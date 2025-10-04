class SupabaseClient {
  constructor(supabaseUrl, supabaseKey) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    this.headers = {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    };
  }

  async insertDislike(postUrn) {
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/post_dislikes`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          post_urn: postUrn,
          dislike_count: 1
        })
      });

      if (!response.ok) {
        if (response.status === 409) {
          return await this.incrementDislike(postUrn);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error('Error inserting dislike:', error);
      throw error;
    }
  }

  async incrementDislike(postUrn) {
    try {
      const currentDislike = await this.getDislike(postUrn);
      if (!currentDislike) {
        return await this.insertDislike(postUrn);
      }

      const response = await fetch(`${this.supabaseUrl}/rest/v1/post_dislikes?post_urn=eq.${encodeURIComponent(postUrn)}`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify({
          dislike_count: currentDislike.dislike_count + 1,
          updated_at: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await this.getDislike(postUrn);
    } catch (error) {
      console.error('Error incrementing dislike:', error);
      throw error;
    }
  }

  async decrementDislike(postUrn) {
    try {
      const currentDislike = await this.getDislike(postUrn);
      if (!currentDislike || currentDislike.dislike_count <= 1) {
        return await this.removeDislike(postUrn);
      }

      const response = await fetch(`${this.supabaseUrl}/rest/v1/post_dislikes?post_urn=eq.${encodeURIComponent(postUrn)}`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify({
          dislike_count: Math.max(0, currentDislike.dislike_count - 1),
          updated_at: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await this.getDislike(postUrn);
    } catch (error) {
      console.error('Error decrementing dislike:', error);
      throw error;
    }
  }

  async removeDislike(postUrn) {
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/post_dislikes?post_urn=eq.${encodeURIComponent(postUrn)}`, {
        method: 'DELETE',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { dislike_count: 0 };
    } catch (error) {
      console.error('Error removing dislike:', error);
      throw error;
    }
  }

  async getDislike(postUrn) {
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/post_dislikes?post_urn=eq.${encodeURIComponent(postUrn)}`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data[0] || null;
    } catch (error) {
      console.error('Error getting dislike:', error);
      throw error;
    }
  }

  async getAllDislikes() {
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/post_dislikes`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const dislikesMap = {};
      data.forEach(item => {
        dislikesMap[item.post_urn] = item.dislike_count;
      });
      return dislikesMap;
    } catch (error) {
      console.error('Error getting all dislikes:', error);
      throw error;
    }
  }
}

class SupabaseBackend {
  constructor() {
    this.supabaseClient = null;
    this.init();
  }

  async init() {
    await this.loadConfig();
    this.setupMessageHandlers();
  }

  async loadConfig() {
    try {
      const supabaseUrl = 'https://rnjfkywebysuruuruagse.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuamZreXdlYnlzdXJ1dXVhZ3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTQyODMsImV4cCI6MjA3NTE3MDI4M30.Vu6X6rTWeWUfmGUwmU4IK2Elk_VhYIhan_lGxEJH6mw';
      
      this.supabaseClient = new SupabaseClient(supabaseUrl, supabaseKey);
      console.log('SupabaseBackend: Using hardcoded Supabase configuration');
    } catch (error) {
      console.log('SupabaseBackend: Error initializing Supabase client', error);
      this.dislikes = new Map();
      await this.loadFromStorage();
    }
  }

  async loadFromStorage() {
    try {
      const result = await chrome.storage.local.get(['backendDislikes']);
      if (result.backendDislikes) {
        this.dislikes = new Map(Object.entries(result.backendDislikes));
      }
    } catch (error) {
      console.log('SupabaseBackend: Error loading from storage', error);
    }
  }

  async saveToStorage() {
    if (!this.supabaseClient && this.dislikes) {
      try {
        const dislikesObj = Object.fromEntries(this.dislikes);
        await chrome.storage.local.set({ backendDislikes: dislikesObj });
      } catch (error) {
        console.log('SupabaseBackend: Error saving to storage', error);
      }
    }
  }

  setupMessageHandlers() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true;
    });
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'getDislike':
          const count = await this.getDislike(request.postId);
          sendResponse({ success: true, count });
          break;
          
        case 'addDislike':
          const newCount = await this.addDislike(request.postId);
          sendResponse({ success: true, count: newCount });
          break;
          
        case 'removeDislike':
          const updatedCount = await this.removeDislike(request.postId);
          sendResponse({ success: true, count: updatedCount });
          break;
          
        case 'getAllDislikes':
          const allDislikes = await this.getAllDislikes();
          sendResponse({ success: true, dislikes: allDislikes });
          break;

        case 'setSupabaseConfig':
          await this.setSupabaseConfig(request.url, request.key);
          sendResponse({ success: true });
          break;
          
        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.log('SupabaseBackend: Error handling message', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  async setSupabaseConfig(url, key) {
    try {
      await chrome.storage.local.set({ supabaseUrl: url, supabaseKey: key });
      this.supabaseClient = new SupabaseClient(url, key);
      console.log('SupabaseBackend: Configuration updated');
    } catch (error) {
      console.log('SupabaseBackend: Error setting config', error);
      throw error;
    }
  }

  async getDislike(postId) {
    if (this.supabaseClient) {
      try {
        const result = await this.supabaseClient.getDislike(postId);
        return result ? result.dislike_count : 0;
      } catch (error) {
        console.log('SupabaseBackend: Supabase error, falling back to local storage', error);
        return this.dislikes?.get(postId) || 0;
      }
    } else {
      return this.dislikes?.get(postId) || 0;
    }
  }

  async addDislike(postId) {
    if (this.supabaseClient) {
      try {
        const result = await this.supabaseClient.insertDislike(postId);
        console.log(`SupabaseBackend: Added dislike to ${postId}, total: ${result.dislike_count}`);
        return result.dislike_count;
      } catch (error) {
        console.log('SupabaseBackend: Supabase error, falling back to local storage', error);
        return await this.addDislikeLocal(postId);
      }
    } else {
      return await this.addDislikeLocal(postId);
    }
  }

  async addDislikeLocal(postId) {
    const currentCount = this.dislikes?.get(postId) || 0;
    const newCount = currentCount + 1;
    if (!this.dislikes) this.dislikes = new Map();
    this.dislikes.set(postId, newCount);
    await this.saveToStorage();
    
    console.log(`SupabaseBackend: Added dislike to ${postId} (local), total: ${newCount}`);
    return newCount;
  }

  async removeDislike(postId) {
    if (this.supabaseClient) {
      try {
        const result = await this.supabaseClient.decrementDislike(postId);
        const count = result ? result.dislike_count : 0;
        console.log(`SupabaseBackend: Removed dislike from ${postId}, total: ${count}`);
        return count;
      } catch (error) {
        console.log('SupabaseBackend: Supabase error, falling back to local storage', error);
        return await this.removeDislikeLocal(postId);
      }
    } else {
      return await this.removeDislikeLocal(postId);
    }
  }

  async removeDislikeLocal(postId) {
    const currentCount = this.dislikes?.get(postId) || 0;
    const newCount = Math.max(0, currentCount - 1);
    
    if (!this.dislikes) this.dislikes = new Map();
    
    if (newCount === 0) {
      this.dislikes.delete(postId);
    } else {
      this.dislikes.set(postId, newCount);
    }
    
    await this.saveToStorage();
    console.log(`SupabaseBackend: Removed dislike from ${postId} (local), total: ${newCount}`);
    return newCount;
  }

  async getAllDislikes() {
    if (this.supabaseClient) {
      try {
        return await this.supabaseClient.getAllDislikes();
      } catch (error) {
        console.log('SupabaseBackend: Supabase error, falling back to local storage', error);
        return this.dislikes ? Object.fromEntries(this.dislikes) : {};
      }
    } else {
      return this.dislikes ? Object.fromEntries(this.dislikes) : {};
    }
  }

  async syncWithContentScript() {
    try {
      const tabs = await chrome.tabs.query({ url: '*://www.linkedin.com/*' });
      const allDislikes = await this.getAllDislikes();
      
      for (const tab of tabs) {
        try {
          await chrome.tabs.sendMessage(tab.id, {
            action: 'syncDislikes',
            dislikes: allDislikes
          });
        } catch (error) {
        }
      }
    } catch (error) {
      console.log('SupabaseBackend: Error syncing with content script', error);
    }
  }
}

let supabaseBackend;

chrome.runtime.onInstalled.addListener(() => {
  console.log('DislinkedIn extension installed');
  supabaseBackend = new SupabaseBackend();
});

chrome.runtime.onStartup.addListener(() => {
  console.log('DislinkedIn extension started');
  supabaseBackend = new SupabaseBackend();
});

if (!supabaseBackend) {
  supabaseBackend = new SupabaseBackend();
}

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.includes('linkedin.com')) {
    try {
      await chrome.tabs.sendMessage(tab.id, { action: 'refreshDislikes' });
    } catch (error) {
      console.log('Could not send message to tab', error);
    }
  }
});
  }

  async syncWithContentScript() {
    try {
      const tabs = await chrome.tabs.query({ url: '*://www.linkedin.com/*' });
      const allDislikes = await this.getAllDislikes();
      
      for (const tab of tabs) {
        try {
          await chrome.tabs.sendMessage(tab.id, {
            action: 'syncDislikes',
            dislikes: allDislikes
          });
        } catch (error) {
        }
      }
    } catch (error) {
      console.log('MockBackend: Error syncing with content script', error);
    }
  }
}

let supabaseBackend;

chrome.runtime.onInstalled.addListener(() => {
  console.log('DislinkedIn extension installed');
  supabaseBackend = new SupabaseBackend();
});

chrome.runtime.onStartup.addListener(() => {
  console.log('DislinkedIn extension started');
  supabaseBackend = new SupabaseBackend();
});

if (!supabaseBackend) {
  supabaseBackend = new SupabaseBackend();
}

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.includes('linkedin.com')) {
    try {
      await chrome.tabs.sendMessage(tab.id, { action: 'refreshDislikes' });
    } catch (error) {
      console.log('Could not send message to tab', error);
    }
  }
});