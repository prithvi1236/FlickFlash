# Google OAuth Setup Guide

## 🚀 **Step 1: Google Cloud Console Setup**

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select Project**
   - Create a new project or select existing one
   - Note your Project ID

3. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

## 🔑 **Step 2: Create OAuth 2.0 Credentials**

1. **Go to Credentials**
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"

2. **Configure OAuth Consent Screen**
   - Choose "External" user type
   - Fill in app information:
     - App name: "Flick Flash"
     - User support email: your email
     - Developer contact email: your email
   - Add scopes: `email`, `profile`, `openid`

3. **Create OAuth Client ID**
   - Application type: "Web application"
   - Name: "Flick Flash Web Client"
   - **Authorized redirect URIs:**
     ```
     https://awyrlttgjamtakctcyeu.supabase.co/auth/v1/callback
     namishpaapp://
     ```

## ⚙️ **Step 3: Update Supabase Configuration**

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Configure Authentication**
   - Go to "Authentication" > "Providers"
   - Enable "Google"
   - Add your Google Client ID and Client Secret

## 🔧 **Step 4: Environment Variables**

Add these to your `.env` file:
```
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
EXPO_PUBLIC_GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 🧪 **Step 5: Test the Setup**

1. **Restart your Expo development server**
   ```bash
   npx expo start --clear
   ```

2. **Try Google OAuth**
   - Click "Continue with Google"
   - Check console logs for any errors

## 🔍 **Troubleshooting**

### **Error: redirect_uri_mismatch**
- Make sure the redirect URI in Google Cloud Console includes both:
  ```
  https://awyrlttgjamtakctcyeu.supabase.co/auth/v1/callback
  namishpaapp://
  ```

### **Error: invalid_client**
- Check that your Google Client ID and Secret are correct
- Verify they're properly configured in Supabase

### **Error: access_denied**
- Check OAuth consent screen configuration
- Make sure required scopes are added

## 📱 **Mobile-Specific Configuration**

For mobile apps, the redirect URI should be:
```
namishpaapp://
```

This uses your app's custom scheme defined in `app.config.js`.

## 🎯 **Expected Flow**

1. User clicks "Continue with Google"
2. Google OAuth page opens in browser
3. User signs in with Google
4. Redirects back to Supabase callback URL
5. Supabase creates session
6. User is authenticated in the app 