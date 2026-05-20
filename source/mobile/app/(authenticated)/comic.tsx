import { StyleSheet, View, Text, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";

export default function Comic() {
    const router = useRouter();
    const { user_id, id_user, comic_id, id } = useLocalSearchParams();
    const userIdParam = user_id ?? id_user;
    const comicIdParam = comic_id ?? id;
    const uid = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;
    const cid = Number(Array.isArray(comicIdParam) ? comicIdParam[0] : comicIdParam);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const m = [0, 1, 2, 3]

    return(
        <View style={styles.container}>
            <AppSidebar
                visible={sidebarOpen}
                userId={uid}
                activeRoute="library"
                onClose={() => setSidebarOpen(false)}
            />
            {/* Header */}
            <View style={styles.header}>
                {/* Menu Hamburger */}
                <Pressable style={styles.menu_hamburguer} onPress={() => setSidebarOpen(true)}>
                    <View style={styles.line}/>
                    <View style={styles.line}/>
                    <View style={styles.line}/>
                </Pressable>
                <Pressable style={styles.back_button} onPress={() => router.back()}>
                    <Image source={require("../../assets/images/arrow.svg")} style={styles.arrow}/>
                </Pressable>
                
            </View>

            {/* Box */}
            <View style={styles.subcontainer}>
                <View style={styles.progress}>
                    
                    <Text style={styles.title}>Tirinha {Number.isNaN(cid) ? "" : cid}</Text>
                    
                    {/* Select Field */}
                    <View style={styles.select_field}>
                        {m.map((item)=>(
                            <Pressable key={item} style={styles.comic}></Pressable>
                        ))}    
                    </View>

                    {/* Progress */}
                    <View style={styles.progress_bar_container}>
                        <Text style={styles.subtitle}>Progresso de Pintura</Text>
                        <View style={styles.progress_bar}>

                        </View>
                        <Text style={styles.subtitle}>0%</Text>
                    </View>

                </View>
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
    back_button: {
        paddingHorizontal: 10,
        paddingVertical: 6,
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
        height: '80%',
        paddingHorizontal: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    progress: {
        height: "auto",
        width: '100%',
        borderRadius: 40,
        borderWidth: 1,
        borderColor: '#8C8989',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
        gap: 10
    },
    select_field: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 20         
    },
    comic: {
        height: 125,
        width: 125,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#8C8989"
    },
    progress_bar_container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 2.5
    },
    progress_bar: {
        borderWidth: 2.5,
        borderColor: "#8C8989",
        borderRadius: 75,
        height: 30,
        width: 200
    }
});
