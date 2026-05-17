type Generation = {
  id: number;
  prompt: string;
  imageUrl: string;
  createdAt: string;
};

let store: Generation[] = [];
let idCounter = 1;

export function getGenerations(): Generation[] {
  // return a copy sorted by createdAt desc
  return [...store].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
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

export function clearStore() {
  store = [];
  idCounter = 1;
}
