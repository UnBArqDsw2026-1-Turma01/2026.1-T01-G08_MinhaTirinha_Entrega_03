import { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  ComicCardFactory,
  ComicSelectionObserver,
  decorateComicCard,
  getStartedComicsByUser,
  OpenComicCommand,
  type StartedComic,
} from "../../lib/started-comics";

export default function Library() {
  const router = useRouter();
  const { user_id } = useLocalSearchParams<{ user_id?: string | string[] }>();
  const selectionObserver = useRef(new ComicSelectionObserver()).current;
  const [selectedComic, setSelectedComic] = useState<StartedComic | null>(null);

  const startedComics = useMemo(() => getStartedComicsByUser(user_id), [user_id]);

  const openComicCommand = useMemo(
    () =>
      new OpenComicCommand((comic) => {
        const resolvedUserId = Array.isArray(user_id) ? user_id[0] : user_id;
        const query = resolvedUserId ? `?user_id=${encodeURIComponent(resolvedUserId)}` : "";
        router.push(`/comic/${comic.id}${query}`);
      }, selectionObserver),
    [router, selectionObserver, user_id],
  );

  useEffect(() => selectionObserver.subscribe(setSelectedComic), [selectionObserver]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundOrbLarge} />
      <View style={styles.backgroundOrbSmall} />

      <View style={styles.page}>
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.kicker}>Galeria pessoal</Text>
              <Text style={styles.title}>Tirinhas iniciadas</Text>
            </View>
            <View style={styles.heroBadge}>
              <Ionicons name="albums-outline" size={18} color="#7D7A78" />
              <Text style={styles.heroBadgeText}>{startedComics.length} itens</Text>
            </View>
          </View>

          <View style={styles.heroIllustration}>
            <Image
              source={require("../../assets/images/logo-minha-tirinha.png")}
              style={styles.heroLogo}
            />
            <View style={styles.heroIllustrationTextBlock}>
              <Text style={styles.heroIllustrationTitle}>Leitura em progresso</Text>
              <Text style={styles.heroIllustrationText}>
                Escolha uma capa para continuar de onde parou.
              </Text>
            </View>
          </View>
        </View>

        {selectedComic ? (
          <View style={styles.selectionBar}>
            <Ionicons name="sparkles-outline" size={18} color="#8C80C8" />
            <Text style={styles.selectionBarText}>{selectedComic.title} selecionada</Text>
          </View>
        ) : null}

        {startedComics.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="book-outline" size={30} color="#B9B3AA" />
            </View>
            <Text style={styles.emptyText}>Você ainda não possui tirinhas iniciadas.</Text>
          </View>
        ) : (
          <FlatList
            data={startedComics}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const comic = decorateComicCard(ComicCardFactory.create(item));

              return (
                <Pressable
                  style={({ pressed }) => [styles.cardShell, pressed && styles.cardShellPressed]}
                  onPress={() => openComicCommand.execute(item)}
                >
                  <View style={[styles.cardGlow, { backgroundColor: comic.shellTone }]} />
                  <View style={[styles.card, { borderColor: comic.borderTone }]}>
                    <View style={[styles.cover, { backgroundColor: comic.coverTone }]}>
                      <View style={styles.coverRibbon} />
                      <Text style={[styles.coverLabel, { color: comic.accent }]}>{comic.coverLabel}</Text>
                      <View style={[styles.coverAccent, { backgroundColor: comic.accent }]} />
                    </View>

                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {comic.title}
                    </Text>

                    <View style={styles.cardMetaRow}>
                      <View style={[styles.progressPill, { backgroundColor: `${comic.accent}22` }]}>
                        <Text style={[styles.progressText, { color: comic.accent }]}>
                          {comic.progressLabel}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="#B4ADA6" />
                    </View>

                    <Text style={styles.cardStatus}>{comic.statusLabel}</Text>
                  </View>
                </Pressable>
              );
            }}
          />
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
    paddingHorizontal: 18,
    paddingTop: 12,
    gap: 14,
  },
  backgroundOrbLarge: {
    position: "absolute",
    top: -60,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: "rgba(217, 236, 255, 0.55)",
  },
  backgroundOrbSmall: {
    position: "absolute",
    left: -35,
    top: 160,
    width: 90,
    height: 90,
    borderRadius: 90,
    backgroundColor: "rgba(249, 216, 230, 0.5)",
  },
  heroCard: {
    borderRadius: 28,
    padding: 18,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(144, 129, 119, 0.12)",
    shadowColor: "#B9AFA3",
    shadowOpacity: 0.14,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
    gap: 14,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  kicker: {
    fontFamily: "Farsan_400Regular",
    fontSize: 18,
    color: "#A09A92",
    letterSpacing: 0.6,
  },
  title: {
    fontFamily: "Iceberg_400Regular",
    fontSize: 30,
    color: "#6F6A66",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#F6EEDB",
  },
  heroBadgeText: {
    fontSize: 13,
    color: "#7D7A78",
    fontWeight: "600",
  },
  subtitle: {
    color: "#8D877F",
    lineHeight: 20,
    fontSize: 14,
  },
  heroIllustration: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 22,
    backgroundColor: "#F4F1E3",
  },
  heroLogo: {
    width: 62,
    height: 62,
    borderRadius: 18,
  },
  heroIllustrationTextBlock: {
    flex: 1,
    gap: 4,
  },
  heroIllustrationTitle: {
    color: "#706A66",
    fontSize: 15,
    fontWeight: "700",
  },
  heroIllustrationText: {
    color: "#948D85",
    fontSize: 13,
    lineHeight: 18,
  },
  selectionBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "rgba(140, 128, 200, 0.12)",
  },
  selectionBarText: {
    color: "#6E639D",
    fontSize: 13,
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 22,
    gap: 14,
  },
  columnWrapper: {
    gap: 12,
  },
  cardShell: {
    flex: 1,
    minHeight: 292,
    borderRadius: 28,
    position: "relative",
  },
  cardShellPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.94,
  },
  cardGlow: {
    position: "absolute",
    inset: 10,
    borderRadius: 28,
    opacity: 0.14,
    transform: [{ translateY: 8 }],
  },
  card: {
    flex: 1,
    padding: 12,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1.5,
    shadowColor: "#BFB4AA",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    gap: 10,
  },
  cover: {
    height: 170,
    borderRadius: 22,
    padding: 12,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  coverRibbon: {
    width: 52,
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
  },
  coverLabel: {
    fontSize: 32,
    fontFamily: "Iceberg_400Regular",
    letterSpacing: 1.2,
  },
  coverAccent: {
    position: "absolute",
    right: -10,
    bottom: -14,
    width: 76,
    height: 76,
    borderRadius: 76,
    opacity: 0.22,
  },
  cardTitle: {
    fontSize: 17,
    color: "#645D57",
    fontWeight: "700",
    lineHeight: 20,
  },
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  progressPill: {
    flexShrink: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
  progressText: {
    fontSize: 11,
    fontWeight: "700",
  },
  cardStatus: {
    color: "#A59D95",
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 26,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(185, 179, 170, 0.3)",
  },
  emptyText: {
    textAlign: "center",
    color: "#8D877F",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
  },
});
