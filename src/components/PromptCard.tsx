import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { H3, BodySm } from './Text';

interface PromptCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
}

export function PromptCard({ title, subtitle, icon, onPress }: PromptCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.textContainer}>
        <H3 style={{ marginBottom: 2 }}>{title}</H3>
        <BodySm>{subtitle}</BodySm>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
});
