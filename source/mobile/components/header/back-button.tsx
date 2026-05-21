import { Image } from "expo-image";
import { Href, router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

type BackButtonProps = {
    route: Href
}

export function BackButton({ route }: BackButtonProps) {
    return(
        <Pressable onPress={()=>router.push(route)}>
            <Image source={require("../../assets/images/arrow.svg")} style={styles.arrow}/>
        </Pressable>      
    );
}

const styles = StyleSheet.create({
    arrow: {
        height: 30,
        width: 17
    },
})