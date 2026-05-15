import { useEffect, useState, useRef } from 'react';
import { saveSession, loadSession, clearSession } from '../sessionStorage';

export function useSession(answers: Record<string, number>, currentIdx: number, points: number, unlockedBadges: string[], screen: string) {
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check for saved session on mount
  useEffect(() => {
    const session = loadSession();
    if (session && Object.keys(session.answers).length > 0) {
      setShowResumePrompt(true);
    }
  }, []);

  // Debounced save to localStorage
  useEffect(() => {
    if (screen === 'questionnaire' && Object.keys(answers).length > 0) {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        saveSession({ answers, currentIdx, points, unlockedBadges });
      }, 2000);
    }
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [answers, currentIdx, points, unlockedBadges, screen]);

  return { showResumePrompt, setShowResumePrompt, clearSession, loadSession };
}
