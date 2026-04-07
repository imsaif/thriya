import React, { useCallback, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useUserStore } from './src/store/userStore';
import { hasPinConfigured, getSavedName } from './src/services/pin';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const setUserName = useUserStore((s) => s.setUserName);
  const setHasPinSetup = useUserStore((s) => s.setHasPinSetup);
  const setUnlocked = useUserStore((s) => s.setUnlocked);

  useEffect(() => {
    async function prepare() {
      await Font.loadAsync({
        'Satoshi-Regular': require('./assets/fonts/Satoshi-Regular.ttf'),
        'Satoshi-Bold': require('./assets/fonts/Satoshi-Bold.ttf'),
      });

      const name = await getSavedName();
      if (name) {
        setUserName(name);
      }

      const pinExists = await hasPinConfigured();
      setHasPinSetup(pinExists);

      setAppReady(true);
    }

    prepare();
  }, [setUserName, setHasPinSetup]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextState: AppStateStatus) => {
        if (nextState === 'background') {
          setUnlocked(false);
        }
      }
    );
    return () => subscription.remove();
  }, [setUnlocked]);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <StatusBar style="dark" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}
