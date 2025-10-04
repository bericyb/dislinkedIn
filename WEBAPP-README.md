# DislinkedIn Web App

A web application for tracking LinkedIn post dislikes with Supabase authentication and cloud storage.

## Features

- 🔐 **User Authentication**: Secure login and signup with Supabase Auth
- ☁️ **Cloud Storage**: Store dislikes in Supabase PostgreSQL database
- 📊 **Personal Dashboard**: View your dislike statistics and history
- 🔒 **Row Level Security**: Your data is private and secure
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Quick Start

### 1. Database Setup

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database-setup.sql`
4. Run the SQL script to create tables and set up Row Level Security

### 2. Configure Authentication

1. In Supabase Dashboard, go to **Authentication** > **Settings**
2. Configure your site URL (e.g., `http://localhost:8000` for local development)
3. Add your redirect URLs under **Redirect URLs**
4. Enable Email authentication (or other providers as needed)

### 3. Update Configuration

If using your own Supabase project, update the credentials in `app.js`:

```javascript
const SUPABASE_URL = 'your-project-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

### 4. Run the Web App

You can serve the app using any static file server:

#### Option 1: Python
```bash
python -m http.server 8000
```

#### Option 2: Node.js (npx)
```bash
npx http-server -p 8000
```

#### Option 3: VS Code Live Server
1. Install the "Live Server" extension
2. Right-click `index.html` and select "Open with Live Server"

Then visit `http://localhost:8000` in your browser.

## File Structure

```
dislinkedIn/
├── index.html              # Main HTML file with auth and dashboard UI
├── app.css                 # Styles for the web app
├── app.js                  # Main application logic with Supabase integration
├── database-setup.sql      # SQL script for Supabase database setup
└── WEBAPP-README.md        # This file
```

## How It Works

### Authentication Flow

1. **Signup**: Users create an account with email/password
2. **Email Verification**: Supabase sends verification email (configurable)
3. **Login**: Users sign in with credentials
4. **Session Management**: Supabase handles JWT tokens and session persistence
5. **Logout**: Securely ends user session

### Data Storage

- **Table**: `post_dislikes`
- **Columns**:
  - `id`: UUID primary key
  - `user_id`: Foreign key to auth.users
  - `post_urn`: LinkedIn post identifier
  - `dislike_count`: Number of dislikes
  - `created_at`: Timestamp
  - `updated_at`: Timestamp (auto-updated)

### Row Level Security (RLS)

The database is configured so that:
- Users can only view their own dislikes
- Users can only insert/update/delete their own dislikes
- Data is completely isolated between users

## API Reference

### Supabase Client Methods

```javascript
// Get all dislikes for current user
const { data, error } = await supabase
    .from('post_dislikes')
    .select('*');

// Insert a new dislike
const { data, error } = await supabase
    .from('post_dislikes')
    .insert({
        user_id: user.id,
        post_urn: 'urn:li:activity:123',
        dislike_count: 1
    });

// Update dislike count
const { data, error } = await supabase
    .from('post_dislikes')
    .update({ dislike_count: newCount })
    .eq('post_urn', 'urn:li:activity:123');

// Delete a dislike
const { data, error } = await supabase
    .from('post_dislikes')
    .delete()
    .eq('post_urn', 'urn:li:activity:123');
```

## Integrating with Chrome Extension

To connect this web app with the Chrome extension:

1. **Update Extension**: Modify `background.js` to use authenticated Supabase client
2. **Add Auth Flow**: Implement OAuth or magic link flow in the extension
3. **Sync Data**: Use the same Supabase project and table structure
4. **User Context**: Ensure extension uses the logged-in user's ID

Example extension update:
```javascript
// In background.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Get current session
const { data: { session } } = await supabase.auth.getSession()

// Insert dislike with user_id
await supabase
    .from('post_dislikes')
    .insert({
        user_id: session.user.id,
        post_urn: postUrn,
        dislike_count: 1
    })
```

## Security Best Practices

1. **Never expose service_role key**: Only use anon key in client-side code
2. **Use RLS**: Always enable Row Level Security on tables
3. **Validate input**: Sanitize user input before displaying
4. **HTTPS only**: Use HTTPS in production
5. **Environment variables**: Store sensitive config in environment variables

## Deployment

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel` in project directory
3. Follow prompts to deploy

### Deploy to Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy` in project directory
3. Follow prompts to deploy

### Deploy to GitHub Pages

1. Push code to GitHub repository
2. Go to Settings > Pages
3. Select source branch (usually `main`)
4. Set folder to `/` (root)
5. Save and wait for deployment

## Troubleshooting

### "Invalid API key" error
- Verify your Supabase URL and anon key in `app.js`
- Check that the key hasn't expired

### "Row Level Security policy violation"
- Ensure RLS policies are set up correctly (run `database-setup.sql`)
- Verify user is authenticated before making queries

### Email verification not working
- Check Supabase Auth settings
- Verify email templates are configured
- Check spam folder for verification emails

### Dislikes not appearing
- Check browser console for errors
- Verify database connection
- Ensure user is logged in
- Check RLS policies allow the operation

## Environment Variables (Production)

Create a `.env` file (don't commit this!):

```env
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Then update `app.js` to use:
```javascript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - See LICENSE file for details

---

**Note**: This web app complements the Chrome extension. The extension adds dislike buttons to LinkedIn, while this web app provides a dashboard to view and manage your dislikes.
