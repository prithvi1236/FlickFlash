# 🔧 Google OAuth redirect_uri_mismatch - Complete Troubleshooting Guide

## 🚨 **Current Error**
```
Error 400: redirect_uri_mismatch
```

## 🔍 **Step-by-Step Fix**

### **Step 1: Check Your Current Platform**

First, let's see what platform you're testing on:

1. **Open your app** and go to the `/auth` page
2. **Open browser console** (F12) or check Expo logs
3. **Look for these logs**:
   ```
   📱 Platform: web (or ios/android)
   🔗 Redirect URI: https://... or namishpaapp://
   ```

### **Step 2: Update Google Cloud Console**

**IMPORTANT**: You need to add BOTH redirect URIs to Google Cloud Console:

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Navigate**: APIs & Services > Credentials
3. **Find your OAuth 2.0 Client ID** for "Flick Flash"
4. **Click on it** to edit
5. **In "Authorized redirect URIs"**, add **BOTH**:
   ```
   https://awyrlttgjamtakctcyeu.supabase.co/auth/v1/callback
   namishpaapp://
   ```
6. **Click "Save"**

### **Step 3: Clear All Caches**

```bash
# Stop the current server (Ctrl+C)
# Clear Expo cache
npx expo start --clear

# If still having issues, also clear npm cache
npm cache clean --force
```

### **Step 4: Test on Different Platforms**

**Test on Mobile (Recommended)**:
1. Use Expo Go app on your phone
2. Scan the QR code
3. Try Google OAuth

**Test on Web**:
1. Press `w` in terminal to open web version
2. Try Google OAuth

### **Step 5: Check Supabase Configuration**

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Go to**: Authentication > Providers
4. **Enable Google** if not already enabled
5. **Add your Google credentials**:
   - Client ID: Your Google OAuth Client ID
   - Client Secret: Your Google OAuth Client Secret

## 🛠️ **Debug Information**

### **Check Console Logs**

When you click "Continue with Google", you should see:
```
🚀 Starting Google OAuth...
📱 Platform: web (or ios/android)
🔗 Redirect URI: https://... or namishpaapp://
✅ OAuth URL created: https://...
📱 WebBrowser result: { type: 'success', url: '...' }
```

### **Common Issues & Solutions**

#### **Issue 1: Still getting redirect_uri_mismatch**
- **Solution**: Make sure you added BOTH redirect URIs in Google Cloud Console
- **Double-check**: No extra spaces, exact URLs

#### **Issue 2: Works on web but not mobile**
- **Solution**: Make sure `namishpaapp://` is added to Google Cloud Console
- **Check**: Your app scheme is correctly set in `app.config.js`

#### **Issue 3: Works on mobile but not web**
- **Solution**: Make sure the Supabase callback URL is added to Google Cloud Console
- **Check**: Supabase Google provider is properly configured

#### **Issue 4: No OAuth URL created**
- **Solution**: Check Supabase configuration
- **Check**: Google provider is enabled in Supabase

## 🔧 **Manual Testing**

### **Test 1: Check Redirect URIs**

1. **Go to Google Cloud Console**
2. **Check your OAuth 2.0 Client ID**
3. **Verify both URIs are there**:
   - `https://awyrlttgjamtakctcyeu.supabase.co/auth/v1/callback`
   - `namishpaapp://`

### **Test 2: Check App Configuration**

1. **Verify `app.config.js`**:
   ```javascript
   scheme: "namishpaapp",
   ```

2. **Verify `auth.tsx`** uses dynamic redirect:
   ```javascript
   const redirectTo = isWeb 
     ? 'https://awyrlttgjamtakctcyeu.supabase.co/auth/v1/callback'
     : 'namishpaapp://';
   ```

### **Test 3: Check Supabase**

1. **Verify Google provider is enabled**
2. **Verify Client ID and Secret are correct**
3. **Check for any error messages in Supabase logs**

## 📱 **Platform-Specific Notes**

### **Web Platform**
- Uses: `https://awyrlttgjamtakctcyeu.supabase.co/auth/v1/callback`
- Handled by: Supabase web SDK
- Redirects back to: Same page

### **Mobile Platform**
- Uses: `namishpaapp://`
- Handled by: Expo Router
- Redirects back to: App

## 🎯 **Expected Success Flow**

1. **Click "Continue with Google"**
2. **See console logs** with platform and redirect URI
3. **Browser opens** with Google OAuth
4. **Sign in with Google**
5. **Redirects back** to app/web
6. **User is authenticated**

## 🆘 **Still Having Issues?**

If you're still getting the error after following all steps:

1. **Share the console logs** when you click "Continue with Google"
2. **Check what platform** you're testing on (web/mobile)
3. **Verify both redirect URIs** are in Google Cloud Console
4. **Try testing on both platforms** (web and mobile)

## 📞 **Quick Checklist**

- [ ] Both redirect URIs added to Google Cloud Console
- [ ] Supabase Google provider enabled
- [ ] App restarted with `--clear` flag
- [ ] Testing on correct platform
- [ ] Console logs show correct redirect URI

---

**Remember**: The key is having BOTH redirect URIs configured in Google Cloud Console, as your app needs to work on both web and mobile platforms. 