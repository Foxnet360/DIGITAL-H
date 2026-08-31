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
import EarlyLeadModal from './components/EarlyLeadModal';
import FunnelHeader from './components/FunnelHeader';
import FunnelFooter from './components/FunnelFooter';

type Screen = 'landing' | 'pretest' | 'questionnaire' | 'leadform' | 'results' | 'public-results';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [lead, setLead] = useState<Lead | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showEarlyLeadModal, setShowEarlyLeadModal] = useState(false);
  const [hasCapturedEarlyLead, setHasCapturedEarlyLead] = useState(false);
  const [questionnaireStartTime, setQuestionnaireStartTime] = useState<number | undefined>(undefined);
  const [publicResultsId, setPublicResultsId] = useState<string>('');
  const [publicResultsToken, setPublicResultsToken] = useState<string>('');

  const { currentIdx, setCurrentIdx, answers, setAnswers, handleAnswer, handleNext: rawHandleNext } = useQuestionnaire(() => {
    if (!lead) {
      transitionToScreen('leadform');
      trackLeadformStart(
        Math.round((Object.keys(answers).length / QUESTIONS.length) * 100)
      );
    } else {
      finishDiagnostic(answers, lead, setLead, transitionToScreen);
    }
  });

  const handleNextWithEarlyCapture = () => {
    // Early capture at Question 8 (Index 7: End of Estrategia Digital)
    if (currentIdx === 7 && !lead && !hasCapturedEarlyLead) {
      setShowEarlyLeadModal(true);
      return;
    }
    rawHandleNext();
  };

  const handleEarlyLeadSave = async (data: { name: string; email: string; company: string; gdprConsent: boolean }) => {
    const fullLead: Lead = {
      name: data.name,
      email: data.email,
      company: data.company || 'Empresa',
      phone: '',
      size: '10-50',
      role: 'Directivo',
      industry: 'General',
      gdprConsent: data.gdprConsent,
      gdprTimestamp: Date.now()
    };
    
    setLead(fullLead);
    setHasCapturedEarlyLead(true);
    setShowEarlyLeadModal(false);

    // Register partial lead immediately in database
    try {
      await fetch('/api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullLead.name,
          email: fullLead.email,
          company: fullLead.company,
          message: 'Lead capturado tempranamente en Módulo 1 DIGITAL-H (Estrategia Digital)',
          source: 'digital-h-early-module1'
        })
      });
    } catch {
      // Non-blocking
    }

    // Continue to Question 9 (Index 8)
    setCurrentIdx(8);
  };

  const { points, unlockedBadges, showBadge, setShowBadge } = useGameState(answers);
  const { showResumePrompt, setShowResumePrompt, loadSession } = useSession(answers, currentIdx, points, unlockedBadges, screen);
  const { finishDiagnostic } = useDiagnostic();
  const { transition } = useViewTransition();

  // Helper para transicionar entre pantallas con View Transitions
  const transitionToScreen = (newScreen: Screen) => {
    transition(() => {
      setScreen(newScreen);
    });
  };

  // Check URL hash for shared results or demo preview on mount
  useEffect(() => {
    const handleHashRoute = () => {
      const hash = window.location.hash;
      const match = hash.match(/^#results\/(\d+)\/([a-f0-9-]+)$/i);
      if (match) {
        setPublicResultsId(match[1]);
        setPublicResultsToken(match[2]);
        setScreen('public-results');
        return;
      }

      if (hash === '#demo' || hash === '#demo-results' || hash === '#demo-report') {
        const mockLead: Lead = {
          name: 'Carlos Mendoza',
          email: 'carlos.mendoza@empresa.com',
          company: 'Grupo Innovación S.A.S.',
          phone: '+57 300 123 4567',
          size: '50-200',
          role: 'CEO / Director General',
          industry: 'Tecnología & Servicios',
          gdprConsent: true,
          gdprTimestamp: Date.now(),
          score: 78
        };
        const mockAnswers: Record<string, number> = {
          'E1.1': 4, 'E1.2': 5, 'E1.3': 4, 'E1.4': 3, 'E1.5': 4, 'E1.6': 3, 'E1.7': 4, 'E1.8': 5,
          'C2.1': 4, 'C2.2': 4, 'C2.3': 3, 'C2.4': 5, 'C2.5': 4, 'C2.6': 4, 'C2.7': 3, 'C2.8': 4,
          'T3.1': 3, 'T3.2': 4, 'T3.3': 2, 'T3.4': 3, 'T3.5': 4, 'T3.6': 3, 'T3.7': 4, 'T3.8': 4,
          'I4.1': 4, 'I4.2': 5, 'I4.3': 3, 'I4.4': 4, 'I4.5': 5, 'I4.6': 4, 'I4.7': 3, 'I4.8': 4,
          'P5.1': 4, 'P5.2': 4, 'P5.3': 3, 'P5.4': 4, 'P5.5': 4, 'P5.6': 4, 'P5.7': 3, 'P5.8': 4,
          '6.1': 4, '6.2': 3, '6.3': 4, '6.4': 4, '6.5': 5, '6.6': 4, '6.7': 4, '6.8': 4
        };
        setAnswers(mockAnswers);
        setLead(mockLead);
        setScreen('results');
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

  // Scroll to top on screen change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

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
            onNext={handleNextWithEarlyCapture}
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

      <EarlyLeadModal isOpen={showEarlyLeadModal} onSave={handleEarlyLeadSave} />
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
