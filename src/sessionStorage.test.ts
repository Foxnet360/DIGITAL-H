import { describe, it, expect, beforeEach } from 'vitest';
import { saveSession, loadSession, clearSession, SessionState } from './sessionStorage';

describe('sessionStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const mockSession: Omit<SessionState, 'timestamp'> = {
    answers: { q1: 10, q2: 5 },
    currentIdx: 2,
    points: 15,
    unlockedBadges: ['badge1']
  };

  it('saves session correctly', () => {
    saveSession(mockSession);
    const saved = localStorage.getItem('digitalh_session');
    expect(saved).not.toBeNull();
    const parsed = JSON.parse(saved as string);
    expect(parsed.currentIdx).toBe(2);
    expect(parsed.points).toBe(15);
    expect(parsed.timestamp).toBeDefined();
  });

  it('loads session correctly', () => {
    saveSession(mockSession);
    const loaded = loadSession();
    expect(loaded).not.toBeNull();
    expect(loaded?.answers).toEqual(mockSession.answers);
    expect(loaded?.currentIdx).toBe(mockSession.currentIdx);
    expect(loaded?.points).toBe(mockSession.points);
    expect(loaded?.unlockedBadges).toEqual(mockSession.unlockedBadges);
  });

  it('returns null if no session', () => {
    expect(loadSession()).toBeNull();
  });

  it('returns null if session is corrupted', () => {
    localStorage.setItem('digitalh_session', 'invalid_json');
    expect(loadSession()).toBeNull();

    localStorage.setItem('digitalh_session', JSON.stringify({ currentIdx: "not_a_number" }));
    expect(loadSession()).toBeNull();
  });

  it('clears session correctly', () => {
    saveSession(mockSession);
    expect(loadSession()).not.toBeNull();
    clearSession();
    expect(loadSession()).toBeNull();
  });
});
