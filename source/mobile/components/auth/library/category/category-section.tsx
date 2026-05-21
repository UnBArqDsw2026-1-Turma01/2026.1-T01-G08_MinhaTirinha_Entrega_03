import { StyleSheet, ScrollView } from "react-native"
import { CategoryButton } from "./category-button";
import { ICategory } from "@/utils/entities/category.entity";

export type CategorySectionProps = {
    categories: ICategory[],
    userId: string,
}

export function CategorySection({ categories, userId }: CategorySectionProps) {
    return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
            {categories.map((category, index)=>(
                <CategoryButton key={index} category={category} userId={userId}/>
            ))}
            </ScrollView> 
    );
}

const styles = StyleSheet.create({
      container: {
        display: "flex",
        marginHorizontal: 15,
        paddingRight: 30,
        gap: 15, 
        paddingVertical: 15
    }
})