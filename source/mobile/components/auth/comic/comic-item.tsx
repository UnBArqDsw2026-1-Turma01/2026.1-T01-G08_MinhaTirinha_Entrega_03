import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, Pressable } from "react-native";

type ComicItemProps = {
    index: number,
    image_url: string,
    userId: string,
    comicId: number,
    origin: string,
    actual_status: boolean,
    previous_status: boolean,
    status_position: string
}

export function ComicItem({ index, image_url, userId, comicId, origin, actual_status, previous_status, status_position }: ComicItemProps) {
    const router = useRouter();
    return(
        <Pressable style={styles.comic} onPress={()=>{  
                                                        if(actual_status) router.push(`/final?image_url=${image_url}&user_id=${userId}&comic_id=${comicId}&origin=${origin}`)
                                                        else if(index===0) router.push(`/paint?user_id=${userId}&comic_id=${comicId}&comic_index=${index+1}&comic_status=${status_position}&origin=${origin}`);
                                                        else if (previous_status) router.push(`/paint?user_id=${userId}&comic_id=${comicId}&comic_index=${index+1}&comic_status=${status_position}&origin=${origin}`);}}>
            <Image style={styles.image} source={{ uri: image_url }}/>
            {index !== 0 && <BlurView intensity={previous_status? 0: 125} style={StyleSheet.absoluteFill}/>}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    comic: {
        height: 125,
        width: 125,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#8C8989",
        overflow: "hidden"
    },
    image: {
        width: "100%",
        height: "100%"
    }
})