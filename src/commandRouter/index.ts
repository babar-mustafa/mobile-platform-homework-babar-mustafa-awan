/**
 * Command Router: allowlist, validation, confirmation rules, logging.
 * The agent never touches UI directly; all actions go through here.
 */

import { ALLOWLIST, REQUIRES_CONFIRMATION } from './types';
import type { Command, AuditEntry } from './types';
import { validateCommand } from './validate';

export type { Command, AuditEntry, CommandType } from './types';
export { REQUIRES_CONFIRMATION, ALLOWLIST } from './types';
export { validateCommand } from './validate';

function isAllowlisted(type: Command['type']): boolean {
  return ALLOWLIST.includes(type);
}

export function requiresConfirmation(type: Command['type']): boolean {
  return REQUIRES_CONFIRMATION.includes(type);
}

export function routeCommand(
  raw: unknown,
  options: {
    onExecuted: (entry: AuditEntry) => void;
    onRejected: (entry: AuditEntry) => void;
    execute: (cmd: Command) => Promise<void> | void;
  }
): { accepted: true; needsConfirmation: boolean; command: Command } | { accepted: false; reason: string } {
  const validated = validateCommand(raw);
  if (!validated.valid) {
    options.onRejected({
      id: `rej-${Date.now()}`,
      timestamp: Date.now(),
      command: raw as Command,
      outcome: 'rejected',
      reason: validated.reason,
    });
    return { accepted: false, reason: validated.reason };
  }

  const { command } = validated;
  if (!isAllowlisted(command.type)) {
    options.onRejected({
      id: `rej-${Date.now()}`,
      timestamp: Date.now(),
      command,
      outcome: 'rejected',
      reason: 'Command not on allowlist',
    });
    return { accepted: false, reason: 'Command not on allowlist' };
  }

  const needsConfirmation = requiresConfirmation(command.type);
  if (!needsConfirmation) {
    Promise.resolve(options.execute(command))
      .then(() => {
        options.onExecuted({
          id: `ex-${Date.now()}`,
          timestamp: Date.now(),
          command,
          outcome: 'executed',
        });
      })
      .catch((err) => {
        options.onRejected({
          id: `rej-${Date.now()}`,
          timestamp: Date.now(),
          command,
          outcome: 'rejected',
          reason: err?.message ?? String(err),
        });
      });
  }

  return { accepted: true, needsConfirmation, command };
}

export function executeConfirmedCommand(
  command: Command,
  options: {
    onExecuted: (entry: AuditEntry) => void;
    onRejected: (entry: AuditEntry) => void;
    execute: (cmd: Command) => Promise<void> | void;
  }
): void {
  Promise.resolve(options.execute(command))
    .then(() => {
      options.onExecuted({
        id: `ex-${Date.now()}`,
        timestamp: Date.now(),
        command,
        outcome: 'executed',
      });
    })
    .catch((err) => {
      options.onRejected({
        id: `rej-${Date.now()}`,
        timestamp: Date.now(),
        command,
        outcome: 'rejected',
        reason: err?.message ?? String(err),
      });
    });
}
