import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function KeinZugangScreen() {
  const { logout, rollen } = useAuth();
  const dunkel = useColorScheme() === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: dunkel ? '#111827' : '#F9FAFB' }]}>
      <Text style={styles.emoji}>🚫</Text>
      <Text style={[styles.titel, { color: dunkel ? '#F9FAFB' : '#111827' }]}>
        Kein Zugang
      </Text>
      <Text style={[styles.text, { color: dunkel ? '#9CA3AF' : '#6B7280' }]}>
        Dein Konto hat keine Berechtigung für die Bausteuerung-App.{'\n\n'}
        Benötigte Rollen: <Text style={styles.hervorgehoben}>monteur</Text> oder{' '}
        <Text style={styles.hervorgehoben}>dienstleister</Text>
      </Text>
      {rollen.length > 0 && (
        <Text style={[styles.rollenHinweis, { color: dunkel ? '#6B7280' : '#9CA3AF' }]}>
          Deine Rollen: {rollen.join(', ')}
        </Text>
      )}
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Abmelden</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  emoji: { fontSize: 56 },
  titel: { fontSize: 24, fontWeight: '700' },
  text: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  hervorgehoben: { fontWeight: '600', color: '#1A56DB' },
  rollenHinweis: { fontSize: 13, fontStyle: 'italic', textAlign: 'center' },
  button: {
    marginTop: 24,
    backgroundColor: '#EF4444',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: { color: '#FFF', fontWeight: '600', fontSize: 15 },
});
