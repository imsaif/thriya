import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../constants/colors';
import { fonts, fontSizes } from '../../constants/typography';
import { useUserStore } from '../../store/userStore';
import { useOnboardingStore } from '../../store/onboardingStore';

const ONBOARDING_DATA_KEY = 'thriya_onboarding_data';

export function CoachReadyScreen() {
  const userName = useUserStore((s) => s.userName);
  const setOnboardingComplete = useUserStore((s) => s.setOnboardingComplete);
  const onboardingData = useOnboardingStore();

  const handleStart = () => {
    // TODO: Re-enable persistence for production
    // const data = {
    //   reason: onboardingData.reason,
    //   hardDaySymptoms: onboardingData.hardDaySymptoms,
    //   foodRelationship: onboardingData.foodRelationship,
    //   ageRange: onboardingData.ageRange,
    //   cycleRegularity: onboardingData.cycleRegularity,
    //   tryingToConceive: onboardingData.tryingToConceive,
    // };
    // await AsyncStorage.setItem(ONBOARDING_DATA_KEY, JSON.stringify(data));
    setOnboardingComplete(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Thriya is ready for you, {userName}</Text>
        <Text style={styles.body}>
          Your coach now knows your story — your symptoms, your relationship with
          food, and where you are in your journey.
        </Text>
        <Text style={styles.body}>
          Every insight will be shaped by what you have shared. The more you log,
          the more personal it becomes.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Let's go</Text>
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
    lineHeight: 22,
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
