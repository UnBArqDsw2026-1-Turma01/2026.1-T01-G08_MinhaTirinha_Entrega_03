import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { useEffect, useMemo, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Services } from "@/utils/services";
import { IStartedComicInfo } from "@/utils/entities/started_comic_info";

/**
 * Tela da Galeria Pessoal.
 *
 * Responsabilidade desta tela:
 * - Buscar as tirinhas que o usuario ja comecou.
 * - Renderizar os cards no mesmo padrao visual da galeria principal.
 * - Calcular o progresso de pintura a partir dos 4 booleanos do historico.
 *
 * Integracao esperada com o banco:
 * - A tabela Historic guarda id_comic, id_user, first, second, third e fourth.
 * - first/second/third/fourth indicam se cada um dos 4 quadrinhos ja foi pintado.
 * - Se a API tambem devolver os dados relacionados de Comic, esta tela usa
 *   Comic.name e Comic.image_url para montar o card.
 *
 * Padroes de projeto usados nesta parte:
 * - Adapter: normalizeStartedComic adapta diferentes formatos de resposta da API
 *   para o formato unico usado pela tela.
 * - Strategy simples: countPaintedPanels concentra a regra de calculo do progresso,
 *   deixando a renderizacao independente da estrutura exata recebida.
 */

export default function GaleriaPessoal() {
    const { user_id } = useLocalSearchParams();
    const uid = Array.isArray(user_id) ? user_id[0] : user_id;
    const router = useRouter();
    const path = 'gallery';
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [startedComics, setStartedComics] = useState<IStartedComicInfo[]>([]);

    useEffect(()=>{
        async function fetchData() {
            try{
                setLoading(true);

                // Chamada esperada: GET /comics/started/:userId.
                // A API deve retornar historicos do usuario com os booleanos
                // first, second, third e fourth, idealmente junto dos dados de Comic.
                const response = await Services.getUserComicsOnHistoric(uid);
                setStartedComics(response);
            } catch (error) {
                router.push('/error');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    },[])

    const hasComics = useMemo(() => startedComics.length > 0, [startedComics]);

    function calculateProgress(comic: IStartedComicInfo) {
        let count = 0;
        if(comic.first) count++;
        if(comic.second) count++;
        if(comic.third) count++;
        if(comic.fourth) count++;
        return count;
    }

    return (
        <View style={styles.container}>
            
            {/* Header */}
            <AppSidebar visible={sidebarOpen} userId={uid} activeRoute='gallery' onClose={() => setSidebarOpen(false)}/>
            <View style={styles.header}>
                <Pressable style={styles.menu_hamburguer} onPress={() => setSidebarOpen(true)}>
                    <View style={styles.line}/>
                    <View style={styles.line}/>
                    <View style={styles.line}/>
                </Pressable>
                <Text style={styles.title}>Galeria Pessoal</Text>
            </View>
            {loading? <></>:
            <>
                {!hasComics ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>Nenhuma tirinha iniciada</Text>
                        <Text style={styles.emptyText}>As tirinhas que voce comecar vao aparecer aqui.</Text>
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={styles.gallery} showsVerticalScrollIndicator={false}>
                        {startedComics.map((comic, index) => (
                            <Pressable key={`${comic.id}-${index}`} style={styles.card} onPress={() => {
                                    router.push({
                                        pathname: "/comic",
                                        params: {
                                            path: path,
                                            user_id: uid,
                                            comic_id: comic.id,
                                            origin: path
                                        }
                                    });
                                }}
                            >
                                <Image source={comic.image_url } style={styles.cardImage} />

                                <View style={styles.progressContainer}>
                                    <Text style={styles.progressText}>
                                        {calculateProgress(comic)}/4</Text>
                                    <View style={styles.progressTrack}>
                                        <View style={[styles.progressFill, { width: `${calculateProgress(comic) * 25}%` }]} />
                                    </View>
                                </View>
                                
                            </Pressable>
                        ))}
                    </ScrollView>
                )}
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
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 20
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
    title: {
        fontSize: 27,
        fontFamily: "Iceberg_400Regular",
        color: "#8C8989",
    },
    gallery: {
        paddingVertical: 25,
        paddingHorizontal: 20,
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 15
    },
    card: {
        width: 150,
        height: 225,
        overflow: "hidden",
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "#8C8989",
    },
    cardImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    progressContainer: {
        position: "absolute",
        left: 10,
        right: 10,
        bottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: "rgba(252, 250, 238, 0.92)",
        gap: 5,
    },
    progressText: {
        fontSize: 13,
        fontWeight: "800",
        color: "#8C8989",
        textAlign: "center",
    },
    progressTrack: {
        height: 8,
        borderRadius: 999,
        overflow: "hidden",
        backgroundColor: "#E2DDD5",
    },
    progressFill: {
        height: "100%",
        borderRadius: 999,
        backgroundColor: "#675A89",
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 28,
        gap: 8,
    },
    emptyTitle: {
        fontSize: 24,
        fontFamily: "Iceberg_400Regular",
        color: "#8C8989",
        textAlign: "center",
    },
    emptyText: {
        fontSize: 16,
        fontFamily: "Farsan_400Regular",
        color: "#8C8989",
        textAlign: "center",
    },
});
