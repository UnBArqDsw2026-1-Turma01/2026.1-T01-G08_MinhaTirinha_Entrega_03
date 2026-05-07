import { Stack } from "expo-router";

export default function RootLayout() {

  return (
    <Stack>
      <Stack.Screen name="library" options={{ headerShown: false }} />
    </Stack>
  );
}
