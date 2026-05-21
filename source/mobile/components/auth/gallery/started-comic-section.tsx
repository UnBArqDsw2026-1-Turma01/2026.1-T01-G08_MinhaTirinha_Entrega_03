import { StyleSheet, ScrollView } from "react-native";
import { StartedComicCard } from "./started-comic-card";
import { IStartedComicInfo } from "@/utils/entities/started_comic_info";

export type StartedComicSectionProps = {
    comics: IStartedComicInfo[],
    path: string, 
    userId: string
}
export function StartedComicSection({ comics, path, userId }: StartedComicSectionProps) {
        function calculateProgress(comic: IStartedComicInfo) {
            let count = 0;
            if(comic.first) count++;
            if(comic.second) count++;
            if(comic.third) count++;
            if(comic.fourth) count++;
            return count;
        }
    return(
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            {comics?.map((comic, index) => (
                <StartedComicCard key={index} path={path} user_id={userId} comic_id={comic.id} comic_image_url={comic.image_url} progress={calculateProgress(comic)}/>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: '100%',
        paddingVertical: 10,
        paddingHorizontal: 20,
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: 'flex-start',
        gap: 15
    },
    // gallery: {
    //     paddingVertical: 25,
    //     paddingHorizontal: 20,
    //     display: "flex",
    //     flexWrap: "wrap",
    //     flexDirection: "row",
    //     justifyContent: "flex-start",
    //     alignItems: "center",
    //     gap: 15
    // },
})