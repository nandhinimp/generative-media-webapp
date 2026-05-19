const KEY_PREFIX = "favorites";

function getKey(userId?: string | null) {
  return userId ? `${KEY_PREFIX}:${userId}` : `${KEY_PREFIX}:guest`;
}

export function loadFavorites(userId?: string | null): Record<number, boolean> {
  try {
    const raw = localStorage.getItem(getKey(userId));
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveFavorites(obj: Record<number, boolean>, userId?: string | null) {
  try {
    localStorage.setItem(getKey(userId), JSON.stringify(obj));
  } catch {}
}

export function toggleFavoriteLocal(id: number, userId?: string | null): Record<number, boolean> {
  const favs = loadFavorites(userId);
  const next = { ...favs, [id]: !favs[id] };
  saveFavorites(next, userId);
  return next;
}
