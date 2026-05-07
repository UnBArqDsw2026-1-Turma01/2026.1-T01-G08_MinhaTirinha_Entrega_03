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

  return (
    <View style={styles.main_container}>
      <Image source={require("../assets/images/logo-minha-tirinha.png")} style={styles.logo_app}/>
      {!loading &&
      <View style={styles.sub_container}>
        <Text style={styles.title}>Realizar Login</Text>
        <Pressable onPress={async () => {
                                          try {
                                            setLoading(true);
                                            await GoogleSignin.hasPlayServices()
                                            const response = await GoogleSignin.signIn()
                                            if (isSuccessResponse(response)) {
                                              const { data, error } = await supabase.auth.signInWithIdToken({
                                                provider: 'google',
                                                token: response.data.idToken,

                                              })
                                              // console.log(error, data);
                                              const user = data.user;
                                              if(user == null) router.replace('/error');
                                              else {
                                                router.replace(`/library?user_id=${user.id}`)
                                              }
                                            }
                                          } catch (error: any) {
                                              // console.log(error);
                                              router.replace('/error')
                                            } 
                                          }
                                        }
                                      >
          <Image source={require("../assets/images/logo-google.png")} style={styles.logo_google}/>
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
})