import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../services/auth.api';
import { LoadingScreen } from '../components/common/LoadingScreen';
import { colors } from '../theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function RootLayoutInner() {
  const { isLoading, loadAuth, setUser } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      await loadAuth();
      try {
        const response = await authApi.getMe();
        if (response.success && response.data) {
          const u = response.data;
          setUser({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            avatar: u.avatar,
            role: u.role?.name || 'user',
          });
        }
      } catch {
        // Not authenticated
      }
    };
    init();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '600' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="category/[id]" options={{ title: 'Category' }} />
        <Stack.Screen name="service/[id]" options={{ title: 'Service Details' }} />
        <Stack.Screen name="provider/[id]" options={{ title: 'Provider Profile' }} />
        <Stack.Screen name="booking/create" options={{ title: 'Book Service' }} />
        <Stack.Screen name="booking/[id]" options={{ title: 'Booking Details' }} />
        <Stack.Screen name="booking/success" options={{ headerShown: false }} />
        <Stack.Screen name="review/[bookingId]" options={{ title: 'Write Review' }} />
        <Stack.Screen name="search" options={{ title: 'Search Services' }} />
        <Stack.Screen name="edit-profile" options={{ title: 'Edit Profile' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutInner />
    </QueryClientProvider>
  );
}
