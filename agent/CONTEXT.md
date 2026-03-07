# Agent context

## What the app is

A small mobile app (iOS/Android) with three screens—Home, Explore, Profile—and a persistent agent flyout. The agent answers questions about the app and proposes actions. All state-changing actions go through a Command Router (allowlist, validation, confirmation where required) and are logged. The agent does not directly manipulate UI; it emits commands that the router validates and executes.

## What the agent can and cannot do

**Can:**
- Answer “what can you do?” and explain navigation, filters, preferences, alerts, export.
- Propose navigation (home, explore, profile), open/close flyout, apply explore filter/sort, set the profile notification preference, show an alert, export the audit log.
- Only propose allowlisted commands; all proposals go through the Command Router.

**Cannot:**
- Execute state-changing commands without user confirmation when the confirmation policy requires it (e.g. `setPreference`, `exportAuditLog`).
- Run commands that are not on the allowlist or that fail schema validation.
- Directly change UI or app state; the router is the single path for execution.

## Command contract

- **Allowlist:** Only these commands may run: `navigate`, `openFlyout`, `closeFlyout`, `applyExploreFilter`, `setPreference`, `showAlert`, `exportAuditLog`.
- **Validation:** Each command has a schema (e.g. `navigate` requires `payload.screen` in `home | explore | profile`). Invalid payloads are rejected and logged.
- **Confirmation policy:** Commands that change state in a non-reversible or sensitive way require explicit user confirmation before execution. Currently: `setPreference`, `exportAuditLog` require confirmation. Navigation, open/close flyout, apply explore filter, and show alert do not (documented in code: `REQUIRES_CONFIRMATION` in `src/commandRouter/types.ts`).
- **Logging:** Every executed or rejected command is appended to the Agent Activity Log (executed/rejected, reason if rejected, timestamp). The log is visible in Profile and can be exported via the native module.

## Example interactions (golden paths)

1. **Navigate:** User opens flyout, asks “Go to Explore”. Agent replies and proposes `navigate(screen: 'explore')`. Router validates and executes; app switches to Explore; log entry “executed”.
2. **Preference with confirm:** User says “Turn on notifications”. Agent proposes `setPreference(key: 'notifications', value: true)`. Router marks it as needing confirmation; UI shows “Proposed action” card. User taps Confirm; router runs the command, preference updates, log entry “executed”.
3. **Invalid command:** Agent or client sends `navigate(screen: 'invalid')`. Router validates, rejects with reason (e.g. invalid screen), logs “rejected” with reason. No UI change.
