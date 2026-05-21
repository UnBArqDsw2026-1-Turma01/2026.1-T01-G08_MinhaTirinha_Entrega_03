import { StyleSheet, View, Text } from 'react-native'
import { useState } from 'react'

import { LogoApp } from '@/components/index/logo-app'
import { GoogleButton } from '@/components/index/google-button'

export default function Index() {

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <View style={styles.main_container}>
      <LogoApp/>
      {!loading &&
      <View style={styles.sub_container}>
        <Text style={styles.title}>Realizar Login</Text>
        <GoogleButton setLoadingTrue={()=>setLoading(true)} setLoadingFalse={()=>setLoading(false)}/>
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
  }
})