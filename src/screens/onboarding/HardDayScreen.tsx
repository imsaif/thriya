import React, { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SelectionCard } from '../../components/SelectionCard';
import { useOnboardingStore } from '../../store/onboardingStore';
import type { OnboardingStackParamList } from '../../types';

const SYMPTOMS = [
  'Cramps that stop me in my tracks',
  'Bloating that makes nothing fit',
  'Fatigue no amount of sleep fixes',
  'Mood swings I can not predict',
  'Acne that flares without warning',
  'Cravings I can not control',
  'Brain fog that makes it hard to focus',
  'Hair thinning or loss',
  'Trouble sleeping',
];

type Props = NativeStackScreenProps<OnboardingStackParamList, 'HardDay'>;

export function HardDayScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const setHardDaySymptoms = useOnboardingStore((s) => s.setHardDaySymptoms);

  const toggle = (symptom: string) => {
    setSelected((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleNext = () => {
    setHardDaySymptoms(selected);
    navigation.navigate('Food');
  };

  return (
    <OnboardingLayout
      title="What does a hard day look like?"
      subtitle="Pick everything that hits. You can select more than one."
      onNext={handleNext}
      canProceed={selected.length > 0}
    >
      {SYMPTOMS.map((symptom) => (
        <SelectionCard
          key={symptom}
          label={symptom}
          selected={selected.includes(symptom)}
          onPress={() => toggle(symptom)}
        />
      ))}
    </OnboardingLayout>
  );
}
