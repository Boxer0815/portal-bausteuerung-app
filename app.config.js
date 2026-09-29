// app.config.js — dynamische Konfiguration, liest .env via process.env
// Für lokale Entwicklung: Kopiere .env.example → .env und passe die Werte an.
// Secrets dürfen NICHT in die Versionsverwaltung.

module.exports = {
  expo: {
    name: "Bausteuerung",
    slug: "portal-bausteuerung-app",
    scheme: "bausteuerung",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.portal.bausteuerung",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        // Kamera- und Fotomediathek-Zugriff
        NSCameraUsageDescription:
          "Die App benötigt Kamerazugriff, um Fotos zum Termin anzuhängen.",
        NSPhotoLibraryUsageDescription:
          "Die App benötigt Zugriff auf die Fotomediathek, um Fotos zum Termin anzuhängen.",
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#1A56DB",
        foregroundImage: "./assets/android-icon-foreground.png",
      },
      permissions: ["android.permission.CAMERA"],
    },
    web: {
      bundler: "metro",
    },
    platforms: ["ios", "android"],
    plugins: [
      "expo-router",
      "expo-splash-screen",
      [
        "expo-image-picker",
        {
          photosPermission:
            "Die App benötigt Zugriff auf die Fotomediathek für Terminfotos.",
          cameraPermission:
            "Die App benötigt Kamerazugriff für Terminfotos.",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      // Keycloak-Konfiguration — niemals Secrets hier eintragen!
      keycloakUrl: process.env.KEYCLOAK_URL ?? "http://localhost:8080",
      keycloakRealm: process.env.KEYCLOAK_REALM ?? "portal",
      keycloakClientId: process.env.KEYCLOAK_CLIENT_ID ?? "bausteuerung-app",
      backendUrl: process.env.BACKEND_URL ?? "http://localhost:3001",
      // Erlaubte Rollen für diese App (kommasepariert oder einzeln)
      erlaubteRollen: (process.env.ERLAUBTE_ROLLEN ?? "monteur,dienstleister").split(","),
      eas: {
        projectId: "aa373fb8-eaa2-4b30-b82c-f11a196c13b2",
      },
    },
    owner: "maxboxer",
    updates: {
      url: "https://u.expo.dev/aa373fb8-eaa2-4b30-b82c-f11a196c13b2",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
  },
};
