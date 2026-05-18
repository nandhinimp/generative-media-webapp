import { Generation } from "../types/generation";

const KEY = 'favorites';

export function loadFavorites(): Record<number, boolean> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

export function saveFavorites(obj: Record<number, boolean>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(obj));
  } catch (e) {}
}

export function toggleFavoriteLocal(id: number): Record<number, boolean> {
  const favs = loadFavorites();
  const next = { ...favs, [id]: !favs[id] };
  saveFavorites(next);
  return next;
}
