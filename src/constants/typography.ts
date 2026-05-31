// Satoshi — single type family, 3 weights. Hierarchy comes from size + weight,
// not from mixing faces. Built for mobile (iOS MVP, Android v2).

export const fonts = {
  regular: 'Satoshi-Regular',
  medium: 'Satoshi-Medium',
  bold: 'Satoshi-Bold',
} as const;

// Legacy numeric sizes — kept so existing screens/components keep compiling.
// New code should prefer `textStyles[role]` below.
export const fontSizes = {
  appTitle: 24,
  sectionTitle: 18,
  body: 16,
  small: 13,
  micro: 11,
} as const;

// Role-based scale. Each entry is a drop-in StyleSheet fragment.
// bodyLg (17) exists specifically for long Coach chat reads.
export const textStyles = {
  displayLg: { fontFamily: fonts.bold,    fontSize: 32, lineHeight: 36 },
  h1:        { fontFamily: fonts.bold,    fontSize: 24, lineHeight: 30 },
  h2:        { fontFamily: fonts.bold,    fontSize: 20, lineHeight: 26 },
  h3:        { fontFamily: fonts.medium,  fontSize: 18, lineHeight: 24 },
  bodyLg:    { fontFamily: fonts.regular, fontSize: 17, lineHeight: 26 },
  body:      { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24 },
  bodySm:    { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 },
  label:     { fontFamily: fonts.medium,  fontSize: 13, lineHeight: 18, letterSpacing: 0.2 },
  caption:   { fontFamily: fonts.medium,  fontSize: 12, lineHeight: 16, letterSpacing: 0.3 },
} as const;

export type TextRole = keyof typeof textStyles;
