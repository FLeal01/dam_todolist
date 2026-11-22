import { describe, expect, test } from '@jest/globals';
import { formatRelativeSpan, parseCustomDateTime } from '../src/utils/dateTime';

describe('Utilidades de fecha y temporizador (dateTime)', () => {
  test('valida y convierte una fecha y hora válidas a ISO', () => {
    const result = parseCustomDateTime({
      day: '25',
      month: '12',
      year: '2026',
      hour: '18',
      minute: '30',
    });

    expect(result.error).toBeNull();
    expect(result.iso).not.toBeNull();
  });

  test('rechaza una fecha inexistente como 31 de febrero', () => {
    const result = parseCustomDateTime({
      day: '31',
      month: '02',
      year: '2026',
      hour: '10',
      minute: '00',
    });

    expect(result.iso).toBeNull();
    expect(result.error).toBeTruthy();
  });

  test('formatea correctamente el tiempo restante en horas y minutos', () => {
    const twoHoursMs = (2 * 3600 + 15 * 60 + 5) * 1000;
    const formatted = formatRelativeSpan(twoHoursMs);

    expect(formatted).toContain('2 horas');
    expect(formatted).toContain('15 min');
  });
});