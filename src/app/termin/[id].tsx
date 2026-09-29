/**
 * Termindetailansicht
 *
 * Zeigt: Kundendaten, Adresse, Auftragsart, aktuellen Status.
 * Feldfunktionen:
 *   - Navigation zur Adresse via Karten-App des Geräts (Apple Maps / Google Maps)
 *   - Foto anhängen via Gerätekamera
 */
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  useColorScheme,
  Platform,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useTermine } from '../../hooks/useTermine';
import { StatusBadge } from '../../components/StatusBadge';
import type { Termin } from '../../types';

export default function TermindetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { termine, laden } = useTermine();
  const [termin, setTermin] = useState<Termin | null>(null);
  const [fotos, setFotos] = useState<string[]>([]);
  const router = useRouter();
  const dunkel = useColorScheme() === 'dark';

  useEffect(() => {
    laden().then(() => {
      const gefunden = termine.find((t) => t.id === id);
      if (gefunden) {
        setTermin(gefunden);
        setFotos(gefunden.fotoUris ?? []);
      }
    });
  }, [id]);

  // Termin synchron aus Array holen (nach laden)
  useEffect(() => {
    const gefunden = termine.find((t) => t.id === id) ?? null;
    if (gefunden) {
      setTermin(gefunden);
      setFotos(gefunden.fotoUris ?? []);
    }
  }, [termine, id]);

  /** Öffnet die Karten-App des Geräts mit der Termin-Adresse. */
  const zurAdresseNavigieren = useCallback(() => {
    if (!termin) return;
    const { strasse, hausnummer, plz, ort } = termin.adresse;
    const adresseText = `${strasse} ${hausnummer}, ${plz} ${ort}`;
    const encodiert = encodeURIComponent(adresseText);

    const url =
      Platform.OS === 'ios'
        ? `maps:0,0?q=${encodiert}`
        : `geo:0,0?q=${encodiert}`;

    Linking.canOpenURL(url).then((kann) => {
      if (kann) {
        Linking.openURL(url);
      } else {
        // Fallback: Google Maps Web
        Linking.openURL(`https://maps.google.com/?q=${encodiert}`);
      }
    });
  }, [termin]);

  /** Öffnet die Kamera und hängt das Foto an den Termin. */
  const fotoHinzufuegen = useCallback(async () => {
    const berechtigung = await ImagePicker.requestCameraPermissionsAsync();
    if (!berechtigung.granted) {
      Alert.alert(
        'Kein Kamerazugriff',
        'Bitte erlauben Sie der App den Kamerazugriff in den Einstellungen.',
      );
      return;
    }

    const ergebnis = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: false,
    });

    if (!ergebnis.canceled && ergebnis.assets[0]) {
      const neueUri = ergebnis.assets[0].uri;
      setFotos((prev) => [...prev, neueUri]);
      // TODO: Foto an Backend senden (POST /api/bausteuerung/termine/:id/fotos)
    }
  }, []);

  if (!termin) {
    return (
      <View style={styles.leer}>
        <Text style={{ color: '#6B7280' }}>Termin wird geladen…</Text>
      </View>
    );
  }

  const hg = dunkel ? '#111827' : '#F9FAFB';
  const karteHg = dunkel ? '#1F2937' : '#FFF';
  const textFarbe = dunkel ? '#F9FAFB' : '#111827';
  const subtextFarbe = dunkel ? '#9CA3AF' : '#6B7280';
  const trennFarbe = dunkel ? '#374151' : '#E5E7EB';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: hg }}>
      <View style={[styles.karte, { backgroundColor: karteHg }]}>
        {/* Header */}
        <View style={styles.zeile}>
          <Text style={[styles.auftragsart, { color: textFarbe }]}>{termin.auftragsart}</Text>
          <StatusBadge status={termin.status} />
        </View>
        <Text style={[styles.uhrzeit, { color: '#1A56DB' }]}>
          {new Date(termin.datum).toLocaleDateString('de-DE', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}, {termin.uhrzeit} Uhr
        </Text>

        <View style={[styles.trennlinie, { backgroundColor: trennFarbe }]} />

        {/* Kundendaten */}
        <Abschnitt titel="Kunde" farbe={subtextFarbe}>
          <Text style={[styles.wert, { color: textFarbe }]}>{termin.kundeName}</Text>
        </Abschnitt>

        {/* Adresse + Navigations-Button */}
        <Abschnitt titel="Adresse" farbe={subtextFarbe}>
          <Text style={[styles.wert, { color: textFarbe }]}>
            {termin.adresse.strasse} {termin.adresse.hausnummer}{'\n'}
            {termin.adresse.plz} {termin.adresse.ort}
          </Text>
          <TouchableOpacity style={styles.navButton} onPress={zurAdresseNavigieren}>
            <Text style={styles.navButtonText}>In Karten-App öffnen</Text>
          </TouchableOpacity>
        </Abschnitt>

        <View style={[styles.trennlinie, { backgroundColor: trennFarbe }]} />

        {/* Statusrückmeldung */}
        <TouchableOpacity
          style={styles.statusButton}
          onPress={() => router.push(`/termin/${termin.id}/status`)}
        >
          <Text style={styles.statusButtonText}>Status melden</Text>
        </TouchableOpacity>
      </View>

      {/* Fotos */}
      <View style={[styles.karte, { backgroundColor: karteHg, marginTop: 12 }]}>
        <Text style={[styles.abschnittTitel, { color: subtextFarbe }]}>Fotos zum Termin</Text>

        <View style={styles.fotoReihe}>
          {fotos.map((uri, i) => (
            <Image key={i} source={{ uri }} style={styles.fotoVorschau} />
          ))}
          <TouchableOpacity style={styles.fotoHinzufuegenButton} onPress={fotoHinzufuegen}>
            <Text style={styles.fotoHinzufuegenText}>+ Foto</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

function Abschnitt({
  titel,
  farbe,
  children,
}: {
  titel: string;
  farbe: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.abschnitt}>
      <Text style={[styles.abschnittTitel, { color: farbe }]}>{titel}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  leer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  karte: {
    margin: 16,
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  zeile: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  auftragsart: { fontSize: 20, fontWeight: '700', flex: 1, marginRight: 8 },
  uhrzeit: { fontSize: 14, fontWeight: '500', marginTop: 4 },
  trennlinie: { height: 1, marginVertical: 16 },
  abschnitt: { marginBottom: 16 },
  abschnittTitel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  wert: { fontSize: 16, lineHeight: 22 },
  navButton: {
    marginTop: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  navButtonText: { color: '#1A56DB', fontWeight: '600', fontSize: 14 },
  statusButton: {
    backgroundColor: '#1A56DB',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statusButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  fotoReihe: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  fotoVorschau: { width: 80, height: 80, borderRadius: 8 },
  fotoHinzufuegenButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fotoHinzufuegenText: { color: '#6B7280', fontWeight: '600' },
});
