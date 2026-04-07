import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SelectionCard } from '../../components/SelectionCard';
import { ChipSelect } from '../../components/ChipSelect';
import { useUserStore } from '../../store/userStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useTranslation } from '../../hooks/useTranslation';
import { colors } from '../../constants/colors';
import { fonts, fontSizes } from '../../constants/typography';
import type { OnboardingStackParamList } from '../../types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'AboutYou'>;

export function AboutYouScreen({ navigation }: Props) {
  const [reason, setReason] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const userName = useUserStore((s) => s.userName);
  const store = useOnboardingStore();
  const t = useTranslation();

  const reasons = [t.reasonDiagnosed, t.reasonManaging, t.reasonMightHave, t.reasonUnderstand];
  const symptomOptions = [t.cramps, t.bloating, t.fatigue, t.moodSwings, t.acne, t.cravings, t.brainFog, t.hairThinning, t.troubleSleeping];

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
      title={`${userName}${t.aboutYouTitle}`}
      subtitle={t.aboutYouSubtitle}
      onNext={handleNext}
      canProceed={reason !== null && symptoms.length > 0}
      buttonLabel={t.continue}
    >
      <Text style={styles.sectionLabel}>{t.whatBringsYou}</Text>
      {reasons.map((r) => (
        <SelectionCard
          key={r}
          label={r}
          selected={reason === r}
          onPress={() => setReason(r)}
        />
      ))}

      <Text style={styles.sectionLabel}>{t.whatBothersYou}</Text>
      <ChipSelect
        options={symptomOptions}
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
