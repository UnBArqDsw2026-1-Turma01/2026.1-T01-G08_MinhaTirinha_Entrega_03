import { StyleSheet, Text } from "react-native";
import { NavigationHeader } from "./navigation-header";
import { BackButton } from "./back-button";
import { Href } from "expo-router";

type NavigationHeaderWithBackButtonProps = {
    setSidebarOpenTrue: ()=> void,
    setSidebarOpenFalse: ()=> void,
    visible: boolean,
    route: string,
    userId: string,
    push: Href
}

export function NavigationHeaderWithBackButton({ setSidebarOpenTrue, setSidebarOpenFalse, visible, route, userId, push }: NavigationHeaderWithBackButtonProps) {
    return(
        <NavigationHeader visible={visible} userId={userId} route={route} setSidebarOpenTrue={setSidebarOpenTrue} setSidebarOpenFalse={setSidebarOpenFalse} justify="space-between">
            <BackButton route={push}/>
        </NavigationHeader>    
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 27,
        fontFamily: "Iceberg_400Regular",
        color: "#8C8989",
    }
})