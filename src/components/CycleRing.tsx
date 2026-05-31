import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../constants/colors';
import { fonts } from '../constants/typography';
import { BodySm } from './Text';

interface CycleRingProps {
  dayOfCycle: number;
  cycleLength: number;
  phaseLabel: string;
}

const SIZE = 180;
const STROKE_WIDTH = 10;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const PHASE_COLORS: Record<string, string> = {
  menstrual: '#C0392B',
  follicular: '#6B8F71',
  ovulatory: '#D4A48E',
  luteal: '#8E6B9E',
  unknown: colors.border,
};

function getPhaseFromDay(day: number): string {
  if (day <= 5) return 'menstrual';
  if (day <= 12) return 'follicular';
  if (day <= 16) return 'ovulatory';
  return 'luteal';
}

export function CycleRing({ dayOfCycle, cycleLength, phaseLabel }: CycleRingProps) {
  const progress = cycleLength > 0 ? dayOfCycle / cycleLength : 0;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const phase = getPhaseFromDay(dayOfCycle);
  const phaseColor = PHASE_COLORS[phase];

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={colors.border}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={phaseColor}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${SIZE / 2}, ${SIZE / 2}`}
        />
      </Svg>
      <View style={styles.centerText}>
        <Text style={styles.dayNumber}>{dayOfCycle}</Text>
        <BodySm style={{ marginTop: 2 }}>{phaseLabel}</BodySm>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
  },
  // Bespoke ring centerpiece number — 40px, no role fits.
  dayNumber: {
    fontFamily: fonts.bold,
    fontSize: 40,
    color: colors.primary,
  },
});
