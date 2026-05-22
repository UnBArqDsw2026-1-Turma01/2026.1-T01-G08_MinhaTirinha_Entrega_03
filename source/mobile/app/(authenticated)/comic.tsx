import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, Href } from "expo-router";
import { useEffect, useState } from "react";
import { Services } from "@/utils/services";
import { IStatus } from "@/utils/entities/status.entity";
import { IComic } from "@/utils/entities/comic.entity";
import { IImage } from "@/utils/entities/image.entity";
import { NavigationHeaderWithBackButton } from "@/components/header/navigation-header-with-back-button";
import { ComicBox } from "@/components/auth/comic/comic-box";
import { Loading } from "@/components/loading";

export default function Comic() {
    const { path, user_id, comic_id, origin } = useLocalSearchParams();
    const origin_f =  Array.isArray(origin) ? origin[0] : origin;
    const pathname = Array.isArray(path) ? path[0] : path;
    const uid = Array.isArray(user_id) ? user_id[0] : user_id;
    const cid = Number(Array.isArray(comic_id) ? comic_id[0] : comic_id);
    const route_origin = `/${origin}?user_id=${uid}`;

    const [comicInfo, setComicInfo] = useState<IComic>();
    const [comicStatus, setComicStatus] = useState<IStatus>();
    const [comicImages, setComicImages] = useState<IImage[]>();
    const [progress, setProgress] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    
    function calculateProgress() {
        let value = 0;
        if(comicStatus?.first) value += 25;
        if(comicStatus?.second) value += 25;
        if(comicStatus?.third) value += 25;
        if(comicStatus?.fourth) value += 25;
        setProgress(value);
    }

    useEffect(()=>{
        async function fetchData() {
            setLoading(true);
            let response_comic;
            if(path === 'library' || path === 'first') {
                response_comic = await Services.getNotStartedComic(cid);
            } else {
                response_comic = await Services.getUserComicOnHistoric(uid, cid);
            }
            setComicInfo(response_comic!.comic_info);
            setComicStatus(response_comic!.comic_status);
            setComicImages(response_comic!.comic_images);
        }
        fetchData();
        setLoading(false);
    }, []);

    useEffect(()=>{
        calculateProgress();
    }, [comicStatus]);


    return( 
        <View style={styles.container}>

            <NavigationHeaderWithBackButton setSidebarOpenTrue={()=>setSidebarOpen(true)} setSidebarOpenFalse={()=>setSidebarOpen(false)}visible={sidebarOpen} route={pathname} userId={uid} push={(route_origin as Href)}/>

            {loading?
                <Loading/>
                :
                <View style={styles.subcontainer}>
                    {(comicInfo === undefined || comicImages === undefined || comicStatus === undefined) ? 
                        <></>:
                        <ComicBox progress={progress} comicInfo={comicInfo} comicStatus={comicStatus} comicImages={comicImages} userId={uid} comicId={cid} origin={origin_f}/> }
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FCFAEE",
    },
    subcontainer: {
        height: '80%',
        paddingHorizontal: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
});