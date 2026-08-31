import React, { useState } from 'react';
import { Award, Check, Copy, Sparkles } from 'lucide-react';
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
    <div className="flex-1 text-center md:text-left space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/15 border border-accent/30 text-accent font-bold text-xs uppercase tracking-wider w-fit self-center md:self-start">
          <Award className="w-4 h-4 mr-2" />
          Diagnóstico Ejecutivo • {company || 'Tu Organización'}
        </div>

        {shareUrl && (
          <button
            onClick={handleCopyLink}
            className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold border transition-all self-center md:self-auto ${
              copied
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-accent/40'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-emerald-400" />
                ¡Enlace Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2 text-accent" />
                Copiar Enlace
              </>
            )}
          </button>
        )}
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight leading-tight">
          Hola, <span className="text-accent">{name || 'Líder Executive'}</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-200 leading-relaxed font-sans">
          Tu organización se encuentra en nivel <strong className="text-accent font-bold underline">{levelName}</strong> con un puntaje global de <span className="font-bold text-white">{imd}%</span>.
        </p>

        <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-2xl bg-white/5 border border-white/10 rounded-2xl p-4">
          {levelDesc}
        </p>
      </div>
    </div>
  );
}
