import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { fonts, fontSizes } from '../constants/typography';
import { PinDots } from '../components/PinDots';
import { PinKeypad } from '../components/PinKeypad';
import { setupPin } from '../services/pin';
import { useUserStore } from '../store/userStore';

type Step = 'create' | 'confirm';

export function PinSetupScreen() {
  const [step, setStep] = useState<Step>('create');
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState(false);
  const userName = useUserStore((s) => s.userName);
  const setHasPinSetup = useUserStore((s) => s.setHasPinSetup);
  const setUnlocked = useUserStore((s) => s.setUnlocked);

  const handleDigit = useCallback(
    (digit: string) => {
      if (pin.length >= 4) return;
      const newPin = pin + digit;
      setPin(newPin);
      setError(false);

      if (newPin.length === 4) {
        if (step === 'create') {
          setFirstPin(newPin);
          setPin('');
          setStep('confirm');
        } else {
          if (newPin === firstPin) {
            void (async () => {
              await setupPin(newPin);
              setHasPinSetup(true);
              setUnlocked(true);
            })();
          } else {
            setError(true);
            setTimeout(() => {
              setPin('');
              setError(false);
            }, 600);
          }
        }
      }
    },
    [pin, step, firstPin, setHasPinSetup, setUnlocked]
  );

  const handleBackspace = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.greeting}>
          {step === 'create'
            ? `Hi ${userName ?? ''}, let\u2019s secure your data`
            : 'Confirm your PIN'}
        </Text>
        <Text style={styles.subtitle}>
          {step === 'create'
            ? 'Choose a 4-digit PIN'
            : 'Enter the same PIN again'}
        </Text>

        <PinDots filledCount={pin.length} error={error} />

        {error && (
          <Text style={styles.errorText}>PINs didn't match. Try again.</Text>
        )}
      </View>

      <PinKeypad onDigitPress={handleDigit} onBackspace={handleBackspace} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  greeting: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.appTitle,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    color: colors.mutedText,
    textAlign: 'center',
  },
  errorText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: '#C0392B',
    textAlign: 'center',
  },
});
