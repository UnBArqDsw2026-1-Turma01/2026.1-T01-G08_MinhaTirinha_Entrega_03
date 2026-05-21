import { StyleSheet, Text } from "react-native";
import { NavigationHeader } from "./navigation-header";

type NavigationHeaderWithTitleProps = {
    setSidebarOpenTrue: ()=> void,
    setSidebarOpenFalse: ()=> void,
    visible: boolean,
    route: string,
    userId: string,
    title: string,
}

export function NavigationHeaderWithTitle({ setSidebarOpenTrue, setSidebarOpenFalse, visible, route, userId, title }: NavigationHeaderWithTitleProps) {
    return(
        <NavigationHeader visible={visible} userId={userId} route={route} setSidebarOpenTrue={setSidebarOpenTrue} setSidebarOpenFalse={setSidebarOpenFalse} justify="flex-start">
            <Text style={styles.title}>{title}</Text>
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