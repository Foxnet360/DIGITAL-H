import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { 
  Download, Calendar, ChevronRight, Award, TrendingUp, 
  X, CheckCircle2, ExternalLink, BookOpen, 
  Map, Linkedin, Phone
} from 'lucide-react';
import { DIMENSIONS } from '../constants';
import { getMaturityLevel, getWeakDimensions, getRecommendations, getTestimonials } from '../utils';
import { Lead } from '../types';
import { USER_LEVELS } from '../levels';
import { generateReportPDF } from '../generateReportPDF';
import { Recommendation } from '../recommendations';
import BookingCalendar from './BookingCalendar';
import * as Icons from 'lucide-react';

interface ResultsProps {
  answers: Record<string, number>;
  lead: Lead;
}

export default function Results({ answers, lead }: ResultsProps) {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const imd = lead.score;
  const level = getMaturityLevel(imd);

  const radarData = DIMENSIONS.map(dim => {
    const dimAnswers = Object.entries(answers)
      .filter(([id]) => id.startsWith(dim.id.charAt(0).toUpperCase()))
      .map(([_, val]) => val);
    const avg = dimAnswers.reduce((a, b) => a + b, 0) / (dimAnswers.length || 1);
    return {
      subject: dim.name,
      A: (avg / 5) * 100,
      fullMark: 100,
    };
  });

  // Get dynamic recommendations based on user's weak dimensions
  const weakDimensions = getWeakDimensions(answers);
  const nextSteps = getRecommendations(weakDimensions);
  const testimonials = getTestimonials(level.name);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      await generateReportPDF({
        answers,
        lead: {
          name: lead.name,
          email: lead.email,
          company: lead.company,
          size: lead.size,
          score: lead.score,
          level: lead.level,
        },
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper to get icon component from string name
  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.Rocket;
  };

  const roadmap = [
    { phase: "Fase 1: Cimientos", time: "Mes 1-2", task: "Alineación estratégica y setup de infraestructura básica.", status: "Prioritario" },
    { phase: "Fase 2: Adopción", time: "Mes 3-5", task: "Capacitación de equipos y automatización de procesos clave.", status: "Enfoque" },
    { phase: "Fase 3: Escalamiento", time: "Mes 6+", task: "Analítica avanzada y optimización continua basada en datos.", status: "Visión" }
  ];

  // Resources based on maturity level
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
  
  const resources = getResources();

  // Urgency messages by maturity level
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

  // Simulated sector percentile based on maturity level
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

  return (
    <div className="min-h-screen bg-background p-6 pb-24" ref={resultsRef}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-12"
        >
          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 text-primary-600 font-bold text-sm">
              <Award className="w-4 h-4 mr-2" />
              Diagnóstico Completado para {lead.company}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-800 leading-tight">
              Tu Madurez Digital es <span style={{ color: level.color }}>{level.name}</span>
            </h1>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent-100 text-primary-700 font-bold text-sm mt-2">
              <span className="mr-2">{USER_LEVELS[level.name]?.icon || '🎯'}</span>
              Nivel: {USER_LEVELS[level.name]?.name || level.name}
            </div>
            <p className="text-xl text-slate-500 leading-relaxed">
              {level.description} Has obtenido un índice de madurez del {imd}%.
            </p>

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

            <div className="space-y-4 pt-4">
              {/* CTA Primario: Agendar consultoría */}
              <a
                href="https://calendly.com/acrux-life/30min"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (window.gtag) {
                    window.gtag('event', 'digital_h_cta_click', {
                      cta_type: 'schedule_consultation',
                      cta_location: 'results_hero',
                      flow_version: 'v2_q48_capture'
                    });
                  }
                }}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl font-bold text-lg flex items-center justify-center shadow-xl shadow-primary-200 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <Phone className="w-6 h-6 mr-3" />
                Reservar mi sesión de 30 min con Psicólogo Organizacional
              </a>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {/* CTA Secundario: Descargar PDF */}
                <button 
                  onClick={() => {
                    if (window.gtag) {
                      window.gtag('event', 'digital_h_cta_click', {
                        cta_type: 'download_pdf',
                        cta_location: 'results_hero',
                        flow_version: 'v2_q48_capture'
                      });
                    }
                    handleDownloadPDF();
                  }}
                  disabled={isDownloading}
                  className="px-6 py-3 bg-white border-2 border-primary-200 text-primary-700 rounded-xl font-bold flex items-center hover:bg-primary-50 transition-all disabled:opacity-50"
                >
                  {isDownloading ? (
                    <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Download className="w-5 h-5 mr-2" />
                  )}
                  Descargar Reporte PDF
                </button>
                
                {/* CTA Terciario: Compartir */}
                <button 
                  onClick={() => {
                    if (window.gtag) {
                      window.gtag('event', 'digital_h_cta_click', {
                        cta_type: 'share_linkedin',
                        cta_location: 'results_hero',
                        flow_version: 'v2_q48_capture'
                      });
                    }
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://acrux.life/digital-h/')}`, '_blank');
                  }}
                  className="px-4 py-3 text-slate-500 hover:text-[#0077b5] rounded-xl font-semibold text-sm flex items-center hover:bg-slate-50 transition-all"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  Compartir
                </button>
              </div>
            </div>
          </div>

          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="110"
                stroke="currentColor"
                strokeWidth="16"
                fill="transparent"
                className="text-slate-100"
              />
              <motion.circle
                cx="128"
                cy="128"
                r="110"
                stroke="currentColor"
                strokeWidth="16"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 110}
                initial={{ strokeDashoffset: 2 * Math.PI * 110 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 110 * (1 - imd / 100) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-primary-600"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-slate-800">{imd}%</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">IMD Global</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100"
          >
            <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-primary-500" />
              Análisis por Dimensión
            </h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }} />
                  <Radar
                    name="Madurez"
                    dataKey="A"
                    stroke="#6366F1"
                    fill="#6366F1"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        {/* Testimonials Section */}
        {testimonials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100"
          >
            <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">
              Empresas que ya transformaron su negocio
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-50 rounded-2xl p-6 border border-slate-100"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-700 font-bold text-lg">
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{testimonial.author}</p>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                      <p className="text-sm text-slate-400">{testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-slate-600 italic mb-4">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                    <TrendingUp className="w-4 h-4" />
                    {testimonial.metric}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Persuasive Scheduling Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-primary-200"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-bold">
                <Calendar className="w-4 h-4 mr-2" />
                Consultoría gratuita disponible
              </div>
              <h2 className="text-3xl font-bold">¿Quieres profundizar en tus resultados?</h2>
              <p className="text-indigo-100 text-lg">
                Agenda una consultoría gratuita de 30 minutos con nuestros expertos en transformación digital.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent-400 flex-shrink-0" />
                  <span>Análisis personalizado de tus resultados</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent-400 flex-shrink-0" />
                  <span>Hoja de ruta priorizada para tu empresa</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent-400 flex-shrink-0" />
                  <span>Sin compromiso ni costo</span>
                </li>
              </ul>
            </div>
            <a
              href="https://calendly.com/acrux-life/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (window.gtag) {
                  window.gtag('event', 'digital_h_cta_click', {
                    cta_type: 'schedule_consultation',
                    cta_location: 'results_persuasive_section',
                    flow_version: 'v2_q48_capture'
                  });
                }
              }}
              className="px-10 py-5 bg-white text-primary-700 rounded-2xl font-bold text-lg flex items-center gap-3 hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg"
            >
              <Phone className="w-6 h-6" />
              Agendar mi consultoría
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </motion.div>

        {/* Custom Booking Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <BookingCalendar
            leadEmail={lead.email}
            leadName={lead.name}
            company={lead.company || 'No especificado'}
          />
        </motion.div>

          {/* Recommendations & Next Steps */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 flex flex-col"
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
                      <p className="text-slate-500 text-sm">{step.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
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
        </div>

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
            {/* Timeline Line */}
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
      </div>

      {/* Step Detail Modal */}
      <AnimatePresence>
        {selectedStep !== null && (
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
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl"
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
    </div>
  );
}
