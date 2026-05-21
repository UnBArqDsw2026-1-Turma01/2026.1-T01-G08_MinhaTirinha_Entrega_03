import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

type FinalImageSectionProps = {
    image_url: string
}

export function FinalImageSection({ image_url }: FinalImageSectionProps) {
    return(
        <View style={styles.container}>
            <Image style={styles.comic} source={image_url}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "80%",
        paddingHorizontal: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    comic: {
        padding: 40,
        height: 300,
        width: 300,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: "black",
        overflow: "hidden"
    },
})