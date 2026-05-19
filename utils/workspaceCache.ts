import { Generation, SavedEdit } from "@/types/generation";

const LAST_USER_ID_KEY = "workspace:last-user-id";

function generationsKey(userId: string) {
  return `workspace:${userId}:generations`;
}

function savedEditsKey(userId: string) {
  return `workspace:${userId}:saved-edits`;
}

export function rememberWorkspaceUserId(userId: string) {
  try {
    localStorage.setItem(LAST_USER_ID_KEY, userId);
  } catch {
    // Ignore storage failures.
  }
}

export function getRememberedWorkspaceUserId() {
  try {
    return localStorage.getItem(LAST_USER_ID_KEY);
  } catch {
    return null;
  }
}

export function loadCachedGenerations(userId: string): Generation[] {
  try {
    const raw = localStorage.getItem(generationsKey(userId));
    return raw ? (JSON.parse(raw) as Generation[]) : [];
  } catch {
    return [];
  }
}

export function saveCachedGenerations(userId: string, generations: Generation[]) {
  try {
    localStorage.setItem(generationsKey(userId), JSON.stringify(generations));
  } catch {
    // Ignore storage failures.
  }
}

export function loadCachedSavedEdits(userId: string): SavedEdit[] {
  try {
    const raw = localStorage.getItem(savedEditsKey(userId));
    return raw ? (JSON.parse(raw) as SavedEdit[]) : [];
  } catch {
    return [];
  }
}

export function saveCachedSavedEdits(userId: string, savedEdits: SavedEdit[]) {
  try {
    localStorage.setItem(savedEditsKey(userId), JSON.stringify(savedEdits));
  } catch {
    // Ignore storage failures.
  }
}