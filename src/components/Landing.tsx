import React from 'react';
import { motion } from 'motion/react';
import { Rocket, ChevronRight, CheckCircle2, BarChart3, Users, Shield, Heart, Star } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full space-y-8"
      >
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 text-primary-600 font-semibold text-sm mb-4">
          <Rocket className="w-4 h-4 mr-2" />
          Transformación Digital para PYMEs
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-[#1E293B] tracking-tight leading-tight">
          DIGITAL-<span className="text-primary-600">H</span>
        </h1>
        
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Descubre el nivel de madurez digital de tu organización con nuestro diagnóstico holístico. 
          Obtén insights accionables y una hoja de ruta personalizada.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-12">
          {[
            { icon: Rocket, label: 'Estrategia' },
            { icon: Heart, label: 'Cultura' },
            { icon: Users, label: 'Talento' },
            { icon: Shield, label: 'Tecnología' },
            { icon: BarChart3, label: 'Procesos' },
            { icon: Star, label: 'Bienestar' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
              className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-sm border border-slate-100"
            >
              <item.icon className="w-8 h-8 text-primary-500 mb-2" />
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary-200 flex items-center mx-auto"
        >
          Comenzar Diagnóstico
          <ChevronRight className="ml-2 w-5 h-5" />
        </motion.button>

        <div className="pt-8 flex items-center justify-center space-x-8 text-slate-400">
          <div className="flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
            <span className="text-sm">15-20 Minutos</span>
          </div>
          <div className="flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
            <span className="text-sm">Reporte Detallado</span>
          </div>
          <div className="flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
            <span className="text-sm">100% Gratuito</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
