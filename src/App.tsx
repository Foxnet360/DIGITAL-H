import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { QUESTIONS } from './constants';
import { saveSession, clearSession } from './sessionStorage';
import { Lead } from './types';
import Landing from './components/Landing';
import Questionnaire from './components/Questionnaire';
import LeadForm from './components/LeadForm';
import Results from './components/Results';
import { ArrowLeft } from 'lucide-react';

import { useGameState } from './hooks/useGameState';
import { useSession } from './hooks/useSession';
import { useQuestionnaire } from './hooks/useQuestionnaire';
import { useDiagnostic } from './hooks/useDiagnostic';

import BadgeNotification from './components/BadgeNotification';
import ResumePrompt from './components/ResumePrompt';
import SaveModal from './components/SaveModal';
import ExitModal from './components/ExitModal';

type Screen = 'landing' | 'questionnaire' | 'leadform' | 'results';

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
      {/* Universal Top Navigation for Acrux */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm py-4 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <a className="flex items-center gap-2 md:gap-3" href="https://acrux.life" onClick={handleVolverClick}>
                <img src="./acrux_logo.svg" alt="ACRUX" className="h-8 md:h-10 w-auto" />
                <span className="block font-display font-bold tracking-tight text-slate-900 text-xl leading-7">
                  Acrux Consultores
                </span>
              </a>
            </div>
            <div className="hidden lg:flex items-center space-x-8">
              <a 
                href="https://acrux.life" 
                className="bg-primary-600 text-white px-6 py-2.5 rounded-full text-sm font-bold font-display shadow-lg hover:shadow-xl hover:bg-primary-600/90 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                Volver a Acrux
                <ArrowLeft className="w-4 h-4" />
              </a>
            </div>
            <div className="lg:hidden">
              <a 
                href="https://acrux.life" 
                onClick={handleVolverClick}
                className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </nav>
      <div className="h-24" />

      <AnimatePresence mode="wait">
        {screen === 'landing' && (
          <Landing onStart={() => {
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
      <footer className="w-full bg-slate-900 border-t border-slate-800 py-8 mt-auto z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
          <p className="text-slate-400 text-sm font-semibold mb-2">
            Desarrollado de manera exclusiva para <a href="https://acrux.life" className="text-accent-400 hover:text-accent-300 transition-colors">acrux.life</a>
          </p>
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Todos los derechos reservados.
          </p>
        </div>
      </footer>
      )}
    </div>
  );
}
