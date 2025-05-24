import { Stack } from 'expo-router';

export default function ExperimentsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Tüm header'ları gizle
        animation: 'slide_from_right',
      }}
    />
  );
}
