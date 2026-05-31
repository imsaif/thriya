import React, { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SelectionCard } from '../../components/SelectionCard';
import { ChipSelect } from '../../components/ChipSelect';
import { H3 } from '../../components/Text';
import { useUserStore } from '../../store/userStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useTranslation } from '../../hooks/useTranslation';
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
      <H3 style={{ marginTop: 24, marginBottom: 12 }}>{t.whatBringsYou}</H3>
      {reasons.map((r) => (
        <SelectionCard
          key={r}
          label={r}
          selected={reason === r}
          onPress={() => setReason(r)}
        />
      ))}

      <H3 style={{ marginTop: 24, marginBottom: 12 }}>{t.whatBothersYou}</H3>
      <ChipSelect
        options={symptomOptions}
        selected={symptoms}
        onToggle={toggleSymptom}
      />
    </OnboardingLayout>
  );
}
