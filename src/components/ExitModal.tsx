import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

interface ExitModalProps {
  show: boolean;
  onClose: () => void;
  onSaveAndExit: () => void;
}

export default function ExitModal({ show, onClose, onSaveAndExit }: ExitModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
                onClick={onClose}
                className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-primary-700 transition-all cursor-pointer"
              >
                Continuar Diagnóstico
              </button>
              <button
                onClick={onSaveAndExit}
                className="w-full py-4 bg-transparent text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all cursor-pointer"
              >
                Guardar y salir a Acrux.life
              </button>
              <a
                href="https://acrux.life"
                className="w-full py-4 bg-transparent text-slate-400 rounded-2xl font-bold hover:bg-slate-50 transition-all cursor-pointer text-sm"
              >
                Salir sin guardar
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
