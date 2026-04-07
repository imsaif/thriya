import React, { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SelectionCard } from '../../components/SelectionCard';
import { useUserStore } from '../../store/userStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import type { OnboardingStackParamList } from '../../types';

const REASONS = [
  'I was recently diagnosed with PCOS',
  'I have been managing PCOS for a while',
  'I think I might have PCOS',
  'I want to understand my hormonal health better',
  'Someone recommended this to me',
];

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Reason'>;

export function ReasonScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const userName = useUserStore((s) => s.userName);
  const setReason = useOnboardingStore((s) => s.setReason);

  const handleNext = () => {
    if (selected) setReason(selected);
    navigation.navigate('HardDay');
  };

  return (
    <OnboardingLayout
      title={`${userName}, what brings you here?`}
      subtitle="This helps Thriya understand where you are in your journey."
      onNext={handleNext}
      canProceed={selected !== null}
    >
      {REASONS.map((reason) => (
        <SelectionCard
          key={reason}
          label={reason}
          selected={selected === reason}
          onPress={() => setSelected(reason)}
        />
      ))}
    </OnboardingLayout>
  );
}
