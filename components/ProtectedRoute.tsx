import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    console.log('🔒 ProtectedRoute - Auth state:', { user: !!user, loading });
    
    if (!loading && !user) {
      console.log('🔒 Redirecting to auth - no user found');
      // Redirect to auth if not authenticated
      router.push('/auth');
    } else if (!loading && user) {
      console.log('🔒 User authenticated, showing protected content');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#48A6A7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#F2EFE7',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
}); 