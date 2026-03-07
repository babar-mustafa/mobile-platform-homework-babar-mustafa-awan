# Decisions

## 3 decisions made

1. **Command Router in JS with explicit allowlist and schema validation.** All agent-proposed actions go through a single router that checks allowlist, validates payloads, and enforces confirmation for `setPreference` and `exportAuditLog`. Why: keeps the agent from touching UI directly and gives one auditable path for all commands.

2. **Native module only for audit log export.** The requirement was a custom native component that writes a string to the device documents directory. We implemented exactly that (Swift on iOS, Kotlin on Android) and did not use RN/Expo filesystem libraries. Why: satisfies “do not use a pre-existing library” and keeps the app small.

3. **In-app “agent” as fixed responses + command proposals.** There is no LLM call; the agent is a small function that maps phrases to replies and proposed commands. Why: timebox and focus on UX and architecture (flyout, proposed-action cards, confirmation, logging) rather than NLP.

## 2 alternatives rejected

1. **Let the agent call setState/navigation directly.** Rejected because the challenge requires a Command Router with allowlist, validation, confirmation, and logging. Direct manipulation would bypass auditability and confirmation rules.

2. **Use Expo or a third-party filesystem package for export.** Rejected because the instructions explicitly say to implement the export in a native component using native file APIs and not to use a pre-existing RN/Expo filesystem library.
