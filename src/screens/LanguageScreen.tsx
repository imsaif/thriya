import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../constants/colors';
import { H1, H3, Body, BodySm } from '../components/Text';
import { useUserStore } from '../store/userStore';
import type { CoachLanguage } from '../types';

const LANGUAGES: { key: CoachLanguage; label: string; native: string }[] = [
  { key: 'English', label: 'English', native: 'English' },
  { key: 'Hindi', label: 'Hindi', native: '\u0939\u093F\u0928\u094D\u0926\u0940' },
  { key: 'Telugu', label: 'Telugu', native: '\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41' },
  { key: 'Tamil', label: 'Tamil', native: '\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD' },
];

export function LanguageScreen() {
  const userName = useUserStore((s) => s.userName);
  const setCoachLanguage = useUserStore((s) => s.setCoachLanguage);
  const setLanguageChosen = useUserStore((s) => s.setLanguageChosen);

  const handleSelect = (lang: CoachLanguage) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCoachLanguage(lang);
    setLanguageChosen(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <H1 style={{ marginBottom: 8 }}>
          {userName}, choose your language
        </H1>
        <Body color={colors.mutedText} style={{ marginBottom: 36 }}>
          Your coach will speak to you in this language
        </Body>

        <View style={styles.options}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.key}
              style={styles.langOption}
              onPress={() => handleSelect(lang.key)}
              activeOpacity={0.7}
            >
              <H3>{lang.native}</H3>
              <BodySm>{lang.label}</BodySm>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  options: {
    gap: 12,
  },
  langOption: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
