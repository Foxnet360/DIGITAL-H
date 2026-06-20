# Design: hook-test-coverage

## Test Setup

Both test files use the existing Vitest + jsdom environment (`vitest.config.ts`).
No new dependencies required.

Mock strategy:
- `fetch` → `vi.fn()` on `global.fetch`
- `window.gtag` → `vi.fn()` on `window.gtag`
- `clearSession` → `vi.mock('../sessionStorage')`
- Timers → `vi.useFakeTimers()` / `vi.advanceTimersByTime()`

---

## `useDiagnostic.test.ts` — Structure

```typescript
import { renderHook } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useDiagnostic } from './useDiagnostic';

vi.mock('../sessionStorage', () => ({
  clearSession: vi.fn(),
}));

const mockLead = {
  name: 'Test User',
  email: 'test@example.com',
  company: 'ACME',
  size: '11-50',
  score: 0,
  level: '',
};

const mockAnswers = Object.fromEntries(
  Array.from({ length: 48 }, (_, i) => [`q${i + 1}`, 4])
);
// imd = (48 * 4) / 240 * 100 = 80 → level: 'Avanzado'

describe('useDiagnostic', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    (window as any).gtag = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Scenarios 1-4 as per spec
});
```

---

## `useGameState.test.ts` — Structure

```typescript
import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useGameState } from './useGameState';

describe('useGameState', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('points calculation', () => {
    it('calculates 150 points for 10 answers', () => {
      const answers = Object.fromEntries(
        Array.from({ length: 10 }, (_, i) => [`q${i + 1}`, 4])
      );
      const { result } = renderHook(() => useGameState(answers));
      expect(result.current.points).toBe(150); // 10*10 + 1*50
    });
    // ... other point scenarios
  });

  describe('badge unlocking', () => {
    it('unlocks primeros-pasos at 8 answers', async () => {
      const answers = Object.fromEntries(
        Array.from({ length: 8 }, (_, i) => [`q${i + 1}`, 4])
      );
      const { result } = renderHook(() => useGameState(answers));
      expect(result.current.unlockedBadges).toContain('primeros-pasos');
      expect(result.current.showBadge).toBe('primeros-pasos');
    });
    // ... other badge scenarios
  });

  describe('badge auto-hide timer', () => {
    it('hides badge after 4000ms', async () => {
      vi.useFakeTimers();
      const answers = Object.fromEntries(
        Array.from({ length: 8 }, (_, i) => [`q${i + 1}`, 4])
      );
      const { result } = renderHook(() => useGameState(answers));
      expect(result.current.showBadge).toBe('primeros-pasos');
      act(() => { vi.advanceTimersByTime(4000); });
      expect(result.current.showBadge).toBeNull();
      vi.useRealTimers();
    });
  });
});
```

---

## Points Formula Verification

From `useGameState.ts`:
```
points = answeredCount * 10 + floor(answeredCount / 8) * 50 + (answeredCount === 48 ? 100 : 0)
```

| Answers | Calc | Expected |
|---------|------|----------|
| 0 | 0 | 0 |
| 8 | 80 + 50 = 130 | 130 |
| 10 | 100 + 50 = 150 | 150 |
| 24 | 240 + 150 = 390 | 390 |
| 48 | 480 + 300 + 100 = 880 | 880 |
