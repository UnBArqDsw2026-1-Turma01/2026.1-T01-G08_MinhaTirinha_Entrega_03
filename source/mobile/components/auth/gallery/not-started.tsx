import { StyleSheet, View, Text } from "react-native";

export function NotStarted() {
    return (
        <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nenhuma tirinha iniciada</Text>
            <Text style={styles.emptyText}>As tirinhas que voce comecar vao aparecer aqui.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
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
})