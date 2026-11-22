import { Platform } from 'react-native';

const monoFont = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  web: '"Fira Code", "Cascadia Code", Consolas, monospace',
  default: 'monospace',
});
export const fonts = {
  serif: monoFont,
  mono: monoFont,
};

export const colors = {
  background: '#080C0A',      // Negro profundo tipo terminal
  surface: '#0F1713',         // Verde muy oscuro para tarjetas e inputs
  primary: '#00FF66',         // Verde fósforo / Matrix principal
  primaryText: '#04140A',     // Texto oscuro para contrastar sobre botones verde neón
  text: '#D8FBE5',            // Blanco verdoso suave para lectura cómoda
  textMuted: '#6FA384',       // Verde grisáceo para subtítulos y metadatos
  textFaint: '#3E634D',       // Verde apagado para placeholders
  border: '#1B3325',          // Bordes sutiles estilo grid de consola
  borderStrong: '#00CC52',    // Borde activo / resaltado
  danger: '#FF3B5C',          // Rojo neón para eliminar o errores
  dangerSoft: '#2B0D14',      // Fondo oscuro rojizo para alertas
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 4,                      // Esquinas más rectas estilo terminal/HUD
  md: 6,
  lg: 8,
};

export const typography = {
  display: {
    fontFamily: monoFont,
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  title: {
    fontFamily: monoFont,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  body: {
    fontFamily: monoFont,
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    fontFamily: monoFont,
    fontSize: 13,
    fontWeight: '700' as const,
  },
  small: {
    fontFamily: monoFont,
    fontSize: 12,
    lineHeight: 17,
  },
};

export const shadow = {
  shadowColor: '#00FF66',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.12,
  shadowRadius: 8,
  elevation: 3,
};