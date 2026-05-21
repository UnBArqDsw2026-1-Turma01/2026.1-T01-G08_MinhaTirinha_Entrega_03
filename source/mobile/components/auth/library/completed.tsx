import { StyleSheet, Text, View } from "react-native";

export function Completed() {
    return (
        <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Parabéns você completou todas as tirinhas!</Text>
            <Text style={styles.emptyText}>Quando lançarmos novas tirinhas elas irão aparecer aqui.</Text>
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