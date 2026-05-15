import { useMemo } from "react";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getComicById } from "../../../lib/started-comics";

export default function ComicDetailScreen() {
  const router = useRouter();
  const { comicId, user_id } = useLocalSearchParams<{ comicId?: string | string[]; user_id?: string | string[] }>();

  const comic = useMemo(() => getComicById(comicId), [comicId]);
  const resolvedUserId = Number(Array.isArray(user_id) ? user_id[0] : user_id);

  const canOpen = Boolean(comic && Number.isFinite(resolvedUserId) && comic.ownerId === resolvedUserId);

  const goToCavalete = () => {
    if (!comic || !canOpen) {
      return;
    }

    const query = `?comicId=${comic.id}&user_id=${resolvedUserId}`;
    router.push(`/cavalete${query}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.page}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#6D6762" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>

        {!comic ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Tirinha não encontrada</Text>
            <Text style={styles.emptyText}>
              A tirinha solicitada não está disponível neste catálogo visual.
            </Text>
          </View>
        ) : !canOpen ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Acesso restrito</Text>
            <Text style={styles.emptyText}>
              Esta tirinha não pertence à sua conta.
            </Text>
          </View>
        ) : (
          <View style={styles.detailCard}>
            <View style={[styles.coverBackdrop, { backgroundColor: comic.coverTone }]}>
              <View style={[styles.coverGlow, { backgroundColor: comic.accent }]} />
              <View style={styles.coverRibbon} />
              <Image
                source={require("../../../assets/images/logo-minha-tirinha.png")}
                style={styles.coverLogo}
              />
              <View style={styles.coverInfoBlock}>
                <Text style={[styles.coverLabel, { color: comic.accent }]}>{comic.coverLabel}</Text>
                <Text style={styles.coverTitle}>{comic.title}</Text>
                <Text style={styles.coverSubtitle}>{comic.subtitle}</Text>
              </View>
            </View>

            <View style={styles.infoBlock}>
              <View style={styles.progressRow}>
                <View style={[styles.progressBarTrack, { backgroundColor: `${comic.accent}22` }]}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${comic.progress}%`, backgroundColor: comic.accent },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>{comic.progress}% concluído</Text>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaChip}>
                  <Ionicons name="images-outline" size={16} color="#847D76" />
                  <Text style={styles.metaChipText}>Pré-visualização do quadrinho</Text>
                </View>
              </View>

              <Pressable style={styles.primaryButton} onPress={goToCavalete}>
                <Ionicons name="color-palette-outline" size={18} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Ir para o cavalete</Text>
              </Pressable>
            </View>
          </View>
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
    padding: 18,
    gap: 18,
  },
  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderWidth: 1,
    borderColor: "rgba(144, 129, 119, 0.12)",
  },
  backButtonText: {
    color: "#6D6762",
    fontWeight: "700",
  },
  detailCard: {
    flex: 1,
    borderRadius: 30,
    padding: 14,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(144, 129, 119, 0.12)",
    shadowColor: "#B9AFA3",
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
    gap: 14,
  },
  coverBackdrop: {
    minHeight: 360,
    borderRadius: 26,
    padding: 18,
    overflow: "hidden",
    justifyContent: "space-between",
    position: "relative",
  },
  coverGlow: {
    position: "absolute",
    right: -54,
    bottom: -54,
    width: 180,
    height: 180,
    borderRadius: 180,
    opacity: 0.18,
  },
  coverRibbon: {
    width: 74,
    height: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.76)",
  },
  coverLogo: {
    width: 84,
    height: 84,
    borderRadius: 22,
    opacity: 0.88,
  },
  coverInfoBlock: {
    gap: 8,
    maxWidth: "92%",
  },
  coverLabel: {
    fontFamily: "Iceberg_400Regular",
    fontSize: 48,
    letterSpacing: 2,
  },
  coverTitle: {
    fontFamily: "Iceberg_400Regular",
    fontSize: 24,
    color: "#6F6A66",
  },
  coverSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#857E77",
  },
  infoBlock: {
    gap: 12,
  },
  progressRow: {
    gap: 8,
  },
  progressBarTrack: {
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 999,
  },
  progressText: {
    color: "#7F7872",
    fontSize: 13,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#F4F1E3",
  },
  metaChipText: {
    color: "#7F7872",
    fontSize: 12,
    fontWeight: "700",
  },
  primaryButton: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: "#675A89",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 10,
  },
  emptyTitle: {
    fontFamily: "Iceberg_400Regular",
    fontSize: 28,
    color: "#68625D",
  },
  emptyText: {
    textAlign: "center",
    color: "#8E867F",
    fontSize: 15,
    lineHeight: 21,
  },
});
