import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award } from 'lucide-react';
import { BADGES } from '../constants';

interface BadgeNotificationProps {
  showBadge: string | null;
  onClose: () => void;
}

export default function BadgeNotification({ showBadge, onClose }: BadgeNotificationProps) {
  return (
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
              onClick={onClose}
              className="pointer-events-auto ml-4 text-slate-400 hover:text-white"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
