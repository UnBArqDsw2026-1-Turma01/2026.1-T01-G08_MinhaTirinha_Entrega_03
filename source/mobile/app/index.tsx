import {
  GoogleSignin,
  isSuccessResponse
} from '@react-native-google-signin/google-signin'

import { supabase } from '../utils/supabase'
import { StyleSheet, View, Text, Pressable } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { Image } from 'expo-image'

export default function Index() {

  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID!,
  })

  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');

  return (
    <View style={styles.main_container}>
      <Image source={require("../assets/images/logo-minha-tirinha.png")} style={styles.logo_app}/>
      {!loading &&
      <View style={styles.sub_container}>
        <Text style={styles.title}>Realizar Login</Text>
        <Pressable
          onPress={async () => {
            // handler de login: tenta autenticar com Google e repassar token ao Supabase
            setLoginError('')
            setLoading(true)
            try {
              await GoogleSignin.hasPlayServices()
              const response = await GoogleSignin.signIn()
              if (isSuccessResponse(response)) {
                // Certifica-se de que o idToken existe (não é null) antes de chamar o Supabase
                const idToken = response.data.idToken
                if (!idToken) throw new Error('idToken ausente no retorno do Google Sign-In')
                const { data, error } = await supabase.auth.signInWithIdToken({
                  provider: 'google',
                  token: idToken,
                })
                const user = data.user
                if (user == null) router.replace('/error')
                else {
                  router.replace(`/library?user_id=${user.id}`);
                  // router.push(`/comic?path=index&user_id=${user.id}&comic_id=1`);
                }
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
          <Image source={require("../assets/images/logo-google.png")} style={styles.logo_google}/>
        </Pressable>
        <Pressable style={styles.testButton} onPress={() => {
          const demoUrl = 'https://i.imgur.com/ExdKOOz.png'
          router.push(`/color-picker?uncolored_image_url=${encodeURIComponent(demoUrl)}&id_comic=demo&id_user=demo`)
        }}>
          <Text>Abrir sem login (teste)</Text>
        </Pressable>
        {!!loginError && <Text style={styles.errorText}>{loginError}</Text>}
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
    gap: 10
  },
  title: {
    fontSize: 26,
    color: "#8C8989",
    fontFamily: "Iceberg_400Regular"
  },
  logo_google: {
    width: 50,
    height: 50,
    borderRadius: 999,
    borderWidth: 0,
    boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)"
  },
  errorText: {
    marginTop: 10,
    color: '#B00020',
    textAlign: 'center',
    maxWidth: 280,
  },
  testButton: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
})