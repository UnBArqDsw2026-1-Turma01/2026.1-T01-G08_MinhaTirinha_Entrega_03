export type StartedComic = {
  id: number;
  ownerId: string;
  title: string;
  coverLabel: string;
  coverTone: string;
  accent: string;
  subtitle: string;
  progress: number;
};

const STARTED_COMICS: StartedComic[] = [
  {
    id: 15,
    ownerId: "user-001",
    title: "A Quarta Página do Porcelanato",
    coverLabel: "AQP",
    coverTone: "#F9D8E6",
    accent: "#D88AA6",
    subtitle: "Mistério leve, humor e um pouco de caos doméstico.",
    progress: 68,
  },
  {
    id: 21,
    ownerId: "user-001",
    title: "Café, Gatos e Planos Sem Sentido",
    coverLabel: "CGP",
    coverTone: "#D8EBFF",
    accent: "#7FA9D9",
    subtitle: "Uma coleção de cenas curtas com clima acolhedor.",
    progress: 31,
  },
  {
    id: 42,
    ownerId: "user-002",
    title: "O Dia em que o Lápis Sumiu",
    coverLabel: "DLS",
    coverTone: "#F4E6C3",
    accent: "#D4A24C",
    subtitle: "Apenas um usuário diferente, para validar a privacidade.",
    progress: 90,
  },
  {
    id: 64,
    ownerId: "user-001",
    title: "Noite de Neon no Bairro Azul",
    coverLabel: "NNB",
    coverTone: "#E4E0F8",
    accent: "#8C80C8",
    subtitle: "Um arco mais visual, com balões e cenários em disputa.",
    progress: 12,
  },
];

export function getStartedComicsByUser(userId: string | string[] | undefined) {
  const resolvedUserId = Array.isArray(userId) ? userId[0] : userId;

  if (!resolvedUserId) {
    return [];
  }

  return STARTED_COMICS.filter((comic) => comic.ownerId === resolvedUserId);
}

export function getComicById(comicId: string | string[] | undefined) {
  const resolvedComicId = Array.isArray(comicId) ? comicId[0] : comicId;

  if (!resolvedComicId) {
    return undefined;
  }

  return STARTED_COMICS.find((comic) => String(comic.id) === resolvedComicId);
}

export class ComicCardFactory {
  static create(comic: StartedComic) {
    return {
      ...comic,
      progressLabel: `${comic.progress}% concluído`,
      statusLabel: comic.progress >= 60 ? "Em avanço" : "Para continuar",
    };
  }
}

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