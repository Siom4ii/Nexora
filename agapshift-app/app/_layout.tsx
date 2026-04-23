import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AuthRouter({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    // Wait for the navigation state to be ready
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === '(worker)' || segments[0] === '(business)' || segments[0] === '(tabs)';

    if (!isAuthenticated && inAuthGroup) {
      // Use a timeout to ensure the layout component is fully mounted 
      // before attempting to navigate away.
      const timer = setTimeout(() => {
        router.replace('/');
      }, 1);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, segments, navigationState?.key]);

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <AuthRouter>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/business-registration" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/kyc-verification" options={{ headerShown: false, title: 'Identity Verification' }} />
            <Stack.Screen name="(auth)/business-localization" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/financial-setup" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/worker-profile" options={{ headerShown: false }} />
            <Stack.Screen name="(worker)" options={{ headerShown: false }} />
            <Stack.Screen name="(business)" options={{ headerShown: false }} />
            <Stack.Screen name="(shared)/rating" options={{ presentation: 'modal', title: 'Rate User' }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthRouter>
    </AuthProvider>
  );
}
