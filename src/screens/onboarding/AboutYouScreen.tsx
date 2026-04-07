import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SelectionCard } from '../../components/SelectionCard';
import { ChipSelect } from '../../components/ChipSelect';
import { useUserStore } from '../../store/userStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import { colors } from '../../constants/colors';
import { fonts, fontSizes } from '../../constants/typography';
import type { OnboardingStackParamList } from '../../types';

const REASONS = [
  'Recently diagnosed with PCOS',
  'Managing PCOS for a while',
  'I think I might have PCOS',
  'Want to understand my hormones better',
];

const SYMPTOMS = [
  'Cramps',
  'Bloating',
  'Fatigue',
  'Mood swings',
  'Acne',
  'Cravings',
  'Brain fog',
  'Hair thinning',
  'Trouble sleeping',
];

type Props = NativeStackScreenProps<OnboardingStackParamList, 'AboutYou'>;

export function AboutYouScreen({ navigation }: Props) {
  const [reason, setReason] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const userName = useUserStore((s) => s.userName);
  const store = useOnboardingStore();

  const toggleSymptom = (symptom: string) => {
    setSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleNext = () => {
    if (reason) store.setReason(reason);
    store.setHardDaySymptoms(symptoms);
    navigation.navigate('QuickInfo');
  };

  return (
    <OnboardingLayout
      title={`${userName}, tell us about you`}
      subtitle="This helps Thriya understand your journey from day one."
      onNext={handleNext}
      canProceed={reason !== null && symptoms.length > 0}
    >
      <Text style={styles.sectionLabel}>What brings you here?</Text>
      {REASONS.map((r) => (
        <SelectionCard
          key={r}
          label={r}
          selected={reason === r}
          onPress={() => setReason(r)}
        />
      ))}

      <Text style={styles.sectionLabel}>What bothers you most?</Text>
      <ChipSelect
        options={SYMPTOMS}
        selected={symptoms}
        onToggle={toggleSymptom}
      />
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.sectionTitle,
    color: colors.primary,
    marginTop: 24,
    marginBottom: 12,
  },
});
