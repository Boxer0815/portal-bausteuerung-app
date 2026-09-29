import { View, Text, StyleSheet } from 'react-native';
import type { TerminStatus } from '../types';

const FARBEN: Record<TerminStatus, { hintergrund: string; text: string; label: string }> = {
  offen:             { hintergrund: '#E5E7EB', text: '#374151', label: 'Offen' },
  angenommen:        { hintergrund: '#DBEAFE', text: '#1D4ED8', label: 'Angenommen' },
  unterwegs:         { hintergrund: '#FEF3C7', text: '#92400E', label: 'Unterwegs' },
  erledigt:          { hintergrund: '#D1FAE5', text: '#065F46', label: 'Erledigt' },
  nicht_erfolgreich: { hintergrund: '#FEE2E2', text: '#991B1B', label: 'Nicht erfolgreich' },
};

export function StatusBadge({ status }: { status: TerminStatus }) {
  const farbe = FARBEN[status];
  return (
    <View style={[styles.badge, { backgroundColor: farbe.hintergrund }]}>
      <Text style={[styles.text, { color: farbe.text }]}>{farbe.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
});
