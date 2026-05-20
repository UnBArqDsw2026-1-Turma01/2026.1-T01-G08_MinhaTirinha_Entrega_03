import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { useEffect, useMemo, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Services } from "@/utils/services";

type StartedComicResponse = {
  id?: number | string;
  comic_id?: number | string;
  id_comic?: number | string;
  id_user?: string;
  title?: string;
  name?: string;
  image_url?: string | null;
  imageUrl?: string | null;
  Comic?: {
    id?: number | string;
    name?: string;
    image_url?: string | null;
  } | null;
  first?: boolean;
  second?: boolean;
  third?: boolean;
  fourth?: boolean;
  panel1?: boolean;
  panel2?: boolean;
  panel3?: boolean;
  panel4?: boolean;
  panelsPainted?: {
    panel1?: boolean;
    panel2?: boolean;
    panel3?: boolean;
    panel4?: boolean;
  };
};

type StartedComic = {
  id: string;
  title: string;
  image_url: string | null;
  progress: number;
};

const MOCK_STARTED_COMICS: StartedComicResponse[] = [
  {
    comic_id: 15,
    id_comic: 15,
    title: "A Quarta Pagina do Porcelanato",
    image_url: null,
    first: true,
    second: true,
    third: false,
    fourth: false,
  },
  {
    comic_id: 21,
    id_comic: 21,
    title: "Cafe, Cores e Planos",
    image_url: null,
    first: true,
    second: false,
    third: false,
    fourth: false,
  },
  {
    comic_id: 42,
    id_comic: 42,
    title: "O Dia em que o Lapis Sumiu",
    image_url: null,
    first: true,
    second: true,
    third: true,
    fourth: false,
  },
];

function countPaintedPanels(comic: StartedComicResponse) {
  const panels = comic.panelsPainted;
  const values = [
    comic.first ?? comic.panel1 ?? panels?.panel1,
    comic.second ?? comic.panel2 ?? panels?.panel2,
    comic.third ?? comic.panel3 ?? panels?.panel3,
    comic.fourth ?? comic.panel4 ?? panels?.panel4,
  ];

  return values.filter(Boolean).length;
}

function normalizeStartedComic(comic: StartedComicResponse): StartedComic {
  const id = comic.id_comic ?? comic.comic_id ?? comic.Comic?.id ?? comic.id ?? "";

  return {
    id: String(id),
    title: comic.title ?? comic.name ?? comic.Comic?.name ?? "Tirinha sem titulo",
    image_url: comic.image_url ?? comic.imageUrl ?? comic.Comic?.image_url ?? null,
    progress: countPaintedPanels(comic),
  };
}

export default function GaleriaPessoal() {
    const { user_id } = useLocalSearchParams();
    const uid = (Array.isArray(user_id) ? user_id[0] : user_id) ?? "1";
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [startedComics, setStartedComics] = useState<StartedComic[]>([]);

    useEffect(()=>{
        async function fetchData() {
            try {
                setLoading(true);
                const response = uid ? await Services.getStartedComics(uid) : undefined;
                const rawComics = Array.isArray(response) && response.length > 0 ? response : MOCK_STARTED_COMICS;
                setStartedComics(rawComics.map(normalizeStartedComic));
            } catch {
                setStartedComics(MOCK_STARTED_COMICS.map(normalizeStartedComic));
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    },[uid])

    const hasComics = useMemo(() => startedComics.length > 0, [startedComics]);

    return (
        <View style={styles.container}>
            <AppSidebar
                visible={sidebarOpen}
                userId={uid}
                activeRoute="galeria-pessoal"
                onClose={() => setSidebarOpen(false)}
            />
            <>
                <View style={styles.header}>
                    <Pressable style={styles.menu_hamburguer} onPress={() => setSidebarOpen(true)}>
                        <View style={styles.line}/>
                        <View style={styles.line}/>
                        <View style={styles.line}/>
                    </Pressable>
                    <Text style={styles.title}>Galeria Pessoal</Text>
                </View>

                {loading && <Text style={styles.loadingText}>Carregando galeria pessoal...</Text>}

                {!hasComics ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>Nenhuma tirinha iniciada</Text>
                        <Text style={styles.emptyText}>As tirinhas que voce comecar vao aparecer aqui.</Text>
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={styles.gallery} showsVerticalScrollIndicator={false}>
                        {startedComics.map((comic, index) => (
                            <Pressable
                                key={`${comic.id}-${index}`}
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
                                {comic.image_url ? (
                                    <Image source={{ uri: comic.image_url }} style={styles.cardImage} />
                                ) : (
                                    <View style={styles.placeholderImage}>
                                        <Text style={styles.placeholderText}>{comic.title.slice(0, 2).toUpperCase()}</Text>
                                    </View>
                                )}
                                <View style={styles.progressContainer}>
                                    <Text style={styles.progressText}>{comic.progress}/4</Text>
                                    <View style={styles.progressTrack}>
                                        <View style={[styles.progressFill, { width: `${comic.progress * 25}%` }]} />
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>
                )}
            </>
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
    title: {
        fontSize: 27,
        fontFamily: "Iceberg_400Regular",
        color: "#8C8989",
    },
    loadingText: {
        color: "#8C8989",
        fontFamily: "Farsan_400Regular",
        fontSize: 16,
        textAlign: "center",
        marginTop: 12,
    },
    gallery: {
        paddingVertical: 25,
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "center",
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
        backgroundColor: "#FFFFFF",
    },
    cardImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    placeholderImage: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F4F1E3",
    },
    placeholderText: {
        fontSize: 32,
        fontFamily: "Iceberg_400Regular",
        color: "#8C8989",
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
