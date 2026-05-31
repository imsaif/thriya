import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { colors } from '../../constants/colors';
import { H1, H3, Body } from '../../components/Text';
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
        <H1 style={{ marginBottom: 24 }}>{t.coachReadyTitle}{userName}</H1>
        <Body color={colors.mutedText} style={{ marginBottom: 16 }}>{t.coachReadyBody1}</Body>
        <Body color={colors.mutedText} style={{ marginBottom: 16 }}>{t.coachReadyBody2}</Body>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <H3 color={colors.white}>{t.letsGo}</H3>
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
});
