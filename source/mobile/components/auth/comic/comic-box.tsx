import { StyleSheet, Text, View } from "react-native";
import { ProgressSection } from "./progress-section";
import { IImage } from "@/utils/entities/image.entity";
import { IStatus } from "@/utils/entities/status.entity";
import { IComic } from "@/utils/entities/comic.entity";
import { ComicItem } from "./comic-item";

type ComicBoxProps = {
    progress: number,
    comicInfo: IComic,
    comicStatus: IStatus,
    comicImages: IImage[],
    userId: string,
    comicId: number,
    origin: string
}

export function ComicBox({ progress, comicInfo, comicStatus, comicImages, userId, comicId, origin }: ComicBoxProps) {
    const comics = [0, 1, 2, 3]
    const status_position = ['first', 'second', 'third', 'fourth'];
    const status = [comicStatus.first, comicStatus.second, comicStatus.third, comicStatus.fourth];
    return(
        <View style={styles.container}>
            <Text style={styles.title}>{comicInfo.name}</Text>
            <View style={styles.subcontainer}>
                {comics.map((index)=>(
                    <ComicItem key={index} index={index} image_url={comicImages[index].image_url} userId={userId} comicId={comicId} origin={origin} actual_status={status[index]} previous_status={status[index-1]} status_position={status_position[index]}/>
                ))}
            </View>
            <ProgressSection progress={progress}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
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
    subcontainer: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 20         
    },
    title: {
        fontSize: 20,
        fontFamily: "Iceberg_400Regular",
        color: "#8C8989",
    },
})