import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperAirplaneIcon } from 'react-native-heroicons/solid';
import { colors } from '../constants/colors';
import { fonts, fontSizes } from '../constants/typography';
import { CoachMessage } from '../components/CoachMessage';
import { sendCoachMessage } from '../services/claude';
import { useUserStore } from '../store/userStore';
import type { ConversationMessage, UserContext } from '../services/claude';

export function CoachScreen() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const userName = useUserStore((s) => s.userName);

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
        <Text style={styles.headerTitle}>Your Coach</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Hi {userName}</Text>
            <Text style={styles.emptySubtitle}>
              Ask me anything about PCOS, your cycle, nutrition, or how you are
              feeling. I am here to help.
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <CoachMessage role={item.role} content={item.content} />
            )}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />
        )}

        {loading && (
          <View style={styles.typingRow}>
            <Text style={styles.typingText}>Thinking...</Text>
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask your coach..."
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
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.sectionTitle,
    color: colors.primary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.appTitle,
    color: colors.primary,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    color: colors.mutedText,
    lineHeight: 24,
  },
  messageList: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  typingRow: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  typingText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.mutedText,
    fontStyle: 'italic',
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
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
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
