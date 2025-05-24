import { Stack } from 'expo-router';

export default function WavesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="wave-interference"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
