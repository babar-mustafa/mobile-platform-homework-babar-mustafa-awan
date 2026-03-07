/**
 * Simple in-app "agent": answers questions about the app and proposes commands.
 * No LLM; fixed responses for demo. In production you'd call an AI API here.
 */

import type { Command, ExploreFilter, ExploreSort } from '../commandRouter/types';
import {
  PHRASE_WHAT_CAN_YOU_DO,
  PHRASE_HELP,
  PHRASE_GO_TO_HOME,
  PHRASE_NAVIGATE_TO_HOME,
  PHRASE_GO_TO_EXPLORE,
  PHRASE_OPEN_EXPLORE,
  PHRASE_GO_TO_PROFILE,
  PHRASE_OPEN_PROFILE,
  PHRASE_CLOSE,
  PHRASE_FLYOUT,
  PHRASE_FILTER,
  PHRASE_RECENT,
  PHRASE_FAVORITES,
  PHRASE_SORT_BY_DATE,
  PHRASE_SORT_BY_NAME,
  PHRASE_DATE,
  PHRASE_TURN_ON_NOTIFICATION,
  PHRASE_TURN_OFF_NOTIFICATION,
  PHRASE_NOTIFICATION,
  PHRASE_PREFERENCE,
  PHRASE_ON,
  PHRASE_OFF,
  PHRASE_ENABLE,
  PHRASE_EXPORT,
  PHRASE_LOG,
  PHRASE_SHOW_ALERT,
  PHRASE_ALERT,
  ROUTE_HOME,
  ROUTE_EXPLORE,
  ROUTE_PROFILE,
} from '../constants';

const HELP = `I can help you:
• Navigate: "Go to Home", "Open Explore", "Open Profile"
• Open/close this flyout
• Change Explore filter (all, recent, favorites) and sort (name, date, relevance)
• Change your Profile preference (Notifications on/off)
• Show an alert
• Export the audit log

Ask in plain language and I'll propose an action for you to confirm when needed.`;

type AgentContext = {
  currentScreen: string;
  exploreFilter: ExploreFilter;
  exploreSort: ExploreSort;
  profilePreference: boolean;
};

type IntentMatch = {
  test: (lower: string) => boolean;
  getResponse: (lower: string, context: AgentContext, userMessage: string) => {
    reply: string;
    proposedCommand: Command | null;
  };
};

const INTENTS: IntentMatch[] = [
  {
    test: (lower) =>
      lower.includes(PHRASE_WHAT_CAN_YOU_DO) || lower.includes(PHRASE_HELP) || lower === '',
    getResponse: () => ({ reply: HELP, proposedCommand: null }),
  },
  {
    test: (lower) => lower.includes(PHRASE_GO_TO_HOME) || lower.includes(PHRASE_NAVIGATE_TO_HOME),
    getResponse: () => ({
      reply: 'I can take you to Home.',
      proposedCommand: { type: 'navigate', payload: { screen: ROUTE_HOME } },
    }),
  },
  {
    test: (lower) => lower.includes(PHRASE_GO_TO_EXPLORE) || lower.includes(PHRASE_OPEN_EXPLORE),
    getResponse: () => ({
      reply: 'I can open the Explore screen.',
      proposedCommand: { type: 'navigate', payload: { screen: ROUTE_EXPLORE } },
    }),
  },
  {
    test: (lower) => lower.includes(PHRASE_GO_TO_PROFILE) || lower.includes(PHRASE_OPEN_PROFILE),
    getResponse: () => ({
      reply: 'I can open your Profile.',
      proposedCommand: { type: 'navigate', payload: { screen: ROUTE_PROFILE } },
    }),
  },
  {
    test: (lower) => lower.includes(PHRASE_CLOSE) && lower.includes(PHRASE_FLYOUT),
    getResponse: () => ({
      reply: 'Closing the agent flyout.',
      proposedCommand: { type: 'closeFlyout', payload: {} },
    }),
  },
  {
    test: (lower) =>
      lower.includes(PHRASE_FILTER) &&
      (lower.includes(PHRASE_RECENT) || lower.includes(PHRASE_FAVORITES)),
    getResponse: (lower) => {
      const filter = lower.includes(PHRASE_FAVORITES) ? 'favorites' : 'recent';
      return {
        reply: `I can set Explore filter to "${filter}".`,
        proposedCommand: { type: 'applyExploreFilter', payload: { filter } },
      };
    },
  },
  {
    test: (lower) =>
      lower.includes(PHRASE_SORT_BY_DATE) || lower.includes(PHRASE_SORT_BY_NAME),
    getResponse: (lower, context) => {
      const sort = lower.includes(PHRASE_DATE) ? 'date' : 'name';
      return {
        reply: `I can set Explore sort to "${sort}".`,
        proposedCommand: {
          type: 'applyExploreFilter',
          payload: { filter: context.exploreFilter, sort },
        },
      };
    },
  },
  // Check "turn off" before "turn on" so "turn off notification" isn't matched by "on" in "notification"
  {
    test: (lower) =>
      lower.includes(PHRASE_TURN_OFF_NOTIFICATION) ||
      (lower.includes(PHRASE_NOTIFICATION) && lower.includes(PHRASE_OFF)),
    getResponse: () => ({
      reply: 'I can turn notifications off. Please confirm.',
      proposedCommand: { type: 'setPreference', payload: { key: 'notifications', value: false } },
    }),
  },
  {
    test: (lower) =>
      lower.includes(PHRASE_TURN_ON_NOTIFICATION) ||
      (lower.includes(PHRASE_NOTIFICATION) && lower.includes(PHRASE_ON)),
    getResponse: () => ({
      reply: 'I can turn notifications on. Please confirm.',
      proposedCommand: { type: 'setPreference', payload: { key: 'notifications', value: true } },
    }),
  },
  {
    test: (lower) =>
      lower.includes(PHRASE_NOTIFICATION) || lower.includes(PHRASE_PREFERENCE),
    getResponse: (lower) => {
      const turnOn = lower.includes(PHRASE_ON) || lower.includes(PHRASE_ENABLE);
      return {
        reply: `I can turn notifications ${turnOn ? 'on' : 'off'}. This requires your confirmation.`,
        proposedCommand: { type: 'setPreference', payload: { key: 'notifications', value: turnOn } },
      };
    },
  },
  {
    test: (lower) => lower.includes(PHRASE_EXPORT) && lower.includes(PHRASE_LOG),
    getResponse: () => ({
      reply: 'I can export the audit log to your device. Please confirm.',
      proposedCommand: { type: 'exportAuditLog', payload: { log: '' } },
    }),
  },
  {
    test: (lower) =>
      lower.includes(PHRASE_SHOW_ALERT) || lower.includes(PHRASE_ALERT),
    getResponse: (_, __, userMessage) => ({
      reply:
        'I can show an alert. What title and message? (e.g. "Hello / Hi there")',
      proposedCommand: {
        type: 'showAlert',
        payload: { title: 'Alert', message: userMessage || 'Message' },
      },
    }),
  },
];

export function getAgentResponse(
  userMessage: string,
  context: AgentContext
): { reply: string; proposedCommand: Command | null } {
  const lower = userMessage.toLowerCase().trim();
  const match = INTENTS.find((intent) => intent.test(lower));
  if (match) {
    return match.getResponse(lower, context, userMessage);
  }
  return {
    reply: `I didn't understand that. ${HELP}`,
    proposedCommand: null,
  };
}
