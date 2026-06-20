import React, { useState } from 'react';
import { Download, ArrowRight } from 'lucide-react';
import { generateReportPDF } from '../../generateReportPDF';
import { Lead } from '../../types';
import { trackEvent, trackPDFDownload } from '../../utils/analytics';

interface ResultsPDFProps {
  answers: Record<string, number>;
  lead: Lead;
  variant?: 'simple' | 'card';
}

export default function ResultsPDF({ answers, lead, variant = 'simple' }: ResultsPDFProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    trackEvent('digital_h_cta_click', {
      cta_type: 'download_pdf',
      cta_location: variant === 'card' ? 'results_bottom' : 'results_hero',
      flow_version: 'v2_q48_capture'
    });
    if (variant === 'card') {
      trackPDFDownload();
    }
    
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

  if (variant === 'card') {
    return (
      <button
        onClick={handleDownloadPDF}
        disabled={isDownloading}
        className="group bg-emerald-50 rounded-xl p-6 hover:bg-emerald-100 transition-colors text-left w-full disabled:opacity-50"
      >
        <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          {isDownloading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download className="w-6 h-6 text-white" />
          )}
        </div>
        <h3 className="font-semibold text-slate-900 mb-2">Descargar informe</h3>
        <p className="text-sm text-slate-600 mb-4">Obtén tu reporte completo en PDF para compartir con tu equipo.</p>
        <span className="inline-flex items-center text-emerald-600 text-sm font-semibold">
          {isDownloading ? 'Generando...' : 'Descargar'}
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </span>
      </button>
    );
  }

  return (
    <button 
      onClick={handleDownloadPDF}
      disabled={isDownloading}
      className="px-6 py-3 bg-white border-2 border-primary-200 text-primary-700 rounded-xl font-bold flex items-center hover:bg-primary-50 transition-all disabled:opacity-50"
    >
      {isDownloading ? (
        <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mr-2" />
      ) : (
        <Download className="w-5 h-5 mr-2" />
      )}
      {isDownloading ? 'Generando PDF...' : 'Descargar Reporte PDF'}
    </button>
  );
}
