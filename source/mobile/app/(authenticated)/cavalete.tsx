import { useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const AVAILABLE_PANELS = [1, 2, 3, 4] as const;
const AVAILABLE_COLORS = [
  { label: "Rosa", value: "#F9D8E6" },
  { label: "Azul", value: "#D8EBFF" },
  { label: "Dourado", value: "#F4E6C3" },
  { label: "Roxo", value: "#E4E0F8" },
  { label: "Laranja", value: "#FFE6CC" },
  { label: "Verde", value: "#D8F5E8" },
  { label: "Vermelho", value: "#FFE6E6" },
];

export default function CavaleteScreen() {
  const router = useRouter();
  const { comicId } = useLocalSearchParams<{ comicId?: string | string[] }>();

  // Etapa seguinte do fluxo iniciado no Command da tela anterior.
  const resolvedComicId = useMemo(() => (Array.isArray(comicId) ? comicId[0] : comicId), [comicId]);
  const [selectedPanel, setSelectedPanel] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const canContinue = Boolean(selectedPanel && selectedColor);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#6D6762" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>

        <View style={styles.hero}>
          <Text style={styles.kicker}>Cavalete</Text>
          <Text style={styles.title}>Escolha o quadrinho e pinte</Text>
          <Text style={styles.description}>
            Essa tela é o próximo passo do fluxo. Aqui você vai escolher qual parte do quadrinho
            quer trabalhar e quais cores usar.
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Ionicons name="book-outline" size={16} color="#847D76" />
              <Text style={styles.metaChipText}>{resolvedComicId ?? "-"}</Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.primaryAction,
              pressed && styles.primaryActionPressed,
              !canContinue && styles.primaryActionDisabled,
            ]}
            onPress={() => {
              if (!canContinue) {
                return;
              }

              // Próximo passo: abrir o editor/pincel real com o quadrinho e a cor escolhida.
            }}
            disabled={!canContinue}
          >
            <Ionicons name="color-palette-outline" size={18} color="#FFFFFF" />
            <Text style={styles.primaryActionText}>
              {canContinue ? "Continuar para pintar" : "Escolha um quadrinho e uma cor"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Escolha o quadrinho</Text>
          <View style={styles.panelGrid}>
            {AVAILABLE_PANELS.map((panel) => (
              <Pressable
                key={panel}
                style={[
                  styles.panelCard,
                  selectedPanel === panel && styles.panelCardSelected,
                ]}
                onPress={() => setSelectedPanel(panel)}
              >
                <Text style={styles.panelNumber}>{panel}</Text>
                <Text style={styles.panelLabel}>Quadrinho</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cores disponíveis</Text>
          <View style={styles.colorGrid}>
            {AVAILABLE_COLORS.map((color) => (
              <Pressable
                key={color.value}
                style={[
                  styles.colorChip,
                  selectedColor === color.value && styles.colorChipSelected,
                ]}
                onPress={() => setSelectedColor(color.value)}
              >
                <View style={[styles.colorSwatch, { backgroundColor: color.value }]} />
                <Text style={styles.colorLabel}>{color.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.emptyNotice}>
          <Ionicons name="construct-outline" size={18} color="#8C80C8" />
          <Text style={styles.emptyNoticeText}>
            O editor de pintura vai entrar aqui depois. A navegação já está pronta.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FCFAEE",
  },
  content: {
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
  hero: {
    borderRadius: 28,
    padding: 18,
    backgroundColor: "rgba(255, 255, 255, 0.74)",
    borderWidth: 1,
    borderColor: "rgba(144, 129, 119, 0.12)",
    gap: 10,
  },
  kicker: {
    fontFamily: "Farsan_400Regular",
    fontSize: 18,
    color: "#A09A92",
  },
  title: {
    fontFamily: "Iceberg_400Regular",
    fontSize: 28,
    color: "#68625D",
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#8C857E",
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
  primaryAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: "#675A89",
  },
  primaryActionPressed: {
    opacity: 0.92,
  },
  primaryActionDisabled: {
    backgroundColor: "#B9B3AA",
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#6D6762",
  },
  panelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  panelCard: {
    width: "48%",
    minHeight: 96,
    borderRadius: 22,
    padding: 14,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(144, 129, 119, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  panelCardSelected: {
    borderColor: "#675A89",
    backgroundColor: "rgba(103, 90, 137, 0.08)",
  },
  panelNumber: {
    fontFamily: "Iceberg_400Regular",
    fontSize: 26,
    color: "#675A89",
  },
  panelLabel: {
    fontSize: 12,
    color: "#7F7872",
    fontWeight: "700",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  colorChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(144, 129, 119, 0.12)",
  },
  colorChipSelected: {
    borderColor: "#675A89",
    backgroundColor: "rgba(103, 90, 137, 0.08)",
  },
  colorSwatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  colorLabel: {
    fontSize: 12,
    color: "#6D6762",
    fontWeight: "700",
  },
  emptyNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(140, 128, 200, 0.12)",
  },
  emptyNoticeText: {
    flex: 1,
    color: "#6E639D",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
});
