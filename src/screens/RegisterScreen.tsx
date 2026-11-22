import { useMemo, useState } from 'react';
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
import { evaluatePasswordRules, isPasswordStrong, isValidEmail } from '../utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const passwordRules = useMemo(() => evaluatePasswordRules(password), [password]);
  const strongPassword = useMemo(() => isPasswordStrong(password), [password]);

  const handleRegister = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Completa todos los campos obligatorios.');
      return;
    }
    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setError('Nombre y apellido deben tener al menos 2 caracteres.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Ingresa un correo electrónico válido (ej. usuario@dominio.cl).');
      return;
    }
    if (!strongPassword) {
      setError('La contraseña aún no cumple con todos los requisitos de seguridad.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la cuenta.');
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
        <Text style={styles.heading}>Crear cuenta</Text>
        <Text style={styles.subheading}>Regístrate para guardar tus propias tareas</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={(t) => { setFirstName(t); if (error) setError(null); }}
          placeholder="Ingresa tu nombre"
          placeholderTextColor={colors.textFaint}
          accessibilityLabel="Nombre"
        />

        <Text style={[styles.label, styles.labelSpaced]}>Apellido</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={(t) => { setLastName(t); if (error) setError(null); }}
          placeholder="Ingresa tu apellido"
          placeholderTextColor={colors.textFaint}
          accessibilityLabel="Apellido"
        />

        <Text style={[styles.label, styles.labelSpaced]}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(t) => { setEmail(t); if (error) setError(null); }}
          placeholder="correo@ejemplo.cl"
          placeholderTextColor={colors.textFaint}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Correo electrónico"
        />
        {email.length > 0 && !isValidEmail(email) ? (
          <Text style={styles.hintError}>Formato de correo inválido (ej. nombre@correo.cl)</Text>
        ) : null}

        <Text style={[styles.label, styles.labelSpaced]}>Contraseña</Text>
        <PasswordInput
          value={password}
          onChangeText={(t) => { setPassword(t); if (error) setError(null); }}
          placeholder="Crea una contraseña segura"
          accessibilityLabel="Contraseña"
          hasError={password.length > 0 && !strongPassword}
        />

        {/* Checklist de complejidad en tiempo real */}
        <View style={styles.rulesBox}>
          <Text style={styles.rulesTitle}>Requisitos de seguridad:</Text>
          {passwordRules.map((rule) => (
            <Text
              key={rule.id}
              style={[styles.ruleItem, rule.valid ? styles.ruleValid : styles.rulePending]}
            >
              {rule.valid ? '✓' : '○'} {rule.label}
            </Text>
          ))}
        </View>

        <Text style={[styles.label, styles.labelSpaced]}>Confirmar contraseña</Text>
        <PasswordInput
          value={confirmPassword}
          onChangeText={(t) => { setConfirmPassword(t); if (error) setError(null); }}
          placeholder="Repite tu contraseña"
          accessibilityLabel="Confirmar contraseña"
          hasError={confirmPassword.length > 0 && password !== confirmPassword}
        />
        {confirmPassword.length > 0 && password !== confirmPassword ? (
          <Text style={styles.hintError}>Las contraseñas no coinciden</Text>
        ) : null}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          title="Registrarme"
          onPress={handleRegister}
          loading={submitting}
          disabled={submitting}
          containerStyle={styles.button}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.link}>Inicia sesión</Text>
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
  subheading: { ...typography.body, color: colors.textMuted, marginBottom: spacing.lg },
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
  rulesBox: {
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm + 4,
    gap: 4,
  },
  rulesTitle: {
    ...typography.small,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  ruleItem: {
    ...typography.small,
  },
  ruleValid: {
    color: colors.primary,
    fontWeight: '700',
  },
  rulePending: {
    color: colors.textMuted,
  },
  hintError: {
    ...typography.small,
    color: colors.danger,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  error: { ...typography.small, color: colors.danger, marginTop: spacing.md },
  button: { marginTop: spacing.xl },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  footerText: { ...typography.small, color: colors.textMuted },
  link: { ...typography.label, fontSize: 13, color: colors.primary, textDecorationLine: 'underline' },
});