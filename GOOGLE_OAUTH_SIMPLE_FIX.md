# 🔧 Simple Google OAuth Fix

## 🚨 **The Problem**
You're getting `Error 400: redirect_uri_mismatch` because Google doesn't recognize the redirect URI your app is sending.

## ✅ **The Simple Solution**

### **Step 1: Update Google Cloud Console**

1. **Go to**: https://console.cloud.google.com/apis/credentials
2. **Find your OAuth 2.0 Client ID** for "Flick Flash"
3. **Click on it** to edit
4. **In "Authorized redirect URIs"**, add this URL:
   ```
   https://awyrlttgjamtakctcyeu.supabase.co/auth/v1/callback
   ```
5. **Click "Save"**

### **Step 2: Restart Your App**

```bash
# Stop current server (Ctrl+C)
npx expo start --clear
```

### **Step 3: Test**

1. Go to `/auth` page
2. Click "Continue with Google"
3. Should work now!

## 🔍 **What I Changed**

I simplified the code to use only the Supabase callback URL for now. This is the most reliable approach.

## 📱 **About `namishpaapp`**

- **What it is**: A custom URL scheme for your app (like `whatsapp://` or `tel://`)
- **Where it's defined**: In `app.config.js` and `app.json` as `scheme: "namishpaapp"`
- **What it does**: Allows your app to handle deep links and OAuth redirects
- **Why we're not using it now**: The Supabase callback URL is simpler and more reliable

## 🎯 **Expected Result**

After adding the redirect URI to Google Cloud Console:
- ✅ No more "redirect_uri_mismatch" error
- ✅ Google OAuth opens in browser
- ✅ User can sign in with Google
- ✅ Redirects back to app successfully

## 🆘 **If Still Not Working**

1. **Double-check**: The exact URL is added to Google Cloud Console
2. **No extra spaces**: Make sure there are no spaces before or after the URL
3. **Click Save**: Make sure you clicked "Save" in Google Cloud Console
4. **Clear cache**: Make sure you restarted with `--clear` flag

---

**The key**: Add `https://awyrlttgjamtakctcyeu.supabase.co/auth/v1/callback` to your Google Cloud Console authorized redirect URIs. 