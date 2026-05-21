import { StyleSheet, Text, View } from "react-native";
import { ProgressBar } from "./progress-bar";

type ProgressSectionProsp = {
    progress: number
}

export function ProgressSection({ progress }: ProgressSectionProsp) {
    return(
        <View style={styles.progress_bar_container}>
            <Text style={styles.subtitle}>Progresso de Pintura</Text>
            <ProgressBar progress={progress}/>
            <Text style={styles.subtitle}>{progress}%</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    progress_bar_container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 2.5
    },
    subtitle: {
        fontSize: 18,
        color: "#A0A0A0",
        fontFamily: "Iceberg_400Regular",
        marginTop: 4,
    },

})