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

export default function Library() {

    const { user_id } = useLocalSearchParams();
    const router = useRouter();

    // Mock de tirinhas baseado na descrição do projeto
    const tirinhas = [
        { id: '1', title: 'O Pequeno Explorador', theme: 'Infantil', image: 'https://placehold.jp/24/34C759/ffffff/300x150.png?text=Tirinha+Infantil' },
        { id: '2', title: 'Piada de Programador', theme: 'Humor', image: 'https://placehold.jp/24/FF9500/ffffff/300x150.png?text=Tirinha+Humor' },
        { id: '3', title: 'IA no Dia a Dia', theme: 'Tecnologia', image: 'https://placehold.jp/24/30A7FF/ffffff/300x150.png?text=Tirinha+Tech' },
        { id: '4', title: 'História do Brasil', theme: 'Educação', image: 'https://placehold.jp/24/5856D6/ffffff/300x150.png?text=Tirinha+Edu' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Minha Tirinha</Text>
                <Text style={styles.subtitle}>Escolha sua próxima aventura para colorir!</Text>
            </View>

            <ScrollView contentContainerStyle={styles.gallery} showsVerticalScrollIndicator={false}>
                {tirinhas.map((item) => (
                    <Pressable
                        key={item.id}
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
                        <View style={styles.cardInfo}>
                            <View style={styles.themeBadge}>
                                <Text style={styles.themeText}>{item.theme}</Text>
                            </View>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                        </View>
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
        paddingTop: 60,
    },
    header: {
        paddingHorizontal: 25,
        marginBottom: 20,
    },
    title: {
        fontSize: 34,
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
        paddingHorizontal: 25,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        marginBottom: 25,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#EEE',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    cardImage: {
        width: '100%',
        height: 160,
        contentFit: 'cover',
    },
    cardInfo: {
        padding: 15,
    },
    themeBadge: {
        backgroundColor: '#FCFAEE',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0'
    },
    themeText: {
        fontSize: 12,
        color: '#8C8989',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    cardTitle: {
        fontSize: 20,
        fontFamily: "Iceberg_400Regular",
        color: '#444',
    }
});
