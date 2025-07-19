// Simple test to check redirect URI
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://awyrlttgjamtakctcyeu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3eXJsdHRnamFtdGFrY3RjeWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MzM0MjYsImV4cCI6MjA2ODUwOTQyNn0.O5skT_eW7VNwxqL9CtWe6p7GQZsGF3D7Sk4Zz_ZFLSo'
);

async function test() {
  try {
    console.log('🧪 Testing OAuth URL generation...');
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://awyrlttgjamtakctcyeu.supabase.co/auth/v1/callback'
      }
    });
    
    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }
    
    console.log('✅ OAuth URL created!');
    console.log('🔗 URL:', data.url);
    
    // Extract redirect_uri from URL
    const url = new URL(data.url);
    const redirectUri = url.searchParams.get('redirect_uri');
    
    console.log('\n📋 RESULTS:');
    console.log('Expected: https://awyrlttgjamtakctcyeu.supabase.co/auth/v1/callback');
    console.log('Actual:   ' + redirectUri);
    console.log('Match:    ' + (redirectUri === 'https://awyrlttgjamtakctcyeu.supabase.co/auth/v1/callback' ? '✅ YES' : '❌ NO'));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

test(); 