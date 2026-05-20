import { StyleSheet, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Painted() {

    const router = useRouter();
    const { image_url } = useLocalSearchParams();
    const url = Array.isArray(image_url) ? image_url[0] : image_url;

    return(
        <View style={styles.container}>
            
            <View style={styles.header}>
                {/* Menu Hamburger */}
                <Pressable style={styles.menu_hamburguer}>
                    <View style={styles.line}/>
                    <View style={styles.line}/>
                    <View style={styles.line}/>
                </Pressable>
                <Pressable onPress={()=>router.back()}>
                    <Image source={require("../../assets/images/arrow.svg")} style={styles.arrow}/>
                </Pressable>
            </View>

            <View style={styles.subcontainer}>
                <Image style={styles.comic} source={url}/>
            </View>

        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FCFAEE",
    },
    header: {
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderBottomWidth: 1,
        borderBottomColor: "#8C8989",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        // gap: 20,
        alignItems: "center",
    },
    menu_hamburguer: {
        display: "flex",
        flexDirection: "column",
        gap: 5,
    },
    line: {
        borderRadius: 999,
        height: 2.5,
        width: 30,
        backgroundColor: "#8C8989"
    },
    arrow: {
        height: 30,
        width: 17
    },
    title: {
        fontSize: 20,
        fontFamily: "Iceberg_400Regular",
        color: "#8C8989",
    },
    subtitle: {
        fontSize: 18,
        color: "#A0A0A0",
        fontFamily: "Iceberg_400Regular",
        marginTop: 4,
    },
    subcontainer: {
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
});