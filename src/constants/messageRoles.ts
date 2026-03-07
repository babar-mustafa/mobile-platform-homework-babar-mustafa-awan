/**
 * Chat message role constants. Use these instead of string literals.
 */
export const MESSAGE_ROLE_USER = 'user' as const;
export const MESSAGE_ROLE_AGENT = 'agent' as const;

export type MessageRole = typeof MESSAGE_ROLE_USER | typeof MESSAGE_ROLE_AGENT;
