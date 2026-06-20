# Spec: analytics-consolidation

## Requirement 1 — Option C error handling in `trackEvent()`

### Scenario: gtag unavailable in development
- **GIVEN** `import.meta.env.DEV === true`
- **WHEN** `trackEvent()` is called and `window.gtag` is not defined
- **THEN** the function SHALL call `console.warn('[analytics] gtag not available:', eventName)`
- **AND** SHALL NOT throw an exception
- **AND** SHALL NOT send any data

### Scenario: gtag unavailable in production
- **GIVEN** `import.meta.env.PROD === true`
- **WHEN** `trackEvent()` is called and `window.gtag` is not defined
- **THEN** the function SHALL call `Sentry.addBreadcrumb({ category: 'analytics', message: 'gtag not available', data: { event: eventName }, level: 'info' })`
- **AND** SHALL NOT throw an exception
- **AND** SHALL NOT log to `console`

### Scenario: gtag is available (happy path)
- **WHEN** `trackEvent()` is called and `window.gtag` is defined
- **THEN** the event SHALL be sent exactly as today — no behavior change

---

## Requirement 2 — All GA4 calls routed through `analytics.ts`

### Scenario: No direct `window.gtag` calls remain
- **GIVEN** the codebase after this change
- **WHEN** `grep -r "window.gtag" src/` is run
- **THEN** the output SHALL be empty

### Scenario: Event names are preserved
- **GIVEN** the existing GA4 event names tracked in production
- **WHEN** the refactoring is complete
- **THEN** every event name SHALL match its pre-refactor equivalent exactly:
  - `digital_h_leadform_start` (from `App.tsx` line 38)
  - `digital_h_questionnaire_abandon` (from `App.tsx` line 66)
  - `digital_h_complete` (from `useDiagnostic.ts` line 37)
  - `generate_lead` (from `useDiagnostic.ts` line 44)

---

## Requirement 3 — Sentry import is conditional (no bundle size regression)

- **WHEN** Sentry breadcrumb logging is added to `analytics.ts`
- **THEN** the Sentry import SHALL use dynamic import or the already-initialized global
  (`window.Sentry` or the `@sentry/react` package already in the bundle)
- **AND** SHALL NOT add `@sentry/react` as a new import if it is already initialized globally
- **NOTE**: `@sentry/react` is already a production dependency — re-using the same import is safe
