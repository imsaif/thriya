import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SelectionCard } from '../../components/SelectionCard';
import { colors } from '../../constants/colors';
import { fonts, fontSizes } from '../../constants/typography';
import { useOnboardingStore } from '../../store/onboardingStore';
import type { OnboardingStackParamList } from '../../types';

const AGE_RANGES = ['18–24', '25–30', '31–35', '36–40', '40+'];
const CYCLE_OPTIONS = ['Regular', 'Irregular', 'Very irregular', 'I am not sure'];
const TTC_OPTIONS = ['Yes', 'No', 'Maybe someday', 'Prefer not to say'];

type Props = NativeStackScreenProps<OnboardingStackParamList, 'QuickInfo'>;

export function QuickInfoScreen({ navigation }: Props) {
  const [ageRange, setAgeRange] = useState<string | null>(null);
  const [cycleRegularity, setCycleRegularity] = useState<string | null>(null);
  const [ttc, setTtc] = useState<string | null>(null);
  const store = useOnboardingStore();

  const canProceed = ageRange !== null && cycleRegularity !== null && ttc !== null;

  const handleNext = () => {
    if (ageRange) store.setAgeRange(ageRange);
    if (cycleRegularity) store.setCycleRegularity(cycleRegularity);
    if (ttc) store.setTryingToConceive(ttc);
    navigation.navigate('CoachReady');
  };

  return (
    <OnboardingLayout
      title="A few quick things"
      subtitle="This helps Thriya personalise your experience from day one."
      onNext={handleNext}
      canProceed={canProceed}
    >
      <Text style={styles.sectionLabel}>Age range</Text>
      <View style={styles.row}>
        {AGE_RANGES.map((age) => (
          <SelectionCard
            key={age}
            label={age}
            selected={ageRange === age}
            onPress={() => setAgeRange(age)}
          />
        ))}
      </View>

      <Text style={styles.sectionLabel}>How regular is your cycle?</Text>
      {CYCLE_OPTIONS.map((option) => (
        <SelectionCard
          key={option}
          label={option}
          selected={cycleRegularity === option}
          onPress={() => setCycleRegularity(option)}
        />
      ))}

      <Text style={styles.sectionLabel}>Are you trying to conceive?</Text>
      {TTC_OPTIONS.map((option) => (
        <SelectionCard
          key={option}
          label={option}
          selected={ttc === option}
          onPress={() => setTtc(option)}
        />
      ))}
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
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
