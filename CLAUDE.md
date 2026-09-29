# portal-bausteuerung-app

Expo-App für Monteure und Dienstleister (Termine, Statusmeldungen, Fotos).

## Deployment

Nach jeder neuen Version immer ein EAS Update auf den Expo-Kanal pushen:

```bash
NODE_OPTIONS="--max-old-space-size=4096" eas update --channel production --message "Beschreibung der Änderungen"
```

Hinweis: `NODE_OPTIONS="--max-old-space-size=4096"` ist erforderlich, sonst crasht Metro mit Segfault.

Für den Preview-Kanal (interne Tests):

```bash
eas update --channel preview --message "Beschreibung der Änderungen"
```

Nur wenn sich native Abhängigkeiten ändern, ist ein neuer nativer Build notwendig:

```bash
eas build --platform ios --profile production
```
