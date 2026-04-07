import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { colors } from '../constants/colors';
import { fonts, fontSizes } from '../constants/typography';

interface OnboardingLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  buttonLabel?: string;
  onNext: () => void;
  onBack?: () => void;
  canProceed: boolean;
}

export function OnboardingLayout({
  title,
  subtitle,
  children,
  buttonLabel = 'Continue',
  onNext,
  onBack,
  canProceed,
}: OnboardingLayoutProps) {
  return (
    <SafeAreaView style={styles.container}>
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.6}>
          <ChevronLeftIcon size={20} color={colors.primary} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        <View style={styles.content}>{children}</View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !canProceed && styles.buttonDisabled]}
          onPress={onNext}
          disabled={!canProceed}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{buttonLabel}</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 24,
    paddingBottom: 24,
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
    marginBottom: 32,
    lineHeight: 20,
  },
  content: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 12,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.body,
    color: colors.white,
  },
});
