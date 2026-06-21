# Tasks: Leadmagnet Improvements

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 180-250 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Complete all 7 findings | PR 1 | Single consolidated PR addressing all branding, UX, booking calendar, resources, and PDF export improvements. |

## Phase 1: Foundation and Assets

- [x] 1.1 Strip background `<rect>` vector tags from `public/acrux_logo.svg` to enable transparency.
- [x] 1.2 Strip background `<rect>` vector tags from `public/favicon.svg` to enable transparency.
- [x] 1.3 Create `public/docs/` directory inside `DIGITAL-H` project.
- [x] 1.4 Copy PDF resources `10 Pasos Para la Transformacion.pdf` and `eBook - La PYME Digital del Siglo XXI.pdf` from `acrux.life` project, renaming them using hyphens to `10-Pasos-Para-la-Transformacion.pdf` and `eBook-La-PYME-Digital-del-Siglo-XXI.pdf`.
- [x] 1.5 Update dimension descriptions inside `src/constants.ts` with professional copy.

## Phase 2: Core Frontend UX

- [x] 2.1 Add transition-triggered scroll hook in `src/App.tsx` (scroll to top on screen change).
- [x] 2.2 Add transition-triggered scroll hook in `src/components/Questionnaire.tsx` (scroll to top on question index change).
- [x] 2.3 Add `id="booking-section"` to `ResultsBookingSection` container in `src/components/results/ResultsCTA.tsx`.
- [x] 2.4 Replace Calendly links in `src/components/results/ResultsCTA.tsx` with `#booking-section` anchors, and update CTA labels to "Reservar mi sesión con profesionales".
- [x] 2.5 Modify `src/components/BookingCalendar.tsx` to fetch occuped slots from `./api/booking.php?date=YYYY-MM-DD` and filter available slots. Update layout title text to "con profesionales".
- [x] 2.6 Update roadmap phases text description inside `src/components/Results.tsx` and resource links pointing to local `/docs/` files.

## Phase 3: PDF Exporter Overhaul

- [x] 3.1 Refactor `src/generateReportPDF.ts` to draw `logoData` inside header (top-right) on all pages instead of cover body, removing the disproportionate image at y=30.
- [x] 3.2 Add dynamic page totals post-generation loop in `src/generateReportPDF.ts` and set year in footer to 2026.
- [x] 3.3 Adjust prioritized recommendations card height to 38, priority badge scale, and description text wrap boundary to prevent overlap.
- [x] 3.4 Update roadmap phases description table in `src/generateReportPDF.ts` to match frontend changes.
- [x] 3.5 Append new closing page to `src/generateReportPDF.ts` with next steps description, visual call-to-action block, and clickable link to `https://acrux.life`.

## Phase 4: Verification and Clean Up

- [x] 4.1 Run standard vitest test suite `npm run test:run` to ensure no state regressions.
- [x] 4.2 Run manual verification by doing a full diagnostic funnel pass, checking scroll to top on question transition, booking slot filtering, local resource downloads, and examining the exported PDF report formatting.
