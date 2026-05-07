import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
  isSuccessResponse
} from '@react-native-google-signin/google-signin'

import { supabase } from '../utils/supabase'
import { View } from 'react-native'
import { useState } from 'react'
import { Redirect } from 'expo-router'

export default function Index() {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID!,
  })

  const [auth, setAuth] = useState<number>()
  return (
    <View style = {{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={async () => {
          try {
            await GoogleSignin.hasPlayServices()
            const response = await GoogleSignin.signIn()
            if (isSuccessResponse(response)) {
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.data.idToken,
              })
              console.log(error, data)
              setAuth(1)
            }
          } catch (error: any) {
            console.log(error)
            if (error) {
              setAuth(2)
            } 
            
            }
          }
        }
      />
      {auth === 1 && <Redirect href="/authenticated" />} 
      {auth === 2 && <Redirect href="/error" />}
    </View>
  )
}