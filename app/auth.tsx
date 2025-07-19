import { View, StyleSheet, Dimensions, TouchableOpacity, TextInput, Modal, Platform, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useLocation } from '../components/LocationContext';
import * as WebBrowser from 'expo-web-browser';
import { supabase, googleAuthConfig } from '../lib/supabase';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');

export default function AuthScreen() {
  const router = useRouter();
  const { setLocation } = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleAuth = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Validation Error', 'Please fill in all fields.');
        return;
      }

      if (!isLogin && password !== confirmPassword) {
        Alert.alert('Validation Error', 'Passwords do not match.');
        return;
      }

      console.log(`${isLogin ? 'Login' : 'Register'} with:`, { email });

      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('Login error:', error);
          Alert.alert('Login Failed', error.message);
          return;
        }

        if (data.user) {
          console.log('User logged in:', data.user.email);
          console.log('🔐 Login session details:', {
            access_token: data.session?.access_token ? 'Present' : 'Missing',
            refresh_token: data.session?.refresh_token ? 'Present' : 'Missing',
            expires_at: data.session?.expires_at,
          });
          setLocation('Mumbai');
          console.log('🔄 Redirecting to home page...');
          // Add a longer delay to ensure auth state is updated
          setTimeout(() => {
            router.push('/');
          }, 500);
        }
      } else {
        // Register
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          console.error('Register error:', error);
          Alert.alert('Registration Failed', error.message);
          return;
        }

        if (data.user) {
          console.log('User registered:', data.user.email);
          Alert.alert(
            'Registration Successful',
            'Please check your email to verify your account before logging in.'
          );
          setIsLogin(true); // Switch to login mode
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      Alert.alert('Authentication Error', 'An error occurred. Please try again.');
    }
  };

  const handleGoogleAuth = async () => {
    try {
      console.log('🚀 Starting Google OAuth...');
      console.log('📱 Platform:', Platform.OS);
      
      // For now, let's use the Supabase callback URL for both platforms
      // This is simpler and should work for testing
      const redirectTo = 'https://awyrlttgjamtakctcyeu.supabase.co/auth/v1/callback';
      
      console.log('🔗 Redirect URI:', redirectTo);
      console.log('🔗 Full redirectTo URL:', redirectTo);
      
      // Step 1: Create OAuth URL with proper configuration
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
        console.error('❌ Supabase OAuth error:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        
        // If Supabase OAuth fails, try alternative approach
        console.log('🔄 Trying alternative approach...');
        await handleAlternativeGoogleAuth();
        return;
      }
      
      if (!data.url) {
        console.error('❌ No OAuth URL received');
        Alert.alert('Authentication Error', 'Failed to create OAuth URL');
        return;
      }
      
      console.log('✅ OAuth URL created:', data.url);
      console.log('🔍 Analyzing OAuth URL...');
      
      // Parse the URL to see what redirect_uri is being sent
      try {
        const url = new URL(data.url);
        const redirectUri = url.searchParams.get('redirect_uri');
        console.log('🔍 redirect_uri in URL:', redirectUri);
        console.log('🔍 All URL parameters:', Object.fromEntries(url.searchParams.entries()));
      } catch (parseError) {
        console.log('❌ Could not parse OAuth URL:', parseError);
      }
      
      // Step 2: Open OAuth in browser
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        'https://awyrlttgjamtakctcyeu.supabase.co/auth/v1/callback'
      );
      
      console.log('📱 WebBrowser result:', result);
      
      if (result.type === 'success') {
        console.log('✅ OAuth successful, URL:', result.url);
        
        // Step 3: Get session after successful OAuth
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError);
          Alert.alert('Session Error', 'Failed to get user session');
          return;
        }
        
        if (sessionData.session) {
          console.log('✅ User authenticated:', sessionData.session.user.email);
          console.log('🔐 Session details:', {
            access_token: sessionData.session.access_token ? 'Present' : 'Missing',
            refresh_token: sessionData.session.refresh_token ? 'Present' : 'Missing',
            expires_at: sessionData.session.expires_at,
          });
          setLocation('Mumbai');
          console.log('🔄 Redirecting to home page...');
          // Add a longer delay to ensure auth state is updated
          setTimeout(() => {
            router.push('/');
          }, 500);
        } else {
          console.log('❌ No session found');
          Alert.alert('Authentication Failed', 'No session found after Google sign-in');
        }
      } else if (result.type === 'cancel') {
        console.log('❌ OAuth cancelled by user');
      } else {
        console.log('❌ OAuth failed:', result);
        Alert.alert('Authentication Failed', 'Google sign-in was not successful');
      }
    } catch (error) {
      console.error('❌ Google auth error:', error);
      console.error('❌ Full error details:', JSON.stringify(error, null, 2));
      Alert.alert('Authentication Error', 'An error occurred during Google sign-in');
    }
  };

  const handleAlternativeGoogleAuth = async () => {
    try {
      console.log('🔄 Using alternative Google OAuth approach...');
      
      // For now, just show a message that Google OAuth needs to be configured
      Alert.alert(
        'Google OAuth Configuration Required',
        'Google OAuth needs to be properly configured in Supabase and Google Cloud Console. For now, please use email/password authentication.',
        [
          {
            text: 'OK',
            onPress: () => console.log('User acknowledged OAuth configuration needed'),
          },
        ]
      );
    } catch (error) {
      console.error('❌ Alternative auth error:', error);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <View style={styles.container}>
      {/* Main Content Panel */}
      <View style={styles.mainPanel}>
        <View style={styles.contentArea}>
          {/* Main Title */}
          <Text style={styles.mainTitle}>
            Flick Flash
          </Text>

          {/* Auth Form */}
          <View style={styles.authContainer}>
            <Text style={styles.authTitle}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#A0A0A0"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeButtonText}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input (Register only) */}
            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput
                  style={styles.textInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  placeholderTextColor="#A0A0A0"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Text style={styles.eyeButtonText}>
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Auth Button */}
            <TouchableOpacity
              style={styles.authButton}
              onPress={handleAuth}
              activeOpacity={0.8}
            >
              <Text style={styles.authButtonText}>
                {isLogin ? 'Login' : 'Register'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Auth Button */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleAuth}
              activeOpacity={0.8}
            >
              <Text style={styles.googleButtonText}>
                Continue with Google
              </Text>
            </TouchableOpacity>

            {/* Toggle Mode */}
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleMode}
              activeOpacity={0.8}
            >
              <Text style={styles.toggleButtonText}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Text style={styles.toggleButtonTextBold}>
                  {isLogin ? 'Register' : 'Login'}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#374151', // gray-800 equivalent
    minHeight: '100%',
  },
  mainPanel: {
    height: '100%',
  },
  contentArea: {
    backgroundColor: '#48A6A7', // Exact color from your code
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  mainTitle: {
    color: '#F2EFE7', // Exact color from your code
    fontSize: 72, // text-7xl equivalent
    fontWeight: '400', // Preahvihear weight
    letterSpacing: 2, // tracking-wide
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'Preahvihear', // Custom Preahvihear font
  },
  authContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(242, 239, 231, 0.1)', // Semi-transparent cream
    borderRadius: 20,
    padding: 30,
    borderWidth: 2,
    borderColor: '#F2EFE7',
  },
  authTitle: {
    color: '#F2EFE7',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Poppins-SemiBold',
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  inputLabel: {
    color: '#F2EFE7',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    fontFamily: 'Poppins-Medium',
  },
  textInput: {
    backgroundColor: 'rgba(242, 239, 231, 0.2)',
    borderWidth: 2,
    borderColor: '#F2EFE7',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingRight: 50, // Space for eye button
    color: '#F2EFE7',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 44, // Adjust based on label height
    padding: 8,
  },
  eyeButtonText: {
    fontSize: 20,
  },
  authButton: {
    backgroundColor: '#F2EFE7',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  authButtonText: {
    color: '#48A6A7',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F2EFE7',
  },
  dividerText: {
    color: '#F2EFE7',
    fontSize: 14,
    marginHorizontal: 16,
    fontFamily: 'Poppins-Regular',
  },
  googleButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#F2EFE7',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  googleButtonText: {
    color: '#F2EFE7',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  toggleButton: {
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#F2EFE7',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  toggleButtonTextBold: {
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
}); 