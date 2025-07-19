# 🔍 Quick Debug: Google OAuth redirect_uri_mismatch

## 🚀 **Immediate Steps**

### **1. Check What Platform You're Testing On**

Open your app and go to `/auth`, then check the console logs. You should see:
```
📱 Platform: web (or ios/android)
🔗 Redirect URI: https://... or namishpaapp://
```

**What platform are you testing on?**
- [ ] Web (browser)
- [ ] Mobile (Expo Go app)
- [ ] iOS Simulator
- [ ] Android Emulator

### **2. Check Google Cloud Console**

**Go to**: https://console.cloud.google.com/apis/credentials

**Look for your OAuth 2.0 Client ID** and check if it has BOTH redirect URIs:
- [ ] `https://awyrlttgjamtakctcyeu.supabase.co/auth/v1/callback`
- [ ] `namishpaapp://`

### **3. Test the Fix**

**If you're testing on WEB**:
- Make sure the Supabase callback URL is in Google Cloud Console
- The redirect URI should be: `https://awyrlttgjamtakctcyeu.supabase.co/auth/v1/callback`

**If you're testing on MOBILE**:
- Make sure `namishpaapp://` is in Google Cloud Console
- The redirect URI should be: `namishpaapp://`

### **4. Clear Cache and Restart**

```bash
# Stop current server (Ctrl+C)
npx expo start --clear
```

## 🎯 **Most Likely Issue**

The error suggests that the redirect URI your app is sending doesn't match what's configured in Google Cloud Console.

**Quick Fix**:
1. Add BOTH redirect URIs to Google Cloud Console
2. Restart your app with `--clear` flag
3. Test again

## 📞 **Need More Help?**

Share these details:
1. What platform are you testing on? (web/mobile)
2. What redirect URI do you see in the console logs?
3. What redirect URIs are configured in Google Cloud Console?
4. Are you testing on Expo Go app or web browser?

---

**Remember**: You need BOTH redirect URIs configured because your app works on both web and mobile platforms! 