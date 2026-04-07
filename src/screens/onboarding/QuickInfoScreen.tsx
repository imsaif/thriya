import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChipSelect } from '../../components/ChipSelect';
import { SelectionCard } from '../../components/SelectionCard';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useCycleStore } from '../../store/cycleStore';
import { useTranslation } from '../../hooks/useTranslation';
import { colors } from '../../constants/colors';
import { fonts, fontSizes } from '../../constants/typography';
import type { OnboardingStackParamList } from '../../types';

interface Question {
  key: string;
  title: string;
  subtitle?: string;
  type: 'chips' | 'cards';
  options: string[];
}

type Props = NativeStackScreenProps<OnboardingStackParamList, 'QuickInfo'>;

export function QuickInfoScreen({ navigation }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [transitioning, setTransitioning] = useState(false);
  const store = useOnboardingStore();
  const setLastPeriodStart = useCycleStore((s) => s.setLastPeriodStart);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const t = useTranslation();

  const periodOptions = [
    'This week',
    '1 week ago',
    '2 weeks ago',
    '3 weeks ago',
    '4+ weeks ago',
    'I don\'t remember',
  ];

  const questions: Question[] = useMemo(() => [
    { key: 'age', title: t.quickInfoAge, type: 'chips' as const, options: ['18\u201324', '25\u201330', '31\u201335', '36\u201340', '40+'] },
    { key: 'cycle', title: t.quickInfoCycle, type: 'cards' as const, options: [t.regular, t.irregular, t.veryIrregular, t.notSure] },
    { key: 'ttc', title: t.quickInfoTtc, type: 'cards' as const, options: [t.yes, t.no, t.maybeSomeday, t.preferNotToSay] },
    { key: 'period', title: 'When did your last period start?', subtitle: 'An estimate is fine. This helps Thriya track your cycle.', type: 'cards' as const, options: periodOptions },
  ], [t, periodOptions]);

  const current = questions[step];
  const selectedValue = answers[current.key] ?? null;

  const transitionTo = useCallback(
    (nextStep: number, onComplete?: () => void) => {
      setTransitioning(true);
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
      if (step < questions.length - 1) {
        transitionTo(step + 1);
      } else {
        transitionTo(step, () => {
          store.setAgeRange(updated.age);
          store.setCycleRegularity(updated.cycle);
          store.setTryingToConceive(updated.ttc);

          const periodDate = periodAnswerToDate(updated.period);
          if (periodDate) {
            setLastPeriodStart(periodDate);
          }

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
        <Text style={styles.backText}>{t.back}</Text>
      </TouchableOpacity>

      <View style={styles.progress}>
        {questions.map((_, i) => (
          <View key={i} style={[styles.dot, i <= step && styles.dotActive]} />
        ))}
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>{current.title}</Text>
        {current.subtitle && (
          <Text style={styles.subtitle}>{current.subtitle}</Text>
        )}

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

function periodAnswerToDate(answer: string): Date | null {
  const today = new Date();
  if (answer === 'This week') {
    today.setDate(today.getDate() - 3);
    return today;
  }
  if (answer === '1 week ago') {
    today.setDate(today.getDate() - 7);
    return today;
  }
  if (answer === '2 weeks ago') {
    today.setDate(today.getDate() - 14);
    return today;
  }
  if (answer === '3 weeks ago') {
    today.setDate(today.getDate() - 21);
    return today;
  }
  if (answer === '4+ weeks ago') {
    today.setDate(today.getDate() - 28);
    return today;
  }
  return null;
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
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.mutedText,
    marginBottom: 20,
    lineHeight: 20,
  },
});
