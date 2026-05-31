import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChipSelect } from '../../components/ChipSelect';
import { SelectionCard } from '../../components/SelectionCard';
import { H1, H3, Body, BodySm } from '../../components/Text';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useCycleStore } from '../../store/cycleStore';
import { useTranslation } from '../../hooks/useTranslation';
import { colors } from '../../constants/colors';
import type { OnboardingStackParamList } from '../../types';

interface Question {
  key: string;
  title: string;
  subtitle?: string;
  type: 'chips' | 'cards' | 'date';
  options?: string[];
}

type Props = NativeStackScreenProps<OnboardingStackParamList, 'QuickInfo'>;

export function QuickInfoScreen({ navigation }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [periodDate, setPeriodDate] = useState<Date | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const store = useOnboardingStore();
  const setLastPeriodStart = useCycleStore((s) => s.setLastPeriodStart);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const t = useTranslation();

  const questions: Question[] = useMemo(() => [
    { key: 'age', title: t.quickInfoAge, type: 'chips' as const, options: ['18\u201324', '25\u201330', '31\u201335', '36\u201340', '40+'] },
    { key: 'cycle', title: t.quickInfoCycle, type: 'cards' as const, options: [t.regular, t.irregular, t.veryIrregular, t.notSure] },
    { key: 'period', title: 'When did your last period start?', subtitle: 'Pick the date, or skip if you are not sure.', type: 'date' as const },
    { key: 'ttc', title: t.quickInfoTtc, type: 'cards' as const, options: [t.yes, t.no, t.maybeSomeday, t.preferNotToSay] },
  ], [t]);

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

  const finishOnboarding = useCallback((finalAnswers: Record<string, string>) => {
    store.setAgeRange(finalAnswers.age);
    store.setCycleRegularity(finalAnswers.cycle);
    store.setTryingToConceive(finalAnswers.ttc);
    if (periodDate) {
      setLastPeriodStart(periodDate);
    }
    navigation.navigate('CoachReady');
  }, [store, periodDate, setLastPeriodStart, navigation]);

  const handleSelect = (value: string) => {
    if (transitioning) return;
    const updated = { ...answers, [current.key]: value };
    setAnswers(updated);

    setTimeout(() => {
      if (step < questions.length - 1) {
        transitionTo(step + 1);
      } else {
        transitionTo(step, () => finishOnboarding(updated));
      }
    }, 400);
  };

  const handleDateConfirm = () => {
    if (transitioning) return;
    const updated = { ...answers, period: 'set' };
    setAnswers(updated);

    if (step < questions.length - 1) {
      transitionTo(step + 1);
    } else {
      transitionTo(step, () => finishOnboarding(updated));
    }
  };

  const handleDateSkip = () => {
    if (transitioning) return;
    setPeriodDate(null);
    const updated = { ...answers, period: 'skipped' };
    setAnswers(updated);

    if (step < questions.length - 1) {
      transitionTo(step + 1);
    } else {
      transitionTo(step, () => finishOnboarding(updated));
    }
  };

  const handleBack = () => {
    if (transitioning) return;
    if (step > 0) {
      transitionTo(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const today = new Date();
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.6}>
        <ChevronLeftIcon size={20} color={colors.primary} />
        <Body>{t.back}</Body>
      </TouchableOpacity>

      <View style={styles.progress}>
        {questions.map((_, i) => (
          <View key={i} style={[styles.dot, i <= step && styles.dotActive]} />
        ))}
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <H1 style={{ marginBottom: 8 }}>{current.title}</H1>
        {current.subtitle && (
          <BodySm style={{ marginBottom: 20 }}>{current.subtitle}</BodySm>
        )}

        {current.type === 'date' ? (
          <View>
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={periodDate ?? today}
                mode="date"
                display="spinner"
                maximumDate={today}
                minimumDate={sixtyDaysAgo}
                onChange={(_, date) => {
                  if (date) setPeriodDate(date);
                }}
                textColor={colors.primary}
                style={styles.datePicker}
              />
            </View>

            <TouchableOpacity
              style={styles.dateConfirmButton}
              onPress={handleDateConfirm}
              activeOpacity={0.8}
            >
              <H3 color={colors.white}>{t.continue}</H3>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleDateSkip}
              activeOpacity={0.6}
            >
              <BodySm>I'm not sure, skip this</BodySm>
            </TouchableOpacity>
          </View>
        ) : current.type === 'chips' ? (
          <ChipSelect
            options={current.options ?? []}
            selected={selectedValue ? [selectedValue] : []}
            onToggle={handleSelect}
          />
        ) : (
          (current.options ?? []).map((option) => (
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
  datePickerContainer: {
    backgroundColor: colors.white,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
  },
  datePicker: {
    height: 180,
  },
  dateConfirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
});
