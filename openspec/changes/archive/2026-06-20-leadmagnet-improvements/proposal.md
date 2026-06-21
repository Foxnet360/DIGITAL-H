# Proposal: Leadmagnet Improvements

## Intent
Improve the DIGITAL-H leadmagnet branding, user experience (UX), native booking system integration, and PDF report layout by resolving 7 identified findings.

## Scope & Deliverables
1. **Logo Transparency**: Remove solid backgrounds from `public/acrux_logo.svg` and `public/favicon.svg`.
2. **Scroll to Top**: Ensure screen/question transitions in `App.tsx` and `Questionnaire.tsx` scroll the viewport to the top.
3. **Native Booking System**: Link Calendly CTAs in `ResultsCTA.tsx` to `#booking-section` and fetch busy slots from local DB in `BookingCalendar.tsx`.
4. **Terminology Update**: Change "Psicólogo Organizacional" to "profesionales" in `BookingCalendar.tsx` and `ResultsCTA.tsx`.
5. **Transformation Roadmap**: Update roadmap descriptions in `Results.tsx` and `generateReportPDF.ts` with unified, professional copy.
6. **Exclusive Resources 404s**: Host local PDFs in `public/docs/` and fix references in `Results.tsx` and `public/api/config.php`.
7. **PDF Template Overhaul**: Move logo to header, implement dynamic page counting (e.g., "Página X de Y"), fix footer overlaps, update copyright year to 2026, wrap recommendation lists cleanly, and add a closing CTA link.

## Affected Files
* SVG assets: `public/acrux_logo.svg`, `public/favicon.svg`
* Frontend components: `src/App.tsx`, `src/components/Questionnaire.tsx`, `src/components/Results.tsx`, `src/components/BookingCalendar.tsx`, `src/components/results/ResultsCTA.tsx`
* Backend & Config: `public/api/booking.php`, `public/api/config.php`
* PDF engine: `src/generateReportPDF.ts`
* New files: `public/docs/10-Pasos-Para-la-Transformacion.pdf`, `public/docs/eBook-La-PYME-Digital-del-Siglo-XXI.pdf`

## Contract Capabilities
### Modified Capabilities
* `acux-branding`: logo transparency and text adjustments
* `lead-capture-form`: page scroll-to-top on questions
* `booking-calendar`: local DB booking, terminology unification
* `pdf-report-generator`: PDF logo layout, footer overlaps, recommendations layout, year update, closing CTA

## Rollback Plan
If any regression is found, revert changes via git:
`git checkout -- src/ public/`

## Success Criteria
1. Logo renders transparently on dark themes.
2. Questionnaire transitions scroll to top.
3. Booking calendar queries local database and bookings are registered.
4. "Psicólogo Organizacional" replaced by "profesionales".
5. Exclusive PDFs load directly without 404.
6. PDF reports generate with dynamic pages, updated year (2026), no overlapping texts/footers, and redirect CTA.
