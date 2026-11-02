import { Platform } from 'react-native';

// Paleta neutra: grises piedra con carbón como único acento.
export const colors = {
  background: '#EFEEEC',
  surface: '#FAFAF9',
  text: '#1F1F1E',
  textMuted: '#6E6D6A',
  textFaint: '#8C8B87',
  primary: '#2C2C2A',
  primaryDisabled: '#BDBCB8',
  border: '#DDDCD8',
  borderStrong: '#B9B8B3',
  danger: '#8E3B36',
  dangerSoft: '#F3E7E5',
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

export const radius = { sm: 8, md: 12, lg: 16 } as const;

// Serif del sistema para títulos (elegancia sin cargar fuentes externas).
export const fonts = {
  serif: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: 'Georgia, "Times New Roman", serif',
  }) as string,
};

export const typography = {
  display: { fontFamily: fonts.serif, fontSize: 22, fontWeight: '600' as const, letterSpacing: 0.2 },
  title: { fontFamily: fonts.serif, fontSize: 18, fontWeight: '600' as const, letterSpacing: 0.1 },
  body: { fontSize: 15, lineHeight: 22 },
  label: { fontSize: 14, fontWeight: '600' as const, letterSpacing: 0.2 },
  small: { fontSize: 13, lineHeight: 18 },
};

// Sombra muy suave: la separación la aporta sobre todo el borde fino.
export const shadow = {
  shadowColor: '#1F1F1E',
  shadowOpacity: 0.05,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 3 },
  elevation: 1,
};
