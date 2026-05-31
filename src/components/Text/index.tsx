import React from 'react';
import { Text as RNText, TextProps, TextStyle, StyleProp } from 'react-native';
import { textStyles, TextRole } from '../../constants/typography';
import { colors } from '../../constants/colors';

type Align = 'left' | 'center' | 'right';

interface Props extends TextProps {
  color?: string;
  align?: Align;
  style?: StyleProp<TextStyle>;
}

function createText(role: TextRole, defaultColor: string = colors.primary) {
  const Component: React.FC<Props> = ({ color, align, style, children, ...rest }) => (
    <RNText
      style={[
        textStyles[role],
        { color: color ?? defaultColor },
        align ? { textAlign: align } : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
  Component.displayName = `Text.${role}`;
  return Component;
}

export const Display = createText('displayLg');
export const H1 = createText('h1');
export const H2 = createText('h2');
export const H3 = createText('h3');
export const BodyLg = createText('bodyLg');
export const Body = createText('body');
export const BodySm = createText('bodySm');
export const Label = createText('label', colors.mutedText);
export const Caption = createText('caption', colors.mutedText);
