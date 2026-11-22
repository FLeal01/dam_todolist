import { useMemo, useRef, useState, type ComponentRef } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button } from '@rneui/themed';
import { captureCurrentLocation, captureTaskPhoto } from '../services/devicePeripherals';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTasks } from '../context/TasksContext';
import { colors, radius, spacing, typography } from '../theme/theme';
import type { RootStackParamList } from '../types/navigation';
import type { TaskLocation } from '../types/task';
import {
  extractDateParts,
  formatDueSummary,
  formatRelativeSpan,
  parseCustomDateTime,
} from '../utils/dateTime';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskForm'>;

export default function TaskFormScreen({ navigation, route }: Props) {
  const { addTask, updateTask } = useTasks();
  const editing = route.params?.task;

  const [title, setTitle] = useState<string>(editing?.title ?? '');
  const [description, setDescription] = useState<string>(editing?.description ?? '');
  const [imageUri, setImageUri] = useState<string | undefined>(editing?.imageUri);
  const [location, setLocation] = useState<TaskLocation | undefined>(editing?.location);

  // Estado para fecha/hora límite opcional
  const [hasDueDate, setHasDueDate] = useState<boolean>(Boolean(editing?.dueAt));
  const initialParts = useMemo(() => extractDateParts(editing?.dueAt), [editing?.dueAt]);
  const [day, setDay] = useState<string>(initialParts.day);
  const [month, setMonth] = useState<string>(initialParts.month);
  const [year, setYear] = useState<string>(initialParts.year);
  const [hour, setHour] = useState<string>(initialParts.hour);
  const [minute, setMinute] = useState<string>(initialParts.minute);

  // Refs para auto-avance entre campos numéricos
// Refs para auto-avance entre campos numéricos
  const monthRef = useRef<ComponentRef<typeof TextInput>>(null);
  const yearRef = useRef<ComponentRef<typeof TextInput>>(null);
  const hourRef = useRef<ComponentRef<typeof TextInput>>(null);
  const minuteRef = useRef<ComponentRef<typeof TextInput>>(null);

  const [titleError, setTitleError] = useState<string | null>(null);
  const [dueError, setDueError] = useState<string | null>(null);
  const [peripheralError, setPeripheralError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [locating, setLocating] = useState<boolean>(false);
  const [focused, setFocused] = useState<'title' | 'description' | null>(null);

  // Evaluación en vivo de la fecha/hora ingresada
  const parsedDue = useMemo(() => {
    if (!hasDueDate) return { iso: null, error: null };
    return parseCustomDateTime({ day, month, year, hour, minute });
  }, [hasDueDate, day, month, year, hour, minute]);

  const applyPreset = (targetDate: Date) => {
    const parts = extractDateParts(targetDate.toISOString());
    setDay(parts.day);
    setMonth(parts.month);
    setYear(parts.year);
    setHour(parts.hour);
    setMinute(parts.minute);
    setHasDueDate(true);
    if (dueError) setDueError(null);
  };

  const handlePresetHours = (hoursToAdd: number) => {
    applyPreset(new Date(Date.now() + hoursToAdd * 60 * 60 * 1000));
  };

  const handlePresetTodayEnd = () => {
    const d = new Date();
    d.setHours(23, 59, 0, 0);
    applyPreset(d);
  };

  const handlePresetTomorrow = () => {
    applyPreset(new Date(Date.now() + 24 * 60 * 60 * 1000));
  };

  const handlePresetThreeDays = () => {
    applyPreset(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
  };

  const onlyDigits = (val: string, maxLen: number) => val.replace(/\D/g, '').slice(0, maxLen);

  const handleTakePhoto = async () => {
    setPeripheralError(null);
    const res = await captureTaskPhoto();
    if (!res.ok) {
      setPeripheralError(res.error);
      return;
    }
    if (res.uri) {
      setImageUri(res.uri);
    }
  };

  const handleGetLocation = async () => {
    setPeripheralError(null);
    setLocating(true);
    const res = await captureCurrentLocation();
    if (!res.ok) {
      setPeripheralError(res.error);
    } else {
      setLocation(res.location);
    }
    setLocating(false);
  };

  const handleSave = async () => {
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setTitleError('Escribe un título para la tarea.');
      return;
    }
    setTitleError(null);

    let dueAtIso: string | undefined = undefined;
    if (hasDueDate) {
      if (!parsedDue.iso || parsedDue.error) {
        setDueError(parsedDue.error ?? 'Revisa la fecha y hora límite.');
        return;
      }
      if (!editing && new Date(parsedDue.iso).getTime() <= Date.now()) {
        setDueError('La fecha límite debe ser posterior a la hora actual.');
        return;
      }
      dueAtIso = parsedDue.iso;
    }
    setDueError(null);
    setSubmitError(null);
    setSaving(true);
    try {
      const data = {
        title: cleanTitle,
        description: description.trim(),
        dueAt: dueAtIso,
        imageUri,
        location,
      };
      if (editing) {
        await updateTask(editing.id, data);
      } else {
        await addTask(data);
      }
      setTitle('');
      setDescription('');
      setImageUri(undefined);
      setLocation(undefined);
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

        {/* Sección de Fecha y Hora Límite (Temporizador opcional) */}
        <View style={styles.dueHeaderRow}>
          <View style={styles.dueTitleCol}>
            <Text style={styles.label}>¿Tiene fecha/hora límite?</Text>
            <Text style={styles.helperSubtext}>Activa un temporizador en tiempo real</Text>
          </View>
          <Switch
            value={hasDueDate}
            onValueChange={(val) => {
              setHasDueDate(val);
              if (val && !editing?.dueAt) {
                handlePresetHours(2);
              }
              if (dueError) setDueError(null);
            }}
            trackColor={{ false: colors.border, true: colors.borderStrong }}
            thumbColor={hasDueDate ? colors.primary : colors.textMuted}
          />
        </View>

        {hasDueDate ? (
          <View style={styles.dueBox}>
            <Text style={styles.presetLabel}>Atajos rápidos:</Text>
            <View style={styles.presetsRow}>
              <Pressable style={styles.presetChip} onPress={() => handlePresetHours(1)}>
                <Text style={styles.presetChipText}>+1 hora</Text>
              </Pressable>
              <Pressable style={styles.presetChip} onPress={() => handlePresetHours(3)}>
                <Text style={styles.presetChipText}>+3 horas</Text>
              </Pressable>
              <Pressable style={styles.presetChip} onPress={handlePresetTodayEnd}>
                <Text style={styles.presetChipText}>Hoy 23:59</Text>
              </Pressable>
              <Pressable style={styles.presetChip} onPress={handlePresetTomorrow}>
                <Text style={styles.presetChipText}>Mañana</Text>
              </Pressable>
              <Pressable style={styles.presetChip} onPress={handlePresetThreeDays}>
                <Text style={styles.presetChipText}>+3 días</Text>
              </Pressable>
            </View>

            <Text style={[styles.presetLabel, { marginTop: spacing.md }]}>
              O define fecha y hora exacta:
            </Text>
            <View style={styles.dateTimeGrid}>
              <View style={styles.dateGroup}>
                <TextInput
                  style={[styles.numInput, styles.numInput2]}
                  value={day}
                  onChangeText={(t) => {
                    const clean = onlyDigits(t, 2);
                    setDay(clean);
                    if (dueError) setDueError(null);
                    if (clean.length === 2) monthRef.current?.focus();
                  }}
                  placeholder="DD"
                  placeholderTextColor={colors.textFaint}
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text style={styles.separator}>/</Text>
                <TextInput
                  ref={monthRef}
                  style={[styles.numInput, styles.numInput2]}
                  value={month}
                  onChangeText={(t) => {
                    const clean = onlyDigits(t, 2);
                    setMonth(clean);
                    if (dueError) setDueError(null);
                    if (clean.length === 2) yearRef.current?.focus();
                  }}
                  placeholder="MM"
                  placeholderTextColor={colors.textFaint}
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text style={styles.separator}>/</Text>
                <TextInput
                  ref={yearRef}
                  style={[styles.numInput, styles.numInput4]}
                  value={year}
                  onChangeText={(t) => {
                    const clean = onlyDigits(t, 4);
                    setYear(clean);
                    if (dueError) setDueError(null);
                    if (clean.length === 4) hourRef.current?.focus();
                  }}
                  placeholder="AAAA"
                  placeholderTextColor={colors.textFaint}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </View>

              <View style={styles.dateGroup}>
                <TextInput
                  ref={hourRef}
                  style={[styles.numInput, styles.numInput2]}
                  value={hour}
                  onChangeText={(t) => {
                    const clean = onlyDigits(t, 2);
                    setHour(clean);
                    if (dueError) setDueError(null);
                    if (clean.length === 2) minuteRef.current?.focus();
                  }}
                  placeholder="HH"
                  placeholderTextColor={colors.textFaint}
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text style={styles.separator}>:</Text>
                <TextInput
                  ref={minuteRef}
                  style={[styles.numInput, styles.numInput2]}
                  value={minute}
                  onChangeText={(t) => {
                    setMinute(onlyDigits(t, 2));
                    if (dueError) setDueError(null);
                  }}
                  placeholder="MM"
                  placeholderTextColor={colors.textFaint}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
            </View>

            {/* Vista previa en vivo */}
            {parsedDue.error ? (
              <Text style={styles.previewError}>{parsedDue.error}</Text>
            ) : parsedDue.iso ? (
              <Text style={styles.previewOk}>
                ⏱ Vence el {formatDueSummary(parsedDue.iso)} (en{' '}
                {formatRelativeSpan(new Date(parsedDue.iso).getTime() - Date.now())})
              </Text>
            ) : null}

            {dueError ? <Text style={styles.previewError}>{dueError}</Text> : null}
          </View>
        ) : null}

        {/* Sección de periféricos: Cámara y GPS */}
        <Text style={[styles.label, styles.labelSpaced]}>Adjuntos y ubicación</Text>
        <View style={styles.peripheralsRow}>
          <Button
            title={imageUri ? 'Cambiar foto' : 'Tomar foto'}
            type="outline"
            onPress={handleTakePhoto}
            containerStyle={styles.peripheralButton}
            buttonStyle={styles.outlineButton}
            titleStyle={styles.outlineTitle}
          />
          <Button
            title={location ? 'Actualizar GPS' : 'Obtener GPS'}
            type="outline"
            onPress={handleGetLocation}
            loading={locating}
            disabled={locating}
            containerStyle={styles.peripheralButton}
            buttonStyle={styles.outlineButton}
            titleStyle={styles.outlineTitle}
          />
        </View>

        {peripheralError ? <Text style={[styles.error, styles.peripheralFeedback]}>{peripheralError}</Text> : null}

        {location ? (
          <View style={styles.locationBox}>
            <Text style={styles.locationText}>
              Ubicación registrada: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
            </Text>
          </View>
        ) : null}

        {imageUri ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: imageUri }} style={styles.previewImage} accessibilityLabel="Vista previa de la foto" />
            <Button
              title="Quitar foto"
              type="clear"
              size="sm"
              buttonStyle={{
                backgroundColor: colors.dangerSoft,
                borderWidth: 1,
                borderColor: colors.danger,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs + 2,
                marginTop: spacing.sm,
              }}
              titleStyle={{
                ...typography.label,
                color: colors.danger,
              }}
              onPress={() => setImageUri(undefined)}
            />
          </View>
        ) : null}

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
  content: { padding: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.xl },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.sm, marginLeft: spacing.xs },
  labelSpaced: { marginTop: spacing.md },
  helperSubtext: {
    ...typography.small,
    color: colors.textMuted,
    marginLeft: spacing.xs,
  },
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
  multiline: { minHeight: 100 },
  dueHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  dueTitleCol: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  dueBox: {
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  presetLabel: {
    ...typography.small,
    color: colors.textMuted,
    marginBottom: spacing.xs + 2,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
  },
  presetChip: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
  },
  presetChipText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '700',
  },
  dateTimeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.md,
  },
  dateGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  numInput: {
    ...typography.body,
    backgroundColor: colors.background,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: 8,
    textAlign: 'center',
  },
  numInput2: { width: 44 },
  numInput4: { width: 64 },
  separator: {
    ...typography.title,
    color: colors.textMuted,
  },
  previewOk: {
    ...typography.small,
    color: colors.primary,
    marginTop: spacing.md,
    fontWeight: '700',
  },
  previewError: {
    ...typography.small,
    color: colors.danger,
    marginTop: spacing.md,
  },
  peripheralsRow: { flexDirection: 'row', gap: spacing.sm },
  peripheralButton: { flex: 1 },
  outlineButton: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    paddingVertical: 11,
  },
  outlineTitle: { ...typography.label, fontSize: 14, color: colors.primary },
  peripheralFeedback: { marginTop: spacing.sm },
  locationBox: {
    marginTop: spacing.sm,
    padding: spacing.sm + 2,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationText: { ...typography.small, color: colors.textMuted },
  previewContainer: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: radius.sm,
    resizeMode: 'cover',
  },
  error: { ...typography.small, color: colors.danger, flexShrink: 1 },
  submitError: { marginTop: spacing.md },
  button: { marginTop: spacing.xl },
});