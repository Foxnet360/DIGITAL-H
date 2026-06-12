import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Rocket, Heart, Users, Shield, BarChart3, Star, 
  ArrowRight, Clock, FileText, TrendingUp, CheckCircle2,
  FileCheck, Lock, ExternalLink
} from 'lucide-react';

interface PreTestScreenProps {
  onStart: () => void;
}

const DIMENSIONS = [
  { 
    icon: Rocket, 
    label: 'Estrategia Digital', 
    color: 'text-primary-600', 
    bg: 'bg-primary-50',
    description: 'Visión, roadmap y gobernanza digital' 
  },
  { 
    icon: Heart, 
    label: 'Cultura y Liderazgo', 
    color: 'text-red-500', 
    bg: 'bg-red-50',
    description: 'Mindset digital y valores organizacionales' 
  },
  { 
    icon: Users, 
    label: 'Talento y Competencias', 
    color: 'text-cyan-600', 
    bg: 'bg-cyan-50',
    description: 'People analytics y RRHH 4.0' 
  },
  { 
    icon: Shield, 
    label: 'Tecnología e Infraestructura', 
    color: 'text-purple-600', 
    bg: 'bg-purple-50',
    description: 'Stack tech y ciberseguridad' 
  },
  { 
    icon: BarChart3, 
    label: 'Procesos y Datos', 
    color: 'text-amber-600', 
    bg: 'bg-amber-50',
    description: 'Automatización y analytics' 
  },
  { 
    icon: Star, 
    label: 'Experiencia y Bienestar', 
    color: 'text-emerald-600', 
    bg: 'bg-emerald-50',
    description: 'Engagement y eNPS' 
  },
];

const EXPECTED_OUTPUTS = [
  { icon: FileText, label: 'Reporte PDF', desc: 'Personalizado con tu marca' },
  { icon: BarChart3, label: 'Benchmark', desc: 'Comparativo con tu industria' },
  { icon: TrendingUp, label: 'Hoja de Ruta', desc: 'Acciones priorizadas' },
];

export default function PreTestScreen({ onStart }: PreTestScreenProps) {
  const [gdprConsent, setGdprConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  useEffect(() => {
    // Track pretest view
    if (window.gtag) {
      window.gtag('event', 'digital_h_pretest_view');
    }
  }, []);

  const handleStart = () => {
    if (window.gtag) {
      window.gtag('event', 'digital_h_pretest_accept', {
        gdpr_consent: gdprConsent,
        marketing_consent: marketingConsent
      });
    }
    onStart();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-4">
            <FileCheck className="w-4 h-4" />
            Antes de comenzar
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Tu Diagnóstico de Madurez Digital
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            DIGITAL-H es un instrumento de autoevaluación que mide la madurez digital 
            de tu organización en 6 dimensiones críticas. Basado en frameworks de 
            transformación digital y validado con más de 50 organizaciones en LATAM.
          </p>
        </motion.div>

        {/* Dimensions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="font-display text-xl font-bold text-slate-900 mb-4 text-center">
            6 Dimensiones Evaluadas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {DIMENSIONS.map((dim, index) => {
              const Icon = dim.icon;
              return (
                <motion.div
                  key={dim.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={`${dim.bg} rounded-xl p-4 text-center`}
                >
                  <Icon className={`w-8 h-8 ${dim.color} mx-auto mb-2`} />
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">{dim.label}</h3>
                  <p className="text-xs text-slate-600">{dim.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Expected Outputs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-10"
        >
          <h2 className="font-display text-xl font-bold text-slate-900 mb-4 text-center">
            Al finalizar recibirás
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EXPECTED_OUTPUTS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.label}</h3>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Time & Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-8 mb-10 text-sm text-slate-600"
        >
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            15-20 minutos
          </span>
          <span className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            48 preguntas
          </span>
        </motion.div>

        {/* Consent Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8"
        >
          <h2 className="font-display text-xl font-bold text-slate-900 mb-4">
            Tratamiento de datos
          </h2>
          <p className="text-slate-700 mb-6">
            Tus respuestas son confidenciales y se utilizan únicamente para generar 
            tu reporte personalizado y ofrecerte recomendaciones relevantes. Nunca 
            compartimos tu información con terceros.
          </p>

          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={gdprConsent}
                onChange={(e) => setGdprConsent(e.target.checked)}
                className="mt-1 w-5 h-5 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-slate-700">
                He leído y acepto la{' '}
                <a 
                  href="https://acrux.life/privacidad" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 underline hover:text-primary-700"
                >
                  política de privacidad
                </a>
                {' '}y el tratamiento de mis datos para generar el diagnóstico. *
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-1 w-5 h-5 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-slate-700">
                Acepto recibir comunicaciones sobre transformación digital y 
                servicios de ACRUX Consultores (opcional).
              </span>
            </label>
          </div>
        </motion.div>

        {/* Trust Signals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-6 mb-8 text-sm text-slate-500"
        >
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4" />
            Datos encriptados
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            GDPR compliant
          </span>
          <span className="flex items-center gap-1.5">
            <ExternalLink className="w-4 h-4" />
            50+ organizaciones
          </span>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <button
            onClick={handleStart}
            disabled={!gdprConsent}
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full 
                       font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 
                       disabled:cursor-not-allowed text-lg"
          >
            Comenzar diagnóstico
            <ArrowRight className="w-5 h-5" />
          </button>
          {!gdprConsent && (
            <p className="text-sm text-slate-500 mt-3">
              Debes aceptar la política de privacidad para continuar
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}