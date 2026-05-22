import { View, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Services } from "@/utils/services";
import { IStartedComicInfo } from "@/utils/entities/started_comic_info";
import { NavigationHeaderWithTitle } from "@/components/header/navigation-header-with-title";
import { NotStarted } from "@/components/auth/gallery/not-started";
import { StartedComicSection } from "@/components/auth/gallery/started-comic-section";
import { Loading } from "@/components/loading";

/**
 * Tela da Galeria Pessoal.
 *
 * Responsabilidade desta tela:
 * - Buscar as tirinhas que o usuario ja comecou.
 * - Renderizar os cards no mesmo padrao visual da galeria principal.
 * - Calcular o progresso de pintura a partir dos 4 booleanos do historico.
 *
 * Integracao esperada com o banco:
 * - A tabela Historic guarda id_comic, id_user, first, second, third e fourth.
 * - first/second/third/fourth indicam se cada um dos 4 quadrinhos ja foi pintado.
 * - Se a API tambem devolver os dados relacionados de Comic, esta tela usa
 *   Comic.name e Comic.image_url para montar o card.
 *
 * Padroes de projeto usados nesta parte:
 * - Adapter: normalizeStartedComic adapta diferentes formatos de resposta da API
 *   para o formato unico usado pela tela.
 * - Strategy simples: countPaintedPanels concentra a regra de calculo do progresso,
 *   deixando a renderizacao independente da estrutura exata recebida.
 */

export default function GaleriaPessoal() {
    const { user_id } = useLocalSearchParams();
    const uid = Array.isArray(user_id) ? user_id[0] : user_id;
    const router = useRouter();
    const path = 'gallery';
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [startedComics, setStartedComics] = useState<IStartedComicInfo[]>([]);

    useEffect(()=>{
        async function fetchData() {
            try{
                setLoading(true);

                // Chamada esperada: GET /comics/started/:userId.
                // A API deve retornar historicos do usuario com os booleanos
                // first, second, third e fourth, idealmente junto dos dados de Comic.
                const response = await Services.getUserComicsOnHistoric(uid);
                setStartedComics(response);
            } catch (error) {
                router.push('/error');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    },[])

    const hasComics = useMemo(() => startedComics.length > 0, [startedComics]);

    return (
        <View style={styles.container}>
            <NavigationHeaderWithTitle visible={sidebarOpen} userId={uid} route='gallery' setSidebarOpenTrue={()=>setSidebarOpen(true)} setSidebarOpenFalse={() => setSidebarOpen(false)} title='Galeria Pessoal'/>
            {loading? 
                <Loading/>:
                <>
                    {!hasComics ? (
                        <NotStarted/>
                    ) : (
                        <StartedComicSection  comics={startedComics} path={path} userId={uid}/>
                    )}
                </>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FCFAEE",
    }
});
