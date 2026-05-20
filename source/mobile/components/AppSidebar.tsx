import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type AppSidebarProps = {
  visible: boolean;
  userId?: string;
  activeRoute: "library" | "galeria-pessoal";
  onClose: () => void;
};

export function AppSidebar({ visible, userId, activeRoute, onClose }: AppSidebarProps) {
  const router = useRouter();

  const navigateTo = (route: AppSidebarProps["activeRoute"]) => {
    onClose();
    const query = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
    router.push(`/${route}${query}`);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>Minha Tirinha</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={22} color="#8C8989" />
            </Pressable>
          </View>

          <Pressable
            style={[styles.navItem, activeRoute === "library" && styles.navItemActive]}
            onPress={() => navigateTo("library")}
          >
            <Ionicons name="library-outline" size={20} color="#8C8989" />
            <Text style={styles.navText}>Galeria de tirinhas</Text>
          </Pressable>

          <Pressable
            style={[styles.navItem, activeRoute === "galeria-pessoal" && styles.navItemActive]}
            onPress={() => navigateTo("galeria-pessoal")}
          >
            <Ionicons name="person-circle-outline" size={20} color="#8C8989" />
            <Text style={styles.navText}>Galeria pessoal</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  sidebar: {
    width: 280,
    maxWidth: "82%",
    height: "100%",
    paddingTop: 42,
    paddingHorizontal: 18,
    backgroundColor: "#FCFAEE",
    borderRightWidth: 1,
    borderRightColor: "#D9D0C4",
    gap: 12,
  },
  sidebarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  sidebarTitle: {
    fontSize: 25,
    fontFamily: "Iceberg_400Regular",
    color: "#8C8989",
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "transparent",
  },
  navItemActive: {
    backgroundColor: "#F4F1E3",
    borderColor: "#D9D0C4",
  },
  navText: {
    fontSize: 17,
    fontFamily: "Farsan_400Regular",
    color: "#8C8989",
  },
});
