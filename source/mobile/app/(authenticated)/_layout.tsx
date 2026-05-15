import { Stack } from "expo-router";

export default function RootLayout() {

  return (
    <Stack>
      <Stack.Screen name="galeria-pessoal" options={{ headerShown: false }} />
      <Stack.Screen name="comic/[comicId]" options={{ headerShown: false }} />
    </Stack>
  );
}
