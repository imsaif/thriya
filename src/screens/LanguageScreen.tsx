import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../constants/colors';
import { fonts, fontSizes } from '../constants/typography';
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
        <Text style={styles.title}>
          {userName}, choose your language
        </Text>
        <Text style={styles.subtitle}>
          Your coach will speak to you in this language
        </Text>

        <View style={styles.options}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.key}
              style={styles.langOption}
              onPress={() => handleSelect(lang.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.langNative}>{lang.native}</Text>
              <Text style={styles.langLabel}>{lang.label}</Text>
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
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.appTitle,
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    color: colors.mutedText,
    marginBottom: 36,
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
  langNative: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.sectionTitle,
    color: colors.primary,
  },
  langLabel: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.mutedText,
  },
});
