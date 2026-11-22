import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';

type PasswordInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  accessibilityLabel?: string;
  hasError?: boolean;
};

export default function PasswordInput({
  value,
  onChangeText,
  placeholder = '••••••••',
  accessibilityLabel = 'Contraseña',
  hasError = false,
}: PasswordInputProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);

  return (
    <View
      style={[
        styles.wrapper,
        focused ? styles.wrapperFocused : null,
        hasError ? styles.wrapperError : null,
      ]}
    >
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={colors.textFaint}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel={accessibilityLabel}
      />
      <Pressable
        onPress={() => setVisible((prev) => !prev)}
        style={styles.eyeButton}
        accessibilityRole="button"
        accessibilityLabel={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        <Text style={styles.eyeIcon}>{visible ? '🙈' : '👁️'}</Text>
        <Text style={styles.eyeText}>{visible ? 'Ocultar' : 'Ver'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
  },
  wrapperFocused: {
    borderColor: colors.primary,
  },
  wrapperError: {
    borderColor: colors.danger,
  },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.text,
    paddingVertical: 13,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        outlineWidth: 0,
      } as Record<string, unknown>,
    }),
  },
  eyeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    gap: 4,
  },
  eyeIcon: {
    fontSize: 15,
  },
  eyeText: {
    ...typography.small,
    color: colors.textMuted,
    fontWeight: '600',
  },
});