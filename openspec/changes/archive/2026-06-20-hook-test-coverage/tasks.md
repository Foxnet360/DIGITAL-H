# Tasks: hook-test-coverage

## Phase 1 — `useDiagnostic.test.ts`

- [x] **T1.1** Create `src/hooks/useDiagnostic.test.ts`

- [x] **T1.2** Setup mocks:
  - `vi.mock('../sessionStorage', () => ({ clearSession: vi.fn() }))`
  - `global.fetch = vi.fn()` in `beforeEach`
  - `(window as any).gtag = vi.fn()` in `beforeEach`
  - `vi.restoreAllMocks()` in `afterEach`

- [x] **T1.3** Define `mockAnswers` with 48 entries (value 4 each) → IMD = 80 → level 'Avanzado' (Note: Actual level is 'Excelente')

- [x] **T1.4** Write test: **happy path**
  - Mock `fetch` to resolve `{ success: true, id: 1, share_token: 'uuid-token', email_sent: true }`
  - Call `finishDiagnostic(mockAnswers, mockLead, setLead, setScreen)`
  - Assert: `fetch` called with POST to `'./api/diagnostic.php'`
  - Assert: `setLead` called with `{ ...mockLead, score: 80, level: 'Excelente', id: 1, share_token: 'uuid-token' }`
  - Assert: `setScreen` called with `'results'`
  - Assert: `clearSession` called

- [x] **T1.5** Write test: **fetch network error**
  - Mock `fetch` to `Promise.reject(new Error('Network error'))`
  - Assert: `setLead` called with fallback (score + level, no id)
  - Assert: `setScreen` still called with `'results'`
  - Assert: `clearSession` called

- [x] **T1.6** Write test: **non-OK HTTP response**
  - Mock `fetch` to resolve `new Response(null, { status: 500 })`
  - Assert: fallback behavior (same as T1.5)

- [x] **T1.7** Write test: **analytics events fired on success**
  - Assert: `window.gtag` called with `('event', 'digital_h_complete', expect.objectContaining({ score: 80 }))`
  - Assert: `window.gtag` called with `('event', 'generate_lead', expect.anything())`
  - (Note: Mocked centralized analytics `trackEvent` and `trackLeadformComplete` since analytics-consolidation is active).

## Phase 2 — `useGameState.test.ts`

- [x] **T2.1** Create `src/hooks/useGameState.test.ts`

- [x] **T2.2** Write test: **0 answers → 0 points**
  - `renderHook(() => useGameState({}))`
  - Assert: `points === 0`

- [x] **T2.3** Write test: **8 answers → 130 points**
  - 8 answers × 10 + 1 module × 50 = 130

- [x] **T2.4** Write test: **10 answers → 150 points**
  - 10 × 10 + 1 × 50 = 150

- [x] **T2.5** Write test: **48 answers → 880 points**
  - 48 × 10 + 6 × 50 + 100 bonus = 880

- [x] **T2.6** Write test: **primeros-pasos badge at 8 answers**
  - Assert: `unlockedBadges` contains `'primeros-pasos'`
  - Assert: `showBadge === 'primeros-pasos'`

- [x] **T2.7** Write test: **mitad-camino badge at 24 answers**
  - `initialBadges: ['primeros-pasos']` passed to hook
  - Assert: `unlockedBadges` contains `'mitad-camino'`

- [x] **T2.8** Write test: **explorador badge at 48 answers**
  - `initialBadges: ['primeros-pasos', 'mitad-camino']`
  - Assert: `unlockedBadges` contains `'explorador'`

- [x] **T2.9** Write test: **badge not re-triggered when already unlocked**
  - 8 answers + `initialBadges: ['primeros-pasos']`
  - Assert: `showBadge === null`

- [x] **T2.10** Write test: **badge auto-hides after 4000ms**
  - Use `vi.useFakeTimers()` before render
  - 8 answers → badge shows
  - `act(() => vi.advanceTimersByTime(4000))`
  - Assert: `showBadge === null`
  - Call `vi.useRealTimers()` in cleanup

## Phase 3 — Verify

- [x] **T3.1** Run `npm run test:run` → all tests pass (0 failures)
- [x] **T3.2** Verify existing `sessionStorage.test.ts` and `utils.test.ts` still pass
- [x] **T3.3** Check total test count increased from 3 files to 5 files
