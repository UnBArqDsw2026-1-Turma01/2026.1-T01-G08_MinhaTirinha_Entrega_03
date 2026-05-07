import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Library() {

    const { user_id } = useLocalSearchParams();
    return (
        <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>    
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>ID Usúario: {user_id}</Text>
        </View>
    );   
}