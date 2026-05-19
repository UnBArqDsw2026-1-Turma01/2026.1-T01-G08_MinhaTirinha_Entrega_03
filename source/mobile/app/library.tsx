import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";

/**
 * =====================================================
 * TELA DE GALERIA (Library)
 * =====================================================
 *
 * DESCRIÇÃO:
 * Galeria de tirinhas organizadas por temas (Infantil, Humor, Tecnologia, Educação).
 * Mantém o padrão de design limpo com tons pastéis e a fonte Iceberg.
 *
 * FLUXO:
 * 1. Usuário seleciona uma tirinha.
 * 2. Navega para a tela de pintura (ColorPicker) passando os parâmetros necessários.
 */

interface category {
    id: number,
    name: string
}

interface comic {
    id: string,
    title: string, 
    theme: string,
    image: string
}

export default function Library() {

    const { user_id } = useLocalSearchParams();
    const router = useRouter();

    // Mock de tirinhas baseado na descrição do projeto


    const categories: category[] = [
        {
            id: 1, name: "Category 1"
        }, 
        {
            id: 2, name: "Category 2"
        }
        , 
        {
            id: 3, name: "Category 3"
        }
        , 
        {
            id: 4, name: "Category 4"
        }
        , 
        {
            id: 5, name: "Category 5"
        }
    ]

    const tirinhas: comic[] = [
        { id: '1', title: 'O Pequeno Explorador', theme: 'Infantil', image: 'https://www.lpm.com.br/livros/imagens/garfield_6___de_bom_humor_9788525415998_hd.jpg' },
        { id: '2', title: 'Piada de Programador', theme: 'Humor', image: 'https://lh6.googleusercontent.com/proxy/LvhsGVp3DaLPAJFflBe2Peucq2X7PBvNhwFEoiH-ekMt_mFXUTA_wL_dynhFZ9gEUI8F_1mWjjpdPiZ9IL6nh6xuwM_xL1f48otF6QS6ebQLfZJHwQ_c50VoIet44AYX1FKwQpTeOT3jJ9fS' },
        { id: '3', title: 'IA no Dia a Dia', theme: 'Tecnologia', image: 'https://lh6.googleusercontent.com/proxy/R00FBT443RrzPHrtRqYpnFKH7YXGgIzwDCEAIL8Owl43w64gnoEds6zImvNi-FmeIg-BLFPNx0cTqYULmm2pOPkRIg4MNPqTeVBU_5JKG-H3wboCgGUxxDRE61U1zGmCx0WLMupVkBKUs7sWm0M' },
        { id: '4', title: 'História do Brasil', theme: 'Educação', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtOcjKEIwrb3fZ-VmoCnVDhpy9Q2c0vA6pvw&s' },
        { id: '1', title: 'O Pequeno Explorador', theme: 'Infantil', image: 'https://www.lpm.com.br/livros/imagens/garfield_1___em_grande_forma_9788525414465_hd.jpg' },
        { id: '2', title: 'Piada de Programador', theme: 'Humor', image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgyPJsUAJkghB1YqvizMKBWWW6BmaQ2HgWNDxEzxuEmAYDsmBN-fzuNFHsjQe3m6tyWxLHZPH9TvuEeDBcKXOZ1Tf_g4dqNHn_WivnefbDcZRXOHDyWKLXWuHtyxXZpVf-r2oS2YvPkd6U/s1600/CEBOLINHA+60.png' },
        { id: '3', title: 'IA no Dia a Dia', theme: 'Tecnologia', image: 'https://static.wikia.nocookie.net/monica/images/3/3c/01a.jpg/revision/latest?cb=20110921001738&path-prefix=pt-br' },
        { id: '4', title: 'História do Brasil', theme: 'Educação', image: 'https://lh4.googleusercontent.com/proxy/wNKyCErC4gSdS8AZJH_T5YBqXKK2rg8AKGYREccTtMQOcwILlBgaWv5Q5XkDt9q7wpVtMaQHk0oz_7q1NffZ7c9VNpyIaCZqy5t8kSmdYSamMM_9DOPQp3e_vkwWeAN10WgneSt77M1KlILdlqbW6w' },
        { id: '1', title: 'O Pequeno Explorador', theme: 'Infantil', image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQagnj6G5s5cWs8jFp0wPZCEC4mB0Vni-7VxKSlrtIAyfmLBflqbf5m1PcmwqxyMVK3N2YyLT6r8xBAKXeQNB3fTAuGTWtkLBj1u6JhnMydHm_IWWEujLa9R9-s52ghjGW1gWyFDH4Ocw3v6d2rWylt9XjJESE6tDT9i5u4tHDDPUt_O_zysmAKo8UuqUl/s960/_CC_117_(1991).jpg' },
        { id: '2', title: 'Piada de Programador', theme: 'Humor', image: 'https://aventurasnahistoria.com.br/wp-content/uploads/amazon/capa-snoopy-livro1.jpg' },
        ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                {/* Menu Hamburger */}
                <Pressable style={styles.menu_hamburguer}>
                    <View style={styles.line}/>
                    <View style={styles.line}/>
                    <View style={styles.line}/>
                </Pressable>
                <Text style={styles.title}>Biblioteca de Aventuras</Text>
            </View>

            {/* Categories */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories_container}>
                {categories.map((category, index)=>(
                    // Category Button
                    <Pressable style={styles.category_button} key={index}>
                        <Text style={styles.category_text}>{category.name}</Text>
                    </Pressable>
                ))}
            </ScrollView>

            {/* Comics */}
            <ScrollView contentContainerStyle={styles.gallery} showsVerticalScrollIndicator={false}>
                {tirinhas.map((item, index) => (
                    // Comic Card
                    <Pressable
                        key={index}
                        style={styles.card}
                        onPress={() => {
                            router.push({
                                pathname: "/color-picker",
                                params: {
                                    id_comic: item.id,
                                    id_user: user_id as string,
                                    uncolored_image_url: item.image,
                                    comic_title: item.title
                                }
                            });
                        }}
                    >
                        <Image source={{ uri: item.image }} style={styles.cardImage} />
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );   
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FCFAEE",
    },
    header: {
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderBottomWidth: 1,
        borderBottomColor: "#8C8989",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

    },
    menu_hamburguer: {
        display: "flex",
        flexDirection: "column",
        gap: 5,
    },
    line: {
        borderRadius: 999,
        height: 2.5,
        width: 30,
        backgroundColor: "#8C8989"
    },
    categories_container: {
        display: "flex",
        marginHorizontal: 15,
        paddingRight: 30,
        gap: 15, 
        paddingVertical: 15
    },
    category_button: {
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#8C8989",
        paddingHorizontal: 10,
        paddingVertical: 2.5,
        height: 30
    },
    category_text: {
        fontSize: 16,
        fontFamily: "Farsan_400Regular",
        color: "#8C8989"
    },
    title: {
        fontSize: 27,
        fontFamily: "Iceberg_400Regular",
        color: "#8C8989",
    },
    subtitle: {
        fontSize: 16,
        color: "#A0A0A0",
        fontFamily: "Iceberg_400Regular",
        marginTop: 4,
    },
    gallery: {
        paddingVertical: 10,
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center',
        gap: 15
    },
    card: {
        width: 150,
        height: 225,
        overflow: 'hidden',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "#8C8989"
    },
    cardImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
});
