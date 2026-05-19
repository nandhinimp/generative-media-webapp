type Generation = {
  id: number;
  prompt: string;
  imageUrl: string;
  createdAt: string;
  deletedAt?: string | null;
  userId?: string | null;
  userName?: string | null;
  userImage?: string | null;
};

type SavedEdit = {
  id: number;
  sourceGenerationId: number;
  prompt: string;
  imageUrl: string;
  createdAt: string;
  deletedAt?: string | null;
  userId?: string | null;
  userName?: string | null;
  userImage?: string | null;
};

let store: Generation[] = [];
let idCounter = 1;
let savedEditStore: SavedEdit[] = [];
let savedEditIdCounter = 1;

export function getGenerations(userId?: string | null): Generation[] {
  // return a copy sorted by createdAt desc
  return [...store]
    .filter((generation) => !generation.deletedAt && (!userId || generation.userId === userId))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function createGeneration(prompt: string, imageUrl: string, user?: { uid: string; name?: string | null; image?: string | null }) {
  const g: Generation = {
    id: idCounter++,
    prompt,
    imageUrl,
    createdAt: new Date().toISOString(),
    userId: user?.uid ?? null,
    userName: user?.name ?? null,
    userImage: user?.image ?? null,
  };
  store.unshift(g);
  return g;
}

export function deleteGeneration(id: number, userId?: string | null) {
  const target = store.find((generation) => generation.id === id && (!userId || generation.userId === userId));
  if (!target) return false;

  target.deletedAt = new Date().toISOString();
  return true;
}

export function updateGenerationImage(id: number, imageUrl: string) {
  const target = store.find((generation) => generation.id === id);
  if (!target) return null;

  target.imageUrl = imageUrl;
  return target;
}

export function clearStore() {
  store = [];
  idCounter = 1;
  savedEditStore = [];
  savedEditIdCounter = 1;
}

export function getSavedEdits(userId?: string | null): SavedEdit[] {
  return [...savedEditStore]
    .filter((savedEdit) => !savedEdit.deletedAt && (!userId || savedEdit.userId === userId))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function createSavedEdit(sourceGenerationId: number, prompt: string, imageUrl: string, user?: { uid: string; name?: string | null; image?: string | null }) {
  const savedEdit: SavedEdit = {
    id: savedEditIdCounter++,
    sourceGenerationId,
    prompt,
    imageUrl,
    createdAt: new Date().toISOString(),
    userId: user?.uid ?? null,
    userName: user?.name ?? null,
    userImage: user?.image ?? null,
  };

  savedEditStore.unshift(savedEdit);
  return savedEdit;
}

export function deleteSavedEdit(id: number, userId?: string | null) {
  const target = savedEditStore.find((savedEdit) => savedEdit.id === id && (!userId || savedEdit.userId === userId));
  if (!target) return false;

  target.deletedAt = new Date().toISOString();
  return true;
}
