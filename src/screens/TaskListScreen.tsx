import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Button } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import EmptyState from '../components/EmptyState';
import TaskItem from '../components/TaskItem';
import { useTasks } from '../context/TasksContext';
import { colors, radius, spacing, typography } from '../theme/theme';
import type { RootStackParamList } from '../types/navigation';
import type { Task } from '../types/task';
import { confirmAction } from '../utils/confirm';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskList'>;

export default function TaskListScreen({ navigation }: Props) {
  const { tasks, loading, error, deleteTask } = useTasks();
  // Error de una acción puntual (p. ej. eliminar); se muestra al usuario en pantalla.
  const [actionError, setActionError] = useState<string | null>(null);

  const handleEdit = (task: Task) => navigation.navigate('TaskForm', { task });

  const handleDelete = (task: Task) =>
    confirmAction({
      title: 'Eliminar tarea',
      message: `¿Quieres eliminar "${task.title}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      onConfirm: () => {
        setActionError(null);
        deleteTask(task.id).catch(() =>
          setActionError(`No se pudo eliminar "${task.title}". Inténtalo de nuevo.`),
        );
      },
    });

  return (
    <View style={styles.container}>
      {error || actionError ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error ?? actionError}
        </Text>
      ) : null}
      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(task) => task.id}
          renderItem={({ item }) => (
            <TaskItem task={item} onEdit={handleEdit} onDelete={handleDelete} />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            tasks.length > 0 ? (
              <Text style={styles.summary}>
                {tasks.length} {tasks.length === 1 ? 'tarea pendiente' : 'tareas pendientes'}
              </Text>
            ) : undefined
          }
          ListEmptyComponent={EmptyState}
          contentContainerStyle={styles.list}
        />
      )}
      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <Button title="Nueva tarea" onPress={() => navigation.navigate('TaskForm')} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.lg, flexGrow: 1 },
  summary: { ...typography.small, color: colors.textMuted, marginBottom: spacing.md, marginLeft: spacing.xs },
  separator: { height: spacing.md },
  loader: { marginTop: spacing.xl },
  error: {
    ...typography.small,
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
});
