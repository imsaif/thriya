import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts, fontSizes } from '../../constants/typography';
import { useUserStore } from '../../store/userStore';
import { useTranslation } from '../../hooks/useTranslation';

export function CoachReadyScreen() {
  const userName = useUserStore((s) => s.userName);
  const setOnboardingComplete = useUserStore((s) => s.setOnboardingComplete);
  const t = useTranslation();

  const handleStart = () => {
    setOnboardingComplete(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t.coachReadyTitle}{userName}</Text>
        <Text style={styles.body}>{t.coachReadyBody1}</Text>
        <Text style={styles.body}>{t.coachReadyBody2}</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{t.letsGo}</Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.appTitle,
    color: colors.primary,
    marginBottom: 24,
    lineHeight: 30,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    color: colors.mutedText,
    lineHeight: 24,
    marginBottom: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.body,
    color: colors.white,
  },
});
