import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../constants/colors';
import { fonts, fontSizes } from '../constants/typography';
import { MoodSelector } from '../components/MoodSelector';
import { OptionRow } from '../components/OptionRow';
import { ChipSelect } from '../components/ChipSelect';

const SLEEP_OPTIONS = ['Poor', 'Okay', 'Good', 'Great'];
const FOOD_OPTIONS = ['Light', 'Balanced', 'Heavier', 'Skipped'];
const SYMPTOM_OPTIONS = [
  'Cramps',
  'Bloating',
  'Headache',
  'Fatigue',
  'Acne',
  'Cravings',
  'Brain fog',
  'Mood swings',
  'Hair loss',
];

export function LogScreen() {
  const [mood, setMood] = useState<string | null>(null);
  const [sleep, setSleep] = useState<string | null>(null);
  const [food, setFood] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

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
    // TODO: Save to Supabase when auth is ready
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
          <Text style={styles.savedTitle}>Logged</Text>
          <Text style={styles.savedMessage}>
            {getAcknowledgement(mood, sleep, symptoms)}
          </Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <Text style={styles.resetText}>Log again</Text>
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
        <Text style={styles.heading}>How are you today?</Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Mood</Text>
          <MoodSelector selected={mood} onSelect={setMood} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Sleep last night</Text>
          <OptionRow options={SLEEP_OPTIONS} selected={sleep} onSelect={setSleep} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Eating today</Text>
          <OptionRow options={FOOD_OPTIONS} selected={food} onSelect={setFood} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Any symptoms?</Text>
          <ChipSelect
            options={SYMPTOM_OPTIONS}
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
          <Text style={styles.saveButtonText}>Save today's log</Text>
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
    return 'Fatigue and symptoms together can be tough \u2014 your coach can help you make sense of it.';
  }
  if (mood === 'low' || mood === 'anxious') {
    return 'Noted. If this keeps showing up, your coach can dig into what might be driving it.';
  }
  if (sleep === 'Poor') {
    return 'Rough night. Sleep and hormones are deeply connected \u2014 ask your coach if you want to know more.';
  }
  if (mood === 'good' || mood === 'calm') {
    return 'Good to hear. Logging the good days matters too \u2014 it helps Thriya spot your patterns.';
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
    marginBottom: 24,
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
