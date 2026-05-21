import { StyleSheet, ScrollView } from "react-native";
import { ComicCard } from "./comic-card";
import { IComicInfo } from "@/utils/entities/comic_info.entity";

export type ComicSectionProps = {
    comics: IComicInfo[],
    path: string, 
    userId: string
}

export function ComicSection({ comics, path, userId }: ComicSectionProps) {
    return(
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            {comics?.map((comic, index) => (
                <ComicCard key={index} path={path} user_id={userId} comic_id={comic.id} comic_image_url={comic.image_url}/>
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
    }
})