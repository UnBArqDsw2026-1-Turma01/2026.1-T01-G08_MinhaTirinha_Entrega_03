import { useMemo, useState } from "react";
import { FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  ComicCardFactory,
  decorateComicCard,
  getStartedComicsByUser,
} from "../../lib/started-comics";

export default function GaleriaPessoal() {
  const router = useRouter();
  const { user_id } = useLocalSearchParams<{ user_id?: string | string[] }>();
  const resolvedUserId = Array.isArray(user_id) ? user_id[0] : user_id;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const startedComics = useMemo(() => getStartedComicsByUser(user_id), [user_id]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.page}>
        {isMenuOpen ? (
          <View style={styles.overlay} pointerEvents="box-none">
            <Pressable style={styles.backdrop} onPress={() => setIsMenuOpen(false)} />
            <View style={styles.sideBar}>
              <Text style={styles.sideBarTitle}>Onde vamos?</Text>
              <Pressable
                style={({ pressed }) => [styles.sideBarItem, pressed && styles.sideBarItemPressed]}
                onPress={() => {
                  setIsMenuOpen(false);
                  router.replace(`/library?user_id=${encodeURIComponent(resolvedUserId ?? "demo-user")}`);
                }}
              >
                <Ionicons name="grid-outline" size={18} color="#1D1713" />
                <Text style={styles.sideBarItemText}>Biblioteca</Text>
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
          <Text style={styles.title}>Galeria pessoal</Text>
        </View>

        {startedComics.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={30} color="#B9B3AA" />
            <Text style={styles.emptyText}>Você ainda não possui tirinhas iniciadas.</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
            <View style={styles.galleryGrid}>
              {startedComics.map((item, index) => {
                const comic = decorateComicCard(ComicCardFactory.create(item));
                const imageSource = comic.imageUrl ? { uri: comic.imageUrl } : require("../../assets/images/exemplo-quadrinho.png");

                return (
                  <Pressable
                    key={item.id}
                    style={({ pressed }) => [styles.cardShell, pressed && styles.cardShellPressed]}
                    onPress={() => {
                      const userParam = encodeURIComponent(resolvedUserId ?? "demo-user");
                      const imageParam = encodeURIComponent(comic.imageUrl ?? "");
                      router.push(`/color-picker?id_comic=${encodeURIComponent(comic.id)}&id_user=${userParam}&uncolored_image_url=${imageParam}`);
                    }}
                  >
                    <View style={[styles.cardGlow, { backgroundColor: comic.shellTone }]} />

                    <View style={[styles.card, { borderColor: comic.borderTone }]}>
                      <View style={styles.coverFrame}>
                        <Image source={imageSource} style={styles.coverImage} contentFit="cover" />
                      </View>

                      <View style={styles.cardBody}>
                        <View style={styles.progressTrack}>
                          <View style={[styles.progressFill, { width: `${comic.progressPercent}%`, backgroundColor: comic.accent }]} />
                        </View>

                        <Text style={styles.progressText}>{comic.progressLabel}</Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FCFAEE",
  },
  page: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 12,
    gap: 14,
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
  title: {
    fontFamily: "Iceberg_400Regular",
    fontSize: 27,
    color: "#8C8989",
  },
  listContent: {
    paddingBottom: 22,
    paddingTop: 4,
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
  },
  cardShell: {
    width: 150,
    minHeight: 225,
    borderRadius: 30,
    position: "relative",
  },
  cardShellPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.94,
  },
  cardGlow: {
    position: "absolute",
    inset: 8,
    borderRadius: 30,
    opacity: 0.16,
    transform: [{ translateY: 12 }],
  },
  card: {
    flex: 1,
    padding: 7,
    borderRadius: 30,
    backgroundColor: "#FFFDF6",
    borderWidth: 1.75,
    shadowColor: "#1D1713",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
    gap: 7,
  },
  coverFrame: {
    height: 150,
    borderRadius: 20,
    padding: 5,
    backgroundColor: "#F7D21B",
    borderWidth: 1.75,
    borderColor: "#1D1713",
    overflow: "hidden",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },
  cardBody: {
    gap: 6,
    paddingHorizontal: 2,
  },
  progressTrack: {
    height: 7,
    borderRadius: 999,
    backgroundColor: "rgba(29, 23, 19, 0.10)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  progressText: {
    fontSize: 9,
    color: "#8B8278",
    fontWeight: "700",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 26,
  },
  emptyText: {
    textAlign: "center",
    color: "#8D877F",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
  },
});