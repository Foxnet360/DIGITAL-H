# Proposal: hook-test-coverage

## Problem

`useDiagnostic` and `useGameState` are business-critical hooks with zero test coverage:

- `useDiagnostic` handles the API call, analytics events, session clear, and screen navigation.
  A regression here silently breaks lead capture and result delivery.
- `useGameState` manages the gamification system (points, badges, timers).
  Badge unlock bugs are invisible without tests.

## Proposed Solution

Add Vitest unit tests for both hooks from scratch using `vi.fn()` for mocks.
Tests run in jsdom environment (already configured in `vitest.config.ts`).

## Scope

**In scope:**
- `src/hooks/useDiagnostic.test.ts` — test the full happy path, API error fallback,
  analytics calls, and session clear behavior
- `src/hooks/useGameState.test.ts` — test points calculation, badge unlock thresholds,
  badge auto-hide timer, and initial badges from session resume

**Out of scope:**
- Component-level tests (separate future change)
- `useQuestionnaire`, `useSession`, `useViewTransition` (lower priority, simpler logic)
- E2E / Playwright tests
