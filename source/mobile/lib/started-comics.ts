export type StartedComic = {
  id: string;
  ownerId: string;
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

export type ComicCard = StartedComic & {
  coverLabel: string;
  progressPercent: number;
  progressLabel: string;
  statusLabel: string;
  coverTone: string;
  accent: string;
};

// Standardized interfaces for gallery API consumers
export interface Category {
  id: number;
  name: string;
}

export interface Comic {
  id: string;
  title: string;
  image_url: string;
}

/**
 * Convert a local StartedComic to the standardized `Comic` interface
 * (useful to keep API/PR contracts stable while preserving internal model).
 */
export function toGalleryComic(c: StartedComic): Comic {
  return {
    id: c.id,
    title: c.title,
    image_url: c.imageUrl ?? "",
  };
}

/**
 * Return simplified gallery comics for a given user.
 * Backwards-compatible: delegates to `getStartedComicsByUser` and maps.
 */
export function getGalleryComicsByUser(userId: string | string[] | undefined): Comic[] {
  return getStartedComicsByUser(userId).map(toGalleryComic);
}

// ----- Backwards compatibility helpers -----
// Some PRs or external modules may expect a different `Comic` shape
// (for example: `type Comic = { id: string; title: string; theme: string; image: string }`).
// To avoid naming/type conflicts in PRs, we expose an explicit legacy type
// and mapping functions so consumers can opt-in to the old shape.

export type ComicLegacy = {
  id: string;
  title: string;
  // `theme` maps from the internal `category` field
  theme: string;
  // `image` maps from the internal `imageUrl` (string or empty)
  image: string;
};

export function toLegacyComic(c: StartedComic): ComicLegacy {
  return {
    id: c.id,
    title: c.title,
    theme: c.category ?? "",
    image: c.imageUrl ?? "",
  };
}

export function getGalleryComicsByUserLegacy(userId: string | string[] | undefined): ComicLegacy[] {
  return getStartedComicsByUser(userId).map(toLegacyComic);
}

const STARTED_COMICS: StartedComic[] = [
  {
    id: "15",
    ownerId: "demo-user",
    title: "A Quarta Página do Porcelanato",
    category: "Slice of life",
    imageUrl: "https://picsum.photos/seed/comic-15/1200/800",
    panelsPainted: { panel1: true, panel2: true, panel3: false, panel4: false },
  },
  {
    id: "21",
    ownerId: "demo-user",
    title: "Café, Gatos e Planos Sem Sentido",
    category: "Cotidiano",
    imageUrl: "https://picsum.photos/seed/comic-21/1200/800",
    panelsPainted: { panel1: true, panel2: false, panel3: false, panel4: false },
  },
  {
    id: "42",
    ownerId: "demo-user",
    title: "O Dia em que o Lápis Sumiu",
    category: "Misterio",
    imageUrl: null,
    panelsPainted: { panel1: true, panel2: true, panel3: true, panel4: false },
  },
  {
    id: "64",
    ownerId: "demo-user",
    title: "Noite de Neon no Bairro Azul",
    category: "Urbano",
    imageUrl: "https://picsum.photos/seed/comic-64/1200/800",
    panelsPainted: { panel1: false, panel2: false, panel3: false, panel4: false },
  },
  {
    id: "89",
    ownerId: "demo-user",
    title: "Diários de um Gato Filósofo",
    category: "Reflexao",
    imageUrl: "https://picsum.photos/seed/comic-89/1200/800",
    panelsPainted: { panel1: true, panel2: true, panel3: false, panel4: false },
  },
];

const COLOR_PALETTE = [
  { coverTone: "#FFF0B8", accent: "#E2B400" },
  { coverTone: "#E8F1FF", accent: "#4D80D8" },
  { coverTone: "#FFE5D3", accent: "#DE7B38" },
  { coverTone: "#EDE3FF", accent: "#8D65D6" },
  { coverTone: "#DFF6E8", accent: "#3FA56D" },
  { coverTone: "#FFE0E8", accent: "#D95D82" },
  { coverTone: "#E5F6F6", accent: "#2E9B9B" },
];

function getPanelsCompleted(panelsPainted: StartedComic["panelsPainted"]) {
  return Number(panelsPainted.panel1) + Number(panelsPainted.panel2) + Number(panelsPainted.panel3) + Number(panelsPainted.panel4);
}

function getColorByComicId(id: string) {
  const index = Number(id) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
}

function getCoverLabel(title: string) {
  return title
    .split(" ")
    .map((word) => word[0])
    .slice(0, 3)
    .join("")
    .toUpperCase();
}

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

  return STARTED_COMICS.find((comic) => comic.id === resolvedComicId);
}

export class ComicCardFactory {
  static create(comic: StartedComic): ComicCard {
    const colors = getColorByComicId(comic.id);
    const completedPanels = getPanelsCompleted(comic.panelsPainted);
    const progressPercent = completedPanels * 25;

    return {
      ...comic,
      coverLabel: getCoverLabel(comic.title),
      progressPercent,
      progressLabel: `${completedPanels}/4 quadrinhos pintados`,
      statusLabel: progressPercent === 100 ? "Concluída" : progressPercent > 0 ? "Em andamento" : "Para continuar",
      coverTone: colors.coverTone,
      accent: colors.accent,
    };
  }
}

export function decorateComicCard(comic: ComicCard) {
  return {
    ...comic,
    shellTone: `${comic.accent}18`,
    borderTone: `${comic.accent}66`,
  };
}