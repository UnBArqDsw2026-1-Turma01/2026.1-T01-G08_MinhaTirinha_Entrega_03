import { StyleSheet, Text, View } from "react-native";
import { Menu } from "./menu";
import { ReactNode } from "react";

type NavigationHeaderProps = {
    setSidebarOpenTrue: ()=> void,
    setSidebarOpenFalse: ()=> void,
    visible: boolean,
    route: string,
    userId: string,
    justify: string,
    children?: ReactNode;
}

export function NavigationHeader({ setSidebarOpenTrue, setSidebarOpenFalse, visible, route, userId, children, justify }: NavigationHeaderProps) {
    return(
        <View style={[styles.header, {justifyContent: justify}]}>
            <Menu visible={visible} userId={userId} activeRoute={route} onOpen={setSidebarOpenTrue} onClose={setSidebarOpenFalse}/>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
        header: {
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderBottomWidth: 1,
        borderBottomColor: "#8C8989",
        display: "flex",
        flexDirection: "row",
        gap: 20,
        alignItems: "center",
    },
    title: {
        fontSize: 27,
        fontFamily: "Iceberg_400Regular",
        color: "#8C8989",
    }
})