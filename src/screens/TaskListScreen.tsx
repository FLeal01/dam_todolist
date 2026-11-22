import { useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Button } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import EmptyState from '../components/EmptyState';
import TaskItem from '../components/TaskItem';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TasksContext';
import { colors, radius, spacing, typography } from '../theme/theme';
import type { RootStackParamList } from '../types/navigation';
import type { Task } from '../types/task';
import { confirmAction } from '../utils/confirm';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskList'>;

export default function TaskListScreen({ navigation }: Props) {
  const { logout } = useAuth();
  const { tasks, loading, syncing, error, toggleTaskCompleted, deleteTask, importFromApi, syncToApi } = useTasks();
  const [actionError, setActionError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Salir"
          type="clear"
          size="sm"
          buttonStyle={{ backgroundColor: 'transparent', paddingHorizontal: spacing.sm }}
          titleStyle={{ ...typography.label, color: colors.danger }}
          onPress={() =>
            confirmAction({
              title: 'Cerrar sesión',
              message: '¿Quieres salir de tu cuenta?',
              confirmText: 'Salir',
              onConfirm: logout,
            })
          }
        />
      ),
    });
  }, [navigation, logout]);

  const handleEdit = (task: Task) => navigation.navigate('TaskForm', { task });

  const handleDelete = (task: Task) =>
    confirmAction({
      title: 'Eliminar tarea',
      message: `¿Quieres eliminar "${task.title}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      onConfirm: () => {
        setActionError(null);
        setStatusMessage(null);
        deleteTask(task.id).catch(() =>
          setActionError(`No se pudo eliminar "${task.title}". Inténtalo de nuevo.`),
        );
      },
    });

  const handleImport = async () => {
    setActionError(null);
    setStatusMessage(null);
    try {
      const count = await importFromApi();
      setStatusMessage(`Se importaron ${count} tareas desde la API externa.`);
    } catch {
      setActionError('No se pudieron importar tareas desde la API externa.');
    }
  };

  const handleSync = async () => {
    setActionError(null);
    setStatusMessage(null);
    try {
      const count = await syncToApi();
      setStatusMessage(`Sincronización completa: ${count} ${count === 1 ? 'tarea enviada' : 'tareas enviadas'} a la nube.`);
    } catch {
      setActionError('Error al sincronizar las tareas con el servidor.');
    }
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.length - pendingCount;

  return (
    <View style={styles.container}>
      {error || actionError ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error ?? actionError}
        </Text>
      ) : null}

      {statusMessage ? (
        <Text style={styles.status} accessibilityRole="status">
          {statusMessage}
        </Text>
      ) : null}

      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(task) => task.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggleComplete={(task) => toggleTaskCompleted(task.id)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            tasks.length > 0 ? (
              <Text style={styles.summary}>
                {pendingCount} {pendingCount === 1 ? 'pendiente' : 'pendientes'} · {completedCount}{' '}
                {completedCount === 1 ? 'lista' : 'listas'}
              </Text>
            ) : undefined
          }
          ListEmptyComponent={EmptyState}
          contentContainerStyle={styles.list}
        />
      )}

      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <View style={styles.apiRow}>
          <Button
            title="Importar API"
            type="outline"
            onPress={handleImport}
            disabled={syncing}
            loading={syncing}
            containerStyle={styles.apiButton}
            buttonStyle={styles.outlineButton}
            titleStyle={styles.outlineTitle}
          />
          <Button
            title="Sincronizar"
            type="outline"
            onPress={handleSync}
            disabled={syncing}
            loading={syncing}
            containerStyle={styles.apiButton}
            buttonStyle={styles.outlineButton}
            titleStyle={styles.outlineTitle}
          />
        </View>
        <Button title="Nueva tarea" onPress={() => navigation.navigate('TaskForm')} disabled={syncing} />
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
  status: {
    ...typography.small,
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
    gap: spacing.sm,
  },
  apiRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  apiButton: {
    flex: 1,
  },
  outlineButton: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    paddingVertical: 11,
  },
  outlineTitle: {
    ...typography.label,
    fontSize: 14,
    color: colors.primary,
  },
});