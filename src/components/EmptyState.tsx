import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';

export default function EmptyState() {
  return (
    <View style={styles.container}>
      {/* Ícono minimalista de lista, dibujado con vistas para no depender de recursos externos. */}
      <View style={styles.glyph} accessibilityElementsHidden importantForAccessibility="no">
        <View style={[styles.line, { width: 28 }]} />
        <View style={[styles.line, { width: 20 }]} />
        <View style={[styles.line, { width: 24 }]} />
      </View>
      <Text style={styles.title}>Aún no tienes tareas</Text>
      <Text style={styles.text}>Usa el botón Nueva tarea para agregar la primera.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  glyph: {
    width: 64,
    height: 64,
    borderRadius: radius.lg + 4,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 17,
    gap: 7,
    marginBottom: spacing.lg,
  },
  line: { height: 2.5, borderRadius: 2, backgroundColor: colors.borderStrong },
  title: { ...typography.title, color: colors.text, marginBottom: spacing.sm },
  text: { ...typography.body, color: colors.textMuted, textAlign: 'center', maxWidth: 280 },
});
