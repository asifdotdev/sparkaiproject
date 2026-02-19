import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  h1: { fontSize: 28, fontWeight: '700', lineHeight: 34 },
  h2: { fontSize: 24, fontWeight: '700', lineHeight: 30 },
  h3: { fontSize: 20, fontWeight: '600', lineHeight: 26 },
  h4: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 22 },
  bodyMedium: { fontSize: 16, fontWeight: '500', lineHeight: 22 },
  bodySemibold: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
  small: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  smallMedium: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  captionMedium: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  full: 999,
};
