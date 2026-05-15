import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save } from 'lucide-react';

interface SaveModalProps {
  show: boolean;
  onClose: () => void;
}

export default function SaveModal({ show, onClose }: SaveModalProps) {
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
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-6">
              <Save className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-bold text-slate-800 mb-3">
              ¡Progreso guardado!
            </h3>
            <p className="text-slate-500 mb-8">
              Tu sesión ha sido guardada. Puedes cerrar esta pestaña y continuar cuando quieras desde donde lo dejaste.
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={onClose}
                className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-primary-700 transition-all cursor-pointer"
              >
                Continuar Diagnóstico
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
