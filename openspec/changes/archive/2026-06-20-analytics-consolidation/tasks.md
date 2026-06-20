# Tasks: analytics-consolidation

## Phase 1 — Update `trackEvent()` core

- [x] **T1.1** Add `import * as Sentry from '@sentry/react'` to `src/utils/analytics.ts`

- [x] **T1.2** Update `trackEvent()` with Option C logic:
  - If `window.gtag` missing AND `import.meta.env.DEV` → `console.warn`
  - If `window.gtag` missing AND `import.meta.env.PROD` → `Sentry.addBreadcrumb` with level `'info'`
  - If `window.gtag` present → existing behavior unchanged

## Phase 2 — Extend `trackLeadformStart()` signature

- [x] **T2.1** Update `trackLeadformStart()` in `analytics.ts`:
  - Add optional `completionRate?: number` parameter
  - Include `question_completion_rate` in the event params when provided

## Phase 3 — Replace calls in `App.tsx`

- [x] **T3.1** Import `trackLeadformStart` and `trackQuestionnaireAbandon` from `./utils/analytics`

- [x] **T3.2** Replace leadform start block (lines ~36–43) with:
  ```typescript
  trackLeadformStart(
    Math.round((Object.keys(answers).length / QUESTIONS.length) * 100)
  );
  ```

- [x] **T3.3** Replace abandonment tracking block (lines ~63–73) with:
  ```typescript
  trackQuestionnaireAbandon(
    Math.round(((currentIdx + 1) / QUESTIONS.length) * 100),
    currentIdx + 1
  );
  ```

- [x] **T3.4** Remove `if (window.gtag)` guard wrappers (now handled inside `trackEvent`)

## Phase 4 — Replace calls in `useDiagnostic.ts`

- [x] **T4.1** Import `trackEvent`, `GA4_EVENTS`, `trackLeadformComplete` from `../utils/analytics`

- [x] **T4.2** Replace the `digital_h_complete` block with:
  ```typescript
  trackEvent('digital_h_complete', {
    score: imd,
    level: level.name,
    company_size: lead.size,
    industry: lead.industry || 'N/A',
    flow_version: 'v2_q48_capture',
  });
  ```
  > Preserve `digital_h_complete` (not `GA4_EVENTS.QUESTIONNAIRE_COMPLETE`) to avoid
  > breaking existing GA4 event history.

- [x] **T4.3** Replace the `generate_lead` block with:
  ```typescript
  trackLeadformComplete(imd, level.name);
  ```

- [x] **T4.4** Remove the `if (window.gtag)` guard and direct `window.gtag` calls

## Phase 5 — Verification

- [x] **T5.1** Run `grep -r "window.gtag" src/` — expect zero results

- [x] **T5.2** Run `npm run build` — expect zero TypeScript errors

- [x] **T5.3** Run `npm run dev` → open browser without GA4 script → open DevTools console
  - Expect `[analytics] gtag not available: digital_h_landing_view` warnings on navigation

- [x] **T5.4** Verify GA4 events fire correctly in browser with `window.gtag` present
  (check via GA4 DebugView or `dataLayer` inspection)
