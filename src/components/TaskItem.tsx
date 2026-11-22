import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, ListItem } from '@rneui/themed';
import { useCountdown } from '../hooks/useCountdown';
import { colors, radius, shadow, spacing, typography } from '../theme/theme';
import type { Task } from '../types/task';
import { formatCreatedAt } from '../utils/dateTime';

type TaskItemProps = {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export default function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const countdown = useCountdown(task.dueAt, task.completed);
  const createdLabel = formatCreatedAt(task.createdAt);
  const syncedLabel = task.syncedAt ? formatCreatedAt(task.syncedAt) : null;

  return (
    <ListItem
      containerStyle={[
        styles.card,
        task.completed ? styles.cardCompleted : null,
        countdown.status === 'expired' ? styles.cardExpired : null,
      ]}
    >
      <ListItem.Content>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => onToggleComplete(task)}
            style={[styles.checkbox, task.completed ? styles.checkboxChecked : null]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: task.completed }}
            accessibilityLabel={
              task.completed ? 'Marcar como pendiente' : 'Marcar como completada'
            }
          >
            {task.completed ? <Text style={styles.checkmark}>✓</Text> : null}
          </Pressable>

          <View style={styles.titleBlock}>
            <Text style={[styles.title, task.completed ? styles.titleCompleted : null]}>
              {task.title}
            </Text>

            <View style={styles.metaRow}>
              {createdLabel ? (
                <Text style={styles.createdMeta}>Creada: {createdLabel}</Text>
              ) : null}
              <Text style={syncedLabel ? styles.syncedMeta : styles.unsyncedMeta}>
                {syncedLabel ? `· ✓ Sync (${syncedLabel})` : '· ☁ No sincronizada'}
              </Text>
            </View>

            {task.description ? (
              <Text
                style={[
                  styles.description,
                  task.completed ? styles.descriptionCompleted : null,
                ]}
              >
                {task.description}
              </Text>
            ) : null}

            {countdown.status !== 'none' ? (
              <View
                style={[
                  styles.timerBadge,
                  countdown.status === 'urgent' ? styles.timerUrgent : null,
                  countdown.status === 'expired' ? styles.timerExpired : null,
                  countdown.status === 'completed' ? styles.timerCompleted : null,
                ]}
              >
                <Text
                  style={[
                    styles.timerText,
                    countdown.status === 'urgent' ? styles.timerTextUrgent : null,
                    countdown.status === 'expired' ? styles.timerTextExpired : null,
                    countdown.status === 'completed' ? styles.timerTextCompleted : null,
                  ]}
                >
                  {countdown.status === 'expired' ? '⚠ ' : '⏱ '}
                  {countdown.label}
                </Text>
              </View>
            ) : null}

            {task.location ? (
              <Text style={styles.locationBadge}>
                GPS: {task.location.latitude.toFixed(4)}, {task.location.longitude.toFixed(4)}
              </Text>
            ) : null}
          </View>
        </View>

        {task.imageUri ? (
          <Image source={{ uri: task.imageUri }} style={styles.thumbnail} />
        ) : null}

        <View style={styles.actions}>
          <Button
            title={task.completed ? 'Reabrir' : 'Listo'}
            type="clear"
            size="sm"
            titleStyle={styles.completeText}
            buttonStyle={styles.actionButton}
            onPress={() => onToggleComplete(task)}
          />
          <Button
            title="Editar"
            type="clear"
            size="sm"
            titleStyle={styles.editText}
            buttonStyle={styles.actionButton}
            onPress={() => onEdit(task)}
          />
          <Button
            title="Eliminar"
            type="clear"
            size="sm"
            titleStyle={styles.deleteText}
            buttonStyle={styles.actionButton}
            onPress={() => onDelete(task)}
          />
        </View>
      </ListItem.Content>
    </ListItem>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: spacing.md + 2,
    paddingTop: spacing.md + 2,
    paddingBottom: spacing.sm,
    ...shadow,
  },
  cardCompleted: { opacity: 0.72 },
  cardExpired: { borderColor: colors.danger, borderWidth: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    backgroundColor: colors.background,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.primaryText,
    fontSize: 14,
    fontWeight: '700',
  },
  titleBlock: { flex: 1 },
  title: { ...typography.title, color: colors.text },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  createdMeta: {
    ...typography.small,
    color: colors.textMuted,
  },
  syncedMeta: {
    ...typography.small,
    color: colors.primary,
  },
  unsyncedMeta: {
    ...typography.small,
    color: '#FFB020',
  },
  description: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs + 2 },
  descriptionCompleted: { textDecorationLine: 'line-through' },
  timerBadge: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.background,
  },
  timerUrgent: {
    borderColor: '#FFB020',
    backgroundColor: '#261A04',
  },
  timerExpired: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  timerCompleted: {
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  timerText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '700',
  },
  timerTextUrgent: { color: '#FFB020' },
  timerTextExpired: { color: colors.danger },
  timerTextCompleted: { color: colors.textMuted },
  locationBadge: {
    ...typography.small,
    color: colors.primary,
    marginTop: spacing.sm,
  },
  thumbnail: {
    width: '100%',
    height: 150,
    borderRadius: radius.md,
    marginTop: spacing.sm,
    resizeMode: 'cover',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    marginTop: spacing.md,
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    gap: spacing.xs,
  },
  actionButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  completeText: { ...typography.label, color: colors.primary },
  editText: { ...typography.label, color: colors.text },
  deleteText: { ...typography.label, color: colors.danger },
});