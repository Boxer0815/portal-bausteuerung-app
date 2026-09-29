import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

export const KEYCLOAK_URL: string = extra.keycloakUrl ?? 'http://localhost:8080';
export const KEYCLOAK_REALM: string = extra.keycloakRealm ?? 'portal';
export const KEYCLOAK_CLIENT_ID: string = extra.keycloakClientId ?? 'bausteuerung-app';
export const BACKEND_URL: string = extra.backendUrl ?? 'http://localhost:3001';
export const ERLAUBTE_ROLLEN: string[] = Array.isArray(extra.erlaubteRollen)
  ? extra.erlaubteRollen
  : ['monteur', 'dienstleister'];
