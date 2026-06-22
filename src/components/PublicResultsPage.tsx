import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Lead } from '../types';
import ResultsHeader from './results/ResultsHeader';
import ScoreCard from './results/ScoreCard';
import DimensionChart from './results/DimensionChart';
import RecommendationList from './results/RecommendationList';
import TestimonialSection from './results/TestimonialSection';
import { ResultsPersuasiveCTA, ResultsBookingSection, ResultsBottomCTAs } from './results/ResultsCTA';

interface PublicResultsPageProps {
  id: string;
  token: string;
}

type FetchState = 'loading' | 'error' | 'forbidden' | 'success';

export default function PublicResultsPage({ id, token }: PublicResultsPageProps) {
  const [state, setState] = useState<FetchState>('loading');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setState('loading');
      try {
        const response = await fetch(`./api/diagnostic.php?id=${id}&token=${token}`);
        if (response.status === 403) {
          setState('forbidden');
          return;
        }
        if (!response.ok) {
          setState('error');
          return;
        }
        const result = await response.json();
        setData(result);
        setState('success');
      } catch (err) {
        console.error('Error fetching public results:', err);
        setState('error');
      }
    };

    fetchData();
  }, [id, token]);

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Cargando resultados de diagnóstico...</p>
      </div>
    );
  }

  if (state === 'forbidden') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Acceso No Autorizado</h2>
        <p className="text-slate-500 max-w-md mb-6">
          El enlace de resultados es inválido o ha expirado. Por favor verifica el enlace original enviado a tu correo.
        </p>
        <a 
          href="https://acrux.life/digital-h/"
          className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
        >
          Realizar Nuevo Diagnóstico
        </a>
      </div>
    );
  }

  if (state === 'error' || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Error al Cargar Resultados</h2>
        <p className="text-slate-500 max-w-md mb-6">
          Hubo un problema de conexión al buscar los detalles de tu diagnóstico. Por favor, intenta recargar la página.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
        >
          Recargar Página
        </button>
      </div>
    );
  }

  // Map backend record to Lead type for components
  const lead: Lead = {
    name: data.name,
    email: 'contacto@acrux.life', // Placeholder or standard email
    company: data.company,
    size: 'No especificado',
    score: data.imd_score,
    level: data.maturity_level,
    id: parseInt(id),
    share_token: token,
    shareUrl: window.location.href
  };

  const answers = data.answers_json || {};

  return (
    <div className="min-h-screen bg-background p-6 pb-24">
      {/* Branding top bar */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <img src="https://acrux.life/logo.png" alt="Acrux" className="h-8" />
          <span className="font-black text-lg text-slate-800 tracking-wider">DIGITAL-H</span>
        </div>
        <div className="text-sm font-semibold text-slate-400">
          Resultados Compartidos
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Main hero card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-12"
        >
          <ResultsHeader 
            name={lead.name}
            company={lead.company}
            imd={lead.score}
            level={lead.level}
            shareUrl={lead.shareUrl}
          />
          <ScoreCard imd={lead.score} level={lead.level} levelColor="#1e3a5f" />
        </motion.div>

        {/* Charts & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DimensionChart answers={answers} />
          <RecommendationList answers={answers} />
        </div>

        {/* Testimonials */}
        <TestimonialSection level={lead.level} />

        {/* Scheduling banner */}
        <ResultsPersuasiveCTA />

        {/* Calendar Booking */}
        <ResultsBookingSection lead={lead} />

        {/* Footer CTAs (inc. PDF) */}
        <ResultsBottomCTAs lead={lead} answers={answers} shareUrl={lead.shareUrl} />
      </div>
    </div>
  );
}
