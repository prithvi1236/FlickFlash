import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Alert } from 'react-native';
import { supabase } from '../lib/supabase';

interface GoogleAuthButtonProps {
  onSuccess: () => void;
}

export function GoogleAuthButton({ onSuccess }: GoogleAuthButtonProps) {
  const handleGoogleAuth = async () => {
    try {
      // Use a direct approach without complex redirect handling
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Minimal configuration
          queryParams: {
            access_type: 'offline',
          },
        },
      });

      if (error) {
        console.error('Google OAuth error:', error);
        Alert.alert('Authentication Error', 'Google sign-in failed. Please try again.');
        return;
      }

      if (data.url) {
        // For now, just show success and proceed
        console.log('Google OAuth initiated successfully');
        Alert.alert(
          'Google OAuth',
          'Google OAuth is being configured. For now, you can proceed with email/password authentication.',
          [
            {
              text: 'OK',
              onPress: () => onSuccess(),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Google auth error:', error);
      Alert.alert('Authentication Error', 'An error occurred during Google sign-in.');
    }
  };

  return (
    <TouchableOpacity style={styles.googleButton} onPress={handleGoogleAuth} activeOpacity={0.8}>
      <Text style={styles.googleButtonText}>Continue with Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
}); 