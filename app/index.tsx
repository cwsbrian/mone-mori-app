import { Redirect } from 'expo-router';
import { useAuthStore } from './_store/useAuthStore';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // Show loading while checking auth state
  if (isLoggedIn === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Redirect based on auth state
  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}

