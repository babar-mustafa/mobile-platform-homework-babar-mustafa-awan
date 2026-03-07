/**
 * App-wide state: current screen, flyout open, explore filter/sort, profile preference, activity log.
 */

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { AuditEntry } from '../commandRouter/types';
import type { ExploreFilter, ExploreSort, ScreenName } from '../commandRouter/types';
import { ROUTE_HOME } from '../constants';

interface AppState {
  currentScreen: ScreenName;
  flyoutOpen: boolean;
  exploreFilter: ExploreFilter;
  exploreSort: ExploreSort;
  profilePreference: boolean; // single persistent toggle
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

const defaultState: AppState = {
  currentScreen: ROUTE_HOME,
  flyoutOpen: false,
  exploreFilter: 'all',
  exploreSort: 'name',
  profilePreference: false,
  activityLog: [],
};

const AppContext = createContext<AppContextValue | null>(null);

function formatEntry(e: AuditEntry): string {
  const time = new Date(e.timestamp).toISOString();
  const cmd = JSON.stringify(e.command);
  return `${time} [${e.outcome}] ${cmd}${e.reason ? ` — ${e.reason}` : ''}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);

  const setCurrentScreen = useCallback((screen: ScreenName) => {
    setState((s) => ({ ...s, currentScreen: screen }));
  }, []);

  const setFlyoutOpen = useCallback((open: boolean) => {
    setState((s) => ({ ...s, flyoutOpen: open }));
  }, []);

  const setExploreFilter = useCallback((filter: ExploreFilter) => {
    setState((s) => ({ ...s, exploreFilter: filter }));
  }, []);

  const setExploreSort = useCallback((sort: ExploreSort) => {
    setState((s) => ({ ...s, exploreSort: sort }));
  }, []);

  const setProfilePreference = useCallback((value: boolean) => {
    setState((s) => ({ ...s, profilePreference: value }));
  }, []);

  const appendActivityLog = useCallback((entry: AuditEntry) => {
    setState((s) => ({ ...s, activityLog: [...s.activityLog, entry] }));
  }, []);

  const getActivityLogText = useCallback(() => {
    return state.activityLog.map(formatEntry).join('\n');
  }, [state.activityLog]);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      setCurrentScreen,
      setFlyoutOpen,
      setExploreFilter,
      setExploreSort,
      setProfilePreference,
      appendActivityLog,
      getActivityLogText,
    }),
    [
      state,
      setCurrentScreen,
      setFlyoutOpen,
      setExploreFilter,
      setExploreSort,
      setProfilePreference,
      appendActivityLog,
      getActivityLogText,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
