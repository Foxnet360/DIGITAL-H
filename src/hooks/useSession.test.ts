import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSession } from './useSession';
import { loadSession, saveSession, clearSession } from '../sessionStorage';

vi.mock('../sessionStorage', async (importOriginal) => {
  const original = await importOriginal<typeof import('../sessionStorage')>();
  return {
    ...original,
    loadSession: vi.fn(),
    saveSession: vi.fn(),
    clearSession: vi.fn(),
  };
});

describe('useSession', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    localStorage.clear();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  const baseArgs = {
    answers: { q1: 4 },
    currentIdx: 0,
    points: 10,
    unlockedBadges: ['primeros-pasos'],
    screen: 'questionnaire',
  };

  it('shows resume prompt when a non-empty saved session exists on mount', () => {
    (loadSession as ReturnType<typeof vi.fn>).mockReturnValue({
      answers: { q1: 4 },
      currentIdx: 2,
      points: 30,
      unlockedBadges: ['primeros-pasos'],
      timestamp: Date.now(),
    });

    const { result } = renderHook(() => useSession(baseArgs.answers, baseArgs.currentIdx, baseArgs.points, baseArgs.unlockedBadges, 'landing'));

    expect(result.current.showResumePrompt).toBe(true);
  });

  it('does not show resume prompt when localStorage is empty', () => {
    (loadSession as ReturnType<typeof vi.fn>).mockReturnValue(null);

    const { result } = renderHook(() => useSession(baseArgs.answers, baseArgs.currentIdx, baseArgs.points, baseArgs.unlockedBadges, 'landing'));

    expect(result.current.showResumePrompt).toBe(false);
  });

  it('does not show resume prompt when saved session has no answers', () => {
    (loadSession as ReturnType<typeof vi.fn>).mockReturnValue({
      answers: {},
      currentIdx: 0,
      points: 0,
      unlockedBadges: [],
      timestamp: Date.now(),
    });

    const { result } = renderHook(() => useSession(baseArgs.answers, baseArgs.currentIdx, baseArgs.points, baseArgs.unlockedBadges, 'landing'));

    expect(result.current.showResumePrompt).toBe(false);
  });

  it('debounced save writes to localStorage after 2 seconds on questionnaire screen', async () => {
    (loadSession as ReturnType<typeof vi.fn>).mockReturnValue(null);

    renderHook(() =>
      useSession(baseArgs.answers, baseArgs.currentIdx, baseArgs.points, baseArgs.unlockedBadges, 'questionnaire')
    );

    expect(saveSession).not.toHaveBeenCalled();

    vi.advanceTimersByTime(2000);

    await waitFor(() =>
      expect(saveSession).toHaveBeenCalledWith({
        answers: baseArgs.answers,
        currentIdx: baseArgs.currentIdx,
        points: baseArgs.points,
        unlockedBadges: baseArgs.unlockedBadges,
      })
    );
  });

  it('does not save to localStorage on non-questionnaire screens', () => {
    (loadSession as ReturnType<typeof vi.fn>).mockReturnValue(null);

    renderHook(() =>
      useSession(baseArgs.answers, baseArgs.currentIdx, baseArgs.points, baseArgs.unlockedBadges, 'landing')
    );

    vi.advanceTimersByTime(3000);

    expect(saveSession).not.toHaveBeenCalled();
  });

  it('does not save to localStorage when no answers have been recorded', () => {
    (loadSession as ReturnType<typeof vi.fn>).mockReturnValue(null);

    renderHook(() =>
      useSession({}, 0, 0, [], 'questionnaire')
    );

    vi.advanceTimersByTime(3000);

    expect(saveSession).not.toHaveBeenCalled();
  });

  it('cancels pending save when answers change before debounce elapses', () => {
    (loadSession as ReturnType<typeof vi.fn>).mockReturnValue(null);

    const { rerender } = renderHook(
      ({ answers }: { answers: Record<string, number> }) => useSession(answers, 0, 10, [], 'questionnaire'),
      { initialProps: { answers: { q1: 4 } } }
    );

    vi.advanceTimersByTime(1000);
    expect(saveSession).not.toHaveBeenCalled();

    rerender({ answers: { q1: 4, q2: 5 } });
    vi.advanceTimersByTime(1000);
    expect(saveSession).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(saveSession).toHaveBeenCalledTimes(1);
    expect(saveSession).toHaveBeenLastCalledWith({
      answers: { q1: 4, q2: 5 },
      currentIdx: 0,
      points: 10,
      unlockedBadges: [],
    });
  });

  it('exposes loadSession that returns saved session', () => {
    const saved = {
      answers: { q1: 4, q2: 5 },
      currentIdx: 2,
      points: 25,
      unlockedBadges: ['primeros-pasos'],
      timestamp: Date.now(),
    };
    (loadSession as ReturnType<typeof vi.fn>).mockReturnValue(saved);

    const { result } = renderHook(() => useSession(baseArgs.answers, baseArgs.currentIdx, baseArgs.points, baseArgs.unlockedBadges, 'landing'));

    expect(result.current.loadSession()).toEqual(saved);
  });

  it('exposes clearSession that removes saved data', () => {
    (loadSession as ReturnType<typeof vi.fn>).mockReturnValue(null);

    const { result } = renderHook(() => useSession(baseArgs.answers, baseArgs.currentIdx, baseArgs.points, baseArgs.unlockedBadges, 'landing'));

    result.current.clearSession();

    expect(clearSession).toHaveBeenCalled();
  });
});
