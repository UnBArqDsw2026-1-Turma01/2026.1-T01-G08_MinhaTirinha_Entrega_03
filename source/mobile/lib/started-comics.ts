/**
 * ==========================================
 * TIPO: StartedComic
 * ==========================================
 * 
 * Representa uma tirinha que o usuário iniciou ler
 * 
 * PARA O BACKEND:
 * - Este tipo reflete EXATAMENTE a estrutura que vem da API
 * - Baseado no diagrama do banco: User (1:n) Historic (0:n) Comic
 * - Apenas campos que existem no banco
 * 
 * PARA O FRONTEND:
 * - id: ID da tirinha (Comic.id)
 * - ownerId: ID do usuário (User.id - number)
 * - title: Nome da tirinha (Comic.name)
 * - progress: % de conclusão calculado de Historic (0-25-50-100)%
 */
export type StartedComic = {
  id: number;
  ownerId: number;
  title: string;
  progress: number;
};

/**
 *  DADOS MOCKADOS - Substitua por chamada à API futuramente
 * 
 * Este array simula as tirinhas iniciadas que viriam do backend.
 * Cada objeto mantém a estrutura definida em StartedComic.
 * 
 *   PARA O BACKEND:
 * - Implemente um endpoint GET /comics/started?user_id={userId}
 * - Retorne apenas tirinhas do usuário solicitado (validar ownerId)
 * - Certifique-se que todas as cores estejam em formato hex válido
 * - O 'progress' deve estar sempre entre 0 e 100
 */
const STARTED_COMICS: StartedComic[] = [
  {
    id: 15,
    ownerId: 1,
    title: "A Quarta Página do Porcelanato",
    progress: 68,
  },
  {
    id: 21,
    ownerId: 1,
    title: "Café, Gatos e Planos Sem Sentido",
    progress: 31,
  },
  {
    id: 42,
    ownerId: 2,
    title: "O Dia em que o Lápis Sumiu",
    progress: 90,
  },
  {
    id: 64,
    ownerId: 1,
    title: "Noite de Neon no Bairro Azul",
    progress: 12,
  },
  {
    id: 89,
    ownerId: 1,
    title: "Diários de um Gato Filósofo",
    progress: 45,
  },
];

/**
 *  FUNÇÃO: getStartedComicsByUser
 *
 * Recupera todas as tirinhas iniciadas do usuário específico.
 * 
 *   PARA O BACKEND:
 * - Implemente filtro por ownerId no endpoint
 * - Retorne array vazio se o usuário não tiver tirinhas
 * - Sempre validar que o userId pertence ao usuário autenticado (segurança)
 * 
 *  PARA O FRONTEND:
 * - userId pode ser string ou array (expo-router passa arrays às vezes)
 * - Função resolve automaticamente para o primeiro elemento se for array
 * - Retorna [] vazio se userId for undefined/null
 * - Usada na tela galeria-pessoal para popultar a FlatList
 * 
 * @param userId - ID do usuário (pode vir como string ou array da query)
 * @returns Array de comics do usuário ou array vazio
 */
export function getStartedComicsByUser(userId: string | string[] | undefined) {
  // Normaliza userId (pode ser string ou array)
  const resolvedUserIdStr = Array.isArray(userId) ? userId[0] : userId;

  if (!resolvedUserIdStr) {
    return [];
  }

  // Converte para number para comparar com ownerId (type: number)
  const resolvedUserId = parseInt(resolvedUserIdStr, 10);

  return STARTED_COMICS.filter((comic) => comic.ownerId === resolvedUserId);
}

/**
 *  FUNÇÃO: getComicById
 * 
 * Busca uma tirinha específica pelo ID.
 * 
 *   PARA O BACKEND:
 * - Implemente endpoint GET /comics/{comicId}
 * - Retorne 404 se comic não existir
 * - Valide permissão: retorne 403 se o usuário não for o ownerId
 * 
 * PARA O FRONTEND:
 * - Usada ao clicar em um card para abrir a página de leitura
 * - Retorna undefined se comic não for encontrado
 * - Precisa do comicId que vem da URL via expo-router
 * 
 * @param comicId - ID único da tirinha (pode ser string ou array)
 * @returns O comic encontrado ou undefined
 */
export function getComicById(comicId: string | string[] | undefined) {
  const resolvedComicId = Array.isArray(comicId) ? comicId[0] : comicId;

  if (!resolvedComicId) {
    return undefined;
  }

  return STARTED_COMICS.find((comic) => String(comic.id) === resolvedComicId);
}

/**
 * DESIGN PATTERN: Factory Method
 * 
 * CLASSE: ComicCardFactory
 * 
 * Responsável por transformar dados brutos do comic em dados prontos para renderização.
 * Gera localmente as propriedades visuais (cores, labels) que não vêm do banco.
 *
 * PARA O BACKEND:
 * - Não há impacto direto no backend
 * - Regra de negócio: progress >= 60 = "Em avanço", caso contrário = "Para continuar"
 * 
 * PARA O FRONTEND:
 * - Sempre use ComicCardFactory.create() antes de decorateComicCard()
 * - Sequência correta: ComicCardFactory.create() → decorateComicCard()
 * - Gera automaticamente: coverLabel, coverTone, accent, progressLabel, statusLabel
 * - Cores são determinísticas: mesmo title = mesmas cores
 */
export class ComicCardFactory {
  /**
   * Paleta de cores disponíveis para as tirinhas
   * Cada cor tem: { tone: cor de fundo, accent: cor de destaque }
   */
  private static readonly COLOR_PALETTE = [
    { tone: "#F9D8E6", accent: "#D88AA6" }, // Rosa
    { tone: "#D8EBFF", accent: "#7FA9D9" }, // Azul
    { tone: "#F4E6C3", accent: "#D4A24C" }, // Dourado
    { tone: "#E4E0F8", accent: "#8C80C8" }, // Roxo
    { tone: "#FFE6CC", accent: "#FF9500" }, // Laranja
    { tone: "#D8F5E8", accent: "#4CAF7F" }, // Verde
    { tone: "#FFE6E6", accent: "#E85959" }, // Vermelho
  ];

  /**
   * Seleciona uma cor da paleta com base no ID do comic
   */
  private static getColorByComicId(id: number) {
    const index = id % this.COLOR_PALETTE.length;
    return this.COLOR_PALETTE[index];
  }

  /**
   * Extrai as 3 primeiras letras do título para formar o coverLabel
   */
  private static getCoverLabel(title: string): string {
    return title
      .split(" ")
      .map((word) => word[0])
      .slice(0, 3)
      .join("")
      .toUpperCase();
  }

  /**
   * Cria um card comic com labels e cores calculados
   * 
   * @param comic - Comic bruto do banco (apenas id, ownerId, title, progress)
   * @returns Comic com cores e labels gerados localmente
   */
  static create(comic: StartedComic) {
    const colors = this.getColorByComicId(comic.id);
    const coverLabel = this.getCoverLabel(comic.title);

    return {
      ...comic,
      coverLabel,
      coverTone: colors.tone,
      accent: colors.accent,
      subtitle: `Tirinha #${comic.id}`, // Gerado localmente
      progressLabel: `${comic.progress}% concluído`,
      statusLabel: comic.progress >= 60 ? "Em avanço" : "Para continuar",
    };
  }
}

/**
 *  DESIGN PATTERN: Decorator
 * 
 * FUNÇÃO: decorateComicCard
 * 
 * Adiciona propriedades visuais calculadas ao comic.
 * Transforma a cor 'accent' em variações com transparência para o design.
 * 
 *   PARA O BACKEND:
 * - Certifique-se que 'accent' está sempre em formato hex válido (#RRGGBB)
 * - As cores são computadas aqui, não precisam vir do backend
 * 
 *  PARA O FRONTEND:
 * - SEMPRE use depois de ComicCardFactory.create()
 * - Ordem: Factory → Decorator
 * - Gera: shellTone (18% opacidade), ribbonTone (26% opacidade), borderTone (40% opacidade)
 * - Essas cores são usadas em:
 *   - shellTone: fundo brilhante do card
 *   - borderTone: borda do card
 *   - ribbonTone: (reservado para uso futuro)
 *
 *  BENEFÍCIOS:
 * - Separação de responsabilidades: Factory cria dados, Decorator estiliza
 * - Sem cálculos complexos no componente React
 * - Fácil testar cores geradas
 * 
 * @param comic - Comic já processado pelo Factory
 * @returns Comic com cores e estilos decorados
 */
export function decorateComicCard(
  comic: ReturnType<typeof ComicCardFactory.create>,
) {
  return {
    ...comic,
    shellTone: `${comic.accent}18`,
    ribbonTone: `${comic.accent}2A`,
    borderTone: `${comic.accent}66`,
  };
}

/**
 *  DESIGN PATTERN: Observer
 * 
 * CLASSE: ComicSelectionObserver
 * 
 * Gerencia notificações quando um comic é selecionado.
 * Permite que múltiplos componentes "ouçam" quando um comic é escolhido.
 * 
 *   PARA O BACKEND:
 * - Não há impacto no backend
 * - Este padrão é apenas frontend, para comunicação entre componentes
 * 
 *  PARA O FRONTEND:
 * - Crie UMA ÚNICA instância usando useRef() (não crie novas a cada render)
 * - Use subscribe() para adicionar listeners
 * - A função retornada por subscribe() remove o listener (cleanup)
 * - Use notify() para disparar notificação para todos os listeners
 * - Usado para mostrar "Comic X selecionada" na barra de seleção
 * 
 *  BENEFÍCIOS:
 * - Desacoplamento: o card não precisa saber sobre a barra de seleção
 * - Escalabilidade: adicione novos listeners sem mudar o card
 * - Reatividade: atualizações automáticas quando comic é selecionado
 * 
 *  EXEMPLOS DE USO:
 * 
 * // Criar observer (uma única vez)
 * const observer = useRef(new ComicSelectionObserver()).current;
 * 
 * // Escutar mudanças
 * useEffect(() => observer.subscribe(setSelectedComic), [observer]);
 * 
 * // Notificar
 * observer.notify(comic);
 */
export class ComicSelectionObserver {
  private listeners = new Set<(comic: StartedComic | null) => void>();

  subscribe(listener: (comic: StartedComic | null) => void) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  notify(comic: StartedComic | null) {
    this.listeners.forEach((listener) => listener(comic));
  }
}

/**
 *  DESIGN PATTERN: Command
 * 
 * CLASSE: OpenComicCommand
 * 
 * Encapsula a ação de abrir um comic em um objeto reutilizável.
 * Combina duas responsabilidades: notificar que foi selecionado e abrir.
 * 
 *   PARA O BACKEND:
 * - Não há impacto direto no backend
 * - Quando o user abre um comic, registre a ação (analytics/logs)
 * 
 *  PARA O FRONTEND:
 * - Crie uma instância única com useMemo()
 * - Passe o callback que abre o comic (ex: router.push)
 * - Passe a referência do observer para notificar seleção
 * - Use execute() quando o user clica em um card
 * 
 *  BENEFÍCIOS:
 * - Sequência garantida: sempre notifica ANTES de abrir
 * - Testável: mock da função openComic facilita testes
 * - Sem efeitos colaterais surpresa: tudo explícito
 * 
 *  FLUXO:
 * 1. User clica em card
 * 2. openComicCommand.execute(comic) é chamado
 * 3. Notifica via observer que comic foi selecionado
 * 4. Abre a página do comic com router.push()
 * 
 *   IMPORTANTE:
 * - SEMPRE chame observer.notify() ANTES de router.push()
 * - Assim o state de seleção atualiza antes da navegação
 */
export class OpenComicCommand {
  constructor(
    private readonly openComic: (comic: StartedComic) => void,
    private readonly observer: ComicSelectionObserver,
  ) {}

  execute(comic: StartedComic) {
    this.observer.notify(comic);
    this.openComic(comic);
  }
}