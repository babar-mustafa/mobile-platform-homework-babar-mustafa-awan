/**
 * Command types and validation for the Agent Command Router.
 * Only allowlisted commands with valid payloads can execute.
 */

export type ScreenName = 'home' | 'explore' | 'profile';
export type ExploreFilter = 'all' | 'recent' | 'favorites';
export type ExploreSort = 'name' | 'date' | 'relevance';

export interface NavigatePayload {
  screen: ScreenName;
}

export interface OpenFlyoutPayload {}
export interface CloseFlyoutPayload {}

export interface ApplyExploreFilterPayload {
  filter: ExploreFilter;
  sort?: ExploreSort;
}

export interface SetPreferencePayload {
  key: string;
  value: boolean | string;
}

export interface ShowAlertPayload {
  title: string;
  message: string;
}

export interface ExportAuditLogPayload {
  log: string;
}

export type CommandType =
  | 'navigate'
  | 'openFlyout'
  | 'closeFlyout'
  | 'applyExploreFilter'
  | 'setPreference'
  | 'showAlert'
  | 'exportAuditLog';

export type CommandPayload =
  | NavigatePayload
  | OpenFlyoutPayload
  | CloseFlyoutPayload
  | ApplyExploreFilterPayload
  | SetPreferencePayload
  | ShowAlertPayload
  | ExportAuditLogPayload;

/** Discriminated union so switch(cmd.type) narrows payload. */
export type Command =
  | ({ type: 'navigate'; payload: NavigatePayload; id?: string })
  | ({ type: 'openFlyout'; payload: OpenFlyoutPayload; id?: string })
  | ({ type: 'closeFlyout'; payload: CloseFlyoutPayload; id?: string })
  | ({ type: 'applyExploreFilter'; payload: ApplyExploreFilterPayload; id?: string })
  | ({ type: 'setPreference'; payload: SetPreferencePayload; id?: string })
  | ({ type: 'showAlert'; payload: ShowAlertPayload; id?: string })
  | ({ type: 'exportAuditLog'; payload: ExportAuditLogPayload; id?: string });

export type AuditOutcome = 'executed' | 'rejected';

export interface AuditEntry {
  id: string;
  timestamp: number;
  command: Command;
  outcome: AuditOutcome;
  reason?: string;
}

/** Commands that require user confirmation before execution */
export const REQUIRES_CONFIRMATION: CommandType[] = ['setPreference', 'exportAuditLog'];

export const ALLOWLIST: CommandType[] = [
  'navigate',
  'openFlyout',
  'closeFlyout',
  'applyExploreFilter',
  'setPreference',
  'showAlert',
  'exportAuditLog',
];
