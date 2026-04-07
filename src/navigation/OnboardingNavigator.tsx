import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ReasonScreen } from '../screens/onboarding/ReasonScreen';
import { HardDayScreen } from '../screens/onboarding/HardDayScreen';
import { FoodScreen } from '../screens/onboarding/FoodScreen';
import { QuickInfoScreen } from '../screens/onboarding/QuickInfoScreen';
import { CoachReadyScreen } from '../screens/onboarding/CoachReadyScreen';
import type { OnboardingStackParamList } from '../types';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Reason" component={ReasonScreen} />
      <Stack.Screen name="HardDay" component={HardDayScreen} />
      <Stack.Screen name="Food" component={FoodScreen} />
      <Stack.Screen name="QuickInfo" component={QuickInfoScreen} />
      <Stack.Screen name="CoachReady" component={CoachReadyScreen} />
    </Stack.Navigator>
  );
}
