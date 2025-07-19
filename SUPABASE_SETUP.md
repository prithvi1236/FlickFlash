# Supabase Google Authentication Setup

## 1. Install Supabase Dependencies

```bash
npm install @supabase/supabase-js
```

## 2. Environment Variables

Create a `.env` file in your project root with:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App URL Scheme (for OAuth redirect)
EXPO_PUBLIC_APP_URL_SCHEME=your-app-scheme
```

## 3. Supabase Project Setup

### 3.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 3.2 Configure Google OAuth in Supabase
1. Go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID: `your_google_client_id`
   - Client Secret: `your_google_client_secret`

## 4. Google Cloud Console Setup

### 4.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API

### 4.2 Create OAuth 2.0 Credentials
1. Go to APIs & Services > Credentials
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
   - `namishpaapp://`

### 4.3 Get Client ID and Secret
- Copy the Client ID and Client Secret
- Add them to Supabase Google provider settings

## 5. App Configuration

### 5.1 Update app.json
Add URL scheme to your `app.json`:

```json
{
  "expo": {
    "scheme": "namishpaapp",
    "web": {
      "bundler": "metro"
    }
  }
}
```

### 5.2 Update Auth Function
Replace the placeholder values in `auth.tsx`:

```typescript
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const googleAuthUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent('namishpaapp://')}`;
```

## 6. Testing

1. Start your app: `npm start`
2. Navigate to `/auth`
3. Click "Continue with Google"
4. Should open browser for Google OAuth
5. After successful auth, redirects back to app

## 7. Troubleshooting

### Common Issues:
- **Invalid redirect URI**: Check Google Cloud Console settings
- **CORS errors**: Ensure Supabase URL is correct
- **Scheme not working**: Check app.json configuration

### Debug Steps:
1. Check console logs for auth URL
2. Verify environment variables are loaded
3. Test Supabase connection
4. Check Google OAuth configuration

## 8. Production Considerations

- Use proper environment variables
- Implement proper error handling
- Add loading states during auth
- Handle token refresh
- Implement proper session management 