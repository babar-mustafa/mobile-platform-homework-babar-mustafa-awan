# Architecture (diagram)

```
┌─────────────────────────────────────────────────────────────────┐
│                         App (App.tsx)                             │
│  AppProvider → RootNavigator (tabs + screen visibility by state)  │
└─────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│  HomeScreen   │         │ ExploreScreen │         │ ProfileScreen  │
│  (placeholder)│         │ filter + sort │         │ preference +   │
│               │         │ controls      │         │ Activity Log   │
└───────────────┘         └───────────────┘         └───────────────┘
        │                           │                           │
        └───────────────────────────┼───────────────────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │  AppContext (state)            │
                    │  currentScreen, flyoutOpen,   │
                    │  exploreFilter/Sort,           │
                    │  profilePreference,           │
                    │  activityLog, appendActivityLog│
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │  AgentFlyout (Modal)           │
                    │  Chat UI, Proposed Action card │
                    │  Confirm / Reject              │
                    └───────────────┬───────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│ agentResponses│         │ commandRouter │         │ executeCommand │
│ (reply +      │         │ routeCommand  │         │ (executor      │
│  proposedCmd) │         │ validateCommand│         │  uses context) │
└───────────────┘         │ allowlist     │         └───────┬───────┘
                          │ confirmation  │                 │
                          │ onExecuted/   │                 │ setFlyoutOpen,
                          │ onRejected →  │                 │ setCurrentScreen,
                          │ appendActivityLog                │ setExploreFilter,
                          └───────────────┘                 │ setProfilePreference,
                                                             │ NativeModules.AuditLogExport
                                                             └─────────────────────────────┘
```

- **Native:** `AuditLogExport` (iOS Swift, Android Kotlin) writes the given string to app documents dir. No RN/Expo filesystem lib.
