import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Category, ComicLegacy, Comic as GalleryComic } from "../../lib/started-comics";
import { Services } from "../../utils/services";
import { useEffect } from "react";

export default function Library() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [categories, setCategories] = useState<Category[]>();
  const [comics, setComics] = useState<GalleryComic[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const { user_id, category_id } = useLocalSearchParams();
  const uid = Array.isArray(user_id) ? user_id[0] : user_id;
  const cid = Number(Array.isArray(category_id) ? category_id[0] : category_id);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let response_comics;
        if (cid) response_comics = await Services.getUnreadComicsByCategory(uid, cid);
        else response_comics = await Services.getUnreadComics(uid);
        const response_categories = await Services.getCategories();
        setComics(response_comics);
        setCategories(response_categories as Category[]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [uid, cid]);

  return (
    <View style={styles.container}>
      {isMenuOpen ? (
        <View style={styles.overlay} pointerEvents="box-none">
          <Pressable style={styles.backdrop} onPress={() => setIsMenuOpen(false)} />
          <View style={styles.sideBar}>
            <Text style={styles.sideBarTitle}>Onde vamos?</Text>
            <Pressable
              style={({ pressed }) => [styles.sideBarItem, pressed && styles.sideBarItemPressed]}
              onPress={() => {
                const resolvedUserId = Array.isArray(user_id) ? user_id[0] : user_id;
                setIsMenuOpen(false);
                router.replace(`/galeria-pessoal?user_id=${encodeURIComponent(resolvedUserId ?? "demo-user")}`);
              }}
            >
              <Ionicons name="grid-outline" size={18} color="#1D1713" />
              <Text style={styles.sideBarItemText}>Galeria pessoal</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <View style={styles.header}>
        <Pressable style={styles.menuHamburguer} onPress={() => setIsMenuOpen((current) => !current)}>
          <View style={styles.line} />
          <View style={styles.line} />
          <View style={styles.line} />
        </Pressable>
        <Text style={styles.title}>Biblioteca de Aventuras</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
        {categories?.map((category) => (
          <Pressable style={styles.categoryButton} key={category.id} onPress={() => router.push(`/library?user_id=${uid}&category_id=${category.id}`)}>
            <Text style={styles.categoryText}>{category.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.gallery} showsVerticalScrollIndicator={false}>
        {loading ? null : comics?.map((item, index) => (
          <Pressable
            key={`${item.id}-${index}`}
            style={styles.card}
            onPress={() => {
              const resolvedUserId = uid ?? "demo-user";
              // support both legacy `image` and gallery `image_url`
              const imageParam = (item as any).image ?? (item as any).image_url ?? "";
              router.push({
                pathname: "/color-picker",
                params: {
                  id_comic: item.id,
                  id_user: resolvedUserId,
                  uncolored_image_url: imageParam,
                  comic_title: item.title,
                },
              });
            }}
          >
            {
              (() => {
                const uri = (item as any).image ?? (item as any).image_url ?? "";
                const source = uri ? { uri } : require("../../assets/images/exemplo-quadrinho.png");
                return <Image source={source} style={styles.cardImage} />;
              })()
            }
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFAEE",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(29, 23, 19, 0.18)",
  },
  sideBar: {
    position: "absolute",
    top: 18,
    left: 14,
    zIndex: 21,
    elevation: 12,
    width: 230,
    padding: 14,
    borderRadius: 24,
    backgroundColor: "#FFFDF6",
    borderWidth: 1.5,
    borderColor: "#1D1713",
    shadowColor: "#1D1713",
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  sideBarTitle: {
    fontSize: 18,
    color: "#1D1713",
    fontFamily: "Iceberg_400Regular",
    marginBottom: 12,
  },
  sideBarItem: {
    width: "100%",
    minHeight: 54,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: "rgba(247, 210, 27, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(29, 23, 19, 0.12)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  sideBarItemPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.88,
  },
  sideBarItemText: {
    color: "#1D1713",
    fontSize: 15,
    fontWeight: "800",
  },
  header: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#8C8989",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuHamburguer: {
    flexDirection: "column",
    gap: 5,
  },
  line: {
    borderRadius: 999,
    height: 2.5,
    width: 30,
    backgroundColor: "#8C8989",
  },
  categoriesContainer: {
    marginHorizontal: 15,
    paddingRight: 30,
    gap: 15,
    paddingVertical: 15,
  },
  categoryButton: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#8C8989",
    paddingHorizontal: 10,
    paddingVertical: 2.5,
    height: 30,
    justifyContent: "center",
  },
  categoryText: {
    fontSize: 16,
    fontFamily: "Farsan_400Regular",
    color: "#8C8989",
  },
  title: {
    fontSize: 27,
    fontFamily: "Iceberg_400Regular",
    color: "#8C8989",
  },
  gallery: {
    paddingVertical: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
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
});