import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  HomeIcon as HomeOutline,
  PencilSquareIcon as PencilOutline,
  ChatBubbleLeftIcon as ChatOutline,
  ChartBarIcon as ChartOutline,
} from 'react-native-heroicons/outline';
import {
  HomeIcon as HomeSolid,
  PencilSquareIcon as PencilSolid,
  ChatBubbleLeftIcon as ChatSolid,
  ChartBarIcon as ChartSolid,
} from 'react-native-heroicons/solid';
import { colors } from '../constants/colors';
import { fonts, fontSizes } from '../constants/typography';
import { useUserStore } from '../store/userStore';
import { WelcomeNameScreen } from '../screens/WelcomeNameScreen';
import { PinSetupScreen } from '../screens/PinSetupScreen';
import { PinLockScreen } from '../screens/PinLockScreen';
import { OnboardingNavigator } from './OnboardingNavigator';
import { HomeScreen } from '../screens/HomeScreen';
import { LogScreen } from '../screens/LogScreen';
import { CoachScreen } from '../screens/CoachScreen';
import { InsightsScreen } from '../screens/InsightsScreen';
import type { RootStackParamList, MainTabParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedText,
        tabBarLabelStyle: {
          fontFamily: fonts.regular,
          fontSize: fontSizes.micro,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) =>
            focused
              ? <HomeSolid size={22} color={color} />
              : <HomeOutline size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Log"
        component={LogScreen}
        options={{
          tabBarIcon: ({ focused, color }) =>
            focused
              ? <PencilSolid size={22} color={color} />
              : <PencilOutline size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Coach"
        component={CoachScreen}
        options={{
          tabBarIcon: ({ focused, color }) =>
            focused
              ? <ChatSolid size={22} color={color} />
              : <ChatOutline size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Insights"
        component={InsightsScreen}
        options={{
          tabBarIcon: ({ focused, color }) =>
            focused
              ? <ChartSolid size={22} color={color} />
              : <ChartOutline size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const userName = useUserStore((s) => s.userName);
  const hasPinSetup = useUserStore((s) => s.hasPinSetup);
  const isUnlocked = useUserStore((s) => s.isUnlocked);
  const onboardingComplete = useUserStore((s) => s.onboardingComplete);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {!userName ? (
          <Stack.Screen name="WelcomeName" component={WelcomeNameScreen} />
        ) : !onboardingComplete ? (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
