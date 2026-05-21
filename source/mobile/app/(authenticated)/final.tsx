import { StyleSheet, View, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FinalImageSection } from "@/components/auth/final/final-image-section";
import { NavigationHeaderWithBackButton } from "@/components/header/navigation-header-with-back-button";
import { useState } from "react";

export default function Final() {    
    const { image_url, user_id, comic_id, origin } = useLocalSearchParams();
    const url = Array.isArray(image_url) ? image_url[0] : image_url;
    const uid = Array.isArray(user_id) ? user_id[0] : user_id;
    const cid = Number(Array.isArray(comic_id) ? comic_id[0] : comic_id);
    const origin_f =  Array.isArray(origin) ? origin[0] : origin;
    const path = 'final';
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    return(
        <View style={styles.container}>
            <NavigationHeaderWithBackButton setSidebarOpenTrue={()=>setSidebarOpen(true)} setSidebarOpenFalse={()=>setSidebarOpen(false)}visible={sidebarOpen} route={path} userId={uid} push={`/comic?path=${path}&user_id=${uid}&comic_id=${cid}&origin=${origin_f}`}/>
            <FinalImageSection image_url={url}/>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FCFAEE",
    }
});

