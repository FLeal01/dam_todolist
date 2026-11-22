const DAYS_SHORT = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/**
 * Formatea una fecha ISO para mostrar cuándo se creó la tarea (ej. "22 nov, 01:23").
 */
export function formatCreatedAt(isoDate?: string): string {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}, ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

/**
 * Formatea una fecha límite de forma descriptiva (ej. "miércoles 25 nov a las 18:30").
 */
export function formatDueSummary(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';
  const dayName = DAYS_SHORT[date.getDay()];
  const dayNum = date.getDate();
  const monthName = MONTHS_SHORT[date.getMonth()];
  const timeStr = `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
  return `${dayName} ${dayNum} ${monthName} a las ${timeStr}`;
}

/**
 * Extrae las partes numéricas (DD, MM, AAAA, HH, MM) de un ISO string para rellenar los inputs.
 */
export function extractDateParts(isoDate?: string): {
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
} {
  const base = isoDate ? new Date(isoDate) : new Date(Date.now() + 60 * 60 * 1000);
  const valid = Number.isNaN(base.getTime()) ? new Date() : base;
  return {
    day: pad2(valid.getDate()),
    month: pad2(valid.getMonth() + 1),
    year: String(valid.getFullYear()),
    hour: pad2(valid.getHours()),
    minute: pad2(valid.getMinutes()),
  };
}

/**
 * Valida los campos DD / MM / AAAA y HH : MM y devuelve un ISO string o null si es inválida.
 */
export function parseCustomDateTime(parts: {
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
}): { iso: string | null; error: string | null } {
  const d = Number(parts.day);
  const m = Number(parts.month);
  const y = Number(parts.year);
  const h = Number(parts.hour);
  const min = Number(parts.minute);

  if (
    parts.day.length < 1 ||
    parts.month.length < 1 ||
    parts.year.length !== 4 ||
    parts.hour.length < 1 ||
    parts.minute.length < 1
  ) {
    return { iso: null, error: 'Completa día, mes, año (4 dígitos) y hora.' };
  }

  if (m < 1 || m > 12) return { iso: null, error: 'El mes debe estar entre 01 y 12.' };
  if (d < 1 || d > 31) return { iso: null, error: 'El día debe estar entre 01 y 31.' };
  if (h < 0 || h > 23) return { iso: null, error: 'La hora debe estar entre 00 y 23.' };
  if (min < 0 || min > 59) return { iso: null, error: 'Los minutos deben estar entre 00 y 59.' };

  const constructed = new Date(y, m - 1, d, h, min, 0, 0);
  // Verifica que JS no haya desbordado (ej. 31/02 -> 03/03)
  if (
    constructed.getFullYear() !== y ||
    constructed.getMonth() !== m - 1 ||
    constructed.getDate() !== d
  ) {
    return { iso: null, error: 'La fecha ingresada no existe en el calendario.' };
  }

  return { iso: constructed.toISOString(), error: null };
}

/**
 * Formatea una diferencia en milisegundos en texto humano (ej. "3 días y 17 horas").
 */
export function formatRelativeSpan(diffMs: number): string {
  if (diffMs <= 0) return 'plazo ya cumplido';
  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days} ${days === 1 ? 'día' : 'días'} y ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }
  if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hora' : 'horas'} y ${minutes} min`;
  }
  return `${Math.max(1, minutes)} min`;
}