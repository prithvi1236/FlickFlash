# 🔍 Google OAuth Configuration Checklist

## 🚨 **You're still getting redirect_uri_mismatch**

Let's systematically check each part of the configuration:

## ✅ **Step 1: Check Supabase Dashboard**

1. **Go to**: https://supabase.com/dashboard
2. **Select your project**: `awyrlttgjamtakctcyeu`
3. **Go to**: Authentication > Providers
4. **Check Google provider**:
   - [ ] Is Google enabled?
   - [ ] Is Client ID filled in?
   - [ ] Is Client Secret filled in?

**If any are missing, you need to add them.**

## ✅ **Step 2: Check Google Cloud Console**

1. **Go to**: https://console.cloud.google.com/apis/credentials
2. **Find your OAuth 2.0 Client ID**
3. **Check "Authorized redirect URIs"**:
   - [ ] `https://awyrlttgjamtakctcyeu.supabase.co/auth/v1/callback`

**If this URL is NOT there, add it and click Save.**

## ✅ **Step 3: Test the App**

1. **Open your app** (web or mobile)
2. **Go to `/auth` page**
3. **Open browser console** (F12 for web)
4. **Click "Continue with Google"**
5. **Look for these logs**:
   ```
   🚀 Starting Google OAuth...
   📱 Platform: web (or ios/android)
   🔗 Redirect URI: https://awyrlttgjamtakctcyeu.supabase.co/auth/v1/callback
   ✅ OAuth URL created: https://...
   🔍 redirect_uri in URL: https://...
   ```

## 🔍 **Step 4: Debug Information**

**What platform are you testing on?**
- [ ] Web browser
- [ ] Mobile (Expo Go)
- [ ] iOS Simulator
- [ ] Android Emulator

**What do you see in the console logs?**
- [ ] OAuth URL created successfully
- [ ] Error before OAuth URL creation
- [ ] redirect_uri mismatch error from Google

## 🛠️ **Common Issues & Solutions**

### **Issue 1: Supabase Google Provider Not Configured**
- **Solution**: Add Google Client ID and Secret in Supabase dashboard
- **Where**: Authentication > Providers > Google

### **Issue 2: Wrong Redirect URI in Google Cloud Console**
- **Solution**: Add `https://awyrlttgjamtakctcyeu.supabase.co/auth/v1/callback`
- **Where**: Google Cloud Console > APIs & Services > Credentials

### **Issue 3: Cached Configuration**
- **Solution**: Clear cache and restart
- **Command**: `npx expo start --clear`

### **Issue 4: Wrong Client ID/Secret**
- **Solution**: Make sure the Client ID and Secret in Supabase match your Google Cloud Console

## 📞 **Need Help?**

**Share these details:**
1. What platform are you testing on?
2. What do you see in the console logs when you click "Continue with Google"?
3. Is Google provider enabled in Supabase?
4. What redirect URIs are in your Google Cloud Console?

## 🎯 **Quick Test**

Try this simple test:
1. Go to your app in a web browser
2. Open browser console (F12)
3. Click "Continue with Google"
4. Look at the console logs
5. Tell me what you see

---

**The most common issue is that the redirect URI in Google Cloud Console doesn't match what Supabase is sending.** 