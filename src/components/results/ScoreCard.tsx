import React from 'react';
import { motion } from 'motion/react';
import { Award } from 'lucide-react';

interface ScoreCardProps {
  imd: number;
  level: string;
  levelColor?: string;
}

export default function ScoreCard({ imd, level }: ScoreCardProps) {
  const radius = 95;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative w-60 h-60 flex items-center justify-center flex-shrink-0 font-sans">
      <svg className="w-full h-full transform -rotate-90 relative z-10">
        <defs>
          <linearGradient id="cleanScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2E86AB" />
            <stop offset="100%" stopColor="#F5A623" />
          </linearGradient>
        </defs>
        <circle
          cx="120"
          cy="120"
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx="120"
          cy="120"
          r={radius}
          stroke="url(#cleanScoreGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - imd / 100) }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Índice IMD</span>
        <span className="text-5xl font-black font-display text-slate-900 tracking-tight leading-none">
          {imd}<span className="text-primary-600 text-3xl font-bold">%</span>
        </span>
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 font-bold text-xs uppercase tracking-wider shadow-xs">
          <Award className="w-3.5 h-3.5 text-primary-600" />
          {level}
        </div>
      </div>
    </div>
  );
}
