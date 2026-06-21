# Design: Leadmagnet Improvements

## Technical Approach

We will resolve the 7 branding, UX, backend, and PDF layout findings using a clean, native approach that eliminates external SaaS dependencies (e.g. Calendly redirects) and ensures a premium, custom experience. 

1. **Branding Transparency**: Strip out the background vector `<rect>` layers in the SVGs (`acrux_logo.svg`, `favicon.svg`) to render transparently on all color themes.
2. **Scroll Transition**: Integrate `window.scrollTo({ top: 0, behavior: 'smooth' })` hooks in both the screen transitions state of `App.tsx` and the question transitions state of `Questionnaire.tsx`.
3. **Native Booking Integration**: Redirect external Calendly CTAs in `ResultsCTA.tsx` to the local `#booking-section` element. Refactor the `BookingCalendar.tsx` component to query `GET ./api/booking.php?date=YYYY-MM-DD` and dynamically filter out booked slots.
4. **Local Resource Hosting**: Copy the resource PDFs from the sibling `acrux.life` repository to `public/docs/` and rename them cleanly to resolve 404 links.
5. **PDF Layout Refactoring**: Redesign `generateReportPDF.ts` to draw the logo in the header of all pages, calculate total page count dynamically at the end by looping through generated pages (replacing hardcoded values), expand prioritize recommendation cards height, update copyright year to 2026, and add a clean closing page with a clickable CTA to `acrux.life`.

## Architecture Decisions

| Decision | Choice | Alternatives Considered | Rationale |
|----------|--------|-------------------------|-----------|
| **Logo Transparency** | Strip the background `<rect>` tags in the SVG code directly. | Stylize with CSS filters or blend modes. | Cleanest vector representation. Eliminates visual artifact issues without CPU/GPU blend overhead. |
| **Scroll-to-Top** | React `useEffect` listeners triggered on state changes (`screen`, `currentIdx`). | Ad-hoc call on each click handler. | Centralized state observation guarantees scroll resetting across all transition paths (prev/next/lead capture/results). |
| **Native Booking Query** | Query `GET ./api/booking.php?date=...` when date selected. | Hardcode slot lists or fetch all dates at once. | Lightweight, real-time availability checking. Minimizes database queries and ensures slots are locked in real-time. |
| **PDF Dynamic Footer** | Post-generation loop to print footer page count on generated pages. | Track page count during generation. | Standard jsPDF pattern. Safely computes true page count even if content expands dynamically over page boundaries. |

## Data Flow

### Booking Flow

```
   BookingCalendar (UI) ─────── GET /api/booking.php?date=YYYY-MM-DD ───────→ Database (booked slots)
          │                                                                           │
          │ (Filters slot visibility based on booked slots)                          │
          ▼                                                                           ▼
   Confirm Reservation ──────── POST /api/booking.php (JSON) ────────────────→ Database (locks slot)
                                                                                      │
                                                                                      ├─→ sendBookingConfirmationEmail() (to User)
                                                                                      └─→ sendBookingNotificationEmail() (to hola@acrux.life)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `public/acrux_logo.svg` | Modify | Remove the solid white/cream background rectangles. |
| `public/favicon.svg` | Modify | Remove the solid white/cream background rectangles. |
| `src/App.tsx` | Modify | Add screen-triggered scroll-to-top hook. |
| `src/components/Questionnaire.tsx` | Modify | Add question-triggered scroll-to-top hook. |
| `src/components/results/ResultsCTA.tsx` | Modify | Redirect Calendly links to `#booking-section`, change booking button text to "Reservar mi sesión con profesionales". |
| `src/components/BookingCalendar.tsx` | Modify | Query the backend for booked slots upon date selection. Unify texts. |
| `public/docs/10-Pasos-Para-la-Transformacion.pdf` | Create | Copy from sibling `acrux.life` repo. |
| `public/docs/eBook-La-PYME-Digital-del-Siglo-XXI.pdf` | Create | Copy from sibling `acrux.life` repo. |
| `src/generateReportPDF.ts` | Modify | Render logo in header, wrap recommendations text, use dynamic footer loop, update year, add CTA closing page. |
| `src/constants.ts` | Modify | Improve dimension descriptions with professional copy. |
| `src/components/Results.tsx` | Modify | Improve roadmap phase descriptions, update resources links to local paths. |

## Interfaces / Contracts

### API Booking Slot Availability Contract

```typescript
// Query booked slots
GET ./api/booking.php?date=YYYY-MM-DD

// Response
{
  "success": true,
  "date": "2026-06-21",
  "booked_slots": ["10:00", "14:00"]
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | State Hooks (`useQuestionnaire`, `useGameState`) | Run existing test suites (`npm run test:run`) to ensure state transitions remain unaffected. |
| Integration | Booking slot filtering | Select a date in the BookingCalendar UI, verify it requests slot availability, and disables occupied hours. |
| E2E / Manual | PDF Generation | Run a full test diagnostic run, download the report PDF, and verify layout correctness (no text overflow, header logo, dynamic page numbers, clickable closing link). |

## Migration / Rollout

No database schema migration is required. The `digitalh_bookings` table already supports the necessary columns (`booking_date`, `booking_time`). The files will be deployed directly.

## Open Questions

None.
