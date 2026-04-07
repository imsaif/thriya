import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AboutYouScreen } from '../screens/onboarding/AboutYouScreen';
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
      <Stack.Screen name="AboutYou" component={AboutYouScreen} />
      <Stack.Screen name="QuickInfo" component={QuickInfoScreen} />
      <Stack.Screen name="CoachReady" component={CoachReadyScreen} />
    </Stack.Navigator>
  );
}
