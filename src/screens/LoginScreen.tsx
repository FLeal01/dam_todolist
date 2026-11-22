import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from '@rneui/themed';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import PasswordInput from '../components/PasswordInput';
import { useAuth } from '../context/AuthContext';
import { colors, radius, spacing, typography } from '../theme/theme';
import type { RootStackParamList } from '../types/navigation';
import { isValidEmail } from '../utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [focusedEmail, setFocusedEmail] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Ingresa tu correo electrónico y contraseña.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('El formato del correo electrónico no es válido.');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await login({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Bienvenido</Text>
        <Text style={styles.subheading}>Inicia sesión para gestionar tus tareas</Text>

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={[styles.input, focusedEmail ? styles.inputFocused : null]}
          onFocus={() => setFocusedEmail(true)}
          onBlur={() => setFocusedEmail(false)}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (error) setError(null);
          }}
          placeholder="correo@ejemplo.cl"
          placeholderTextColor={colors.textFaint}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Correo electrónico"
        />

        <Text style={[styles.label, styles.labelSpaced]}>Contraseña</Text>
        <PasswordInput
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (error) setError(null);
          }}
          placeholder="Ingresa tu contraseña"
          accessibilityLabel="Contraseña"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          title="Iniciar sesión"
          onPress={handleLogin}
          loading={submitting}
          disabled={submitting}
          containerStyle={styles.button}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Regístrate aquí</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  heading: { ...typography.display, color: colors.text, marginBottom: spacing.xs },
  subheading: { ...typography.body, color: colors.textMuted, marginBottom: spacing.xl },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.sm, marginLeft: spacing.xs },
  labelSpaced: { marginTop: spacing.md },
  input: {
    ...typography.body,
    backgroundColor: colors.surface,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 13,
  },
  inputFocused: { borderColor: colors.primary },
  error: { ...typography.small, color: colors.danger, marginTop: spacing.md },
  button: { marginTop: spacing.xl },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  footerText: { ...typography.small, color: colors.textMuted },
  link: { ...typography.label, fontSize: 13, color: colors.primary, textDecorationLine: 'underline' },
});