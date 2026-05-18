type Generation = {
  id: number;
  prompt: string;
  imageUrl: string;
  createdAt: string;
  deletedAt?: string | null;
};

type SavedEdit = {
  id: number;
  sourceGenerationId: number;
  prompt: string;
  imageUrl: string;
  createdAt: string;
  deletedAt?: string | null;
};

let store: Generation[] = [];
let idCounter = 1;
let savedEditStore: SavedEdit[] = [];
let savedEditIdCounter = 1;

export function getGenerations(): Generation[] {
  // return a copy sorted by createdAt desc
  return [...store]
    .filter((generation) => !generation.deletedAt)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function createGeneration(prompt: string, imageUrl: string) {
  const g: Generation = {
    id: idCounter++,
    prompt,
    imageUrl,
    createdAt: new Date().toISOString(),
  };
  store.unshift(g);
  return g;
}

export function deleteGeneration(id: number) {
  const target = store.find((generation) => generation.id === id);
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

export function getSavedEdits(): SavedEdit[] {
  return [...savedEditStore]
    .filter((savedEdit) => !savedEdit.deletedAt)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function createSavedEdit(sourceGenerationId: number, prompt: string, imageUrl: string) {
  const savedEdit: SavedEdit = {
    id: savedEditIdCounter++,
    sourceGenerationId,
    prompt,
    imageUrl,
    createdAt: new Date().toISOString(),
  };

  savedEditStore.unshift(savedEdit);
  return savedEdit;
}

export function deleteSavedEdit(id: number) {
  const target = savedEditStore.find((savedEdit) => savedEdit.id === id);
  if (!target) return false;

  target.deletedAt = new Date().toISOString();
  return true;
}
