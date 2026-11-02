import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button } from '@rneui/themed';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTasks } from '../context/TasksContext';
import { colors, radius, spacing, typography } from '../theme/theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskForm'>;

export default function TaskFormScreen({ navigation, route }: Props) {
  const { addTask, updateTask } = useTasks();
  const editing = route.params?.task;

  const [title, setTitle] = useState<string>(editing?.title ?? '');
  const [description, setDescription] = useState<string>(editing?.description ?? '');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [focused, setFocused] = useState<'title' | 'description' | null>(null);

  const handleSave = async () => {
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setTitleError('Escribe un título para la tarea.');
      return;
    }
    setTitleError(null);
    setSubmitError(null);
    setSaving(true);
    try {
      const data = { title: cleanTitle, description: description.trim() };
      if (editing) {
        await updateTask(editing.id, data);
      } else {
        await addTask(data);
      }
      // Los campos se limpian al guardar; luego se vuelve a la lista para ver la tarea agregada.
      setTitle('');
      setDescription('');
      navigation.goBack();
    } catch {
      setSubmitError('No se pudo guardar la tarea. Inténtalo de nuevo.');
    } finally {
      setSaving(false);
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
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={[
            styles.input,
            focused === 'title' ? styles.inputFocused : null,
            titleError ? styles.inputError : null,
          ]}
          onFocus={() => setFocused('title')}
          onBlur={() => setFocused(null)}
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (titleError) setTitleError(null);
          }}
          placeholder="Ej. Preparar la presentación"
          placeholderTextColor={colors.textFaint}
          returnKeyType="next"
          maxLength={80}
          accessibilityLabel="Título de la tarea"
        />
        <View style={styles.meta}>
          {titleError ? <Text style={styles.error}>{titleError}</Text> : <View />}
          <Text style={styles.counter}>{title.length}/80</Text>
        </View>

        <Text style={[styles.label, styles.labelSpaced]}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.multiline, focused === 'description' ? styles.inputFocused : null]}
          onFocus={() => setFocused('description')}
          onBlur={() => setFocused(null)}
          value={description}
          onChangeText={setDescription}
          placeholder="Agrega detalles de la tarea (opcional)"
          placeholderTextColor={colors.textFaint}
          multiline
          textAlignVertical="top"
          accessibilityLabel="Descripción de la tarea"
        />

        {submitError ? <Text style={[styles.error, styles.submitError]}>{submitError}</Text> : null}

        <Button
          title={editing ? 'Actualizar tarea' : 'Guardar tarea'}
          onPress={handleSave}
          loading={saving}
          disabled={saving}
          containerStyle={styles.button}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingTop: spacing.lg },
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
  inputError: { borderColor: colors.danger },
  meta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs + 2 },
  counter: { ...typography.small, color: colors.textFaint },
  multiline: { minHeight: 120 },
  error: { ...typography.small, color: colors.danger, flexShrink: 1 },
  submitError: { marginTop: spacing.md },
  button: { marginTop: spacing.xl },
});
