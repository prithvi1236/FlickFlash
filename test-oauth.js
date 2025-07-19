// Simple test to verify OAuth URL generation
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://awyrlttgjamtakctcyeu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3eXJsdHRnamFtdGFrY3RjeWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MzM0MjYsImV4cCI6MjA2ODUwOTQyNn0.O5skT_eW7VNwxqL9CtWe6p7GQZsGF3D7Sk4Zz_ZFLSo';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
});

async function testOAuth() {
  try {
    console.log('🧪 Testing OAuth URL generation...');
    
    const redirectTo = 'https://awyrlttgjamtakctcyeu.supabase.co/auth/v1/callback';
    console.log('🔗 Redirect URI:', redirectTo);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    
    if (error) {
      console.error('❌ Error:', error);
      return;
    }
    
    if (!data.url) {
      console.error('❌ No URL received');
      return;
    }
    
    console.log('✅ OAuth URL created successfully!');
    console.log('🔗 Full URL:', data.url);
    
    // Parse the URL to extract redirect_uri
    const url = new URL(data.url);
    const redirectUri = url.searchParams.get('redirect_uri');
    
    console.log('🔍 Extracted redirect_uri:', redirectUri);
    console.log('🔍 All parameters:');
    
    for (const [key, value] of url.searchParams.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    
    console.log('\n📋 SUMMARY:');
    console.log('✅ Expected redirect_uri: https://awyrlttgjamtakctcyeu.supabase.co/auth/v1/callback');
    console.log(`🔍 Actual redirect_uri: ${redirectUri}`);
    console.log('✅ Match:', redirectUri === 'https://awyrlttgjamtakctcyeu.supabase.co/auth/v1/callback' ? 'YES' : 'NO');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testOAuth(); 