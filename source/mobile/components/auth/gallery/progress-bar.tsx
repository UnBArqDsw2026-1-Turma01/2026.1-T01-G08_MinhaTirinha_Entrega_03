import { StyleSheet, View } from "react-native";

type ProgressBarProps = { 
    progress: number
}

export function ProgressBar({ progress }: ProgressBarProps) {
    return(
        <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 25}%` }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    progressTrack: {
        height: 8,
        borderRadius: 999,
        overflow: "hidden",
        backgroundColor: "#E2DDD5",
    },
    progressFill: {
        height: "100%",
        borderRadius: 999,
        backgroundColor: "#675A89",
    },
})