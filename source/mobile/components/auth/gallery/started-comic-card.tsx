import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, Pressable } from "react-native";
import { ProgressSection } from "./progress-section";

type StartedComicCardProps = {
    path: string, 
    user_id: string, 
    comic_id: number,
    comic_image_url: string,
    progress: number
}

export function StartedComicCard({ path, user_id, comic_id, comic_image_url, progress }: StartedComicCardProps) {
    const router = useRouter();
    return(
        <Pressable style={styles.card} onPress={() => {router.push({pathname: "/comic", params: { path: path, user_id: user_id, comic_id: comic_id, origin: path}});}}>
            <Image source={{ uri: comic_image_url }} style={styles.image} />
            <ProgressSection progress={progress}/>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        width: 150,
        height: 225,
        overflow: 'hidden',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "#8C8989"
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
})

