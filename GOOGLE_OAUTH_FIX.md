# 🔧 Fix Google OAuth redirect_uri_mismatch Error

## 🚨 **The Problem**
You're getting this error:
```
Error 400: redirect_uri_mismatch
```

This happens when the redirect URI your app is sending doesn't match what's configured in Google Cloud Console.

## ✅ **The Solution**

### **Step 1: Update Google Cloud Console**

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Navigate to OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Find your OAuth 2.0 Client ID for "Flick Flash"
   - Click on it to edit

3. **Update Authorized Redirect URIs**
   - In the "Authorized redirect URIs" section, add **BOTH**:
   ```
   https://awyrlttgjamtakctcyeu.supabase.co/auth/v1/callback
   namishpaapp://
   ```
   - Click "Save"

### **Step 2: Verify App Configuration**

Your app is already configured correctly with:
- **Scheme**: `namishpaapp` (in `app.config.js`)
- **Redirect URI**: `namishpaapp://` (in `auth.tsx`)

### **Step 3: Test the Fix**

1. **Restart your Expo development server**:
   ```bash
   npx expo start --clear
   ```

2. **Try Google OAuth again**:
   - Go to `/auth` page
   - Click "Continue with Google"
   - Should now work without the redirect_uri_mismatch error

## 🔍 **Why This Happened**

- **Mobile apps** use custom URL schemes (like `namishpaapp://`)
- **Web apps** use HTTP URLs (like `https://...`)
- Your app is a **mobile app**, so it needs the custom scheme
- Google Cloud Console needs **both** URLs configured

## 📱 **How It Works Now**

1. User clicks "Continue with Google"
2. Google OAuth opens in browser
3. User signs in with Google
4. Google redirects to `namishpaapp://`
5. Expo Router handles the redirect
6. User is authenticated in the app

## 🛠️ **If Still Not Working**

### **Check 1: Google Cloud Console**
- Make sure both redirect URIs are added
- No extra spaces or typos
- Click "Save" after adding

### **Check 2: App Configuration**
- Verify `app.config.js` has `scheme: "namishpaapp"`
- Verify `auth.tsx` uses `redirectTo: 'namishpaapp://'`

### **Check 3: Clear Cache**
```bash
npx expo start --clear
```

### **Check 4: Supabase Configuration**
- Make sure Google provider is enabled in Supabase
- Verify Client ID and Secret are correct

## 🎯 **Expected Result**

After fixing:
- ✅ No more "redirect_uri_mismatch" error
- ✅ Google OAuth opens in browser
- ✅ User can sign in with Google
- ✅ Redirects back to app successfully
- ✅ User is authenticated

## 📞 **Need Help?**

If you're still having issues:
1. Check the console logs for detailed error messages
2. Verify all steps above are completed
3. Make sure you're testing on a mobile device or simulator (not web)

---

**Note**: The web version of your app will use the Supabase callback URL, while the mobile version uses the custom scheme. That's why both need to be configured in Google Cloud Console. 