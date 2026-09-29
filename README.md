# portal-bausteuerung-app

Expo-App für Monteure und Dienstleister zur Verwaltung von Kundenterminen im Feld.

## Voraussetzungen

- Node.js 20+
- Expo CLI (`npm install -g expo`)
- Expo Go auf dem iPhone (aus dem App Store)

## Lokale Einrichtung

```bash
cd portal-bausteuerung-app
npm install
cp .env.example .env
# .env anpassen (KEYCLOAK_URL, BACKEND_URL, ...)
npm start
```

QR-Code mit der Expo-Go-App scannen.

## Konfiguration

Alle Endpunkte werden über `.env` gesteuert – keine hartcodierten Hosts oder Secrets.
Siehe `.env.example` für alle verfügbaren Variablen.

## Rollenprüfung

Die App erlaubt nur Nutzern den Zugang, die in Keycloak mindestens eine der Rollen
`monteur` oder `dienstleister` besitzen. Andere Nutzer sehen einen Hinweisscreen.

## Screens

| Screen | Route | Beschreibung |
|---|---|---|
| Terminliste | `/(tabs)` | Tages- / Wochenansicht der eigenen Termine |
| Termindetail | `/termin/[id]` | Kundendaten, Adresse, Navigation, Kamera |
| Statusmeldung | `/termin/[id]/status` | Termin als angenommen / unterwegs / erledigt melden |
| Login | `/login` | Keycloak-Login via OAuth2 PKCE |
| Kein Zugang | `/kein-zugang` | Hinweis bei fehlender Berechtigung |

## Mock-Daten

Solange kein Backend-Endpunkt `/api/bausteuerung/termine` existiert, liefert
`src/hooks/useTermine.ts` Mock-Daten. Der entsprechende Abschnitt ist klar markiert.

## Build (EAS)

```bash
eas build --platform ios --profile preview
```
