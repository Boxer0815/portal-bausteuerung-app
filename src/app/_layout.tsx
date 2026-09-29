/**
 * Root-Layout — Auth-Gate.
 *
 * Routing-Logik:
 *   laedt         → SplashScreen bleibt sichtbar
 *   kein Token    → /login
 *   Token, keine erlaubte Rolle → /kein-zugang
 *   Token + Rolle → /(tabs)
 */
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../hooks/useAuth';

SplashScreen.preventAutoHideAsync();

function AuthGate() {
  const { laedt, token, hatZugang } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (laedt) return;
    SplashScreen.hideAsync();

    const inTabs = (segments[0] as string | undefined) === '(tabs)';

    if (!token) {
      router.replace('/login');
    } else if (!hatZugang) {
      router.replace('/kein-zugang');
    } else if (!inTabs) {
      router.replace('/(tabs)');
    }
  }, [laedt, token, hatZugang]);

  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="kein-zugang" options={{ headerShown: false }} />
        <Stack.Screen
          name="termin/[id]"
          options={{ title: 'Termindetail' }}
        />
        <Stack.Screen
          name="termin/[id]/status"
          options={{ title: 'Statusmeldung', presentation: 'modal' }}
        />
      </Stack>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
