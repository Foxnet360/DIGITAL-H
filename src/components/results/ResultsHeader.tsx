import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Award, Check, Copy } from 'lucide-react';
import { getMaturityLevel } from '../../utils';
import { USER_LEVELS } from '../../levels';

interface ResultsHeaderProps {
  name: string;
  company: string;
  imd: number;
  level: string;
  shareUrl?: string;
}

export default function ResultsHeader({ name, company, imd, level, shareUrl }: ResultsHeaderProps) {
  const [copied, setCopied] = useState(false);
  const levelInfo = getMaturityLevel(imd);
  const levelName = levelInfo.name;
  const levelColor = levelInfo.color;
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
    <div className="flex-1 text-center md:text-left space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 text-primary-600 font-bold text-sm w-fit self-center md:self-start">
          <Award className="w-4 h-4 mr-2" />
          Diagnóstico Completado para {company}
        </div>

        {shareUrl && (
          <button
            onClick={handleCopyLink}
            className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all self-center md:self-auto ${
              copied
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-white border-primary-200 text-primary-700 hover:bg-primary-50'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                ¡Enlace Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copiar Enlace de Compartir
              </>
            )}
          </button>
        )}
      </div>

      <h1 className="text-4xl md:text-6xl font-black text-slate-800 leading-tight">
        Tu Madurez Digital es <span style={{ color: levelColor }}>{levelName}</span>
      </h1>

      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent-100 text-primary-700 font-bold text-sm">
          <span className="mr-2">{USER_LEVELS[levelName]?.icon || '🎯'}</span>
          Nivel: {USER_LEVELS[levelName]?.name || levelName}
        </div>
        {name && (
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm">
            Participante: {name}
          </div>
        )}
      </div>

      <p className="text-xl text-slate-500 leading-relaxed">
        {levelDesc} Has obtenido un índice de madurez del {imd}%.
      </p>
    </div>
  );
}
