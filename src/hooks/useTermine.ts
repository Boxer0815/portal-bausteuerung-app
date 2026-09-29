/**
 * useTermine — lädt Termine vom Backend.
 *
 * MOCK-HINWEIS: Solange kein Backend-Endpunkt /api/bausteuerung/termine
 * existiert, werden die unten definierten Mock-Daten zurückgegeben.
 * Sobald der Endpunkt verfügbar ist, den Mock-Block entfernen und
 * stattdessen `apiFetch` nutzen.
 */
import { useState, useCallback } from 'react';
import { apiFetch } from '../utils/api';
import type { Termin, TerminStatus } from '../types';

// ─── MOCK-DATEN (Endpunkt noch nicht implementiert) ───────────────────────────
const MOCK_TERMINE: Termin[] = [
  {
    id: 'T001',
    datum: new Date().toISOString().split('T')[0]!,
    uhrzeit: '09:00',
    auftragsart: 'Neuanschaltung',
    kundeName: 'Müller GmbH',
    adresse: { strasse: 'Hauptstraße', hausnummer: '12', plz: '20095', ort: 'Hamburg' },
    status: 'offen',
  },
  {
    id: 'T002',
    datum: new Date().toISOString().split('T')[0]!,
    uhrzeit: '13:30',
    auftragsart: 'Entstörung',
    kundeName: 'Schmidt & Partner',
    adresse: { strasse: 'Berliner Allee', hausnummer: '5a', plz: '20099', ort: 'Hamburg' },
    status: 'angenommen',
  },
  {
    id: 'T003',
    datum: new Date(Date.now() + 86400000).toISOString().split('T')[0]!,
    uhrzeit: '10:00',
    auftragsart: 'Umzug',
    kundeName: 'Bäcker Bernstein',
    adresse: { strasse: 'Mönckebergstraße', hausnummer: '1', plz: '20095', ort: 'Hamburg' },
    status: 'offen',
  },
];
// ─────────────────────────────────────────────────────────────────────────────

export function useTermine() {
  const [termine, setTermine] = useState<Termin[]>([]);
  const [laedt, setLaedt] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  const laden = useCallback(async () => {
    setLaedt(true);
    setFehler(null);
    try {
      // TODO: Mock entfernen, sobald /api/bausteuerung/termine implementiert ist
      // const daten = await apiFetch<Termin[]>('/api/bausteuerung/termine');
      const daten = MOCK_TERMINE; // MOCK
      setTermine(daten);
    } catch (e) {
      setFehler(e instanceof Error ? e.message : 'Unbekannter Fehler');
    } finally {
      setLaedt(false);
    }
  }, []);

  const statusAktualisieren = useCallback(
    async (terminId: string, neuerStatus: TerminStatus): Promise<void> => {
      // TODO: Mock entfernen, sobald Endpunkt implementiert ist
      // await apiFetch(`/api/bausteuerung/termine/${terminId}/status`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ status: neuerStatus }),
      // });
      setTermine((prev) =>
        prev.map((t) => (t.id === terminId ? { ...t, status: neuerStatus } : t)),
      );
    },
    [],
  );

  return { termine, laedt, fehler, laden, statusAktualisieren };
}
