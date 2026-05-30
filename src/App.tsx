import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { QUESTIONS } from './constants';
import { saveSession, clearSession } from './sessionStorage';
import { Lead } from './types';
import Landing from './components/Landing';
import PreTestScreen from './components/PreTestScreen';
import Questionnaire from './components/Questionnaire';
import LeadForm from './components/LeadForm';
import Results from './components/Results';

import { useGameState } from './hooks/useGameState';
import { useSession } from './hooks/useSession';
import { useQuestionnaire } from './hooks/useQuestionnaire';
import { useDiagnostic } from './hooks/useDiagnostic';

import BadgeNotification from './components/BadgeNotification';
import ResumePrompt from './components/ResumePrompt';
import SaveModal from './components/SaveModal';
import ExitModal from './components/ExitModal';
import FunnelHeader from './components/FunnelHeader';
import FunnelFooter from './components/FunnelFooter';

type Screen = 'landing' | 'pretest' | 'questionnaire' | 'leadform' | 'results';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [lead, setLead] = useState<Lead | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [questionnaireStartTime, setQuestionnaireStartTime] = useState<number | undefined>(undefined);

  const { currentIdx, setCurrentIdx, answers, setAnswers, handleAnswer, handleNext } = useQuestionnaire(() => {
    if (!lead) {
      setScreen('leadform');
      if (window.gtag) {
        const utmSource = new URLSearchParams(window.location.search).get('utm_source') || 'organico';
        window.gtag('event', 'digital_h_leadform_start', {
          utm_source: utmSource,
          question_completion_rate: Math.round((Object.keys(answers).length / QUESTIONS.length) * 100),
          flow_version: 'v2_q48_capture'
        });
      }
    } else {
      finishDiagnostic(answers, lead, setLead, setScreen);
    }
  });

  const { points, unlockedBadges, setUnlockedBadges, showBadge, setShowBadge } = useGameState(answers);
  const { showResumePrompt, setShowResumePrompt, loadSession } = useSession(answers, currentIdx, points, unlockedBadges, screen);
  const { finishDiagnostic } = useDiagnostic();

  // Track questionnaire abandonment
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (screen === 'questionnaire' && currentIdx < QUESTIONS.length - 1) {
        if (window.gtag) {
          window.gtag('event', 'digital_h_questionnaire_abandon', {
            question_number: currentIdx + 1,
            total_questions: QUESTIONS.length,
            progress_percentage: Math.round(((currentIdx + 1) / QUESTIONS.length) * 100),
            flow_version: 'v2_q48_capture'
          });
        }
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [screen, currentIdx]);

  const handleLeadSubmit = (data: any) => {
    setLead(data);
    finishDiagnostic(answers, data, setLead, setScreen);
  };

  const handleResume = () => {
    const session = loadSession();
    if (session) {
      setAnswers(session.answers);
      setCurrentIdx(session.currentIdx);
      // points and badges will recalculate via useGameState hook
      setQuestionnaireStartTime(Date.now());
      setScreen('questionnaire');
    }
    setShowResumePrompt(false);
  };

  const handleRestart = () => {
    clearSession();
    setAnswers({});
    setCurrentIdx(0);
    // points and badges auto recalculate
    setLead(null);
    setScreen('landing');
    setShowResumePrompt(false);
  };

  const handleSaveSession = () => {
    saveSession({ answers, currentIdx, points, unlockedBadges });
    setShowSaveModal(true);
  };

  const handleVolverClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (screen === 'questionnaire' || screen === 'leadform') {
      setShowExitModal(true);
    } else {
      window.location.href = 'https://acrux.life';
    }
  };

  return (
    <div className="font-sans text-slate-900 bg-background min-h-screen flex flex-col">
      <FunnelHeader onVolverClick={handleVolverClick} title="Acrux | DIGITAL-H" />

      <AnimatePresence mode="wait">
        {screen === 'landing' && (
          <Landing onStart={() => {
            setScreen('pretest');
          }} />
        )}
        {screen === 'pretest' && (
          <PreTestScreen onStart={() => {
            setQuestionnaireStartTime(Date.now());
            setScreen('questionnaire');
          }} />
        )}
        {screen === 'questionnaire' && (
          <Questionnaire
            questions={QUESTIONS}
            currentIdx={currentIdx}
            answers={answers}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onPrev={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
            onSaveSession={handleSaveSession}
            points={points}
            startTime={questionnaireStartTime}
          />
        )}
        {screen === 'leadform' && (
          <LeadForm 
            onSubmit={handleLeadSubmit}
            elapsedTime={questionnaireStartTime ? Math.floor((Date.now() - questionnaireStartTime) / 1000) : 0}
            questionsAnswered={Object.keys(answers).length}
            totalQuestions={QUESTIONS.length}
            unlockedBadges={unlockedBadges}
          />
        )}
        {screen === 'results' && (
          <Results answers={answers} lead={lead} />
        )}
      </AnimatePresence>

      <ResumePrompt show={showResumePrompt} onResume={handleResume} onRestart={handleRestart} />
      <BadgeNotification showBadge={showBadge} onClose={() => setShowBadge(null)} />
      <SaveModal show={showSaveModal} onClose={() => setShowSaveModal(false)} />
      <ExitModal 
        show={showExitModal} 
        onClose={() => setShowExitModal(false)} 
        onSaveAndExit={() => {
          saveSession({ answers, currentIdx, points, unlockedBadges });
          window.location.href = 'https://acrux.life';
        }} 
      />

      {screen !== 'questionnaire' && (
        <FunnelFooter />
      )}
    </div>
  );
}
