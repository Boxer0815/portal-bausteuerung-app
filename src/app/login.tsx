import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function LoginScreen() {
  const { login, loginBereit, laedt } = useAuth();
  const dunkel = useColorScheme() === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: dunkel ? '#111827' : '#F9FAFB' }]}>
      <Text style={styles.logo}>🔧</Text>
      <Text style={[styles.titel, { color: dunkel ? '#F9FAFB' : '#111827' }]}>
        Bausteuerung
      </Text>
      <Text style={[styles.untertitel, { color: dunkel ? '#9CA3AF' : '#6B7280' }]}>
        Monteur- & Dienstleister-App
      </Text>

      {laedt ? (
        <ActivityIndicator size="large" color="#1A56DB" style={styles.abstand} />
      ) : (
        <TouchableOpacity
          style={[styles.button, !loginBereit && styles.buttonDeaktiviert]}
          onPress={login}
          disabled={!loginBereit}
        >
          <Text style={styles.buttonText}>Mit Keycloak anmelden</Text>
        </TouchableOpacity>
      )}
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
  logo: { fontSize: 64 },
  titel: { fontSize: 28, fontWeight: '700' },
  untertitel: { fontSize: 16, marginBottom: 16 },
  abstand: { marginTop: 16 },
  button: {
    backgroundColor: '#1A56DB',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 16,
  },
  buttonDeaktiviert: { opacity: 0.5 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
