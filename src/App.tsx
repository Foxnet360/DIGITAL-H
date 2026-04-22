import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QUESTIONS, BADGES } from './constants';
import { calculateIMD, getMaturityLevel } from './utils';
import { saveSession, loadSession, clearSession } from './sessionStorage';
import { Lead } from './types';
import Landing from './components/Landing';
import Welcome from './components/Welcome';
import Questionnaire from './components/Questionnaire';
import LeadForm from './components/LeadForm';
import Results from './components/Results';
import { Award, ArrowLeft, AlertTriangle } from 'lucide-react';

type Screen = 'landing' | 'welcome' | 'questionnaire' | 'leadform' | 'results';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [points, setPoints] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [showBadge, setShowBadge] = useState<string | null>(null);
  const [lead, setLead] = useState<Lead | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  
  // Auto-hide badge timer ref (fix for task 3.1)
  const badgeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced session save (task 2.2)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check for saved session on mount (task 2.3)
  useEffect(() => {
    const session = loadSession();
    if (session && Object.keys(session.answers).length > 0) {
      setShowResumePrompt(true);
    }
  }, []);

  // Debounced save to localStorage (task 2.2)
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

  // Gamification: Points calculation (task 3.2 - separated from badges)
  useEffect(() => {
    const answeredCount = Object.keys(answers).length;
    let newPoints = answeredCount * 10;
    const modulesCompleted = Math.floor(answeredCount / 8);
    newPoints += modulesCompleted * 50;
    if (answeredCount === 48) newPoints += 100;
    setPoints(newPoints);
  }, [answers]);

  // Gamification: Badge checks (task 3.2 - fixed with correct dependencies)
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

  // Auto-hide badge with useRef timer (task 3.1 - fix setTimeout in JSX)
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

  const handleAnswer = (id: string, val: number) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const handleNext = () => {
    if (currentIdx === 31 && !lead) {
      setScreen('leadform');
      return;
    }

    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      finishDiagnostic();
    }
  };

  const finishDiagnostic = async () => {
    const imd = calculateIMD(answers);
    const level = getMaturityLevel(imd);
    
    const diagnosticData = {
      name: lead.name,
      email: lead.email,
      company: lead.company,
      size: lead.size,
      imd,
      level: level.name,
      answers,
      gdprConsent: lead.gdprConsent || false,
      gdprTimestamp: lead.gdprTimestamp,
    };

    try {
      const response = await fetch('/digital-h/api/diagnostic.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(diagnosticData),
      });

      if (!response.ok) {
        throw new Error('Error saving diagnostic');
      }

      const result = await response.json();
      
      setLead({
        ...lead,
        score: imd,
        level: level.name,
        id: result.id,
      });
      
      clearSession(); // task 2.5
      setScreen('results');
    } catch (error) {
      console.error('Error saving diagnostic:', error);
      // Still show results even if save fails
      setLead({
        ...lead,
        score: imd,
        level: level.name,
      });
      clearSession();
      setScreen('results');
    }
  };

  const handleLeadSubmit = (data: any) => {
    setLead(data);
    setScreen('questionnaire');
    setCurrentIdx(32);
  };

  const handleResume = () => {
    const session = loadSession();
    if (session) {
      setAnswers(session.answers);
      setCurrentIdx(session.currentIdx);
      setPoints(session.points);
      setUnlockedBadges(session.unlockedBadges);
      setScreen('questionnaire');
    }
    setShowResumePrompt(false);
  };

  const handleRestart = () => {
    clearSession(); // task 2.6
    setAnswers({});
    setCurrentIdx(0);
    setPoints(0);
    setUnlockedBadges([]);
    setLead(null);
    setScreen('welcome');
    setShowResumePrompt(false);
  };

  const handleVolverClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (screen === 'questionnaire' || screen === 'welcome' || screen === 'leadform') {
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
                <img src="/acrux_logo.svg" alt="ACRUX" className="h-8 md:h-10 w-auto" />
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
      {/* Spacer for fixed navbar */}
      <div className="h-24" />

      <AnimatePresence mode="wait">
        {screen === 'landing' && (
          <Landing onStart={() => setScreen('welcome')} />
        )}
        {screen === 'welcome' && (
          <Welcome onNext={() => setScreen('questionnaire')} />
        )}
        {screen === 'questionnaire' && (
          <Questionnaire
            questions={QUESTIONS}
            currentIdx={currentIdx}
            answers={answers}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onPrev={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
            points={points}
          />
        )}
        {screen === 'leadform' && (
          <LeadForm onSubmit={handleLeadSubmit} />
        )}
        {screen === 'results' && (
          <Results answers={answers} lead={lead} />
        )}
      </AnimatePresence>

      {/* Resume Session Prompt (task 2.3/2.4) */}
      <AnimatePresence>
        {showResumePrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl z-10 text-center"
            >
              <h3 className="font-display text-2xl font-bold text-slate-800 mb-3">
                ¿Continuar donde lo dejaste?
              </h3>
              <p className="text-slate-500 mb-8">
                Detectamos que tienes un diagnóstico en progreso. Puedes continuar desde la última pregunta respondida.
              </p>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleResume}
                  className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-primary-700 transition-all cursor-pointer"
                >
                  Continuar Diagnóstico
                </button>
                <button
                  onClick={handleRestart}
                  className="w-full py-4 bg-transparent text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Iniciar Nuevo Diagnóstico
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Badge Notification Overlay (task 3.1 - fixed timer) */}
      <AnimatePresence>
        {showBadge && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-4 border border-white/10">
              <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-accent-400 uppercase tracking-widest">¡Logro Desbloqueado!</div>
                <div className="text-lg font-bold">{BADGES.find(b => b.id === showBadge)?.name}</div>
              </div>
              <button 
                onClick={() => setShowBadge(null)}
                className="pointer-events-auto ml-4 text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persuasion Exit Modal */}
      <AnimatePresence>
        {showExitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExitModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl z-10 text-center"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mx-auto mb-6">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-800 mb-3">
                ¡Espera un momento!
              </h3>
              <p className="text-slate-500 mb-8">
                Estás construyendo el mapa de tu madurez digital. Si sales ahora, 
                perderás el progreso de tu evaluación corporativa.
              </p>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => setShowExitModal(false)}
                  className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-primary-700 transition-all cursor-pointer"
                >
                  Continuar Diagnóstico
                </button>
                <a
                  href="https://acrux.life"
                  className="w-full py-4 bg-transparent text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Sí, salir a Acrux.life
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
    </div>
  );
}
