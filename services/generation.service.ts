import { Generation, GenerationOptions, SavedEdit } from "../types/generation";
import { fetchJsonWithAuth } from "./auth.service";

export async function fetchGenerations(): Promise<Generation[]> {
  const res = await fetchJsonWithAuth('/api/generations');
  if (!res.ok) throw new Error(`Failed to fetch generations: ${res.status}`);
  return res.json();
}

export async function generateImage(prompt: string, options: GenerationOptions): Promise<Generation | { imageUrl?: string; error?: string }> {
  // Attach authenticated user info (if available) to the request body
  // `fetchJsonWithAuth` will add the Authorization header using Firebase id token
  let currentUser: any = null;
  try {
    // dynamic import to avoid SSR reference errors
    const fb = await import('@/lib/firebase');
    currentUser = fb.auth?.currentUser ?? null;
  } catch (e) {
    // ignore
  }

  const body: any = { prompt, options };
  if (currentUser) {
    body.userId = currentUser.uid;
    body.userName = currentUser.displayName ?? null;
    body.userImage = currentUser.photoURL ?? null;
  }

  const res = await fetchJsonWithAuth('/api/generate', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (res.status === 401) throw new Error('AUTH_REQUIRED');
  if (!res.ok) throw new Error(data?.error || 'Generation failed');
  return data;
}

export async function deleteGeneration(id: number): Promise<boolean> {
  const res = await fetchJsonWithAuth(`/api/generations/${id}`, { method: 'DELETE' });
  return res.ok;
}

export async function fetchSavedEdits(): Promise<SavedEdit[]> {
  const res = await fetchJsonWithAuth('/api/saved-edited-images');
  if (!res.ok) throw new Error(`Failed to fetch saved edits: ${res.status}`);
  return res.json();
}

export async function saveEditedImage(sourceGenerationId: number, prompt: string, imageUrl: string): Promise<SavedEdit> {
  const res = await fetchJsonWithAuth('/api/saved-edited-images', {
    method: 'POST',
    body: JSON.stringify({ sourceGenerationId, prompt, imageUrl }),
  });

  const data = await res.json();
  if (res.status === 401) throw new Error('AUTH_REQUIRED');
  if (!res.ok) throw new Error(data?.error || 'Failed to save edited image');
  return data;
}

export async function deleteSavedEdit(id: number): Promise<boolean> {
  const res = await fetchJsonWithAuth(`/api/saved-edited-images/${id}`, { method: 'DELETE' });
  return res.ok;
}

export async function claimLegacyWorkspace(): Promise<void> {
  const res = await fetchJsonWithAuth('/api/workspace/claim-legacy', {
    method: 'POST',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || `Failed to claim legacy workspace: ${res.status}`);
  }
}
