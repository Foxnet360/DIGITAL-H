import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, afterEach } from 'vitest';
import { useGameState } from './useGameState';

describe('useGameState', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('points calculation', () => {
    it('calculates 0 points for 0 answers', () => {
      const answers = {};
      const { result } = renderHook(() => useGameState(answers));
      expect(result.current.points).toBe(0);
    });

    it('calculates 130 points for 8 answers', () => {
      const answers = Object.fromEntries(
        Array.from({ length: 8 }, (_, i) => [`q${i + 1}`, 4])
      );
      const { result } = renderHook(() => useGameState(answers));
      expect(result.current.points).toBe(130); // 8 * 10 + 1 * 50 = 130
    });

    it('calculates 150 points for 10 answers', () => {
      const answers = Object.fromEntries(
        Array.from({ length: 10 }, (_, i) => [`q${i + 1}`, 4])
      );
      const { result } = renderHook(() => useGameState(answers));
      expect(result.current.points).toBe(150); // 10 * 10 + 1 * 50 = 150
    });

    it('calculates 880 points for 48 answers', () => {
      const answers = Object.fromEntries(
        Array.from({ length: 48 }, (_, i) => [`q${i + 1}`, 4])
      );
      const { result } = renderHook(() => useGameState(answers));
      expect(result.current.points).toBe(880); // 48 * 10 + 6 * 50 + 100 = 880
    });
  });

  describe('badge unlocking', () => {
    it('unlocks primeros-pasos badge at 8 answers', () => {
      const answers = Object.fromEntries(
        Array.from({ length: 8 }, (_, i) => [`q${i + 1}`, 4])
      );
      const { result } = renderHook(() => useGameState(answers));
      expect(result.current.unlockedBadges).toContain('primeros-pasos');
      expect(result.current.showBadge).toBe('primeros-pasos');
    });

    it('unlocks mitad-camino badge at 24 answers', () => {
      const answers = Object.fromEntries(
        Array.from({ length: 24 }, (_, i) => [`q${i + 1}`, 4])
      );
      const { result } = renderHook(() => useGameState(answers, ['primeros-pasos']));
      expect(result.current.unlockedBadges).toContain('mitad-camino');
      expect(result.current.unlockedBadges).toContain('primeros-pasos');
      expect(result.current.showBadge).toBe('mitad-camino');
    });

    it('unlocks explorador badge at 48 answers', () => {
      const answers = Object.fromEntries(
        Array.from({ length: 48 }, (_, i) => [`q${i + 1}`, 4])
      );
      const { result } = renderHook(() => useGameState(answers, ['primeros-pasos', 'mitad-camino']));
      expect(result.current.unlockedBadges).toContain('explorador');
      expect(result.current.showBadge).toBe('explorador');
    });

    it('does not re-trigger badge show when already unlocked in initialBadges', () => {
      const answers = Object.fromEntries(
        Array.from({ length: 8 }, (_, i) => [`q${i + 1}`, 4])
      );
      const { result } = renderHook(() => useGameState(answers, ['primeros-pasos']));
      expect(result.current.showBadge).toBeNull();
    });
  });

  describe('badge auto-hide timer', () => {
    it('hides badge after 4000ms', () => {
      vi.useFakeTimers();
      const answers = Object.fromEntries(
        Array.from({ length: 8 }, (_, i) => [`q${i + 1}`, 4])
      );
      const { result } = renderHook(() => useGameState(answers));
      expect(result.current.showBadge).toBe('primeros-pasos');
      
      act(() => {
        vi.advanceTimersByTime(4000);
      });
      
      expect(result.current.showBadge).toBeNull();
      vi.useRealTimers();
    });
  });
});
