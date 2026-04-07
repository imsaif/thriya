import Anthropic from '@anthropic-ai/sdk';
import { systemPrompt } from '../constants/systemPrompt';

const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;

const client = apiKey
  ? new Anthropic({ apiKey })
  : null;

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface UserContext {
  name: string;
  language: string;
  cycleDay: number;
  phase: string;
  daysUntilPeriod: number | null;
  recentSymptoms: string[];
  recentMood: string | null;
  onboardingReason: string | null;
}

function buildSystemPrompt(context: UserContext): string {
  return systemPrompt
    .replace('{{name}}', context.name)
    .replace('{{cycle_day}}', context.cycleDay.toString())
    .replace('{{phase}}', context.phase)
    .replace(
      '{{days_until_period}}',
      context.daysUntilPeriod?.toString() ?? 'unknown'
    )
    .replace(
      '{{recent_symptoms}}',
      context.recentSymptoms.length > 0
        ? context.recentSymptoms.join(', ')
        : 'none logged recently'
    )
    .replace('{{recent_mood}}', context.recentMood ?? 'not logged recently')
    .replace(
      '{{onboarding_reason}}',
      context.onboardingReason ?? 'not specified'
    )
    .replace('{{language}}', context.language);
}

export async function sendCoachMessage(
  messages: ConversationMessage[],
  userContext: UserContext
): Promise<string> {
  if (!client) {
    return 'Coach is not available right now. Please check your API key in .env';
  }

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250514',
      max_tokens: 600,
      system: buildSystemPrompt(userContext),
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return 'Something went wrong. Try again in a moment.';
    }

    return textBlock.text;
  } catch (error) {
    return 'Could not reach your coach right now. Please try again.';
  }
}
