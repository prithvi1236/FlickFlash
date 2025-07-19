import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider as PaperProvider } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import { LocationProvider } from '../components/LocationContext';
import { AuthProvider, useAuth } from '../components/AuthContext';

// Component to handle authentication routing
function AuthRouting() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    console.log('🔒 AuthRouting - Auth state:', { user: !!user, loading, segments });
    
    if (loading) {
      console.log('🔒 AuthRouting - Still loading...');
      return;
    }

    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      console.log('🔒 AuthRouting - No user, redirecting to auth');
      router.replace('/auth');
    } else if (user && inAuthGroup) {
      console.log('🔒 AuthRouting - User authenticated, redirecting to home');
      // Add a small delay to prevent race conditions
      setTimeout(() => {
        router.replace('/');
      }, 100);
    }
  }, [user, loading, segments, router]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Preahvihear': require('../assets/fonts/Preahvihear-Regular.ttf'),
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  // Initialize notification handler (basic setup)
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  return (
    <AuthProvider>
      <LocationProvider>
        <PaperProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AuthRouting />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="auth" options={{ headerShown: false }} />
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="movie-selection" options={{ headerShown: false }} />
              <Stack.Screen name="theater-selection" options={{ headerShown: false }} />
              <Stack.Screen name="date-selection" options={{ headerShown: false }} />
              <Stack.Screen name="confirmation" options={{ headerShown: false }} />
              <Stack.Screen name="request-history" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </PaperProvider>
      </LocationProvider>
    </AuthProvider>
  );
}
