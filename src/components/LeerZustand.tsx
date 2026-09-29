import { View, Text, StyleSheet } from 'react-native';

interface Props {
  emoji?: string;
  titel: string;
  beschreibung?: string;
}

export function LeerZustand({ emoji = '📭', titel, beschreibung }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.titel}>{titel}</Text>
      {beschreibung && <Text style={styles.beschreibung}>{beschreibung}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 8,
  },
  emoji: { fontSize: 48 },
  titel: { fontSize: 18, fontWeight: '600', textAlign: 'center', color: '#374151' },
  beschreibung: { fontSize: 14, textAlign: 'center', color: '#6B7280' },
});
