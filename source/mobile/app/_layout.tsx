import { Stack } from "expo-router";
import { Iceberg_400Regular, useFonts } from '@expo-google-fonts/iceberg'
import { Farsan_400Regular } from '@expo-google-fonts/farsan'
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';

export default function RootLayout() {

  const [loaded, error] = useFonts({
    Iceberg_400Regular,
    Farsan_400Regular
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
