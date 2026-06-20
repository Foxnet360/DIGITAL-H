# Spec: hook-test-coverage

## `useDiagnostic` test requirements

### Scenario 1: Happy path — successful API response
- **GIVEN** `fetch` returns `{ success: true, id: 1, share_token: 'abc-uuid', email_sent: true }`
- **WHEN** `finishDiagnostic(answers, lead, setLead, setScreen)` is called
- **THEN** `fetch` SHALL have been called with `'./api/diagnostic.php'` and method `'POST'`
- **AND** `setLead` SHALL be called with the updated lead including `score`, `level`, `id`, `share_token`
- **AND** `setScreen` SHALL be called with `'results'`
- **AND** `clearSession` SHALL have been called

### Scenario 2: API error — fetch throws
- **GIVEN** `fetch` rejects with a network error
- **WHEN** `finishDiagnostic()` is called
- **THEN** `setLead` SHALL still be called with `score` and `level` (fallback)
- **AND** `setScreen` SHALL still be called with `'results'`
- **AND** `clearSession` SHALL have been called

### Scenario 3: API error — non-OK response
- **GIVEN** `fetch` resolves with `response.ok === false`
- **WHEN** `finishDiagnostic()` is called
- **THEN** behavior SHALL match Scenario 2 (fallback path)

### Scenario 4: Analytics events are fired
- **GIVEN** `window.gtag` is a `vi.fn()` spy
- **WHEN** `finishDiagnostic()` succeeds
- **THEN** `window.gtag` SHALL have been called with `'event', 'digital_h_complete'`
- **AND** SHALL have been called with `'event', 'generate_lead'`
- **NOTE**: After `analytics-consolidation` is applied, update this test to assert on
  `trackEvent` mock instead of `window.gtag` directly

---

## `useGameState` test requirements

### Scenario 1: Points calculation
- **GIVEN** `answers` has 10 entries (each question answered)
- **WHEN** the hook renders
- **THEN** `points` SHALL equal `10 * 10 + 1 * 50 = 150` (10 answers + 1 completed module of 8)

### Scenario 2: Points at 48 answers (completion bonus)
- **GIVEN** `answers` has 48 entries
- **WHEN** the hook renders
- **THEN** `points` SHALL equal `48 * 10 + 6 * 50 + 100 = 880`

### Scenario 3: Badge unlock — primeros-pasos at 8 answers
- **GIVEN** `answers` has 8 entries and `unlockedBadges` is empty
- **WHEN** the hook renders
- **THEN** `unlockedBadges` SHALL contain `'primeros-pasos'`
- **AND** `showBadge` SHALL be `'primeros-pasos'`

### Scenario 4: Badge unlock — mitad-camino at 24 answers
- **GIVEN** `answers` has 24 entries and `unlockedBadges` contains only `'primeros-pasos'`
- **WHEN** the hook renders
- **THEN** `unlockedBadges` SHALL contain `'mitad-camino'`
- **AND** `showBadge` SHALL be `'mitad-camino'`

### Scenario 5: Badge unlock — explorador at 48 answers
- **GIVEN** `answers` has 48 entries and previous badges already unlocked
- **WHEN** the hook renders
- **THEN** `unlockedBadges` SHALL contain `'explorador'`

### Scenario 6: Badge not re-unlocked
- **GIVEN** `answers` has 8 entries AND `unlockedBadges` already contains `'primeros-pasos'`
- **WHEN** the hook renders
- **THEN** `showBadge` SHALL be `null` (badge was already unlocked, no re-trigger)

### Scenario 7: Badge auto-hides after 4 seconds
- **GIVEN** `showBadge` is set to `'primeros-pasos'`
- **WHEN** 4000ms elapse (use Vitest fake timers)
- **THEN** `showBadge` SHALL be `null`
