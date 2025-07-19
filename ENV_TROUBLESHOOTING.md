# Environment Variables Troubleshooting

## Issue: "supabaseUrl is required" Error

This means your `.env` file is not being read properly by Expo.

## Quick Fix Steps:

### 1. **Check Your .env File Location**
Make sure your `.env` file is in the **root** of your project:
```
namish_pa-app/
├── .env  ← Should be here
├── app/
├── components/
├── package.json
└── app.config.js
```

### 2. **Check Your .env File Format**
Your `.env` file should look like this:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:**
- ✅ Use `EXPO_PUBLIC_` prefix
- ✅ No spaces around `=`
- ✅ No quotes around values
- ✅ No trailing spaces

### 3. **Restart Your Development Server**
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm start
```

### 4. **Check the Debug Output**
The debug component will show you:
- ✅ Found = Environment variable is loaded
- ❌ Missing = Environment variable is not found

### 5. **Alternative: Hardcode for Testing**
If you want to test quickly, temporarily hardcode in `lib/supabase.ts`:
```typescript
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key-here';
```

## Common Issues:

### Issue 1: Wrong File Location
- `.env` file must be in project root
- Not in `app/` folder
- Not in parent directory

### Issue 2: Wrong Variable Names
- Must start with `EXPO_PUBLIC_`
- Case sensitive
- No typos

### Issue 3: File Format Issues
- No spaces around `=`
- No quotes
- No trailing spaces
- Use plain text editor

### Issue 4: Cache Issues
- Clear Expo cache: `npx expo start --clear`
- Restart development server

## Test Your Setup:

1. **Start the app**: `npm start`
2. **Go to `/auth`** page
3. **Look for the debug box** showing environment variables
4. **Check console logs** for environment variable status

## Still Having Issues?

1. **Check file permissions** on `.env`
2. **Try creating a new `.env` file**
3. **Verify your Supabase credentials** are correct
4. **Check for hidden characters** in your `.env` file

The debug component will help identify exactly what's wrong! 🔍 