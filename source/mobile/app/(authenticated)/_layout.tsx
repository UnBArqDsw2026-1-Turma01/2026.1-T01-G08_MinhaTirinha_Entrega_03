import { Stack } from "expo-router";

export default function RootLayout() {

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="library"/>
      <Stack.Screen name="gallery"/>
      <Stack.Screen name="comic"/>
      <Stack.Screen name="color-picker"/>
      <Stack.Screen name="painted"/>
    </Stack>
  );
}