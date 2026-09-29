/**
 * Statusrückmeldung — Monteur meldet neuen Terminstatus.
 *
 * Mögliche Status: angenommen | unterwegs | erledigt | nicht_erfolgreich
 * Nach dem Speichern wird der Status ans Backend geschrieben (aktuell Mock)
 * und der Screen geschlossen.
 */
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTermine } from '../../../hooks/useTermine';
import type { TerminStatus } from '../../../types';

const STATUS_OPTIONEN: { wert: TerminStatus; label: string; emoji: string; beschreibung: string }[] = [
  { wert: 'angenommen',        label: 'Angenommen',        emoji: '✅', beschreibung: 'Termin bestätigt, ich kümmere mich darum.' },
  { wert: 'unterwegs',         label: 'Unterwegs',         emoji: '🚗', beschreibung: 'Ich bin auf dem Weg zum Kunden.' },
  { wert: 'erledigt',          label: 'Erledigt',          emoji: '🏁', beschreibung: 'Auftrag erfolgreich abgeschlossen.' },
  { wert: 'nicht_erfolgreich', label: 'Nicht erfolgreich', emoji: '❌', beschreibung: 'Auftrag konnte nicht abgeschlossen werden.' },
];

export default function StatusrueckmeldungScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { statusAktualisieren } = useTermine();
  const router = useRouter();
  const dunkel = useColorScheme() === 'dark';

  const [ausgewaehlterStatus, setAusgewaehlterStatus] = useState<TerminStatus | null>(null);
  const [speichert, setSpeichert] = useState(false);

  const speichern = useCallback(async () => {
    if (!ausgewaehlterStatus) return;
    setSpeichert(true);
    try {
      await statusAktualisieren(id!, ausgewaehlterStatus);
      router.back();
    } catch (e) {
      Alert.alert('Fehler', e instanceof Error ? e.message : 'Status konnte nicht gespeichert werden.');
    } finally {
      setSpeichert(false);
    }
  }, [ausgewaehlterStatus, id, statusAktualisieren, router]);

  const hg = dunkel ? '#111827' : '#F9FAFB';
  const karteHg = dunkel ? '#1F2937' : '#FFF';
  const textFarbe = dunkel ? '#F9FAFB' : '#111827';
  const subtextFarbe = dunkel ? '#9CA3AF' : '#6B7280';

  return (
    <View style={[styles.container, { backgroundColor: hg }]}>
      <Text style={[styles.titel, { color: textFarbe }]}>Wie ist der Stand?</Text>
      <Text style={[styles.untertitel, { color: subtextFarbe }]}>
        Wähle den aktuellen Status für diesen Termin.
      </Text>

      <View style={styles.optionenListe}>
        {STATUS_OPTIONEN.map((option) => {
          const aktiv = ausgewaehlterStatus === option.wert;
          return (
            <TouchableOpacity
              key={option.wert}
              style={[
                styles.option,
                { backgroundColor: karteHg },
                aktiv && styles.optionAktiv,
              ]}
              onPress={() => setAusgewaehlterStatus(option.wert)}
            >
              <Text style={styles.optionEmoji}>{option.emoji}</Text>
              <View style={styles.optionText}>
                <Text style={[styles.optionLabel, { color: textFarbe }, aktiv && styles.optionLabelAktiv]}>
                  {option.label}
                </Text>
                <Text style={[styles.optionBeschreibung, { color: subtextFarbe }]}>
                  {option.beschreibung}
                </Text>
              </View>
              {aktiv && <Text style={styles.haken}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.speichernButton, !ausgewaehlterStatus && styles.speichernButtonDeaktiviert]}
        onPress={speichern}
        disabled={!ausgewaehlterStatus || speichert}
      >
        {speichert ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.speichernButtonText}>Status speichern</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titel: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
  untertitel: { fontSize: 14, marginBottom: 24 },
  optionenListe: { gap: 12 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
    gap: 12,
  },
  optionAktiv: { borderColor: '#1A56DB' },
  optionEmoji: { fontSize: 28 },
  optionText: { flex: 1 },
  optionLabel: { fontSize: 16, fontWeight: '600' },
  optionLabelAktiv: { color: '#1A56DB' },
  optionBeschreibung: { fontSize: 13, marginTop: 2 },
  haken: { fontSize: 20, color: '#1A56DB', fontWeight: '700' },
  speichernButton: {
    marginTop: 32,
    backgroundColor: '#1A56DB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  speichernButtonDeaktiviert: { opacity: 0.4 },
  speichernButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
