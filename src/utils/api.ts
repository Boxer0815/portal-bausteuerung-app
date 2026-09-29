import * as SecureStore from 'expo-secure-store';
import { BACKEND_URL } from './config';

const TOKEN_KEY = 'bau_access_token';
const REFRESH_KEY = 'bau_refresh_token';

export async function speichereTokens(access: string, refresh: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, access);
  await SecureStore.setItemAsync(REFRESH_KEY, refresh);
}

export async function ladeAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function ladeRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_KEY);
}

export async function loescheTokens() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}

/** Authentifizierter Fetch gegen das Backend. */
export async function apiFetch<T = unknown>(
  pfad: string,
  optionen: RequestInit = {},
): Promise<T> {
  const token = await ladeAccessToken();
  if (!token) throw new Error('Nicht authentifiziert');

  const antwort = await fetch(`${BACKEND_URL}${pfad}`, {
    ...optionen,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...optionen.headers,
    },
  });

  if (!antwort.ok) {
    let meldung = `HTTP ${antwort.status}`;
    try {
      const body = await antwort.json();
      if (body?.error) meldung = body.error;
    } catch {
      // ignorieren
    }
    throw new Error(meldung);
  }

  if (antwort.status === 204) return null as T;
  return antwort.json() as Promise<T>;
}
