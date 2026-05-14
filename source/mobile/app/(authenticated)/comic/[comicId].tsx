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
  const resolvedUserId = Array.isArray(user_id) ? user_id[0] : user_id;

  const canOpen = Boolean(comic && resolvedUserId && comic.ownerId === resolvedUserId);

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
            <View style={[styles.cover, { backgroundColor: comic.coverTone }]}>
              <View style={styles.coverRibbon} />
              <Image
                source={require("../../../assets/images/logo-minha-tirinha.png")}
                style={styles.coverLogo}
              />
              <Text style={[styles.coverLabel, { color: comic.accent }]}>{comic.coverLabel}</Text>
              <View style={[styles.coverBubble, { backgroundColor: comic.accent }]} />
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.title}>{comic.title}</Text>
              <Text style={styles.subtitle}>{comic.subtitle}</Text>

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
                  <Ionicons name="person-outline" size={16} color="#847D76" />
                  <Text style={styles.metaChipText}>{resolvedUserId}</Text>
                </View>
                <View style={styles.metaChip}>
                  <Ionicons name="lock-open-outline" size={16} color="#847D76" />
                  <Text style={styles.metaChipText}>Conteúdo correspondente</Text>
                </View>
              </View>

              <Pressable style={styles.primaryButton} onPress={() => router.back()}>
                <Text style={styles.primaryButtonText}>Abrir tirinha</Text>
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
  cover: {
    minHeight: 340,
    borderRadius: 26,
    padding: 18,
    overflow: "hidden",
    justifyContent: "space-between",
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
  coverLabel: {
    fontFamily: "Iceberg_400Regular",
    fontSize: 52,
    letterSpacing: 2,
  },
  coverBubble: {
    position: "absolute",
    right: -18,
    bottom: -18,
    width: 120,
    height: 120,
    borderRadius: 120,
    opacity: 0.22,
  },
  infoBlock: {
    gap: 12,
  },
  title: {
    fontFamily: "Iceberg_400Regular",
    fontSize: 28,
    color: "#69645F",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#8C857E",
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
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 18,
    backgroundColor: "#E6D8F3",
  },
  primaryButtonText: {
    color: "#675A89",
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
