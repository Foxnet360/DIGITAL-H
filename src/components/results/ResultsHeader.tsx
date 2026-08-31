import React, { useState } from 'react';
import { Award, Check, Copy } from 'lucide-react';
import { getMaturityLevel } from '../../utils';

interface ResultsHeaderProps {
  name: string;
  company: string;
  imd: number;
  level: string;
  shareUrl?: string;
}

export default function ResultsHeader({ name, company, imd, level: _level, shareUrl }: ResultsHeaderProps) {
  const [copied, setCopied] = useState(false);
  const levelInfo = getMaturityLevel(imd);
  const levelName = levelInfo.name;
  const levelDesc = levelInfo.description;

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar el enlace: ', err);
    }
  };

  return (
    <div className="flex-1 text-center md:text-left space-y-5 font-sans">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 font-bold text-xs uppercase tracking-wider w-fit self-center md:self-start">
          <Award className="w-4 h-4 mr-2 text-primary-600" />
          Diagnóstico Ejecutivo • {company || 'Tu Organización'}
        </div>

        {shareUrl && (
          <button
            onClick={handleCopyLink}
            className={`inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all self-center md:self-auto ${
              copied
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-primary-300'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1.5 text-emerald-600" />
                ¡Enlace Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1.5 text-primary-600" />
                Copiar Enlace de Compartir
              </>
            )}
          </button>
        )}
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight leading-tight">
          Reporte para <span className="text-primary-600">{name || 'Directivo'}</span>
        </h1>

        <p className="text-base md:text-lg text-slate-600 leading-relaxed font-sans">
          Nivel de Madurez Digital: <strong className="text-primary-700 font-bold underline">{levelName}</strong> con un puntaje de <span className="font-black text-slate-900">{imd}%</span>.
        </p>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
          {levelDesc}
        </p>
      </div>
    </div>
  );
}
