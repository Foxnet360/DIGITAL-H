# Proposal: analytics-consolidation

## Problem

`src/utils/analytics.ts` exists as a centralized GA4 tracking module with typed,
named event functions. However, `App.tsx` and `src/hooks/useDiagnostic.ts` bypass this
module and call `window.gtag` directly. This creates two problems:

1. **Inconsistency**: two code paths track GA4 events — the module and raw `window.gtag`.
   When the event schema changes, there are two places to update.
2. **No observability on analytics failures**: when `gtag` is unavailable (ad blockers,
   browser extensions), the failure is completely invisible — not even a dev warning.

## Proposed Solution

- Route all GA4 tracking through `analytics.ts` exclusively.
- Remove all direct `window.gtag` calls from `App.tsx` and `useDiagnostic.ts`.
- Add Option C error handling to `analytics.ts`:
  - **Development**: `console.warn` when `gtag` is not available
  - **Production**: log a Sentry breadcrumb (not an error) for observability without alert noise

## User Value

- No user-facing change.
- Developers get a warning in dev when GA4 is misconfigured.
- On production, Sentry shows how many users have ad blockers or restricted environments,
  without triggering alerts.

## Scope

**In scope:**
- Update `trackEvent()` in `analytics.ts` to implement Option C behavior
- Replace direct `window.gtag` calls in `App.tsx` with the appropriate typed functions
- Replace direct `window.gtag` calls in `useDiagnostic.ts` with typed functions
- Verify all existing event names remain unchanged (no GA4 schema regression)

**Out of scope:**
- Adding new analytics events
- Changing GA4 event naming convention
- Server-side event tracking
