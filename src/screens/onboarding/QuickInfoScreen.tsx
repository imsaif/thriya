import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChipSelect } from '../../components/ChipSelect';
import { SelectionCard } from '../../components/SelectionCard';
import { useOnboardingStore } from '../../store/onboardingStore';
import { colors } from '../../constants/colors';
import { fonts, fontSizes } from '../../constants/typography';
import type { OnboardingStackParamList } from '../../types';

const AGE_RANGES = ['18–24', '25–30', '31–35', '36–40', '40+'];
const CYCLE_OPTIONS = ['Regular', 'Irregular', 'Very irregular', 'Not sure'];
const TTC_OPTIONS = ['Yes', 'No', 'Maybe someday', 'Prefer not to say'];

interface Question {
  key: string;
  title: string;
  type: 'chips' | 'cards';
  options: string[];
}

const QUESTIONS: Question[] = [
  { key: 'age', title: 'What is your age range?', type: 'chips', options: AGE_RANGES },
  { key: 'cycle', title: 'How regular is your cycle?', type: 'cards', options: CYCLE_OPTIONS },
  { key: 'ttc', title: 'Are you trying to conceive?', type: 'cards', options: TTC_OPTIONS },
];

type Props = NativeStackScreenProps<OnboardingStackParamList, 'QuickInfo'>;

export function QuickInfoScreen({ navigation }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [transitioning, setTransitioning] = useState(false);
  const store = useOnboardingStore();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const current = QUESTIONS[step];
  const selectedValue = answers[current.key] ?? null;

  const transitionTo = useCallback(
    (nextStep: number, onComplete?: () => void) => {
      setTransitioning(true);
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        if (onComplete) {
          onComplete();
        } else {
          setStep(nextStep);
        }
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setTransitioning(false);
        });
      });
    },
    [fadeAnim]
  );

  const handleSelect = (value: string) => {
    if (transitioning) return;
    const updated = { ...answers, [current.key]: value };
    setAnswers(updated);

    setTimeout(() => {
      if (step < QUESTIONS.length - 1) {
        transitionTo(step + 1);
      } else {
        transitionTo(step, () => {
          store.setAgeRange(updated.age);
          store.setCycleRegularity(updated.cycle);
          store.setTryingToConceive(updated.ttc);
          navigation.navigate('CoachReady');
        });
      }
    }, 400);
  };

  const handleBack = () => {
    if (transitioning) return;
    if (step > 0) {
      transitionTo(step - 1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.6}>
        <ChevronLeftIcon size={20} color={colors.primary} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.progress}>
        {QUESTIONS.map((_, i) => (
          <View key={i} style={[styles.dot, i <= step && styles.dotActive]} />
        ))}
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>{current.title}</Text>

        {current.type === 'chips' ? (
          <ChipSelect
            options={current.options}
            selected={selectedValue ? [selectedValue] : []}
            onToggle={handleSelect}
          />
        ) : (
          current.options.map((option) => (
            <SelectionCard
              key={option}
              label={option}
              selected={selectedValue === option}
              onPress={() => handleSelect(option)}
            />
          ))
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 4,
  },
  backText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    color: colors.primary,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 20,
    paddingBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.appTitle,
    color: colors.primary,
    marginBottom: 24,
  },
});
