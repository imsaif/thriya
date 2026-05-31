import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../constants/colors';
import { H1, H3, Body, Label } from '../components/Text';
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
          <H1 style={{ marginBottom: 12 }}>{t.logged}</H1>
          <Body color={colors.mutedText} style={{ marginBottom: 32 }}>
            {getAcknowledgement(mood, sleep, symptoms)}
          </Body>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <Label color={colors.primary}>{t.logAgain}</Label>
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
        <H1 style={{ marginBottom: 20 }}>{t.howAreYouToday}</H1>

        <View style={styles.section}>
          <H3 style={{ marginBottom: 12 }}>{t.mood}</H3>
          <MoodSelector selected={mood} onSelect={setMood} />
        </View>

        <View style={styles.section}>
          <H3 style={{ marginBottom: 12 }}>{t.sleepLastNight}</H3>
          <OptionRow options={sleepOptions} selected={sleep} onSelect={setSleep} />
        </View>

        <View style={styles.section}>
          <H3 style={{ marginBottom: 12 }}>{t.eatingToday}</H3>
          <OptionRow options={foodOptions} selected={food} onSelect={setFood} />
        </View>

        <View style={styles.section}>
          <H3 style={{ marginBottom: 12 }}>{t.anySymptoms}</H3>
          <ChipSelect
            options={symptomOptions}
            selected={symptoms}
            onToggle={toggleSymptom}
          />
        </View>

        <TouchableOpacity
          style={[styles.periodButton, periodLogged && styles.periodButtonLogged]}
          onPress={handleLogPeriod}
          disabled={periodLogged}
          activeOpacity={0.7}
        >
          <View style={[styles.periodIcon, periodLogged && styles.periodIconLogged]} />
          <Body color={periodLogged ? colors.mutedText : colors.primary}>
            {periodLogged ? 'Period logged for today' : 'My period started today'}
          </Body>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!canSave}
          activeOpacity={0.8}
        >
          <H3 color={colors.white}>{t.saveTodaysLog}</H3>
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
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    gap: 12,
  },
  periodButtonLogged: {
    backgroundColor: colors.card,
    borderColor: colors.card,
    borderStyle: 'solid',
  },
  periodIcon: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  periodIconLogged: {
    backgroundColor: colors.mutedText,
  },
  section: {
    marginBottom: 28,
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
  savedContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  resetButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
});
