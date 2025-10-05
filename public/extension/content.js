class DislinkedIn {
  constructor() {
    this.dislikes = new Map();
    this.observer = null;
    this.init();
  }

  init() {
    console.log('DislinkedIn: Initializing extension');
    this.loadDislikes();
    this.startObserver();
    this.injectDislikeButtons();
    this.setupMessageListener();
    console.log('DislinkedIn: Initialization complete');
  }

  startObserver() {
    console.log('DislinkedIn: Starting mutation observer');
    this.observer = new MutationObserver((mutations) => {
      console.log(`DislinkedIn: Detected ${mutations.length} DOM mutations`);
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              console.log('DislinkedIn: Processing added node:', node);
              this.injectDislikeButtons(node);
            }
          });
        }
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    console.log('DislinkedIn: Mutation observer started');
  }

  async loadDislikes() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getAllDislikes' });
      if (response.success) {
        this.dislikes = new Map(Object.entries(response.dislikes));
      }
    } catch (error) {
      console.log('DislinkedIn: Error loading dislikes from background', error);
    }
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'syncDislikes') {
        this.dislikes = new Map(Object.entries(message.dislikes));
        this.updateAllDislikeButtons();
        sendResponse({ success: true });
      } else if (message.action === 'refreshDislikes') {
        this.loadDislikes().then(() => {
          this.updateAllDislikeButtons();
          sendResponse({ success: true });
        });
        return true;
      }
    });
  }

  updateAllDislikeButtons() {
    document.querySelectorAll('.dislinkedin-dislike-button').forEach(button => {
      // Use stable selector to find action bar
      const actionBar = button.closest('div:has(button[data-view-name="reaction-button"])');
      const postId = this.getPostId(actionBar);
      if (postId) {
        const count = this.dislikes.get(postId) || 0;
        const isDisliked = count > 0;
        this.updateDislikeButton(button, postId, isDisliked);
      }
    });
  }

  getPostId(element) {
    console.log('DislinkedIn: Getting postId for element:', element);
    // Try componentkey first (more stable)
    const postContainer = element.closest('[componentkey^="urn:li:activity:"]');
    console.log('DislinkedIn: Found post container:', postContainer);
    if (postContainer) {
      const urn = postContainer.getAttribute('componentkey');
      console.log('DislinkedIn: Extracted URN from componentkey:', urn);
      return urn;
    }

    // Fallback to data-urn for older versions
    const legacyContainer = element.closest('[data-urn]');
    if (legacyContainer) {
      const urn = legacyContainer.getAttribute('data-urn');
      console.log('DislinkedIn: Extracted URN from data-urn (fallback):', urn);
      return urn;
    }

    console.log('DislinkedIn: No URN found in ancestors');
    return null;
  }

  createDislikeButton() {
    const dislikeButton = document.createElement('span');
    dislikeButton.className = 'dislinkedin-dislike-button feed-shared-social-action-bar__action-button feed-shared-social-action-bar--new-padding';

    dislikeButton.innerHTML = `
      <button 
        aria-pressed="false" 
        aria-label="React Dislike" 
        class="artdeco-button artdeco-button--muted artdeco-button--3 artdeco-button--tertiary social-actions-button dislike-button__trigger" 
        type="button"
      >
        <span class="artdeco-button__text">
          <div class="flex-wrap justify-center artdeco-button__text align-items-center">
            <svg role="none" aria-hidden="true" class="artdeco-button__icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-supported-dps="16x16">
              <path d="M17 14V2"/>
              <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/>
            </svg>
            <span aria-hidden="true" class="artdeco-button__text dislike-button__text social-action-button__text">
              Dislike
            </span>
          </div>
        </span>
      </button>
    `;

    return dislikeButton;
  }

  updateDislikeButton(button, postId, isDisliked) {
    const buttonElement = button.querySelector('button');
    const textElement = button.querySelector('.dislike-button__text');
    const iconElement = button.querySelector('svg');

    if (isDisliked) {
      buttonElement.setAttribute('aria-pressed', 'true');
      buttonElement.classList.add('dislinkedin-disliked');
      textElement.textContent = 'Disliked';
      iconElement.style.fill = '#e06847';
    } else {
      buttonElement.setAttribute('aria-pressed', 'false');
      buttonElement.classList.remove('dislinkedin-disliked');
      textElement.textContent = 'Dislike';
      iconElement.style.fill = 'currentColor';
    }

    const count = this.dislikes.get(postId) || 0;
    if (count > 0) {
      let countElement = button.querySelector('.dislike-count');
      if (!countElement) {
        countElement = document.createElement('span');
        countElement.className = 'dislike-count';
        button.appendChild(countElement);
      }
      countElement.textContent = count;
    } else {
      const countElement = button.querySelector('.dislike-count');
      if (countElement) {
        countElement.remove();
      }
    }
  }

  async handleDislikeClick(button, postId) {
    const currentCount = this.dislikes.get(postId) || 0;
    const isCurrentlyDisliked = button.querySelector('button').getAttribute('aria-pressed') === 'true';

    try {
      let response;
      if (isCurrentlyDisliked) {
        response = await chrome.runtime.sendMessage({ 
          action: 'removeDislike', 
          postId: postId 
        });
      } else {
        response = await chrome.runtime.sendMessage({ 
          action: 'addDislike', 
          postId: postId 
        });
      }

      if (response.success) {
        if (response.count === 0) {
          this.dislikes.delete(postId);
        } else {
          this.dislikes.set(postId, response.count);
        }
        this.updateDislikeButton(button, postId, !isCurrentlyDisliked);
        console.log(`DislinkedIn: Post ${postId} ${isCurrentlyDisliked ? 'un-disliked' : 'disliked'}, count: ${response.count}`);
      }
    } catch (error) {
      console.log('DislinkedIn: Error updating dislike', error);
    }
  }

  injectDislikeButtons(container = document) {
    console.log('DislinkedIn: Starting injection, container:', container === document ? 'document' : container);
    // Use stable data-view-name selector instead of class names
    const actionBars = container.querySelectorAll('div:has(button[data-view-name="reaction-button"]):not(.dislinkedin-processed)');
    console.log(`DislinkedIn: Found ${actionBars.length} unprocessed action bars`);

    actionBars.forEach((actionBar, index) => {
      console.log(`DislinkedIn: Processing action bar ${index + 1}/${actionBars.length}`);

      // Use stable data-view-name selector for reaction button
      const reactionButton = actionBar.querySelector('button[data-view-name="reaction-button"]');
      console.log(`DislinkedIn: Action bar ${index + 1} reaction button found:`, !!reactionButton);
      if (!reactionButton) {
        console.log(`DislinkedIn: Action bar ${index + 1} has no reaction button, checking available buttons:`,
          Array.from(actionBar.querySelectorAll('button')).map(b => b.getAttribute('data-view-name')));
        return;
      }

      // Check if this reaction button has already been processed
      if (reactionButton.classList.contains('dislinkedin-processed')) {
        console.log(`DislinkedIn: Action bar ${index + 1} reaction button already processed, skipping`);
        return;
      }

      // Check if dislike button already exists
      if (actionBar.querySelector('.dislinkedin-dislike-button')) {
        console.log(`DislinkedIn: Action bar ${index + 1} already has dislike button, skipping`);
        reactionButton.classList.add('dislinkedin-processed');
        return;
      }

      const postId = this.getPostId(actionBar);
      console.log(`DislinkedIn: Action bar ${index + 1} postId:`, postId);
      if (!postId) {
        console.log(`DislinkedIn: Action bar ${index + 1} has no postId, skipping`);
        return;
      }

      // Find the parent container of the reaction button to insert after it
      const reactionContainer = reactionButton.parentElement;
      console.log(`DislinkedIn: Reaction container found:`, !!reactionContainer);

      console.log(`DislinkedIn: Creating dislike button for post ${postId}`);
      const dislikeButton = this.createDislikeButton();

      dislikeButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(`DislinkedIn: Dislike button clicked for post ${postId}`);
        this.handleDislikeClick(dislikeButton, postId);
      });

      // Insert after the reaction container (or after button if no container)
      const insertAfter = reactionContainer || reactionButton;
      insertAfter.insertAdjacentElement('afterend', dislikeButton);
      console.log(`DislinkedIn: Dislike button inserted after reaction button for post ${postId}`);

      const currentCount = this.dislikes.get(postId) || 0;
      this.updateDislikeButton(dislikeButton, postId, false);
      console.log(`DislinkedIn: Updated dislike button with count ${currentCount} for post ${postId}`);

      // Mark both the action bar and reaction button as processed
      actionBar.classList.add('dislinkedin-processed');
      reactionButton.classList.add('dislinkedin-processed');
    });
    
    console.log(`DislinkedIn: Injection complete. Processed ${actionBars.length} action bars`);
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }

    document.querySelectorAll('.dislinkedin-dislike-button').forEach(button => {
      button.remove();
    });
  }
}

let dislinkedIn;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    dislinkedIn = new DislinkedIn();
  });
} else {
  dislinkedIn = new DislinkedIn();
}

window.addEventListener('beforeunload', () => {
  if (dislinkedIn) {
    dislinkedIn.destroy();
  }
});
