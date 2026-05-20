import {
  GoogleSignin,
  isSuccessResponse
} from '@react-native-google-signin/google-signin'

import { StyleSheet, View, Text, Pressable } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { supabase } from '@/utils/supabase'

export default function Index() {
  const TEST_USER_ID = '1'

  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID!,
  })

  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [loginError, setLoginError] = useState<string>('')

  const continueWithoutGoogle = () => {
    router.replace({
      pathname: "/library",
      params: { user_id: TEST_USER_ID },
    })
  }

  return (
    <View style={styles.main_container}>
      <Image source={require("../assets/images/logo-minha-tirinha.png")} style={styles.logo_app} />
      <View style={styles.sub_container}>
        <Text style={styles.title}>Acessar a galeria</Text>
        <Text style={styles.description}>
          Escolha entre entrar com Google ou seguir sem login para acessar a galeria de tirinhas.
        </Text>

        <Pressable
          style={styles.primaryButton}
          disabled={loading}
          onPress={async () => {
            setLoginError('')
            setLoading(true)
            try {
              await GoogleSignin.hasPlayServices()
              const response = await GoogleSignin.signIn()
              if (isSuccessResponse(response)) {
                const idToken = response.data.idToken
                if (!idToken) throw new Error('idToken ausente no retorno do Google Sign-In')

                const { data } = await supabase.auth.signInWithIdToken({
                  provider: 'google',
                  token: idToken,
                })
                const user = data.user
                if (user == null) router.replace('/error')
                else router.replace({
                  pathname: "/library",
                  params: { user_id: user.id },
                })
              }
            } catch (error: any) {
              const message = error?.message || String(error) || 'Erro desconhecido no login'
              setLoginError(message)
              console.log('Erro no login Google/Supabase:', error)
            } finally {
              setLoading(false)
            }
          }}
        >
          <Image source={require("../assets/images/logo-google.png")} style={styles.logo_google} />
          <Text style={styles.primaryButtonText}>{loading ? 'Entrando...' : 'Entrar com Google'}</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={continueWithoutGoogle}
        >
          <Text style={styles.secondaryButtonText}>Continuar sem Google</Text>
        </Pressable>
        {!!loginError && <Text style={styles.errorText}>{loginError}</Text>}
      </View>
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
  errorText: {
    marginTop: 10,
    color: '#B00020',
    textAlign: 'center',
    maxWidth: 280,
  },
})
