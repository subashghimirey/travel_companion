import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Layout() {
  const router = useRouter();

  // Use useEffect to navigate to the login screen once the layout is mounted
  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <Stack
      screenOptions={{
        headerLeft: () => null,
        headerTitle: () => null,
      }}
    />
  );
}
