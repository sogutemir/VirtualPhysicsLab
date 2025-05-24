import { Stack } from 'expo-router';

export default function BasicsLayout() {
  return (
    <Stack>
      <Stack.Screen name="acceleration" options={{ headerShown: false }} />
      <Stack.Screen name="buoyancy" options={{ headerShown: false }} />
      <Stack.Screen name="coriolis-effect" options={{ headerShown: false }} />
      <Stack.Screen name="relative-motion" options={{ headerShown: false }} />
      <Stack.Screen name="pressure/index" options={{ headerShown: false }} />
    </Stack>
  );
}
