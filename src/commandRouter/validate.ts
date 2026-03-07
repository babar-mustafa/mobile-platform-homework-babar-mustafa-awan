/**
 * Schema validation for commands. Rejects invalid payloads.
 */

import type {
  Command,
  CommandType,
  NavigatePayload,
  ApplyExploreFilterPayload,
  SetPreferencePayload,
  ShowAlertPayload,
  ExportAuditLogPayload,
  ExploreFilter,
  ExploreSort,
  ScreenName,
} from './types';
import { ROUTES } from '../constants';

const SCREENS: ScreenName[] = [...ROUTES];
const FILTERS: ExploreFilter[] = ['all', 'recent', 'favorites'];
const SORTS: ExploreSort[] = ['name', 'date', 'relevance'];

function isScreenName(v: unknown): v is ScreenName {
  return typeof v === 'string' && SCREENS.includes(v as ScreenName);
}

function isExploreFilter(v: unknown): v is ExploreFilter {
  return typeof v === 'string' && FILTERS.includes(v as ExploreFilter);
}

function isExploreSort(v: unknown): v is ExploreSort {
  return typeof v === 'string' && SORTS.includes(v as ExploreSort);
}

function validateNavigate(payload: unknown): payload is NavigatePayload {
  if (payload == null || typeof payload !== 'object') return false;
  const p = payload as Record<string, unknown>;
  return isScreenName(p.screen);
}

function validateApplyExploreFilter(payload: unknown): payload is ApplyExploreFilterPayload {
  if (payload == null || typeof payload !== 'object') return false;
  const p = payload as Record<string, unknown>;
  if (!isExploreFilter(p.filter)) return false;
  if (p.sort !== undefined && !isExploreSort(p.sort)) return false;
  return true;
}

function validateSetPreference(payload: unknown): payload is SetPreferencePayload {
  if (payload == null || typeof payload !== 'object') return false;
  const p = payload as Record<string, unknown>;
  return typeof p.key === 'string' && p.key.length > 0 && (typeof p.value === 'boolean' || typeof p.value === 'string');
}

function validateShowAlert(payload: unknown): payload is ShowAlertPayload {
  if (payload == null || typeof payload !== 'object') return false;
  const p = payload as Record<string, unknown>;
  return typeof p.title === 'string' && typeof p.message === 'string';
}

function validateExportAuditLog(payload: unknown): payload is ExportAuditLogPayload {
  if (payload == null || typeof payload !== 'object') return false;
  const p = payload as Record<string, unknown>;
  return typeof p.log === 'string';
}

export function validateCommand(cmd: unknown): { valid: true; command: Command } | { valid: false; reason: string } {
  if (cmd == null || typeof cmd !== 'object') {
    return { valid: false, reason: 'Command must be an object' };
  }
  const c = cmd as Record<string, unknown>;
  const type = c.type as CommandType | undefined;
  const payload = c.payload;

  if (typeof type !== 'string') {
    return { valid: false, reason: 'Missing or invalid command type' };
  }

  switch (type) {
    case 'navigate':
      if (!validateNavigate(payload)) return { valid: false, reason: 'navigate requires payload.screen: home | explore | profile' };
      return { valid: true, command: { type: 'navigate', payload: payload as NavigatePayload } };
    case 'openFlyout':
      return { valid: true, command: { type: 'openFlyout', payload: {} } };
    case 'closeFlyout':
      return { valid: true, command: { type: 'closeFlyout', payload: {} } };
    case 'applyExploreFilter':
      if (!validateApplyExploreFilter(payload)) return { valid: false, reason: 'applyExploreFilter requires payload.filter and optional payload.sort' };
      return { valid: true, command: { type: 'applyExploreFilter', payload: payload as ApplyExploreFilterPayload } };
    case 'setPreference':
      if (!validateSetPreference(payload)) return { valid: false, reason: 'setPreference requires payload.key (string) and payload.value (boolean | string)' };
      return { valid: true, command: { type: 'setPreference', payload: payload as SetPreferencePayload } };
    case 'showAlert':
      if (!validateShowAlert(payload)) return { valid: false, reason: 'showAlert requires payload.title and payload.message' };
      return { valid: true, command: { type: 'showAlert', payload: payload as ShowAlertPayload } };
    case 'exportAuditLog':
      if (!validateExportAuditLog(payload)) return { valid: false, reason: 'exportAuditLog requires payload.log (string)' };
      return { valid: true, command: { type: 'exportAuditLog', payload: payload as ExportAuditLogPayload } };
    default:
      return { valid: false, reason: `Unknown command type: ${type}` };
  }
}
