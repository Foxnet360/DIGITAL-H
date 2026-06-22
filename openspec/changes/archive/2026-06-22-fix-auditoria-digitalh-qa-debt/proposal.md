# Proposal: fix-auditoria-digitalh-qa-debt

## Intent

Close the remaining QA debt from the archived `fix-auditoria-digitalh` change. Five manual verification tasks (8.2–8.5, 8.7) were left unchecked; this change executes them, fixes any defects uncovered, and marks them complete.

## Scope

### In Scope
- End-to-end flow verification: Landing → Quiz → LeadForm → Results → PDF → Email.
- `localStorage` persistence and restore after F5 reload.
- Resend sandbox email delivery and content accuracy.
- Multi-page PDF generation and data accuracy.
- Mobile viewport 375px visual review.
- Fix any issues found during verification.
- Update archived change task checklist.

### Out of Scope
- New features or UI redesign.
- Backend architecture changes beyond bug fixes.
- Replacing Firestore, Calendly, or analytics.

## Capabilities

### New Capabilities
None

### Modified Capabilities
None

> This change is pure QA verification and bugfix. If a defect implies a requirement change, a delta spec will be added during sdd-spec.

## Approach

1. Inspect current implementation in `src/components/`, `src/hooks/`, `src/generateReportPDF.ts`, and the email backend endpoint.
2. Run the application locally (`npm run dev`) and execute each QA checklist item manually; capture evidence (screenshots, network logs, generated PDFs, Resend sandbox inbox).
3. For each failure, write a focused fix with regression test or manual verification step.
4. Update the archived `fix-auditoria-digitalh` tasks.md items 8.2–8.5 and 8.7 to `[x]`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/Questionnaire.tsx` | Verify | Answer flow, module indicators, resume prompt |
| `src/components/LeadForm.tsx` | Verify | GDPR checkbox, validation, company size dropdown |
| `src/components/Results.tsx` | Verify | Results rendering, PDF download trigger |
| `src/generateReportPDF.ts` | Verify/Fix | Multi-page output, headers/footers, data accuracy |
| `src/hooks/useSession.ts` | Verify | localStorage save/restore/clear logic |
| Email backend (`api/index.ts` or similar) | Verify/Fix | Resend sandbox send, template data, rate limiting |
| `index.html` / CSS | Verify | Mobile 375px layout, branding contrast |
| `openspec/changes/archive/2026-05-30-fix-auditoria-digitalh/tasks.md` | Update | Mark QA tasks complete |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Resend sandbox unavailable or rate-limited | Low | Use local email capture or mock endpoint if needed |
| PDF generation inconsistent in headless/manual test | Med | Generate multiple PDFs with sample data; compare page count |
| Mobile layout issues require broader CSS changes | Med | Scope fixes to the specific breakpoint; avoid redesign |
| localStorage restore edge cases (stale schema) | Low | Clear session on schema mismatch; log to console |

## Rollback Plan

Revert any code fixes to the pre-change commit. Because the change only verifies and patches existing behavior, rollback is a single `git revert` or checkout of the last stable commit. Revert task checkmarks to `[ ]` if rollback occurs.

## Dependencies

- Local dev environment running (`npm run dev`)
- Resend sandbox API key in `.env`
- Browser DevTools and mobile viewport emulation

## Success Criteria

- [ ] 8.2 End-to-end flow completes without console errors.
- [ ] 8.3 `localStorage` persists and restores correctly after F5.
- [ ] 8.4 Resend sandbox receives the email with correct data.
- [ ] 8.5 Generated PDF has ≥2 pages and matches user data.
- [ ] 8.7 Layout is usable at 375px viewport with no horizontal scroll or clipped text.
- [ ] `npm run lint` passes after any code fixes.
- [ ] Archived change tasks 8.2–8.5, 8.7 are marked `[x]`.
