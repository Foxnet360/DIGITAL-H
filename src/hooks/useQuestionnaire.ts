import { useState, useEffect } from 'react';
import { QUESTIONS } from '../constants';

export function useQuestionnaire(onComplete: () => void) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const handleAnswer = (id: string, val: number) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      onComplete();
    }
  };

  return { currentIdx, setCurrentIdx, answers, setAnswers, handleAnswer, handleNext };
}
