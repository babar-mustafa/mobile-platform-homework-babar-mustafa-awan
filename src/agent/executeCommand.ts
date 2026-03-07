/**
 * Executes a validated command by updating app state / UI.
 * Called by the Command Router after allowlist + validation.
 */

import { Alert } from 'react-native';
import type { Command } from '../commandRouter/types';
import type { AppContextValue } from '../context/AppContext';

export function createExecutor(app: AppContextValue) {
  return function execute(cmd: Command): Promise<void> {
    switch (cmd.type) {
      case 'navigate':
        app.setCurrentScreen(cmd.payload.screen);
        return Promise.resolve();
      case 'openFlyout':
        app.setFlyoutOpen(true);
        return Promise.resolve();
      case 'closeFlyout':
        app.setFlyoutOpen(false);
        return Promise.resolve();
      case 'applyExploreFilter':
        app.setExploreFilter(cmd.payload.filter);
        if (cmd.payload.sort != null) app.setExploreSort(cmd.payload.sort);
        return Promise.resolve();
      case 'setPreference':
        if (typeof cmd.payload.value === 'boolean') {
          app.setProfilePreference(cmd.payload.value);
        }
        return Promise.resolve();
      case 'showAlert':
        Alert.alert(cmd.payload.title, cmd.payload.message);
        return Promise.resolve();
      case 'exportAuditLog': {
        const { NativeModules } = require('react-native');
        const AuditLogExport = NativeModules.AuditLogExport;
        if (AuditLogExport && typeof AuditLogExport.exportAuditLog === 'function') {
          AuditLogExport.exportAuditLog(cmd.payload.log);
        }
        return Promise.resolve();
      }
      default:
        return Promise.reject(new Error(`Unknown command: ${(cmd as Command).type}`));
    }
  };
}
