import { Stack } from "expo-router";

export default function RootLayout() {

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="galeria-pessoal" />
      <Stack.Screen name="library" />
      <Stack.Screen name="color-picker" />
    </Stack>
  );
}
