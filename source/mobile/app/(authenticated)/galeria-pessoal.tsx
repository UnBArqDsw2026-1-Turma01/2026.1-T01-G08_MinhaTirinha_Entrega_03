/**
 * ==========================================
 * TELA: Galeria Pessoal
 * ==========================================
 * 
 * Exibe todas as tirinhas que o usuário iniciou ler.
 * 
 *  ARQUITETURA:
 * - ComicCardFactory: Prepara dados dos comics
 * - decorateComicCard: Adiciona estilos calculados
 * - ComicSelectionObserver: Gerencia seleção de comics
 * - OpenComicCommand: Executa abertura de comics
 * 
 *   PARA O BACKEND:
 * - Certifique que GET /comics/started?user_id={userId} retorna StartedComic[]
 * - Valide ownerId para garantir que user_id == ownerId (segurança)
 * - Todas as cores devem estar em formato hex válido
 * 
 *  PARA O FRONTEND:
 * - User_id é extraído dos query params da URL
 * - A FlatList renderiza em 2 colunas (numColumns={2})
 * - Animação suave ao clicar um card (press effect)
 * - Mostra barra de "Comic X selecionada" quando um comic é escolhido
 * - Mostra estado vazio se não houver tirinhas iniciadas
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  ComicCardFactory,
  ComicSelectionObserver,
  decorateComicCard,
  getStartedComicsByUser,
  OpenComicCommand,
  type StartedComic,
} from "../../lib/started-comics";

export default function Library() {
  /**
   *  SETUP: Hooks e Estado
   */
  
  // Router para navegação entre telas
  const router = useRouter();
  
  // Extrai user_id dos query params da URL
  // Exemplos: galeria-pessoal?user_id=user-001
  const { user_id } = useLocalSearchParams<{ user_id?: string | string[] }>();
  
  /**
   *  Observer Pattern: Gerencia seleção de comics
   * - useRef garante que seja a mesma instância em todos os renders
   * - Sem useRef, observer seria recriado a cada render (ruim!)
   */
  const selectionObserver = useRef(new ComicSelectionObserver()).current;
  
  // State que armazena qual comic está selecionado
  // Atualizado quando o observer dispara notificação
  const [selectedComic, setSelectedComic] = useState<StartedComic | null>(null);

  /**
   *  Fetch dos dados: Todos os comics do usuário
   * - useMemo garante que fetch só acontece quando user_id muda
   * - Retorna array vazio se user_id for undefined
   */
  const startedComics = useMemo(() => getStartedComicsByUser(user_id), [user_id]);

  /**
   *  Command Pattern: Prepara ação de abrir comic
   * - Encapsula: notificar seleção + navegar
   * - useMemo para não recriar a cada render
   * - Passa router.push como callback
   */
  const openComicCommand = useMemo(
    () =>
      new OpenComicCommand((comic) => {
        // Normaliza user_id (pode ser string ou array)
        const resolvedUserId = Array.isArray(user_id) ? user_id[0] : user_id;
        
        // Encoda query param para evitar caracteres especiais
        const query = resolvedUserId ? `?user_id=${encodeURIComponent(resolvedUserId)}` : "";
        
        // Navega para tela de leitura do comic específico
        router.push(`/comic/${comic.id}${query}`);
      }, selectionObserver),
    [router, selectionObserver, user_id],
  );

  /**
   *  Observer Listener: Atualiza UI quando comic é selecionado
   * - subscribe() retorna função de cleanup (auto remove listener)
   * - Só roda uma vez (dependency array = [selectionObserver])
   */
  useEffect(() => selectionObserver.subscribe(setSelectedComic), [selectionObserver]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Decorações de fundo (orbs visuais) */}
      <View style={styles.backgroundOrbLarge} />
      <View style={styles.backgroundOrbSmall} />

      <View style={styles.page}>
        {/* Cabeçalho minimalista */}
        <View style={styles.titleContainer}>
          <Text style={styles.kicker}>Galeria pessoal</Text>
          <Text style={styles.title}>Tirinhas iniciadas</Text>
        </View>

        {/**
         *  Barra de Seleção
         * - Aparece apenas quando um comic está selecionado (selectedComic != null)
         * - Feedback visual: mostra qual comic está pronto para abrir
         * - Desaparece quando nenhum está selecionado
         */}
        {selectedComic ? (
          <View style={styles.selectionBar}>
            <Ionicons name="sparkles-outline" size={18} color="#8C80C8" />
            <Text style={styles.selectionBarText}>{selectedComic.title} selecionada</Text>
          </View>
        ) : null}

        {/**
         *  Renderização da Galeria
         * 
         * Dois cenários:
         * 1. Vazio: Mostra mensagem se user não tiver tirinhas iniciadas
         * 2. Com dados: FlatList em 2 colunas com cards
         */}
        {startedComics.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="book-outline" size={30} color="#B9B3AA" />
            </View>
            <Text style={styles.emptyText}>Você ainda não possui tirinhas iniciadas.</Text>
          </View>
        ) : (
          /**
           *  FlatList: Exibe comics em grid 2x2
           * 
           * Propriedades importantes:
           * - numColumns={2}: Layout em 2 colunas
           * - keyExtractor: ID único para React (performance)
           * - showsVerticalScrollIndicator={false}: Remove scrollbar
           */
          <FlatList
            data={startedComics}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              /**
               *  Pipeline de Transformação:
               * 
               * 1. ComicCardFactory.create(item)
               *    - Adiciona progressLabel e statusLabel
               *    - Lógica: se progress >= 60 → "Em avanço", senão → "Para continuar"
               * 
               * 2. decorateComicCard(...)
               *    - Adiciona cores calculadas (shellTone, borderTone)
               *    - Cria variações de opacidade da cor accent
               * 
               * Resultado: comic pronto para renderização visual
               */
              const comic = decorateComicCard(ComicCardFactory.create(item));

              return (
                <Pressable
                  style={({ pressed }) => [styles.cardShell, pressed && styles.cardShellPressed]}
                  // Executa Command ao clicar
                  onPress={() => openComicCommand.execute(item)}
                >
                  {/* 
                    *  Glow Effect: Brilho atrás do card
                    * - Usa shellTone (cor com 18% opacidade)
                    * - Cria efeito de profundidade
                  */}
                  <View style={[styles.cardGlow, { backgroundColor: comic.shellTone }]} />
                  
                  {/*
                    *  Card Principal
                    * - borderColor usa borderTone (40% opacidade)
                    * - Cada card é independente e reutilizável
                  */}
                  <View style={[styles.card, { borderColor: comic.borderTone }]}>
                    {/*
                      *  Seção de Capa
                      * - backgroundColor: coverTone (cor única por tirinha)
                      * - Ribbon: elemento decorativo
                      * - Label: sigla da tirinha (ex: "AQP")
                      * - Accent: barra de cor que diferencia
                    */}
                    <View style={[styles.cover, { backgroundColor: comic.coverTone }]}>
                      <View style={styles.coverRibbon} />
                      <Text style={[styles.coverLabel, { color: comic.accent }]}>{comic.coverLabel}</Text>
                      <View style={[styles.coverAccent, { backgroundColor: comic.accent }]} />
                    </View>

                    {/* Título da tirinha (máximo 2 linhas) */}
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {comic.title}
                    </Text>

                    {/*
                      *  Linha de Metadados
                      * - Progress Pill: mostra "X% concluído" com cor accent
                      * - Chevron: indica navegação
                    */}
                    <View style={styles.cardMetaRow}>
                      <View style={[styles.progressPill, { backgroundColor: `${comic.accent}22` }]}>
                        <Text style={[styles.progressText, { color: comic.accent }]}>
                          {comic.progressLabel}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="#B4ADA6" />
                    </View>

                    {/* Status da tirinha: "Em avanço" ou "Para continuar" */}
                    <Text style={styles.cardStatus}>{comic.statusLabel}</Text>
                  </View>
                </Pressable>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FCFAEE",
  },
  page: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
    gap: 14,
  },
  backgroundOrbLarge: {
    position: "absolute",
    top: -60,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: "rgba(217, 236, 255, 0.55)",
  },
  backgroundOrbSmall: {
    position: "absolute",
    left: -35,
    top: 160,
    width: 90,
    height: 90,
    borderRadius: 90,
    backgroundColor: "rgba(249, 216, 230, 0.5)",
  },
  titleContainer: {
    marginBottom: 12,
  },
  kicker: {
    fontFamily: "Farsan_400Regular",
    fontSize: 18,
    color: "#A09A92",
    letterSpacing: 0.6,
  },
  title: {
    fontFamily: "Iceberg_400Regular",
    fontSize: 30,
    color: "#6F6A66",
  },
  selectionBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "rgba(140, 128, 200, 0.12)",
  },
  selectionBarText: {
    color: "#6E639D",
    fontSize: 13,
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 22,
    gap: 14,
  },
  columnWrapper: {
    gap: 12,
  },
  cardShell: {
    flex: 1,
    minHeight: 292,
    borderRadius: 28,
    position: "relative",
  },
  cardShellPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.94,
  },
  cardGlow: {
    position: "absolute",
    inset: 10,
    borderRadius: 28,
    opacity: 0.14,
    transform: [{ translateY: 8 }],
  },
  card: {
    flex: 1,
    padding: 12,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1.5,
    shadowColor: "#BFB4AA",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    gap: 10,
  },
  cover: {
    height: 170,
    borderRadius: 22,
    padding: 12,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  coverRibbon: {
    width: 52,
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
  },
  coverLabel: {
    fontSize: 32,
    fontFamily: "Iceberg_400Regular",
    letterSpacing: 1.2,
  },
  coverAccent: {
    position: "absolute",
    right: -10,
    bottom: -14,
    width: 76,
    height: 76,
    borderRadius: 76,
    opacity: 0.22,
  },
  cardTitle: {
    fontSize: 17,
    color: "#645D57",
    fontWeight: "700",
    lineHeight: 20,
  },
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  progressPill: {
    flexShrink: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
  progressText: {
    fontSize: 11,
    fontWeight: "700",
  },
  cardStatus: {
    color: "#A59D95",
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 26,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(185, 179, 170, 0.3)",
  },
  emptyText: {
    textAlign: "center",
    color: "#8D877F",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
  },
});
