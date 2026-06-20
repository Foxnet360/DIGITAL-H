import React, { useState, useEffect } from 'react';
import { QUESTIONS } from './constants';
import { saveSession, clearSession } from './sessionStorage';
import { Lead } from './types';
import Landing from './components/Landing';
import PreTestScreen from './components/PreTestScreen';
import Questionnaire from './components/Questionnaire';
import LeadForm from './components/LeadForm';
import Results from './components/Results';
import PublicResultsPage from './components/PublicResultsPage';
import { trackLeadformStart, trackQuestionnaireAbandon } from './utils/analytics';

import { useGameState } from './hooks/useGameState';
import { useSession } from './hooks/useSession';
import { useQuestionnaire } from './hooks/useQuestionnaire';
import { useDiagnostic } from './hooks/useDiagnostic';
import { useViewTransition } from './hooks/useViewTransition';

import BadgeNotification from './components/BadgeNotification';
import ResumePrompt from './components/ResumePrompt';
import SaveModal from './components/SaveModal';
import ExitModal from './components/ExitModal';
import FunnelHeader from './components/FunnelHeader';
import FunnelFooter from './components/FunnelFooter';

type Screen = 'landing' | 'pretest' | 'questionnaire' | 'leadform' | 'results' | 'public-results';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [lead, setLead] = useState<Lead | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [questionnaireStartTime, setQuestionnaireStartTime] = useState<number | undefined>(undefined);
  const [publicResultsId, setPublicResultsId] = useState<string>('');
  const [publicResultsToken, setPublicResultsToken] = useState<string>('');

  const { currentIdx, setCurrentIdx, answers, setAnswers, handleAnswer, handleNext } = useQuestionnaire(() => {
    if (!lead) {
      transitionToScreen('leadform');
      trackLeadformStart(
        Math.round((Object.keys(answers).length / QUESTIONS.length) * 100)
      );
    } else {
      finishDiagnostic(answers, lead, setLead, transitionToScreen);
    }
  });

  const { points, unlockedBadges, setUnlockedBadges, showBadge, setShowBadge } = useGameState(answers);
  const { showResumePrompt, setShowResumePrompt, loadSession } = useSession(answers, currentIdx, points, unlockedBadges, screen);
  const { finishDiagnostic } = useDiagnostic();
  const { transition } = useViewTransition();

  // Helper para transicionar entre pantallas con View Transitions
  const transitionToScreen = (newScreen: Screen) => {
    transition(() => {
      setScreen(newScreen);
    });
  };

  // Check URL hash for shared results on mount
  useEffect(() => {
    const handleHashRoute = () => {
      const hash = window.location.hash;
      const match = hash.match(/^#results\/(\d+)\/([a-f0-9-]+)$/i);
      if (match) {
        setPublicResultsId(match[1]);
        setPublicResultsToken(match[2]);
        setScreen('public-results');
      }
    };

    handleHashRoute();
    window.addEventListener('hashchange', handleHashRoute);
    return () => window.removeEventListener('hashchange', handleHashRoute);
  }, []);

  // Track questionnaire abandonment
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (screen === 'questionnaire' && currentIdx < QUESTIONS.length - 1) {
        trackQuestionnaireAbandon(
          Math.round(((currentIdx + 1) / QUESTIONS.length) * 100),
          currentIdx + 1
        );
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [screen, currentIdx]);

  const handleLeadSubmit = (data: any) => {
    setLead(data);
    finishDiagnostic(answers, data, setLead, transitionToScreen);
  };

  const handleResume = () => {
    const session = loadSession();
    if (session) {
      setAnswers(session.answers);
      setCurrentIdx(session.currentIdx);
      // points and badges will recalculate via useGameState hook
      setQuestionnaireStartTime(Date.now());
      transitionToScreen('questionnaire');
    }
    setShowResumePrompt(false);
  };

  const handleRestart = () => {
    clearSession();
    setAnswers({});
    setCurrentIdx(0);
    // points and badges auto recalculate
    setLead(null);
    transitionToScreen('landing');
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
    <div className="font-sans text-slate-900 bg-background min-h-screen flex flex-col" data-view-transition>
      <FunnelHeader 
        onVolverClick={handleVolverClick} 
        title="Acrux | DIGITAL-H" 
        showBackButton={screen !== 'public-results'} 
      />

        {screen === 'landing' && (
          <Landing onStart={() => {
            transitionToScreen('pretest');
          }} />
        )}
        {screen === 'pretest' && (
          <PreTestScreen onStart={() => {
            setQuestionnaireStartTime(Date.now());
            transitionToScreen('questionnaire');
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
          <Results answers={answers} lead={lead!} />
        )}
        {screen === 'public-results' && (
          <PublicResultsPage id={publicResultsId} token={publicResultsToken} />
        )}

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
