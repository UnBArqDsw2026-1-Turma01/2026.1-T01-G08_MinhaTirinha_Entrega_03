import { ICategory } from "@/utils/entities/category.entity";
import { useRouter } from "expo-router"
import { StyleSheet, Pressable, Text } from "react-native"

type CategoryButtonProps = {
    category: ICategory,
    userId: string
}

export function CategoryButton({ category, userId }: CategoryButtonProps) {
    const router = useRouter();
    return(
        <Pressable style={styles.button} onPress={()=>{router.push(`/library?user_id=${userId}&category_id=${category.id}`)}}>
            <Text style={styles.title}>{category.name}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#8C8989",
        paddingHorizontal: 10,
        paddingVertical: 2.5,
        height: 30
    },
    title: {
        fontSize: 16,
        fontFamily: "Farsan_400Regular",
        color: "#8C8989"
    },
})

