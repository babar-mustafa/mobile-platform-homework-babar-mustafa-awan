# Mobile Platform Homework — Agent-driven app

React Native app: 3 screens (Home, Explore, Profile) + agent flyout. The agent proposes actions; a Command Router enforces allowlist, validation, confirmation, and audit logging. A custom native module (Swift/Kotlin) writes the audit log to the device documents directory.

## Setup

Node 18+ required. With nvm, run `nvm use` in the project root (`.nvmrc` is 20).

```bash
cd MobilePlatformHomework
npm install
```

**iOS**

```bash
cd ios && pod install && cd ..
npm run ios
```

**Android**

```bash
npm run android
```

If tab bar icons don’t appear, do a clean build: `cd android && ./gradlew clean && cd ..` then `npm run android`.

## Architecture (TL;DR)

- Screens driven by `AppContext` (currentScreen, explore filter/sort, profile preference, activity log). Tab bar switches screens.
- Agent flyout: modal with chat UI and “Proposed action” cards. User confirms or rejects; then Command Router runs the command and logs it.
- Command Router: allowlist, schema validation, confirmation for `setPreference` and `exportAuditLog`, activity log. Executor updates context or calls native export.
- Native: `AuditLogExport` writes audit log to app documents dir (Swift/Kotlin; no RN/Expo filesystem lib).
- UI: styled-components and primitives in `src/theme` and `src/components/common`. Screens and flyout reuse them.

## Key decisions

- Command Router in JS with allowlist and schema validation; agent never touches UI directly.
- Native module only for audit log export (native file APIs).
- In-app agent: fixed responses + command proposals (no LLM) for timebox.
- Rejected: agent setState directly (bypasses audit); Expo/RN filesystem for export (instructions require custom native).

## AI disclosure

- **Tools used:** Cursor (AI-assisted editor).
- **Usage:** React Native/TypeScript (screens, context, command router, flyout), Swift/Kotlin native stubs, README/artifacts. AI suggested layout and tests.
- **Workflow:** Requirements from PDF; structure and command contract first. AI for boilerplate; allowlist, confirmation rules, native paths done/checked manually.
- **Mine:** Command contract, schema shapes, agent/CONTEXT.md, decisions.md, architecture diagram, and the Jest test (what it proves).

## Demo script

1. Home → “Open Agent”. Ask “What can you do?” → capabilities reply.
2. “Go to Explore” → agent proposes navigate; app switches; log shows executed.
3. “Turn on notifications” → Proposed action card; Confirm → preference updates; log executed.
4. Profile → Agent Activity Log. “Export audit log” → file in documents dir.

## Next steps

- Demo videos in `artifacts/`. Optional: deep links, error toasts for export failure, more commands (same allowlist/validation pattern).

## Submission checklist

- [ ] Repo named `mobile-platform-homework-<first-last>` and default branch is `main`
- [x] README includes Setup commands for iOS and Android
- [x] README word count ≤ 500 (excluding commands/checkboxes)
- [x] `agent/CONTEXT.md` included
- [x] `artifacts/decisions.md` included (≤ 400 words)
- [x] `artifacts/architecture.(png|md)` included (architecture.md)
- [x] `artifacts/demo-ios.mp4` and `artifacts/demo-android.mp4` included (Android: `demo-android.mov`)
- [x] One meaningful test included and described
- [x] AI disclosure included (tools used + how + what was yours)

## What the test proves

`src/commandRouter/__tests__/validate.test.ts`: (1) Validation rejects invalid commands (wrong type, bad payload) and accepts valid ones. (2) Confirmation policy: `setPreference` and `exportAuditLog` need confirmation; `navigate` does not. (3) Invalid → `onRejected` called, `execute` not. Valid `navigate` → `execute` and `onExecuted`. Valid `setPreference` → `execute` only after user confirms (in UI).

Run: `yarn test` or `npm test`.
