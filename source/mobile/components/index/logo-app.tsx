import { Image } from "expo-image";
import { StyleSheet } from "react-native";

export function LogoApp() {
    return       <Image source={require("../../assets/images/logo-minha-tirinha.png")} style={styles.logo_app}/>
    
}

const styles = StyleSheet.create({
    logo_app: {
        width: 150,
        height: 150
  }
})