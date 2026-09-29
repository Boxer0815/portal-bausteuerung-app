/**
 * Auth-Context + Hook für Keycloak OAuth2 PKCE (expo-auth-session).
 *
 * Flow:
 *   1. App startet → gespeicherten Token prüfen
 *   2. Kein Token → Login-Screen
 *   3. Login-Button → AuthSession öffnet Keycloak im Browser
 *   4. Redirect → Token speichern → Rollen aus JWT lesen
 *   5. Keine erlaubte Rolle → kein-zugang-Screen
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import * as AuthSession from 'expo-auth-session';
import {
  KEYCLOAK_URL,
  KEYCLOAK_REALM,
  KEYCLOAK_CLIENT_ID,
  ERLAUBTE_ROLLEN,
} from '../utils/config';
import {
  speichereTokens,
  ladeAccessToken,
  loescheTokens,
} from '../utils/api';
import type { AuthState } from '../types';

const DISCOVERY_URL = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}`;

type Action =
  | { type: 'LADEN' }
  | { type: 'EINGELOGGT'; token: string; rollen: string[] }
  | { type: 'AUSGELOGGT' };

function reducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case 'LADEN':
      return { ...state, laedt: true };
    case 'EINGELOGGT':
      return {
        token: action.token,
        rollen: action.rollen,
        hatZugang: action.rollen.some((r) => ERLAUBTE_ROLLEN.includes(r)),
        laedt: false,
      };
    case 'AUSGELOGGT':
      return { token: null, rollen: [], hatZugang: false, laedt: false };
  }
}

function rollenAusToken(token: string): string[] {
  try {
    const payload = token.split('.')[1]!;
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const data = JSON.parse(decoded) as Record<string, unknown>;
    return (data.realm_access as { roles?: string[] } | undefined)?.roles ?? [];
  } catch {
    return [];
  }
}

interface AuthContextValue extends AuthState {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loginBereit: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    token: null,
    rollen: [],
    hatZugang: false,
    laedt: true,
  });

  const discovery = AuthSession.useAutoDiscovery(DISCOVERY_URL);
  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'bausteuerung' });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: KEYCLOAK_CLIENT_ID,
      redirectUri,
      scopes: ['openid', 'profile', 'email'],
      usePKCE: true,
    },
    discovery,
  );

  // Gespeicherten Token beim Start laden
  useEffect(() => {
    (async () => {
      const gespeicherterToken = await ladeAccessToken();
      if (gespeicherterToken) {
        dispatch({
          type: 'EINGELOGGT',
          token: gespeicherterToken,
          rollen: rollenAusToken(gespeicherterToken),
        });
      } else {
        dispatch({ type: 'AUSGELOGGT' });
      }
    })();
  }, []);

  // OAuth2-Antwort verarbeiten
  useEffect(() => {
    if (response?.type !== 'success') return;

    (async () => {
      dispatch({ type: 'LADEN' });
      try {
        const tokenResponse = await AuthSession.exchangeCodeAsync(
          {
            clientId: KEYCLOAK_CLIENT_ID,
            code: response.params['code'] ?? '',
            redirectUri,
            extraParams: request?.codeVerifier
              ? { code_verifier: request.codeVerifier }
              : undefined,
          },
          discovery!,
        );

        await speichereTokens(
          tokenResponse.accessToken,
          tokenResponse.refreshToken ?? '',
        );
        dispatch({
          type: 'EINGELOGGT',
          token: tokenResponse.accessToken,
          rollen: rollenAusToken(tokenResponse.accessToken),
        });
      } catch {
        dispatch({ type: 'AUSGELOGGT' });
      }
    })();
  }, [response]);

  const login = useCallback(async () => {
    await promptAsync();
  }, [promptAsync]);

  const logout = useCallback(async () => {
    await loescheTokens();
    dispatch({ type: 'AUSGELOGGT' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, loginBereit: !!request }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth muss innerhalb von AuthProvider verwendet werden');
  return ctx;
}
