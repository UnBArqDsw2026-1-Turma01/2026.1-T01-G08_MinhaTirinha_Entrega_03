import { StyleSheet, View, Text, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Services } from "@/utils/services";
import { IStatus } from "@/utils/entities/status.entity";
import { IComic } from "@/utils/entities/comic.entity";
import { IImage } from "@/utils/entities/image.entity";
import { BlurView } from "expo-blur";

export default function Comic() {
    const router = useRouter();
    const { path, user_id, comic_id } = useLocalSearchParams();
    const uid = Array.isArray(user_id) ? user_id[0] : user_id;
    const cid = Number(Array.isArray(comic_id) ? comic_id[0] : comic_id);
    const [comicInfo, setComicInfo] = useState<IComic>();
    const [comicStatus, setComicStatus] = useState<IStatus>();
    const [comicImages, setComicImages] = useState<IImage[]>();
    const [progress, setProgress] = useState('0%');
    
    function calculateProgress() {
        let value = 0;
        if(comicStatus?.first) value += 25;
        if(comicStatus?.second) value += 25;
        if(comicStatus?.third) value += 25;
        if(comicStatus?.fourth) value += 25;
        setProgress(`${value}%`);
    }

    useEffect(()=>{
        async function fetchData() {
            let response_comic;
            if(path === 'library') {
                response_comic = await Services.getNotStartedComic(cid);
            } else {
                response_comic = await Services.getUserComicOnHistoric(uid, cid);
            }
            setComicInfo(response_comic!.comic_info[0]);
            setComicStatus(response_comic!.comic_status);
            setComicImages(response_comic!.comic_images);
        }
        fetchData();
    }, []);

    useEffect(()=>{
        calculateProgress();
    }, [comicStatus]);


    return( 
        <View style={styles.container}>
            {/* Header */}
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

            {/* Box */}
            <View style={styles.subcontainer}>
                {(comicInfo === undefined || comicImages === undefined || comicStatus === undefined) ? <></>:
                    <View style={styles.progress}>
                        <Text style={styles.title}>{comicInfo.name}</Text>
                        {/* Select Field */}
                        <View style={styles.select_field}>
                                <Pressable style={styles.comic} onPress={()=>{
                                                                            if(comicStatus?.first) router.push(`/painted?image_url=${comicImages?.[0].image_url}`)
                                                                            else router.push('/color-picker');
                                                                            }}>
                                    <Image style={styles.image} source={{ uri: comicImages[0].image_url }}/>
                                </Pressable>
                                <Pressable style={styles.comic} onPress={()=>{  if(comicStatus?.second) router.push(`/painted?image_url=${comicImages?.[1].image_url}`)
                                                                                else if(comicStatus?.first) router.push('/color-picker');
                                                                            }}>
                                    <Image style={styles.image} source={{ uri: comicImages[1].image_url }}/>
                                    <BlurView intensity={comicStatus?.first? 0: 125} style={StyleSheet.absoluteFill}/>
                                </Pressable>
                                <Pressable style={styles.comic} onPress={()=>{  if(comicStatus?.third) router.push(`/painted?image_url=${comicImages?.[2].image_url}`)
                                                                                else if(comicStatus?.second) router.push('/color-picker');
                                                                            }}>                                
                                    <Image style={styles.image} source={{ uri: comicImages[2].image_url }}/>                                                                       
                                    <BlurView intensity={comicStatus?.second? 0: 125} style={StyleSheet.absoluteFill}/>
                                </Pressable>
                                <Pressable style={styles.comic} onPress={()=>{  if(comicStatus?.third) router.push(`/painted?image_url=${comicImages?.[3].image_url}`)
                                                                                else if(comicStatus?.fourth) router.push('/color-picker');
                                                                            }}>
                                    <Image style={styles.image} source={{ uri: comicImages[3].image_url }}/>
                                    <BlurView intensity={comicStatus?.third? 0: 125} style={StyleSheet.absoluteFill}/>
                                </Pressable>
                        </View>

                        {/* Progress */}
                        <View style={styles.progress_bar_container}>
                            <Text style={styles.subtitle}>Progresso de Pintura</Text>
                            <View style={styles.progress_bar}>
                                <View style={{height: 25, backgroundColor: "#d18f97", width: `${progress}`, borderRadius: 75}}/>
                            </View>
                            <Text style={styles.subtitle}>{progress}</Text>
                        </View>

                    </View>
                }
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
        borderColor: "#8C8989",
        overflow: "hidden"
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
        width: 200,
        display:"flex",
        justifyContent: "center"
    },
    blur: {
        width: "100%",
        height: "100%",
    },
    image: {
        width: "100%",
        height: "100%"
    }
});