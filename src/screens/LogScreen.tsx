import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../constants/colors';
import { fonts, fontSizes } from '../constants/typography';
import { MoodSelector } from '../components/MoodSelector';
import { OptionRow } from '../components/OptionRow';
import { ChipSelect } from '../components/ChipSelect';
import { useTranslation } from '../hooks/useTranslation';
import { useCycleStore } from '../store/cycleStore';

export function LogScreen() {
  const [mood, setMood] = useState<string | null>(null);
  const [sleep, setSleep] = useState<string | null>(null);
  const [food, setFood] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [periodLogged, setPeriodLogged] = useState(false);
  const t = useTranslation();
  const setLastPeriodStart = useCycleStore((s) => s.setLastPeriodStart);

  const handleLogPeriod = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLastPeriodStart(new Date());
    setPeriodLogged(true);
  };

  const sleepOptions = [t.poor, t.okay, t.good, t.great];
  const foodOptions = [t.light, t.balanced, t.heavier, t.skipped];
  const symptomOptions = [t.cramps, t.bloating, t.headache, t.fatigue, t.acne, t.cravings, t.brainFog, t.moodSwings, t.hairLoss];

  const canSave = mood !== null;

  const toggleSymptom = (symptom: string) => {
    setSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSave = () => {
    if (!canSave) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSaved(true);
  };

  const handleReset = () => {
    setMood(null);
    setSleep(null);
    setFood(null);
    setSymptoms([]);
    setSaved(false);
  };

  if (saved) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.savedContainer}>
          <Text style={styles.savedTitle}>{t.logged}</Text>
          <Text style={styles.savedMessage}>
            {getAcknowledgement(mood, sleep, symptoms)}
          </Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <Text style={styles.resetText}>{t.logAgain}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>{t.howAreYouToday}</Text>

        <TouchableOpacity
          style={[styles.periodButton, periodLogged && styles.periodButtonLogged]}
          onPress={handleLogPeriod}
          disabled={periodLogged}
          activeOpacity={0.7}
        >
          <Text style={styles.periodDot}>{'\u{1F534}'}</Text>
          <Text style={[styles.periodText, periodLogged && styles.periodTextLogged]}>
            {periodLogged ? 'Period started today' : 'My period started'}
          </Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t.mood}</Text>
          <MoodSelector selected={mood} onSelect={setMood} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t.sleepLastNight}</Text>
          <OptionRow options={sleepOptions} selected={sleep} onSelect={setSleep} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t.eatingToday}</Text>
          <OptionRow options={foodOptions} selected={food} onSelect={setFood} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t.anySymptoms}</Text>
          <ChipSelect
            options={symptomOptions}
            selected={symptoms}
            onToggle={toggleSymptom}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!canSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>{t.saveTodaysLog}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function getAcknowledgement(
  mood: string | null,
  sleep: string | null,
  symptoms: string[]
): string {
  if (symptoms.length > 0 && mood === 'tired') {
    return 'Fatigue and symptoms together can be tough. Your coach can help you make sense of it.';
  }
  if (mood === 'low' || mood === 'anxious') {
    return 'Noted. If this keeps showing up, your coach can dig into what might be driving it.';
  }
  if (sleep === 'Poor' || sleep === '\u0916\u0930\u093E\u092C' || sleep === '\u0C1A\u0C46\u0C21\u0C4D\u0C21\u0C17\u0C3E' || sleep === '\u0BAE\u0BCB\u0B9A\u0BAE\u0BCD') {
    return 'Rough night. Sleep and hormones are deeply connected. Ask your coach if you want to know more.';
  }
  if (mood === 'good' || mood === 'calm') {
    return 'Good to hear. Logging the good days matters too. It helps Thriya spot your patterns.';
  }
  return 'Logged. The more you track, the clearer your patterns become.';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  heading: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.appTitle,
    color: colors.primary,
    marginBottom: 20,
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: 10,
  },
  periodButtonLogged: {
    backgroundColor: colors.card,
    borderColor: colors.card,
  },
  periodDot: {
    fontSize: 16,
  },
  periodText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.body,
    color: colors.primary,
  },
  periodTextLogged: {
    fontFamily: fonts.regular,
    color: colors.mutedText,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.sectionTitle,
    color: colors.primary,
    marginBottom: 12,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 12,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.body,
    color: colors.white,
  },
  savedContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  savedTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.appTitle,
    color: colors.primary,
    marginBottom: 12,
  },
  savedMessage: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    color: colors.mutedText,
    lineHeight: 24,
    marginBottom: 32,
  },
  resetButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  resetText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.primary,
  },
});
