/**
 * Terminliste — zeigt Termine für heute und diese Woche.
 * Umschalten per Tab "Heute" / "Diese Woche".
 */
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTermine } from '../../hooks/useTermine';
import { StatusBadge } from '../../components/StatusBadge';
import { LeerZustand } from '../../components/LeerZustand';
import type { Termin } from '../../types';

function tagLabel(datum: string): string {
  const d = new Date(datum);
  return d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
}

function heute(): string {
  return new Date().toISOString().split('T')[0]!;
}

function dieseWocheStart(): string {
  const d = new Date();
  const tag = d.getDay() || 7; // Montag = 1
  d.setDate(d.getDate() - tag + 1);
  return d.toISOString().split('T')[0]!;
}

function dieseWocheEnde(): string {
  const d = new Date();
  const tag = d.getDay() || 7;
  d.setDate(d.getDate() + (7 - tag));
  return d.toISOString().split('T')[0]!;
}

export default function TerminlisteScreen() {
  const dunkel = useColorScheme() === 'dark';
  const { termine, laedt, fehler, laden } = useTermine();
  const [ansicht, setAnsicht] = useState<'heute' | 'woche'>('heute');
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      laden();
    }, [laden]),
  );

  const gefilterteTermine: Termin[] = termine.filter((t) => {
    if (ansicht === 'heute') return t.datum === heute();
    return t.datum >= dieseWocheStart() && t.datum <= dieseWocheEnde();
  });

  const hg = dunkel ? '#111827' : '#F9FAFB';
  const karteHg = dunkel ? '#1F2937' : '#FFF';
  const textFarbe = dunkel ? '#F9FAFB' : '#111827';
  const subtextFarbe = dunkel ? '#9CA3AF' : '#6B7280';

  return (
    <View style={[styles.container, { backgroundColor: hg }]}>
      {/* Ansicht-Umschalter */}
      <View style={styles.tabs}>
        {(['heute', 'woche'] as const).map((a) => (
          <TouchableOpacity
            key={a}
            style={[styles.tab, ansicht === a && styles.tabAktiv]}
            onPress={() => setAnsicht(a)}
          >
            <Text style={[styles.tabText, ansicht === a && styles.tabTextAktiv]}>
              {a === 'heute' ? 'Heute' : 'Diese Woche'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {fehler && (
        <Text style={styles.fehler}>{fehler}</Text>
      )}

      <FlatList
        data={gefilterteTermine}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={laedt} onRefresh={laden} />}
        contentContainerStyle={gefilterteTermine.length === 0 ? { flex: 1 } : { padding: 16, gap: 12 }}
        ListEmptyComponent={
          <LeerZustand
            emoji="📭"
            titel="Keine Termine"
            beschreibung={
              ansicht === 'heute'
                ? 'Für heute sind keine Termine eingetragen.'
                : 'Für diese Woche sind keine Termine eingetragen.'
            }
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.karte, { backgroundColor: karteHg }]}
            onPress={() => router.push(`/termin/${item.id}`)}
            activeOpacity={0.7}
          >
            <View style={styles.karteZeile}>
              <Text style={[styles.uhrzeit, { color: '#1A56DB' }]}>
                {ansicht === 'woche' ? `${tagLabel(item.datum)}, ` : ''}{item.uhrzeit} Uhr
              </Text>
              <StatusBadge status={item.status} />
            </View>
            <Text style={[styles.auftragsart, { color: textFarbe }]}>{item.auftragsart}</Text>
            <Text style={[styles.kunde, { color: subtextFarbe }]}>{item.kundeName}</Text>
            <Text style={[styles.adresse, { color: subtextFarbe }]}>
              {item.adresse.strasse} {item.adresse.hausnummer}, {item.adresse.plz} {item.adresse.ort}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabs: {
    flexDirection: 'row',
    margin: 16,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    padding: 3,
    gap: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  tabAktiv: { backgroundColor: '#FFF' },
  tabText: { fontSize: 14, fontWeight: '500', color: '#6B7280' },
  tabTextAktiv: { color: '#1A56DB', fontWeight: '700' },
  karte: {
    borderRadius: 12,
    padding: 16,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 2,
  },
  karteZeile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  uhrzeit: { fontSize: 13, fontWeight: '600' },
  auftragsart: { fontSize: 16, fontWeight: '700' },
  kunde: { fontSize: 14 },
  adresse: { fontSize: 13 },
  fehler: { color: '#EF4444', padding: 16, textAlign: 'center' },
});
