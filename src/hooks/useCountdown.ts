import { useEffect, useState } from 'react';

export type CountdownStatus = 'none' | 'completed' | 'normal' | 'urgent' | 'expired';

export type CountdownResult = {
  status: CountdownStatus;
  label: string;
  remainingMs: number;
};

const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const TWENTY_FOUR_HOURS = 24 * 60 * ONE_MINUTE;

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function computeCountdown(dueAt?: string, completed?: boolean): CountdownResult {
  if (!dueAt) {
    return { status: 'none', label: '', remainingMs: Infinity };
  }

  if (completed) {
    return { status: 'completed', label: 'Completada a tiempo ✓', remainingMs: 0 };
  }

  const target = new Date(dueAt).getTime();
  if (Number.isNaN(target)) {
    return { status: 'none', label: '', remainingMs: Infinity };
  }

  const diff = target - Date.now();
  if (diff <= 0) {
    return { status: 'expired', label: 'EXPIRADA', remainingMs: 0 };
  }

  const days = Math.floor(diff / TWENTY_FOUR_HOURS);
  const hours = Math.floor((diff % TWENTY_FOUR_HOURS) / (60 * ONE_MINUTE));
  const minutes = Math.floor((diff % (60 * ONE_MINUTE)) / ONE_MINUTE);
  const seconds = Math.floor((diff % ONE_MINUTE) / ONE_SECOND);

  if (diff >= TWENTY_FOUR_HOURS) {
    return {
      status: 'normal',
      label: `Quedan ${days}d ${pad2(hours)}h ${pad2(minutes)}m`,
      remainingMs: diff,
    };
  }

  return {
    status: 'urgent',
    label: `Quedan ${pad2(hours)}h ${pad2(minutes)}m ${pad2(seconds)}s`,
    remainingMs: diff,
  };
}

export function useCountdown(dueAt?: string, completed?: boolean): CountdownResult {
  const [state, setState] = useState<CountdownResult>(() => computeCountdown(dueAt, completed));

  useEffect(() => {
    const initial = computeCountdown(dueAt, completed);
    setState(initial);

    // Si no tiene fecha límite, ya está completada o ya expiró, no dejamos ningún intervalo activo
    if (initial.status === 'none' || initial.status === 'completed' || initial.status === 'expired') {
      return;
    }

    // Ahorro de batería: si falta > 24h refresca cada minuto; si falta < 24h refresca cada segundo
    const intervalMs = initial.status === 'normal' ? ONE_MINUTE : ONE_SECOND;

    const timer = setInterval(() => {
      setState(computeCountdown(dueAt, completed));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [dueAt, completed, state.status]);

  return state;
}