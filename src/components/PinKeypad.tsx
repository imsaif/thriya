import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../constants/colors';
import { fonts } from '../constants/typography';
import { Label } from './Text';

interface PinKeypadProps {
  onDigitPress: (digit: string) => void;
  onBackspace: () => void;
}

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'delete'],
];

export function PinKeypad({ onDigitPress, onBackspace }: PinKeypadProps) {
  const handlePress = (key: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (key === 'delete') {
      onBackspace();
    } else {
      onDigitPress(key);
    }
  };

  return (
    <View style={styles.container}>
      {KEYS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => {
            if (key === '') {
              return <View key="empty" style={styles.key} />;
            }
            return (
              <TouchableOpacity
                key={key}
                style={styles.key}
                onPress={() => handlePress(key)}
                activeOpacity={0.6}
              >
                {key === 'delete' ? (
                  <Label>Delete</Label>
                ) : (
                  <Text style={styles.keyText}>{key}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  key: {
    width: 80,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Bespoke keypad digit — 28px, no role fits.
  keyText: {
    fontFamily: fonts.regular,
    fontSize: 28,
    color: colors.primary,
  },
});
