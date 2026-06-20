import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Calendar, ExternalLink, X, CheckCircle2 } from 'lucide-react';
import { getWeakDimensions, getRecommendations } from '../../utils';
import * as Icons from 'lucide-react';

interface RecommendationListProps {
  answers: Record<string, number>;
}

export default function RecommendationList({ answers }: RecommendationListProps) {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const weakDimensions = getWeakDimensions(answers);
  const nextSteps = getRecommendations(weakDimensions);

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.Rocket;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 flex flex-col h-full"
      >
        <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-primary-500" />
          Próximos Pasos Sugeridos
        </h3>
        <div className="space-y-4 flex-1">
          {nextSteps.map((step, i) => {
            const IconComponent = getIconComponent(step.icon);
            return (
              <div 
                key={step.id} 
                onClick={() => setSelectedStep(i)}
                className="flex items-start p-4 bg-slate-50 rounded-2xl group hover:bg-primary-50 transition-all cursor-pointer border border-transparent hover:border-primary-100"
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary-600 mr-4 shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-all">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-800 font-bold text-sm mb-1">{step.title}</p>
                  <p className="text-slate-500 text-sm line-clamp-2">{step.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-400 group-hover:translate-x-1 transition-all flex-shrink-0 self-center" />
              </div>
            );
          })}
        </div>
        
        <button 
          onClick={() => window.open('https://acrux.life/contacto', '_blank')}
          className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
        >
          Hablemos de tu proyecto
          <ExternalLink className="ml-2 w-5 h-5" />
        </button>
      </motion.div>

      {/* Step Detail Modal */}
      <AnimatePresence>
        {selectedStep !== null && nextSteps[selectedStep] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStep(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl z-10"
            >
              <button 
                onClick={() => setSelectedStep(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="space-y-6">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800">{nextSteps[selectedStep].title}</h3>
                <p className="text-xl text-slate-500 leading-relaxed">
                  {nextSteps[selectedStep].detail}
                </p>
                <div className="pt-6">
                  <button 
                    onClick={() => setSelectedStep(null)}
                    className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary-100 hover:bg-primary-700 transition-all"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
