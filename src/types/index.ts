/**
 * Centralized type and interface definitions.
 */

import type { ReactNode } from 'react';
import type {
  ScreenName,
  ExploreFilter,
  ExploreSort,
  AuditEntry,
} from '../commandRouter/types';

// Re-export command router types
export type {
  ScreenName,
  ExploreFilter,
  ExploreSort,
  NavigatePayload,
  OpenFlyoutPayload,
  CloseFlyoutPayload,
  ApplyExploreFilterPayload,
  SetPreferencePayload,
  ShowAlertPayload,
  ExportAuditLogPayload,
  CommandType,
  CommandPayload,
  Command,
  AuditOutcome,
  AuditEntry,
} from '../commandRouter/types';

export { REQUIRES_CONFIRMATION, ALLOWLIST } from '../commandRouter/types';

// App context
export interface AppState {
  currentScreen: ScreenName;
  flyoutOpen: boolean;
  exploreFilter: ExploreFilter;
  exploreSort: ExploreSort;
  profilePreference: boolean;
  activityLog: AuditEntry[];
}

export interface AppContextValue extends AppState {
  setCurrentScreen: (screen: ScreenName) => void;
  setFlyoutOpen: (open: boolean) => void;
  setExploreFilter: (filter: ExploreFilter) => void;
  setExploreSort: (sort: ExploreSort) => void;
  setProfilePreference: (value: boolean) => void;
  appendActivityLog: (entry: AuditEntry) => void;
  getActivityLogText: () => string;
}

// Agent flyout
import type { MessageRole } from '../constants';

export interface ChatMessage {
  role: MessageRole;
  text: string;
}

export interface AgentFlyoutProps {
  visible: boolean;
  onClose: () => void;
}

// Button
export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
}

// Card
export interface CardProps {
  children: ReactNode;
  style?: object;
}

// Screen container
export interface ScreenContainerProps {
  children: ReactNode;
}

// Profile / log
export interface LogEntryRowProps {
  entry: AuditEntry;
}

// Navigation
export interface TabItem {
  name: 'home' | 'explore' | 'profile';
  label: string;
}

export interface TabBarProps {
  currentScreen: string;
}
