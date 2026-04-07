import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../constants/colors';
import { fonts, fontSizes } from '../constants/typography';
import { useUserStore } from '../store/userStore';
import type { RootStackParamList, CoachLanguage } from '../types';

const LANGUAGES: { key: CoachLanguage; label: string; native: string }[] = [
  { key: 'English', label: 'English', native: 'English' },
  { key: 'Hindi', label: 'Hindi', native: '\u0939\u093F\u0928\u094D\u0926\u0940' },
  { key: 'Telugu', label: 'Telugu', native: '\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41' },
  { key: 'Tamil', label: 'Tamil', native: '\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD' },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const userName = useUserStore((s) => s.userName);
  const coachLanguage = useUserStore((s) => s.coachLanguage);
  const setCoachLanguage = useUserStore((s) => s.setCoachLanguage);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.6}>
        <ChevronLeftIcon size={20} color={colors.primary} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Settings</Text>

        <View style={styles.profileSection}>
          <Text style={styles.profileName}>{userName}</Text>
        </View>

        <Text style={styles.sectionLabel}>Coach language</Text>
        <Text style={styles.sectionHint}>
          Your coach will respond in this language
        </Text>

        {LANGUAGES.map((lang) => {
          const isSelected = coachLanguage === lang.key;
          return (
            <TouchableOpacity
              key={lang.key}
              style={[styles.langOption, isSelected && styles.langOptionSelected]}
              onPress={() => setCoachLanguage(lang.key)}
              activeOpacity={0.7}
            >
              <View>
                <Text style={[styles.langLabel, isSelected && styles.langLabelSelected]}>
                  {lang.label}
                </Text>
                <Text style={[styles.langNative, isSelected && styles.langNativeSelected]}>
                  {lang.native}
                </Text>
              </View>
              {isSelected && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>{'\u2713'}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 4,
  },
  backText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    color: colors.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  heading: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.appTitle,
    color: colors.primary,
    marginBottom: 24,
  },
  profileSection: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 32,
  },
  profileName: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.sectionTitle,
    color: colors.primary,
  },
  sectionLabel: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.sectionTitle,
    color: colors.primary,
    marginBottom: 4,
  },
  sectionHint: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.mutedText,
    marginBottom: 16,
  },
  langOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  langOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  langLabel: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.body,
    color: colors.primary,
  },
  langLabelSelected: {
    color: colors.white,
  },
  langNative: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.mutedText,
    marginTop: 2,
  },
  langNativeSelected: {
    color: colors.userBubbleText,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
