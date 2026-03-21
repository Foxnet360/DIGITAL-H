import React from 'react';
import { motion } from 'motion/react';
import { Info, Clock, Award, ChevronRight } from 'lucide-react';

interface WelcomeProps {
  onNext: () => void;
}

export default function Welcome({ onNext }: WelcomeProps) {
  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-2xl w-full bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100"
      >
        <h2 className="text-3xl font-bold text-[#1E293B] mb-6">¡Bienvenido a DIGITAL-H!</h2>
        
        <div className="space-y-6 mb-10">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-indigo-50 rounded-xl">
              <Info className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">¿Qué obtendrás?</h3>
              <p className="text-slate-600">Un análisis profundo de 6 dimensiones críticas de tu empresa y recomendaciones personalizadas.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-pink-50 rounded-xl">
              <Clock className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Tiempo estimado</h3>
              <p className="text-slate-600">Aproximadamente 15-20 minutos. Puedes pausar y continuar después.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-amber-50 rounded-xl">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Gamificación</h3>
              <p className="text-slate-600">Gana puntos y badges mientras avanzas. ¡Desbloquea el nivel Visionario!</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl mb-8 text-sm text-slate-500 italic">
          "No hay respuestas correctas o incorrectas. La sinceridad es clave para un diagnóstico útil que impulse tu transformación."
        </div>

        <button
          onClick={onNext}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 flex items-center justify-center hover:bg-indigo-700 transition-colors"
        >
          Empezar ahora
          <ChevronRight className="ml-2 w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
}
