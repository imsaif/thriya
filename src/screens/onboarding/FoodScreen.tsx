import React, { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SelectionCard } from '../../components/SelectionCard';
import { useOnboardingStore } from '../../store/onboardingStore';
import type { OnboardingStackParamList } from '../../types';

const OPTIONS = [
  'I eat well most of the time',
  'I try but it is hard to stay consistent',
  'I have tried many diets and nothing sticks',
  'I do not think much about what I eat',
  'Food is a source of stress for me',
];

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Food'>;

export function FoodScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const setFoodRelationship = useOnboardingStore((s) => s.setFoodRelationship);

  const handleNext = () => {
    if (selected) setFoodRelationship(selected);
    navigation.navigate('QuickInfo');
  };

  return (
    <OnboardingLayout
      title="How is your relationship with food?"
      subtitle="No judgement. This helps Thriya give you advice that actually fits your life."
      onNext={handleNext}
      canProceed={selected !== null}
    >
      {OPTIONS.map((option) => (
        <SelectionCard
          key={option}
          label={option}
          selected={selected === option}
          onPress={() => setSelected(option)}
        />
      ))}
    </OnboardingLayout>
  );
}
