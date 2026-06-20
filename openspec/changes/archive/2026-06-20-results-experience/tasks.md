# Tasks: results-experience

## Phase 1 — Database & Backend

- [x] **T1.1** Add `share_token VARCHAR(36)` column to `digitalh_results` table
  - Run: `ALTER TABLE digitalh_results ADD COLUMN share_token VARCHAR(36) NOT NULL DEFAULT '' AFTER id;`
  - Run: `CREATE INDEX idx_share_token ON digitalh_results (share_token);`
  - Files: DB migration (manual or script in `database/`)

- [x] **T1.2** Update `public/api/diagnostic.php` POST handler
  - Generate UUID v4 `share_token` before INSERT
  - Add `share_token` to INSERT statement
  - Return `share_token` in success response JSON
  - Update `sendThankYouEmail()` call to pass `$insertId` and `$shareToken`

- [x] **T1.3** Add GET handler to `public/api/diagnostic.php`
  - Accept `?id={int}&token={string}` query params
  - Validate: id is integer, token is 36-char string
  - Query `digitalh_results` WHERE `id = ? AND share_token = ?`
  - Return 404 if no row found
  - Return JSON: `{ name, company, imd_score, maturity_level, answers_json, share_token }`
  - Do NOT return email address in GET response

- [x] **T1.4** Update `sendThankYouEmail()` in `public/api/config.php`
  - Add `$id` and `$shareToken` parameters to function signature
  - Add "Ver mis resultados completos" CTA button before the Calendly button
  - URL: `https://acrux.life/digital-h/#results/{$id}/{$shareToken}`

- [x] **T1.5** Mirror changes to `deploy/digital-h/api/` (sync with `public/api/`)

## Phase 2 — TypeScript Types

- [x] **T2.1** Update `src/types/shared.ts`
  - Add `diagnosticId?: number` to `Lead`
  - Add `shareToken?: string` to `Lead`
  - Fix `timestamp?: any` → `timestamp?: number`

## Phase 3 — Hook Update

- [x] **T3.1** Update `src/hooks/useDiagnostic.ts`
  - Parse `result.share_token` from API response
  - Store `id` and `share_token` in `setLead()` call
  - Compute `shareUrl = \`${window.location.origin}${window.location.pathname}#results/${id}/${shareToken}\``

## Phase 4 — Component Decomposition

- [x] **T4.1** Create `src/components/results/` directory and extract `ResultsHeader.tsx`
  - Props: `name`, `company`, `imd`, `level`, `shareUrl?`
  - Include copy-to-clipboard button if `shareUrl` is provided

- [x] **T4.2** Extract `ScoreCard.tsx`
  - Props: `imd`, `level`, `levelColor`
  - Preserve existing animation

- [x] **T4.3** Extract `DimensionChart.tsx`
  - Props: `answers`
  - Internally calls `getWeakDimensions()`
  - Wraps existing Recharts usage

- [x] **T4.4** Extract `RecommendationList.tsx`
  - Props: `answers`
  - Internally calls `getWeakDimensions()` + `getRecommendations()`

- [x] **T4.5** Extract `TestimonialSection.tsx`
  - Props: `level`
  - Internally calls `getTestimonials()`

- [x] **T4.6** Extract `ResultsCTA.tsx`
  - Props: `shareUrl?`, `lead`
  - Includes: share button, Calendly booking CTA, download PDF trigger

- [x] **T4.7** Extract `ResultsPDF.tsx`
  - Props: `answers`, `lead`
  - Wraps `generateReportPDF()` call with button UI

- [x] **T4.8** Refactor `Results.tsx` to orchestrator
  - Import and compose all sub-components
  - Remove all extracted logic
  - Verify: existing prop interface unchanged (`answers`, `lead`)

## Phase 5 — Hash Routing & Public Page

- [x] **T5.1** Create `src/components/PublicResultsPage.tsx`
  - Props: `id: string`, `token: string`
  - States: `loading | error | forbidden | success`
  - On mount: `GET /api/diagnostic.php?id={id}&token={token}`
  - On success: render `ResultsHeader` + `ScoreCard` + `DimensionChart` + `RecommendationList`
  - On 403: show "Link inválido o expirado" message
  - On error: show "Error al cargar resultados, intenta de nuevo"

- [x] **T5.2** Update `src/App.tsx` for hash routing
  - Add `'public-results'` to `Screen` type
  - Add `publicResultsId` and `publicResultsToken` state
  - Add `useEffect` on mount that reads `window.location.hash`
  - Pattern: `#results/{id}/{token}` — 36-char UUID v4 token
  - Render `<PublicResultsPage />` when screen === 'public-results'
  - Hide `FunnelHeader` back button on public results screen

## Phase 6 — Verification

- [x] **T6.1** Manual E2E: complete diagnostic → check email link → open public URL → verify results display
- [x] **T6.2** Manual: test 403 case (wrong token)
- [x] **T6.3** Manual: test 404 case (non-existent ID)
- [x] **T6.4** Verify existing in-app results flow unchanged
- [x] **T6.5** Verify PDF download still works from both in-app and public page CTA
