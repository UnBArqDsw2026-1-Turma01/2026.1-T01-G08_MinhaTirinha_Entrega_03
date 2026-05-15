import {
  GoogleSignin,
  isSuccessResponse
} from '@react-native-google-signin/google-signin'

import { StyleSheet, View, Text, Pressable } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { Image } from 'expo-image'

export default function Index() {
  // ID de teste alinhado com o mock atual do front
  const TEST_USER_ID = '1'

  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID!,
  })

  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const continueWithoutGoogle = () => {
    router.replace(`/galeria-pessoal?user_id=${TEST_USER_ID}`)
  }

  return (
    <View style={styles.main_container}>
      <Image source={require("../assets/images/logo-minha-tirinha.png")} style={styles.logo_app}/>
      <View style={styles.sub_container}>
        <Text style={styles.title}>Acessar a galeria</Text>
        <Text style={styles.description}>
          Escolha entre entrar com Google ou seguir sem login apenas para teste.
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={async () => {
            try {
              setLoading(true);
              await GoogleSignin.hasPlayServices()
              const response = await GoogleSignin.signIn()
              if (isSuccessResponse(response)) {
                router.replace(`/galeria-pessoal?user_id=${TEST_USER_ID}`)
              }
            } catch (error: any) {
              router.replace('/error')
            } finally {
              setLoading(false)
            }
          }}
        >
          <Image source={require("../assets/images/logo-google.png")} style={styles.logo_google}/>
          <Text style={styles.primaryButtonText}>Entrar com Google</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={continueWithoutGoogle}
        >
          <Text style={styles.secondaryButtonText}>Continuar sem Google</Text>
        </Pressable>
      </View>}
    </View>
  )
}

const styles = StyleSheet.create({
  main_container: {
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    height: "100%",
    backgroundColor: "#FCFAEE",
    gap: 62.5
  },
  logo_app: {
    width: 150,
    height: 150
  },
  sub_container: {
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    gap: 12,
    paddingHorizontal: 24
  },
  title: {
    fontSize: 26,
    color: "#8C8989",
    fontFamily: "Iceberg_400Regular"
  },
  description: {
    fontSize: 15,
    lineHeight: 21,
    color: "#9B948D",
    textAlign: "center",
    fontWeight: "500",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: "#F4F1E3",
    boxShadow: "2px 4px 8px rgba(0, 0, 0, 0.08)",
  },
  logo_google: {
    width: 50,
    height: 50,
    borderRadius: 999,
    borderWidth: 0,
    boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)"
  },
  primaryButtonText: {
    color: "#6F6A66",
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: "#E6D8F3",
    boxShadow: "2px 4px 8px rgba(0, 0, 0, 0.08)",
  },
  secondaryButtonText: {
    color: "#675A89",
    fontSize: 15,
    fontWeight: "800",
  },
})