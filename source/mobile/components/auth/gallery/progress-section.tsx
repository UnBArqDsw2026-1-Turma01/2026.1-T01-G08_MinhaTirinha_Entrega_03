import { StyleSheet, Text, View } from "react-native";
import { ProgressBar } from "./progress-bar";

type ProgressSectionProps = {
    progress: number
}

export function ProgressSection({ progress }: ProgressSectionProps) {
    return(
        <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{progress}/4</Text>
            <ProgressBar progress={progress}/>
        </View>
    );
} 

const styles = StyleSheet.create({
    progressContainer: {
        position: "absolute",
        left: 10,
        right: 10,
        bottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: "rgba(252, 250, 238, 0.92)",
        gap: 5,
    },
    progressText: {
        fontSize: 13,
        fontWeight: "800",
        color: "#8C8989",
        textAlign: "center",
    }
})