const SESSION_KEY = 'digitalh_session';

export interface SessionState {
  answers: Record<string, number>;
  currentIdx: number;
  points: number;
  unlockedBadges: string[];
  timestamp: number;
}

export function saveSession(state: Omit<SessionState, 'timestamp'>) {
  const data: SessionState = {
    ...state,
    timestamp: Date.now(),
  };
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch {
    // Ignore localStorage errors (e.g., private mode)
  }
}

export function loadSession(): SessionState | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SessionState;
    // Validate structure
    if (
      typeof data.answers === 'object' &&
      typeof data.currentIdx === 'number' &&
      typeof data.points === 'number' &&
      Array.isArray(data.unlockedBadges)
    ) {
      return data;
    }
  } catch {
    // Invalid or corrupted data
  }
  return null;
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore
  }
}
