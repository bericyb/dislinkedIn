# DislinkedIn - LinkedIn Dislike Button Extension

A browser extension that adds a dislike button to LinkedIn posts, allowing you to express negative reactions to content in your LinkedIn feed.

## Features

- 🎯 **Seamless Integration**: Adds a dislike button that matches LinkedIn's native UI design
- 💾 **Local Storage**: Tracks your dislikes locally using browser storage
- 🔄 **Real-time Updates**: Instantly updates dislike counts and visual feedback
- 📱 **Responsive Design**: Works on both desktop and mobile LinkedIn layouts
- 🚀 **Mock Backend**: Includes a simulated backend for testing purposes

## Installation

### Chrome/Edge (Manual Installation)

1. Download or clone this repository
2. Open Chrome/Edge and navigate to `chrome://extensions/` (or `edge://extensions/`)
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the extension folder
5. The DislinkedIn extension should now appear in your extensions list

### Firefox (Manual Installation)

1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from the extension folder

## Usage

1. **Navigate to LinkedIn**: Visit [linkedin.com](https://linkedin.com) and log in to your account
2. **Find the Dislike Button**: Scroll through your feed - you'll see a new "Dislike" button next to the existing Like, Comment, Repost, and Send buttons
3. **Click to Dislike**: Click the dislike button to register your negative reaction
4. **View Statistics**: Click the extension icon in your browser toolbar to see your dislike statistics

## Technical Details

### File Structure

```
dislinkedIn/
├── manifest.json          # Extension configuration
├── content.js            # Main content script that injects dislike buttons
├── background.js         # Service worker with mock backend API
├── styles.css           # CSS styles matching LinkedIn's design
├── popup.html           # Extension popup interface
├── popup.js             # Popup functionality
├── icons/               # Extension icons
└── README.md           # This file
```

### How It Works

1. **Content Script**: The `content.js` file runs on LinkedIn pages and:
   - Observes DOM changes to detect new posts
   - Injects dislike buttons into action bars
   - Handles click events and visual feedback
   - Syncs with local storage

2. **Mock Backend**: The `background.js` service worker provides:
   - Simulated API endpoints for storing/retrieving dislikes
   - Cross-tab synchronization
   - Persistent storage using Chrome's storage API

3. **Styling**: Custom CSS ensures the dislike button:
   - Matches LinkedIn's existing button design
   - Provides appropriate hover and active states
   - Includes a thumbs-down icon (rotated thumbs-up)
   - Displays dislike counts when applicable

### Post Identification

The extension identifies posts using LinkedIn's `data-urn` attribute, which contains unique post identifiers like:
```
urn:li:activity:7380291595671199744
```

### Data Storage

Dislikes are stored locally in the browser using Chrome's storage API:
- **Key**: Post URN (unique identifier)
- **Value**: Number of dislikes for that post
- **Persistence**: Data persists across browser sessions

## Privacy & Security

- **No External Servers**: All data is stored locally in your browser
- **No Data Collection**: The extension doesn't collect or transmit any personal data
- **LinkedIn Only**: Only activates on LinkedIn.com domains
- **Mock Backend**: Simulates server functionality without actual network requests

## Development

### Making Changes

1. Edit the relevant files in the extension directory
2. Reload the extension in your browser's extension management page
3. Refresh LinkedIn to see your changes

### Key Components

- **Button Injection**: Modify `content.js` to change how/where buttons appear
- **Styling**: Update `styles.css` to change button appearance
- **Data Handling**: Modify `background.js` to change storage behavior
- **UI**: Update `popup.html` and `popup.js` for extension popup changes

### Debugging

- Open browser developer tools on LinkedIn to see console messages
- Use the Extensions page to inspect the background script
- Check the popup console for popup-related issues

## Limitations

- **LinkedIn Changes**: May break if LinkedIn significantly changes their UI structure
- **Local Only**: Dislike counts are only visible to you (not shared with other users)
- **Mock Backend**: Currently uses simulated backend - would need real server for production use

## Future Enhancements

- 🌐 **Real Backend Integration**: Connect to actual server for shared dislike counts
- 📊 **Analytics Dashboard**: More detailed statistics and insights
- 🎨 **Customization Options**: Different button styles and positions
- 🔔 **Notifications**: Alert when posts you've disliked receive updates
- 📱 **Mobile App Support**: Extend functionality to LinkedIn mobile app

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## License

MIT License - feel free to use and modify as needed.

---

**Disclaimer**: This extension is not affiliated with or endorsed by LinkedIn. It's a third-party tool created for demonstration purposes.# dislinkedIn
