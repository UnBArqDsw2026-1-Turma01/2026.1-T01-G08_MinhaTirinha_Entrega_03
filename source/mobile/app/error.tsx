import { View, Text } from "react-native";

export default function Error() {
    return (
        <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>    
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>:(</Text>
        </View>
    );
}