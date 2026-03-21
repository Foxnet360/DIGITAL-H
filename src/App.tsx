import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { QUESTIONS, BADGES } from './constants';
import { calculateIMD, getMaturityLevel } from './utils';
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
  const [lead, setLead] = useState<any>(null);
  const [showExitModal, setShowExitModal] = useState(false);

  // Gamification Logic
  useEffect(() => {
    const answeredCount = Object.keys(answers).length;
    let newPoints = answeredCount * 10;
    
    // Module bonus
    const modulesCompleted = Math.floor(answeredCount / 8);
    newPoints += modulesCompleted * 50;
    
    if (answeredCount === 48) newPoints += 100;
    
    setPoints(newPoints);

    // Badge Checks
    const checkBadges = () => {
      const newBadges = [...unlockedBadges];
      let foundNew = false;

      if (answeredCount >= 8 && !newBadges.includes('primeros-pasos')) {
        newBadges.push('primeros-pasos');
        setShowBadge('primeros-pasos');
        foundNew = true;
      }
      if (answeredCount >= 24 && !newBadges.includes('mitad-camino')) {
        newBadges.push('mitad-camino');
        setShowBadge('mitad-camino');
        foundNew = true;
      }
      if (answeredCount >= 48 && !newBadges.includes('explorador')) {
        newBadges.push('explorador');
        setShowBadge('explorador');
        foundNew = true;
      }

      if (foundNew) setUnlockedBadges(newBadges);
    };

    checkBadges();
  }, [answers]);

  const handleAnswer = (id: string, val: number) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const handleNext = () => {
    // Lead Form Trigger: After 32 questions (4 modules)
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
    
    const finalLead = {
      ...lead,
      answers,
      score: imd,
      level: level.name,
      timestamp: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'leads'), finalLead);
      setLead(finalLead);
      setScreen('results');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'leads');
    }
  };

  const handleLeadSubmit = (data: any) => {
    setLead(data);
    setScreen('questionnaire');
    setCurrentIdx(32); // Continue with module 5
  };

  const handleVolverClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Si la persona ya está interactuando con el cuestionario o leadform
    if (screen === 'questionnaire' || screen === 'welcome' || screen === 'leadform') {
      setShowExitModal(true);
    } else {
      window.location.href = 'https://acrux.life';
    }
  };

  return (
    <div className="font-sans text-slate-900 bg-background min-h-screen flex flex-col">
      {/* Universal Top Navigation for Acrux */}
      <div className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="https://acrux.life" onClick={handleVolverClick} className="flex items-center text-slate-600 hover:text-indigo-600 font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Acrux
          </a>
          <div className="font-display font-bold text-slate-800 tracking-wide">DIGITAL-H</div>
        </div>
      </div>

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

      {/* Badge Notification Overlay */}
      <AnimatePresence>
        {showBadge && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-4 border border-white/10">
              <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest">¡Logro Desbloqueado!</div>
                <div className="text-lg font-bold">{BADGES.find(b => b.id === showBadge)?.name}</div>
              </div>
              <button 
                onClick={() => setShowBadge(null)}
                className="pointer-events-auto ml-4 text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>
            {/* Auto hide after 4s */}
            {setTimeout(() => setShowBadge(null), 4000) && null}
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
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-indigo-700 transition-all cursor-pointer"
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
            Desarrollado de manera exclusiva para <a href="https://acrux.life" className="text-indigo-400 hover:text-indigo-300 transition-colors">acrux.life</a>
          </p>
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
