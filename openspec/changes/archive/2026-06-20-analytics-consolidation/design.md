# Design: analytics-consolidation

## `trackEvent()` — Updated implementation

```typescript
// src/utils/analytics.ts
import * as Sentry from '@sentry/react'; // already a prod dep — no bundle cost

export const trackEvent = (eventName: string, params?: GA4EventParams): void => {
  if (typeof window === 'undefined') return;

  if (!(window as any).gtag) {
    if (import.meta.env.DEV) {
      console.warn('[analytics] gtag not available:', eventName, params);
    } else {
      // Production: Sentry breadcrumb — not an error, just observability context
      Sentry.addBreadcrumb({
        category: 'analytics',
        message: `gtag not available: ${eventName}`,
        data: params,
        level: 'info',
      });
    }
    return;
  }

  (window as any).gtag('event', eventName, params);
};
```

---

## `App.tsx` — Replace direct `window.gtag` calls

### Current (lines ~38–43): leadform start tracking
```typescript
// BEFORE
if (window.gtag) {
  const utmSource = new URLSearchParams(window.location.search).get('utm_source') || 'organico';
  window.gtag('event', 'digital_h_leadform_start', {
    utm_source: utmSource,
    question_completion_rate: Math.round((Object.keys(answers).length / QUESTIONS.length) * 100),
    flow_version: 'v2_q48_capture'
  });
}
```
```typescript
// AFTER
import { trackLeadformStart } from './utils/analytics';

trackLeadformStart();
// Note: trackLeadformStart() already captures utm_source internally via getUtmParam()
// Add question_completion_rate to the function signature if needed (see tasks)
```

### Current (lines ~64–73): abandonment tracking
```typescript
// BEFORE
if (window.gtag) {
  window.gtag('event', 'digital_h_questionnaire_abandon', {
    question_number: currentIdx + 1,
    total_questions: QUESTIONS.length,
    progress_percentage: Math.round(((currentIdx + 1) / QUESTIONS.length) * 100),
    flow_version: 'v2_q48_capture'
  });
}
```
```typescript
// AFTER
import { trackQuestionnaireAbandon } from './utils/analytics';

trackQuestionnaireAbandon(
  Math.round(((currentIdx + 1) / QUESTIONS.length) * 100),
  currentIdx + 1
);
```

---

## `useDiagnostic.ts` — Replace direct `window.gtag` calls

### Current: completion + lead events
```typescript
// BEFORE
if (window.gtag) {
  window.gtag('event', 'digital_h_complete', { score: imd, level: level.name, ... });
  window.gtag('event', 'generate_lead', { lead_source: 'digital-h', value: imd, ... });
}
```
```typescript
// AFTER
import { trackLeadformComplete } from '../utils/analytics';
// trackLeadformComplete() sends BOTH digital_h_leadform_complete AND generate_lead
// We need to also send digital_h_complete separately:
import { trackEvent, GA4_EVENTS } from '../utils/analytics';

trackEvent(GA4_EVENTS.QUESTIONNAIRE_COMPLETE /* note: maps to digital_h_complete */ , {
  score: imd,
  level: level.name,
  company_size: lead.size,
  industry: lead.industry || 'N/A',
  flow_version: 'v2_q48_capture',
});
trackLeadformComplete(imd, level.name);
```

> **Note**: `digital_h_complete` in the current code maps to `QUESTIONNAIRE_COMPLETE`
> in `GA4_EVENTS`. The event name `digital_h_questionnaire_complete` is the canonical one.
> The existing raw call uses `digital_h_complete` (non-canonical). Preserve the old name
> via `trackEvent('digital_h_complete', ...)` to avoid breaking existing GA4 reports.

---

## Files Changed

| File | Change |
|------|--------|
| `src/utils/analytics.ts` | Add Option C to `trackEvent()` + import Sentry |
| `src/App.tsx` | Replace 2 raw `window.gtag` blocks with typed analytics calls |
| `src/hooks/useDiagnostic.ts` | Replace 2 raw `window.gtag` blocks with typed analytics calls |
| `src/utils/analytics.ts` | Optionally extend `trackLeadformStart` signature for `completion_rate` |
