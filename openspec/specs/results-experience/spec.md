# Spec: results-experience

## Requirement 1 — Decompose Results.tsx

The `Results.tsx` component SHALL be split into the following sub-components,
each in its own file under `src/components/results/`:

| Component | Responsibility |
|-----------|---------------|
| `ResultsHeader.tsx` | Score summary header (IMD %, level badge, user name) |
| `ScoreCard.tsx` | Animated circular/numeric IMD display |
| `DimensionChart.tsx` | Recharts radar/bar chart of the 6 dimensions |
| `RecommendationList.tsx` | 4 personalized recommendations |
| `TestimonialSection.tsx` | 2 testimonials matched to maturity level |
| `ResultsCTA.tsx` | Booking calendar CTA + secondary CTAs |
| `ResultsPDF.tsx` | PDF download button (wraps `generateReportPDF.ts`) |
| `Results.tsx` | Orchestrator — composes above components, no own logic |

### Scenario: Existing in-app results flow is unaffected
- **GIVEN** a user completes the diagnostic within the SPA
- **WHEN** they are navigated to the `results` screen
- **THEN** they SHALL see identical output to the current `Results.tsx`
- **AND** all existing props (`answers`, `lead`) SHALL remain the same interface

---

## Requirement 2 — Shareable Public Results Page

### 2a — Backend: GET endpoint to retrieve saved diagnostic

- **WHEN** a GET request is made to `./api/diagnostic.php?id={id}&token={token}`
- **THEN** the backend SHALL return the saved diagnostic data as JSON:
  ```json
  {
    "name": "...",
    "company": "...",
    "imd_score": 72,
    "maturity_level": "Avanzado",
    "answers_json": "{...}",
    "share_token": "..."
  }
  ```
- **AND** the backend SHALL validate that `token` matches the `share_token` stored for that `id`
- **AND** SHALL return HTTP 404 if `id` does not exist
- **AND** SHALL return HTTP 403 if `token` does not match

### 2b — Backend: share_token column

- **WHEN** a new diagnostic is saved (`INSERT` in `diagnostic.php`)
- **THEN** a `share_token` (UUID v4, 36 chars) SHALL be generated and stored
- **AND** the `share_token` SHALL be returned in the POST response alongside `id`

### 2c — Frontend: hash-based routing for public results

- **WHEN** the browser URL contains `#results/{id}/{token}`
- **THEN** the app SHALL render a `PublicResultsPage` component instead of the normal `Landing`
- **AND** `PublicResultsPage` SHALL fetch results from the GET endpoint using `id` and `token`
- **AND** SHALL display `ResultsHeader`, `ScoreCard`, `DimensionChart`, and `RecommendationList`
- **AND** SHALL show a loading state while fetching
- **AND** SHALL show a user-friendly error if the fetch fails (404 or 403)

### 2d — Frontend: pass share_token through the app flow

- **WHEN** `useDiagnostic.ts` receives a successful API response
- **THEN** it SHALL store `id` and `share_token` in the `Lead` object
- **AND** `Results.tsx` SHALL have access to the shareable URL:
  `{baseUrl}#results/{id}/{token}`

---

## Requirement 3 — Email includes shareable link

- **WHEN** `sendThankYouEmail()` is called after a successful diagnostic save
- **THEN** the email HTML SHALL include a CTA button labeled "Ver mis resultados completos"
- **AND** the button SHALL link to `https://acrux.life/digital-h/#results/{id}/{token}`
- **AND** this button SHALL appear before the Calendly booking CTA
- **AND** the fallback behavior (email failure does not block results screen) SHALL remain

---

## Requirement 4 — Security: share_token replaces sequential ID as access control

- The GET endpoint SHALL NOT return data with `id` alone (no token = 403)
- The `share_token` SHALL be a UUID v4 (128-bit entropy)
- No authentication is required — the token IS the access credential (capability URL pattern)
