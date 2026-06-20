import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Map, BookOpen, Download } from 'lucide-react';
import { getMaturityLevel } from '../utils';
import { Lead } from '../types';
import ResultsHeader from './results/ResultsHeader';
import ScoreCard from './results/ScoreCard';
import DimensionChart from './results/DimensionChart';
import RecommendationList from './results/RecommendationList';
import TestimonialSection from './results/TestimonialSection';
import { 
  ResultsHeroCTAs, 
  ResultsPersuasiveCTA, 
  ResultsBookingSection, 
  ResultsBottomCTAs 
} from './results/ResultsCTA';

interface ResultsProps {
  answers: Record<string, number>;
  lead: Lead;
}

export default function Results({ answers, lead }: ResultsProps) {
  const imd = lead.score;
  const level = getMaturityLevel(imd);

  const roadmap = [
    { phase: "Fase 1: Cimientos", time: "Mes 1-2", task: "Alineación estratégica y setup de infraestructura básica.", status: "Prioritario" },
    { phase: "Fase 2: Adopción", time: "Mes 3-5", task: "Capacitación de equipos y automatización de procesos clave.", status: "Enfoque" },
    { phase: "Fase 3: Escalamiento", time: "Mes 6+", task: "Analítica avanzada y optimización continua basada en datos.", status: "Visión" }
  ];

  const getResources = () => {
    const baseResources = [
      { 
        title: "Guía: 10 Pasos para Iniciar tu Transformación", 
        type: "PDF", 
        link: "https://acrux.life/docs/10-Pasos-Para-la-Transformacion.pdf",
        description: "22 páginas de acciones prácticas"
      }
    ];
    
    if (['Inicial', 'Emergente', 'Desarrollo'].includes(level.name)) {
      return baseResources;
    }
    
    return [
      ...baseResources,
      { 
        title: "Ebook: La PYME Digital del Siglo XXI", 
        type: "Ebook", 
        link: "https://acrux.life/docs/eBook-La-PYME-Digital-del-Siglo-XXI.pdf",
        description: "29 páginas de estrategias digitales"
      }
    ];
  };

  const getUrgencyMessage = (levelName: string): { text: string; color: string; bgColor: string } => {
    switch (levelName) {
      case 'Inicial':
      case 'Emergente':
        return {
          text: "Tu empresa podría estar perdiendo hasta 30% de productividad semanal en procesos manuales y retrabajo. Cada mes de delay representa horas que no recuperarás.",
          color: 'text-orange-700',
          bgColor: 'bg-orange-50'
        };
      case 'Desarrollo':
      case 'Avanzado':
        return {
          text: "Estás a solo 2-3 acciones estratégicas de pasar al siguiente nivel. El 68% de empresas en tu etapa retroceden por falta de acompañamiento especializado.",
          color: 'text-blue-700',
          bgColor: 'bg-blue-50'
        };
      case 'Excelente':
      case 'Referente':
        return {
          text: "Mantener tu ventaja competitiva requiere revisión continua. Las empresas líderes reevalúan su madurez digital cada 6 meses.",
          color: 'text-emerald-700',
          bgColor: 'bg-emerald-50'
        };
      default:
        return {
          text: "Este análisis tiene vigencia de 30 días. Las condiciones de mercado cambian rápidamente.",
          color: 'text-slate-700',
          bgColor: 'bg-slate-50'
        };
    }
  };

  const getSectorPercentile = (levelName: string): number => {
    const percentiles: Record<string, number> = {
      'Inicial': 15,
      'Emergente': 35,
      'Desarrollo': 55,
      'Avanzado': 75,
      'Excelente': 90,
      'Referente': 98
    };
    return percentiles[levelName] || 50;
  };

  const urgency = getUrgencyMessage(level.name);
  const sectorPercentile = getSectorPercentile(level.name);
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30);
  const resources = getResources();

  // Use computed shareUrl from lead or construct it
  const shareUrl = lead.shareUrl || `${window.location.origin}${window.location.pathname}#results/${lead.id || 0}/${lead.share_token || ''}`;

  return (
    <div className="min-h-screen bg-background p-6 pb-24">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-12"
        >
          <div className="flex-1 text-center md:text-left space-y-6">
            <ResultsHeader 
              name={lead.name}
              company={lead.company}
              imd={imd}
              level={level.name}
              shareUrl={shareUrl}
            />

            {/* Urgency Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`${urgency.bgColor} border-l-4 border-current rounded-r-xl p-4 ${urgency.color}`}
            >
              <p className="font-semibold text-sm leading-relaxed">
                {urgency.text}
              </p>
            </motion.div>

            {/* Validity Countdown */}
            <div className="flex items-center justify-between text-sm text-slate-500 bg-slate-50 rounded-xl px-4 py-3">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Vigencia del análisis: hasta {expirationDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="text-xs font-medium bg-slate-200 rounded-full px-3 py-1">
                30 días
              </span>
            </div>

            {/* Sector Comparison */}
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-4 border border-primary-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-primary-700">Posición vs empresas de tu tamaño</span>
                <span className="text-lg font-black text-primary-600">Percentil {sectorPercentile}</span>
              </div>
              <div className="w-full bg-white rounded-full h-3">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 to-accent-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${sectorPercentile}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                El {100 - sectorPercentile}% de empresas similares están en nivel {level.name} o superior
              </p>
            </div>

            <ResultsHeroCTAs lead={lead} answers={answers} shareUrl={shareUrl} />
          </div>

          <ScoreCard imd={imd} level={level.name} levelColor={level.color} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DimensionChart answers={answers} />
          <RecommendationList answers={answers} />
        </div>

        {/* Testimonials */}
        <TestimonialSection level={level.name} />

        {/* Persuasive Scheduling Section */}
        <ResultsPersuasiveCTA />

        {/* Custom Booking Calendar */}
        <ResultsBookingSection lead={lead} />

        {/* Roadmap Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100"
        >
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 flex items-center">
                <Map className="w-8 h-8 mr-3 text-primary-600" />
                Hoja de Ruta de Transformación
              </h2>
              <p className="text-slate-500 mt-2">Tu camino personalizado hacia la excelencia digital.</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-100 hidden md:block" />
            <div className="space-y-12">
              {roadmap.map((item, i) => (
                <div key={i} className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">
                  <div className="hidden md:flex absolute left-8 -translate-x-1/2 w-4 h-4 rounded-full bg-primary-600 border-4 border-white shadow-sm z-10" />
                  <div className="w-full md:w-32 text-primary-600 font-bold text-sm uppercase tracking-widest">
                    {item.time}
                  </div>
                  <div className="flex-1 bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-primary-100 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-bold text-slate-800">{item.phase}</h4>
                      <span className="px-3 py-1 bg-primary-100 text-primary-600 text-xs font-bold rounded-full uppercase">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-slate-600">{item.task}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Resources Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-primary-200"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Recursos Exclusivos para ti</h2>
              <p className="text-indigo-100 max-w-xl">
                Basado en tu nivel de madurez <span className="font-bold underline">{level.name}</span>, hemos seleccionado estos recursos para acelerar tu crecimiento.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 w-full md:w-auto">
              {resources.map((res, i) => (
                <a 
                  key={i}
                  href={res.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 hover:bg-white/20 transition-all flex items-center space-x-4 group"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">{res.type}</p>
                    <p className="text-sm font-bold">{res.title}</p>
                    <p className="text-xs text-indigo-200 mt-1">{res.description}</p>
                  </div>
                  <Download className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom CTAs */}
        <ResultsBottomCTAs lead={lead} answers={answers} shareUrl={shareUrl} />
      </div>
    </div>
  );
}
