/**
 * Proves: Command Router validation rejects invalid commands and accepts valid ones.
 * Confirmation policy is enforced (setPreference requires confirmation).
 */

import { ROUTE_HOME, ROUTE_EXPLORE } from '../../constants';
import { validateCommand } from '../validate';
import { routeCommand, requiresConfirmation } from '../index';

describe('Command Router', () => {
  describe('validateCommand', () => {
    it('rejects non-object command', () => {
      const r = validateCommand('navigate');
      expect(r.valid).toBe(false);
      expect(r.valid === false && r.reason).toBeDefined();
    });

    it('rejects unknown command type', () => {
      const r = validateCommand({ type: 'deleteEverything', payload: {} });
      expect(r.valid).toBe(false);
    });

    it('rejects navigate with invalid screen', () => {
      const r = validateCommand({ type: 'navigate', payload: { screen: 'settings' } });
      expect(r.valid).toBe(false);
    });

    it('accepts valid navigate', () => {
      const r = validateCommand({ type: 'navigate', payload: { screen: ROUTE_HOME } });
      expect(r.valid).toBe(true);
      if (r.valid) expect(r.command.payload).toEqual({ screen: ROUTE_HOME });
    });

    it('rejects setPreference without key', () => {
      const r = validateCommand({ type: 'setPreference', payload: { value: true } });
      expect(r.valid).toBe(false);
    });

    it('accepts valid setPreference', () => {
      const r = validateCommand({ type: 'setPreference', payload: { key: 'notifications', value: true } });
      expect(r.valid).toBe(true);
    });
  });

  describe('requiresConfirmation', () => {
    it('setPreference requires confirmation', () => {
      expect(requiresConfirmation('setPreference')).toBe(true);
    });
    it('exportAuditLog requires confirmation', () => {
      expect(requiresConfirmation('exportAuditLog')).toBe(true);
    });
    it('navigate does not require confirmation', () => {
      expect(requiresConfirmation('navigate')).toBe(false);
    });
  });

  describe('routeCommand', () => {
    it('rejects invalid command and calls onRejected', () => {
      const onRejected = jest.fn();
      const onExecuted = jest.fn();
      const execute = jest.fn();
      const result = routeCommand(
        { type: 'navigate', payload: { screen: 'invalid' } },
        { onExecuted, onRejected, execute }
      );
      expect(result.accepted).toBe(false);
      expect(onRejected).toHaveBeenCalledWith(
        expect.objectContaining({ outcome: 'rejected', command: expect.any(Object) })
      );
      expect(execute).not.toHaveBeenCalled();
    });

    it('for valid navigate returns accepted and does not need confirmation', () => {
      const onRejected = jest.fn();
      const onExecuted = jest.fn();
      const execute = jest.fn();
      const result = routeCommand(
        { type: 'navigate', payload: { screen: ROUTE_EXPLORE } },
        { onExecuted, onRejected, execute }
      );
      expect(result.accepted).toBe(true);
      expect(result.accepted && result.needsConfirmation).toBe(false);
      expect(onRejected).not.toHaveBeenCalled();
      // execute is called async; after one tick onExecuted should be called
      return Promise.resolve().then(() => {
        expect(execute).toHaveBeenCalledWith(expect.objectContaining({ type: 'navigate', payload: { screen: ROUTE_EXPLORE } }));
        expect(onExecuted).toHaveBeenCalled();
      });
    });

    it('for setPreference returns accepted and needsConfirmation', () => {
      const onRejected = jest.fn();
      const onExecuted = jest.fn();
      const execute = jest.fn();
      const result = routeCommand(
        { type: 'setPreference', payload: { key: 'notifications', value: true } },
        { onExecuted, onRejected, execute }
      );
      expect(result.accepted).toBe(true);
      expect(result.accepted && result.needsConfirmation).toBe(true);
      expect(execute).not.toHaveBeenCalled();
    });
  });
});
