import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { textStyles } from '../constants/typography';
import { H1, H3, Body } from '../components/Text';
import { saveName } from '../services/pin';
import { useUserStore } from '../store/userStore';

export function WelcomeNameScreen() {
  const [name, setName] = useState('');
  const setUserName = useUserStore((s) => s.setUserName);

  const handleContinue = async () => {
    const trimmed = name.trim();
    if (trimmed.length === 0) return;

    // TODO: Re-enable for production
    // await saveName(trimmed);
    setUserName(trimmed);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <View style={styles.content}>
          <H1 align="center" style={{ marginBottom: 8 }}>Welcome to Thriya</H1>
          <Body color={colors.mutedText} align="center" style={{ marginBottom: 40 }}>
            What should we call you?
          </Body>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your first name"
            placeholderTextColor={colors.mutedText}
            autoCapitalize="words"
            autoCorrect={false}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleContinue}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, name.trim().length === 0 && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={name.trim().length === 0}
          activeOpacity={0.8}
        >
          <H3 color={colors.white}>Continue</H3>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  inner: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    ...textStyles.bodyLg,
    color: colors.primary,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
});
