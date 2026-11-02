import { StyleSheet, View } from 'react-native';
import { Button, ListItem } from '@rneui/themed';
import type { Task } from '../types/task';
import { colors, radius, shadow, spacing, typography } from '../theme/theme';

type TaskItemProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export default function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  return (
    <ListItem
      containerStyle={styles.card}
      onPress={() => onEdit(task)}
      accessibilityLabel={`Tarea ${task.title}`}
    >
      <ListItem.Content>
        <ListItem.Title style={styles.title}>{task.title}</ListItem.Title>
        {task.description ? (
          <ListItem.Subtitle style={styles.description} numberOfLines={3}>
            {task.description}
          </ListItem.Subtitle>
        ) : null}
        <View style={styles.actions}>
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
  title: { ...typography.title, color: colors.text },
  description: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs + 2 },
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
  actionButton: { paddingHorizontal: spacing.md },
  editText: { ...typography.label, color: colors.text },
  deleteText: { ...typography.label, color: colors.danger },
});
