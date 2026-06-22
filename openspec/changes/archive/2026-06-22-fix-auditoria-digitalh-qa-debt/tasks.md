# Tasks: fix-auditoria-digitalh-qa-debt

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 500–800 |
| Orchestrator review budget | 800 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 → PR 2 → PR 3 |
| Delivery strategy | auto-forecast |
| Chain strategy | stacked-to-main |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | E2E flow + localStorage persistence | PR 1 | base: main; touches App.tsx, useSession.ts, sessionStorage.ts |
| 2 | Email delivery + PDF generation | PR 2 | base: main; touches public/api/*, generateReportPDF.ts, Results.tsx |
| 3 | Mobile viewport + archive checklist | PR 3 | base: main; touches CSS/components, archived tasks.md |

## Phase 1: End-to-End Flow Verification (8.2)

- [x] 1.1 Run `npm run dev` and walk Landing → PreTest → Questionnaire → LeadForm → Results → PDF → Email; record console errors.
- [x] 1.2 Verify `src/components/Questionnaire.tsx` module indicators and answer navigation do not reset state.
- [x] 1.3 Verify `src/components/LeadForm.tsx` GDPR checkbox blocks submit and saves timestamp.
- [x] 1.4 Fix any runtime/console error found; re-run lint.

## Phase 2: localStorage Persistence After F5 (8.3)

- [x] 2.1 Add regression test in `src/hooks/useSession.test.ts`: debounced save writes to localStorage; mount restores prompt.
- [x] 2.2 Verify F5 reload during questionnaire shows `ResumePrompt` and restores `answers`, `currentIdx`, `points`, `unlockedBadges`.
- [x] 2.3 Fix `src/hooks/useSession.ts` or `src/sessionStorage.ts` if restore fails or stale schema is not cleared.

## Phase 3: Resend Sandbox Email Verification (8.4)

- [x] 3.1 Verify `public/api/sendEmail.php` (or `public/api/diagnostic.php`) sends email with correct name, company, IMD, level, results link.
- [x] 3.2 Add Vitest test or PHP script to assert email payload shape when Resend sandbox key is present.
- [x] 3.3 Fix backend endpoint if email body is missing data or delivery fails; ensure errors do not block Results screen.

## Phase 4: Multi-Page PDF Verification (8.5)

- [x] 4.1 Add unit test `src/generateReportPDF.test.ts` that mocks jsPDF and asserts ≥4 pages and correct headers.
- [x] 4.2 Generate PDF with sample data and verify page count ≥2, headers include company, and dimension table matches answers.
- [x] 4.3 Fix `src/generateReportPDF.ts` if pages are missing, data is wrong, or logo fetch throws.

## Phase 5: Mobile Viewport 375px (8.7)

- [x] 5.1 Open DevTools at 375×667; verify `src/components/Landing.tsx`, `Questionnaire.tsx`, `LeadForm.tsx`, `Results.tsx` have no horizontal scroll or clipped text.
- [x] 5.2 Fix `src/index.css` or component classes for the 375px breakpoint only; avoid redesign.

## Phase 6: Archive & Final Checks

- [x] 6.1 Mark items 8.2–8.5 and 8.7 as `[x]` in `openspec/changes/archive/2026-05-30-fix-auditoria-digitalh/tasks.md`.
- [x] 6.2 Run `npm run lint` and `npm run test:run`; fix failures.

## Phase 7: Component Test Timeout Follow-up

- [x] 7.1 Identify slow component tests and root causes (Framer Motion animations, Recharts layout measurement, heavy component trees in jsdom).
- [x] 7.2 Add test-only mocks for `motion/react` and `recharts` to reduce render overhead in jsdom.
- [x] 7.3 Configure `testTimeout: 10000` in `vitest.config.ts` so `npm run test:run` passes reliably without extra flags.
- [x] 7.4 Run `npm run test:run` and `npm run lint`; confirm all pass.
