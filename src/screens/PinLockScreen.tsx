import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { H1, Body, BodySm } from '../components/Text';
import { PinDots } from '../components/PinDots';
import { PinKeypad } from '../components/PinKeypad';
import { verifyPin, attemptBiometric } from '../services/pin';
import { useUserStore } from '../store/userStore';

export function PinLockScreen() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const userName = useUserStore((s) => s.userName);
  const setUnlocked = useUserStore((s) => s.setUnlocked);

  useEffect(() => {
    void (async () => {
      const success = await attemptBiometric();
      if (success) {
        setUnlocked(true);
      }
    })();
  }, [setUnlocked]);

  const handleDigit = useCallback(
    (digit: string) => {
      if (pin.length >= 4 || attempts >= 5) return;
      const newPin = pin + digit;
      setPin(newPin);
      setError(false);

      if (newPin.length === 4) {
        void (async () => {
          const valid = await verifyPin(newPin);
          if (valid) {
            setUnlocked(true);
          } else {
            setError(true);
            setAttempts((prev) => prev + 1);
            setTimeout(() => {
              setPin('');
              setError(false);
            }, 600);
          }
        })();
      }
    },
    [pin, attempts, setUnlocked]
  );

  const handleBackspace = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <H1 align="center" style={{ marginBottom: 8 }}>
          Welcome back{userName ? `, ${userName}` : ''}
        </H1>
        <Body color={colors.mutedText} align="center">Enter your PIN</Body>

        <PinDots filledCount={pin.length} error={error} />

        {error && attempts < 5 && (
          <BodySm color="#C0392B" align="center">Wrong PIN. Try again.</BodySm>
        )}
        {attempts >= 5 && (
          <BodySm color="#C0392B" align="center">
            Too many attempts. Please wait a moment.
          </BodySm>
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
});
