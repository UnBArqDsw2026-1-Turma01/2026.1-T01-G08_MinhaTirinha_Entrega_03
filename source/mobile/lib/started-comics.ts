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
 * - title: Nome da tirinha (Comic.name)
 * - category: Categoria (usada como gênero no front)
 * - imageUrl: URL da imagem principal (vem de image_url TEXT no banco)
 * - panelsPainted: estado de pintura dos 4 quadrinhos
 */
export type StartedComic = {
  id: number;
  title: string;
  category: string;
  imageUrl: string | null;
  panelsPainted: {
    panel1: boolean;
    panel2: boolean;
    panel3: boolean;
    panel4: boolean;
  };
};

/**
 *  DADOS MOCKADOS - Substitua por chamada à API futuramente
 * 
 * Este array simula as tirinhas iniciadas que viriam do backend.
 * Cada objeto mantém a estrutura definida em StartedComic.
 * 
 *   PARA O BACKEND:
 * - Implemente um endpoint GET /comics/started?user_id={userId}
 * - Retorne os dados do comic com category e estado dos paineis
 * - Retorne image_url como TEXT (URL), mapeado para imageUrl no frontend
 * - Certifique-se que todas as cores estejam em formato hex válido
 * - O progresso e calculado no frontend a partir dos 4 booleanos
 */
const STARTED_COMICS: StartedComic[] = [
  {
    id: 15,
    title: "A Quarta Página do Porcelanato",
    category: "Slice of life",
    imageUrl: "https://picsum.photos/seed/comic-15/1200/800",
    panelsPainted: {
      panel1: true,
      panel2: true,
      panel3: false,
      panel4: false,
    },
  },
  {
    id: 21,
    title: "Café, Gatos e Planos Sem Sentido",
    category: "Cotidiano",
    imageUrl: "https://picsum.photos/seed/comic-21/1200/800",
    panelsPainted: {
      panel1: true,
      panel2: false,
      panel3: false,
      panel4: false,
    },
  },
  {
    id: 42,
    title: "O Dia em que o Lápis Sumiu",
    category: "Misterio",
    imageUrl: null,
    panelsPainted: {
      panel1: true,
      panel2: true,
      panel3: true,
      panel4: false,
    },
  },
  {
    id: 64,
    title: "Noite de Neon no Bairro Azul",
    category: "Urbano",
    imageUrl: "https://picsum.photos/seed/comic-64/1200/800",
    panelsPainted: {
      panel1: false,
      panel2: false,
      panel3: false,
      panel4: false,
    },
  },
  {
    id: 89,
    title: "Diários de um Gato Filósofo",
    category: "Reflexao",
    imageUrl: "https://picsum.photos/seed/comic-89/1200/800",
    panelsPainted: {
      panel1: true,
      panel2: true,
      panel3: false,
      panel4: false,
    },
  },
];

function getPaintedPanelsCount(panels: StartedComic["panelsPainted"]) {
  return Number(panels.panel1) + Number(panels.panel2) + Number(panels.panel3) + Number(panels.panel4);
}

function getProgressPercentByPanels(panels: StartedComic["panelsPainted"]) {
  return getPaintedPanelsCount(panels) * 25;
}

/**
 *  FUNÇÃO: getStartedComicsByUser
 *
 * Recupera todas as tirinhas iniciadas do usuário específico.
 * 
 *   PARA O BACKEND:
 * - Retorne category e flags dos paineis pintados
 * - Retorne image_url (TEXT com URL da imagem)
 * - Retorne array vazio se o usuário não tiver tirinhas
 * - Sempre validar autenticação do usuário no endpoint
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
  void userId;
  return STARTED_COMICS;
}

/**
 *  FUNÇÃO: getComicById
 * 
 * Busca uma tirinha específica pelo ID.
 * 
 *   PARA O BACKEND:
 * - Implemente endpoint GET /comics/{comicId}
 * - Retorne 404 se comic não existir
 * - Valide permissão conforme regras de autenticação da API
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

  const comic = STARTED_COMICS.find((item) => String(item.id) === resolvedComicId);

  return comic ? decorateComicCard(ComicCardFactory.create(comic)) : undefined;
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
 * - O frontend calcula progresso por quantidade de paineis pintados
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
    * @param comic - Comic bruto do banco (id, title, category, imageUrl e paineis)
   * @returns Comic com cores e labels gerados localmente
   */
  static create(comic: StartedComic) {
    const colors = this.getColorByComicId(comic.id);
    const coverLabel = this.getCoverLabel(comic.title);
    const paintedPanels = getPaintedPanelsCount(comic.panelsPainted);
    const progress = getProgressPercentByPanels(comic.panelsPainted);

    let statusLabel = "Para continuar";
    if (progress === 100) {
      statusLabel = "Concluida";
    } else if (progress > 0) {
      statusLabel = "Em andamento";
    }

    return {
      ...comic,
      coverLabel,
      coverTone: colors.tone,
      accent: colors.accent,
      subtitle: comic.category,
      paintedPanels,
      progress,
      progressLabel: `${paintedPanels}/4 quadrinhos pintados`,
      statusLabel,
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
 * - Pode ser usado para analytics/telemetria de seleção sem acoplar no card
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