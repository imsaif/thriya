import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { BodyLg } from './Text';

interface CoachMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export function CoachMessage({ role, content }: CoachMessageProps) {
  const isUser = role === 'user';

  return (
    <View style={[styles.row, isUser && styles.rowUser]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <BodyLg color={isUser ? colors.userBubbleText : colors.coachText}>
          {content}
        </BodyLg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  rowUser: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userBubble: {
    backgroundColor: colors.userBubble,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
  },
});
