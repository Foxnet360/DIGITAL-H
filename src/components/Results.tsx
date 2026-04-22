import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { 
  Download, Share2, Calendar, ChevronRight, Award, TrendingUp, 
  X, CheckCircle2, ExternalLink, BookOpen, Rocket, Cpu, Zap, 
  BarChart3, Map
} from 'lucide-react';
import { DIMENSIONS } from '../constants';
import { getMaturityLevel } from '../utils';
import { Lead } from '../types';
import { USER_LEVELS } from '../levels';
import { generateReportPDF } from '../generateReportPDF';

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

  const nextSteps = [
    {
      title: "Hoja de Ruta Estratégica",
      description: "Digitalizar el roadmap estratégico con horizontes de 6-12 meses.",
      detail: "Define objetivos claros por trimestre, asigna responsables y presupuestos específicos para cada iniciativa digital identificada en este diagnóstico.",
      icon: Rocket
    },
    {
      title: "Capacitación en IA",
      description: "Implementar un programa de formación continua en habilidades IA.",
      detail: "Capacita a tu equipo en el uso de herramientas generativas para aumentar la productividad en un 40% según benchmarks del sector.",
      icon: Cpu
    },
    {
      title: "Automatización Operativa",
      description: "Automatizar los 3 procesos más repetitivos del área operativa.",
      detail: "Identifica cuellos de botella en la cadena de valor y aplica RPA o integraciones simples para liberar tiempo de talento estratégico.",
      icon: Zap
    },
    {
      title: "Gobernanza de Datos",
      description: "Establecer un dashboard de KPIs en tiempo real para la dirección.",
      detail: "Conecta tus fuentes de datos (CRM, ERP, Google Analytics) en un solo tablero visual para tomar decisiones basadas en evidencia.",
      icon: BarChart3
    }
  ];

  const roadmap = [
    { phase: "Fase 1: Cimientos", time: "Mes 1-2", task: "Alineación estratégica y setup de infraestructura básica.", status: "Prioritario" },
    { phase: "Fase 2: Adopción", time: "Mes 3-5", task: "Capacitación de equipos y automatización de procesos clave.", status: "Enfoque" },
    { phase: "Fase 3: Escalamiento", time: "Mes 6+", task: "Analítica avanzada y optimización continua basada en datos.", status: "Visión" }
  ];

  const resources = [
    { title: "Guía: 10 Pasos para Iniciar tu Transformación", type: "PDF", link: "#" },
    { title: "Ebook: La PYME Digital del Siglo XXI", type: "Ebook", link: "#" },
    { title: "Webinar: Interpretando Resultados DIGITAL-H", type: "Video", link: "#" }
  ];

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
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold flex items-center shadow-lg shadow-primary-100 disabled:opacity-50 transition-all hover:bg-primary-700"
              >
                {isDownloading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Download className="w-5 h-5 mr-2" />
                )}
                Descargar Reporte PDF
              </button>
              <button 
                onClick={() => {
                  const text = `¡He completado mi diagnóstico de madurez digital con DIGITAL-H! Mi nivel es ${level.name} (${imd}%).`;
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold flex items-center hover:bg-slate-50 transition-all"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Compartir Resultados
              </button>
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
              {nextSteps.map((step, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedStep(i)}
                  className="flex items-start p-4 bg-slate-50 rounded-2xl group hover:bg-primary-50 transition-all cursor-pointer border border-transparent hover:border-primary-100"
                >
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary-600 mr-4 shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-all">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800 font-bold text-sm mb-1">{step.title}</p>
                    <p className="text-slate-500 text-sm">{step.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
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
          className="bg-primary-600 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-primary-200"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Recursos Exclusivos para ti</h2>
              <p className="text-indigo-100 max-w-xl">
                Basado en tu nivel de madurez <span className="font-bold underline">{level.name}</span>, hemos seleccionado estos recursos para acelerar tu crecimiento.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
              {resources.map((res, i) => (
                <a 
                  key={i}
                  href={res.link}
                  className="bg-[rgba(255,255,255,0.1)] backdrop-blur-md p-4 rounded-2xl border border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.2)] transition-all flex items-center space-x-4 group"
                >
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">{res.type}</p>
                    <p className="text-sm font-bold">{res.title}</p>
                  </div>
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
