class PopupManager {
  constructor() {
    this.init();
    this.supabaseUrl = 'https://rnjfkywebysuruuuagse.supabase.co'
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuamZreXdlYnlzdXJ1dXVhZ3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTQyODMsImV4cCI6MjA3NTE3MDI4M30.Vu6X6rTWeWUfmGUwmU4IK2Elk_VhYIhan_lGxEJH6mw'
  }

  async init() {
    await this.loadStats();
    await this.loadConfig();
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.getElementById('refreshBtn').addEventListener('click', () => {
      this.refreshStats();
    });

    document.getElementById('clearBtn').addEventListener('click', () => {
      this.clearAllDislikes();
    });

    document.getElementById('saveConfigBtn').addEventListener('click', () => {
      this.saveConfig();
    });

    document.getElementById('testConnectionBtn').addEventListener('click', () => {
      this.testConnection();
    });

    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });
  }

  switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });

    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
  }

  async testConnection() {
    const url = document.getElementById('supabaseUrl').value.trim();
    const key = document.getElementById('supabaseKey').value.trim();

    if (!url || !key) {
      this.showStatus('Please enter both URL and key', 'error');
      return;
    }

    this.showStatus('Testing connection...', 'success');

    try {
      const response = await fetch(`${url}/rest/v1/post_dislikes?limit=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });

      if (response.ok) {
        this.showStatus('Connection successful!', 'success');
      } else {
        this.showStatus(`Connection failed: ${response.status}`, 'error');
      }
    } catch (error) {
      console.log('Connection test error:', error);
      this.showStatus('Connection failed', 'error');
    }
  }

  updateBackendStatus(hasSupabaseConfig) {
    const backendStatus = document.getElementById('backendStatus');
    if (backendStatus) {
      backendStatus.textContent = hasSupabaseConfig ? 'Supabase' : 'Local Storage';
    }
  }

  async loadStats() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getAllDislikes' });
      
      if (response.success) {
        this.updateStatsDisplay(response.dislikes);
      } else {
        this.showStatus('Error loading stats', 'error');
      }
    } catch (error) {
      console.log('Error loading stats:', error);
      this.showStatus('Error connecting to extension', 'error');
    }
  }

  updateStatsDisplay(dislikes) {
    const totalDislikes = Object.values(dislikes).reduce((sum, count) => sum + count, 0);
    const postsDisliked = Object.keys(dislikes).length;

    document.getElementById('totalDislikes').textContent = totalDislikes;
    document.getElementById('postsDisliked').textContent = postsDisliked;
    document.getElementById('extensionStatus').textContent = 'Active';
  }

  async refreshStats() {
    this.showStatus('Refreshing...', 'success');
    
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const currentTab = tabs[0];
      
      if (currentTab.url.includes('linkedin.com')) {
        await chrome.tabs.sendMessage(currentTab.id, { action: 'refreshDislikes' });
      }
      
      await this.loadStats();
      this.showStatus('Stats refreshed!', 'success');
    } catch (error) {
      console.log('Error refreshing stats:', error);
      this.showStatus('Error refreshing stats', 'error');
    }
  }

  async clearAllDislikes() {
    if (!confirm('Are you sure you want to clear all dislikes? This action cannot be undone.')) {
      return;
    }

    this.showStatus('Clearing all dislikes...', 'success');
    
    try {
      await chrome.storage.local.clear();
      
      const tabs = await chrome.tabs.query({ url: '*://www.linkedin.com/*' });
      for (const tab of tabs) {
        try {
          await chrome.tabs.sendMessage(tab.id, { action: 'clearAllDislikes' });
        } catch (error) {
        }
      }
      
      await this.loadStats();
      this.showStatus('All dislikes cleared!', 'success');
    } catch (error) {
      console.log('Error clearing dislikes:', error);
      this.showStatus('Error clearing dislikes', 'error');
    }
  }

  showStatus(message, type) {
    const statusElement = document.getElementById('statusMessage');
    statusElement.textContent = message;
    statusElement.className = `status ${type}`;
    statusElement.style.display = 'block';
    
    setTimeout(() => {
      statusElement.style.display = 'none';
    }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});
