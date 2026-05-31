import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperAirplaneIcon } from 'react-native-heroicons/solid';
import { colors } from '../constants/colors';
import { textStyles } from '../constants/typography';
import { H1, H3, Body, BodySm } from '../components/Text';
import { CoachMessage } from '../components/CoachMessage';
import { sendCoachMessage } from '../services/claude';
import { useUserStore } from '../store/userStore';
import { useTranslation } from '../hooks/useTranslation';
import type { ConversationMessage, UserContext } from '../services/claude';

export function CoachScreen() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const userName = useUserStore((s) => s.userName);
  const coachLanguage = useUserStore((s) => s.coachLanguage);
  const t = useTranslation();

  const handleSend = async () => {
    const text = input.trim();
    if (text.length === 0 || loading) return;

    const userMessage: ConversationMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    const context: UserContext = {
      name: userName ?? '',
      language: coachLanguage,
      cycleDay: 0,
      phase: 'unknown',
      daysUntilPeriod: null,
      recentSymptoms: [],
      recentMood: null,
      onboardingReason: null,
    };

    const reply = await sendCoachMessage(updatedMessages, context);

    setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <H3>{t.yourCoach}</H3>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        {messages.length === 0 ? (
          <TouchableOpacity
            style={styles.emptyState}
            activeOpacity={1}
            onPress={Keyboard.dismiss}
          >
            <H1 style={{ marginBottom: 12 }}>Hi {userName}</H1>
            <Body color={colors.mutedText}>{t.coachEmptySubtitle}</Body>
          </TouchableOpacity>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <CoachMessage role={item.role} content={item.content} />
            )}
            contentContainerStyle={styles.messageList}
            keyboardDismissMode="interactive"
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />
        )}

        {loading && (
          <View style={styles.typingRow}>
            <BodySm style={{ fontStyle: 'italic' }}>{t.thinking}</BodySm>
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder={t.askYourCoach}
            placeholderTextColor={colors.mutedText}
            multiline
            maxLength={1000}
            editable={!loading}
            returnKeyType="default"
          />
          <TouchableOpacity
            style={[styles.sendButton, (input.trim().length === 0 || loading) && styles.sendDisabled]}
            onPress={handleSend}
            disabled={input.trim().length === 0 || loading}
            activeOpacity={0.7}
          >
            <PaperAirplaneIcon size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  messageList: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  typingRow: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    ...textStyles.body,
    color: colors.primary,
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 12,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendDisabled: {
    opacity: 0.4,
  },
});
