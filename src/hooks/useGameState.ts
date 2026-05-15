import { useState, useEffect, useRef } from 'react';

export function useGameState(answers: Record<string, number>, initialBadges: string[] = []) {
  const [points, setPoints] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(initialBadges);
  const [showBadge, setShowBadge] = useState<string | null>(null);
  const badgeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Gamification: Points calculation
  useEffect(() => {
    const answeredCount = Object.keys(answers).length;
    let newPoints = answeredCount * 10;
    const modulesCompleted = Math.floor(answeredCount / 8);
    newPoints += modulesCompleted * 50;
    if (answeredCount === 48) newPoints += 100;
    setPoints(newPoints);
  }, [answers]);

  // Gamification: Badge checks
  useEffect(() => {
    const answeredCount = Object.keys(answers).length;
    const newBadges: string[] = [];
    let foundNew = false;

    if (answeredCount >= 8 && !unlockedBadges.includes('primeros-pasos')) {
      newBadges.push('primeros-pasos');
      foundNew = true;
    }
    if (answeredCount >= 24 && !unlockedBadges.includes('mitad-camino')) {
      newBadges.push('mitad-camino');
      foundNew = true;
    }
    if (answeredCount >= 48 && !unlockedBadges.includes('explorador')) {
      newBadges.push('explorador');
      foundNew = true;
    }

    if (foundNew) {
      const updated = [...unlockedBadges, ...newBadges];
      setUnlockedBadges(updated);
      setShowBadge(newBadges[newBadges.length - 1]);
    }
  }, [answers, unlockedBadges]);

  // Auto-hide badge with useRef timer
  useEffect(() => {
    if (showBadge) {
      if (badgeTimerRef.current) clearTimeout(badgeTimerRef.current);
      badgeTimerRef.current = setTimeout(() => {
        setShowBadge(null);
      }, 4000);
    }
    return () => {
      if (badgeTimerRef.current) clearTimeout(badgeTimerRef.current);
    };
  }, [showBadge]);

  return { points, unlockedBadges, setUnlockedBadges, showBadge, setShowBadge };
}
