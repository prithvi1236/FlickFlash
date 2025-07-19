import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Supabase credentials
const supabaseUrl = 'https://awyrlttgjamtakctcyeu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3eXJsdHRnamFtdGFrY3RjeWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MzM0MjYsImV4cCI6MjA2ODUwOTQyNn0.O5skT_eW7VNwxqL9CtWe6p7GQZsGF3D7Sk4Zz_ZFLSo';

// Debug: Log credentials status
console.log('🔧 Supabase Configuration:');
console.log('URL Source: Direct');
console.log('Key Source: Direct');

// Validate credentials
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials');
}

// Create Supabase client with proper auth configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // Enable session detection in URL for web
    flowType: 'pkce', // Use PKCE for better security
    storage: typeof window !== 'undefined' ? window.localStorage : undefined, // Use localStorage for web
  },
});

// Google OAuth configuration for mobile apps
export const googleAuthConfig = {
  provider: 'google',
  options: {
    // Use app's custom scheme for mobile redirect
    redirectTo: 'namishpaapp://',
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    },
  },
};

// Platform-specific Google OAuth configuration
export const getGoogleAuthConfig = () => {
  const isWeb = typeof window !== 'undefined' && window.location;
  return {
    provider: 'google',
    options: {
      redirectTo: isWeb 
        ? 'https://awyrlttgjamtakctcyeu.supabase.co/auth/v1/callback'
        : 'namishpaapp://',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  };
}; 