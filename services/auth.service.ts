import { auth } from "@/lib/firebase";

export async function getFirebaseIdToken(forceRefresh = false): Promise<string | null> {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  return currentUser.getIdToken(forceRefresh);
}

export async function buildAuthHeaders(forceRefresh = false): Promise<HeadersInit> {
  const token = await getFirebaseIdToken(forceRefresh);

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

export async function fetchJsonWithAuth(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const authHeaders = await buildAuthHeaders();

  Object.entries(authHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(input, {
    ...init,
    headers,
  });
}