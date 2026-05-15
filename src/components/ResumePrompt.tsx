import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ResumePromptProps {
  show: boolean;
  onResume: () => void;
  onRestart: () => void;
}

export default function ResumePrompt({ show, onResume, onRestart }: ResumePromptProps) {
  return (
    <AnimatePresence>
      {show && (
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
                onClick={onResume}
                className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-primary-700 transition-all cursor-pointer"
              >
                Continuar Diagnóstico
              </button>
              <button
                onClick={onRestart}
                className="w-full py-4 bg-transparent text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all cursor-pointer"
              >
                Iniciar Nuevo Diagnóstico
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
