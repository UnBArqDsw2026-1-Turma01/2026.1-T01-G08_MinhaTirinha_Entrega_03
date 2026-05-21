import { Pressable } from "react-native";
import {
  GoogleSignin,
  isSuccessResponse
} from '@react-native-google-signin/google-signin'

import { supabase } from '../../utils/supabase'

import { useRouter } from 'expo-router'
import { Image } from "expo-image";

import { StyleSheet } from "react-native";


type GoogleButtonProps = {
    setLoadingTrue: ()=>void,
    setLoadingFalse: ()=>void,

}

export function GoogleButton({setLoadingTrue, setLoadingFalse}: GoogleButtonProps) {
    GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID!,
    })
    const router = useRouter();
    return (
        <Pressable
          onPress={async () => {
            // handler de login: tenta autenticar com Google e repassar token ao Supabase
            setLoadingTrue(); 
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
                if (user == null) router.push('/error');
                else router.replace(`/library?user_id=${user.id}`);
              }
            } catch (error: any) {
              router.push('/error');
            } finally {
              setLoadingFalse()
            }}}>
          <Image source={require("../../assets/images/logo-google.png")} style={styles.logo_google}/>
        </Pressable>

    );
}

const styles = StyleSheet.create({
      logo_google: {
    width: 50,
    height: 50,
    borderRadius: 999,
    borderWidth: 0,
    boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)"
  }
})