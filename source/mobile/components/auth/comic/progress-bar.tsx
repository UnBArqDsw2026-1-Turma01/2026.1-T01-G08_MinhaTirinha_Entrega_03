import { StyleSheet, View } from "react-native";

type ProgressBarProps = {
    progress: number
}

export function ProgressBar({ progress }: ProgressBarProps) {
    return(
        <View style={styles.container}>
            <View style={[styles.progress, {width: `${progress}%`}]}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 2.5,
        borderColor: "#8C8989",
        borderRadius: 75,
        height: 30,
        width: 200,
        display:"flex",
        justifyContent: "center"
    },
    progress: {
        height: 25, 
        backgroundColor: "#d18f97", 
        borderRadius: 75
    }
    
})