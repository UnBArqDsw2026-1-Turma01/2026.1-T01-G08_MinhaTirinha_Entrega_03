import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Services } from "@/utils/services";
import { AppSidebar } from "@/components/AppSidebar";

/**
 * =====================================================
 * TELA DE GALERIA (Library)
 * =====================================================
 *
 * DESCRIÇÃO:
 * Galeria de tirinhas organizadas por temas (Infantil, Humor, Tecnologia, Educação).
 * Mantém o padrão de design limpo com tons pastéis e a fonte Iceberg.
 *
 * FLUXO:
 * 1. Usuário seleciona uma tirinha.
 * 2. Navega para a tela de pintura (ColorPicker) passando os parâmetros necessários.
 */

interface category {
    id: number,
    name: string
}

interface comic {
    id: string,
    title: string, 
    image_url: string
}

export default function Library() {

    const { user_id, category_id } = useLocalSearchParams();
    const uid = (Array.isArray(user_id) ? user_id[0] : user_id) ?? "1";
    const cid = Number(Array.isArray(category_id) ? category_id[0] : category_id);
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [comics, setComics] = useState<comic[]>();
    const [categories, setCategories] = useState<category[]>();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    
    
    useEffect(()=>{
        async function fetchData() {
            try {
                setLoading(true);
                let response_comics;
                if(cid) response_comics = await Services.getUnreadComicsByCategory(uid, cid);
                else response_comics = await Services.getUnreadComics(uid);
                const response_categories = await Services.getCategories();
                setComics(response_comics);
                setCategories(response_categories);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    },[cid, uid])

    return (
        
        <View style={styles.container}>
            <AppSidebar
                visible={sidebarOpen}
                userId={uid}
                activeRoute="library"
                onClose={() => setSidebarOpen(false)}
            />
            {loading? <></>:
            <>
                {/* Header */}
                <View style={styles.header}>
                    {/* Menu Hamburger */}
                    <Pressable style={styles.menu_hamburguer} onPress={() => setSidebarOpen(true)}>
                        <View style={styles.line}/>
                        <View style={styles.line}/>
                        <View style={styles.line}/>
                    </Pressable>
                    <Text style={styles.title}>Biblioteca de Aventuras</Text>
                </View>

                {/* Categories */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories_container}>
                    {categories?.map((category, index)=>(
                        // Category Button
                        <Pressable style={styles.category_button} key={index} onPress={()=>{router.push(`/library?user_id=${uid}&category_id=${category.id}`)}}>
                            <Text style={styles.category_text}>{category.name}</Text>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Comics */}
                <ScrollView contentContainerStyle={styles.gallery} showsVerticalScrollIndicator={false}>
                    {comics?.map((comic, index) => (
                        // Comic Card
                        <Pressable
                            key={index}
                            style={styles.card}
                            onPress={() => {
                                router.push({
                                    pathname: "/comic",
                                    params: {
                                        id: comic.id,
                                        id_user: uid,
                                    }
                                });
                            }}
                        >
                            <Image source={{ uri: comic.image_url }} style={styles.cardImage} />
                        </Pressable>
                    ))}
                </ScrollView>
            </>}
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
    categories_container: {
        display: "flex",
        marginHorizontal: 15,
        paddingRight: 30,
        gap: 15, 
        paddingVertical: 15
    },
    category_button: {
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#8C8989",
        paddingHorizontal: 10,
        paddingVertical: 2.5,
        height: 30
    },
    category_text: {
        fontSize: 16,
        fontFamily: "Farsan_400Regular",
        color: "#8C8989"
    },
    title: {
        fontSize: 27,
        fontFamily: "Iceberg_400Regular",
        color: "#8C8989",
    },
    subtitle: {
        fontSize: 16,
        color: "#A0A0A0",
        fontFamily: "Iceberg_400Regular",
        marginTop: 4,
    },
    gallery: {
        paddingVertical: 10,
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center',
        gap: 15
    },
    card: {
        width: 150,
        height: 225,
        overflow: 'hidden',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "#8C8989"
    },
    cardImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
});
