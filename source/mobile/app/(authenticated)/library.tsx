import { View, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Services } from "@/utils/services";
import { IComicInfo } from "@/utils/entities/comic_info.entity";
import { ICategory } from "@/utils/entities/category.entity";
import { NavigationHeaderWithTitle } from "@/components/header/navigation-header-with-title";
import { Completed } from "@/components/auth/library/completed";
import { CategorySection } from "@/components/auth/library/category/category-section";
import { ComicSection } from "@/components/auth/library/comic/comic-section";
import { Loading } from "@/components/loading";

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

    const { user_id, category_id } = useLocalSearchParams();
    const uid = Array.isArray(user_id) ? user_id[0] : user_id;
    const cid = Number(Array.isArray(category_id) ? category_id[0] : category_id);
    const router = useRouter();
    const path: string = 'library';
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [comics, setComics] = useState<IComicInfo[]>();
    const [categories, setCategories] = useState<ICategory[]>();
    const [empty, setEmpty] = useState<boolean>(); 

    useEffect(()=>{
        async function fetchData() {
            try {
                setLoading(true);
                let response_comics;
                if(cid) response_comics = await Services.getNotStartedComicsByCategory(uid, cid);
                else response_comics = await Services.getNotStartedComics(uid);
                const response_categories = await Services.getNotReadCategories(uid);
                setComics(response_comics);
                setCategories(response_categories);
                if(response_comics.length === 0) setEmpty(true);
                else setEmpty(false);
                setLoading(false);
            } catch (error) {
                // router.push('/error');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    },[])

    return (
        <View style={styles.container}>
            <NavigationHeaderWithTitle setSidebarOpenTrue={()=>setSidebarOpen(true)} setSidebarOpenFalse={()=>setSidebarOpen(false)} visible={sidebarOpen} route={path} userId={uid} title="Biblioteca de Aventuras"/>
            {loading? 
                <Loading/>
                :
                <>
                    {!!empty ? 
                        <Completed/>:
                        <>
                            {(!!categories && !!comics) &&
                                <>  
                                    <CategorySection categories={categories} userId={uid}/> 
                                    <ComicSection comics={comics} path={path} userId={uid}/>
                                </>
                            }
                        </>}     
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