import React from 'react';
import { motion } from 'motion/react';
import { Award, Sparkles } from 'lucide-react';

interface ScoreCardProps {
  imd: number;
  level: string;
  levelColor: string;
}

export default function ScoreCard({ imd, level, levelColor }: ScoreCardProps) {
  const radius = 100;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative w-64 h-64 flex items-center justify-center flex-shrink-0 font-sans">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
      
      <svg className="w-full h-full transform -rotate-90 relative z-10">
        <defs>
          <linearGradient id="scoreGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5A623" />
            <stop offset="50%" stopColor="#2E86AB" />
            <stop offset="100%" stopColor="#4A7C59" />
          </linearGradient>
        </defs>
        <circle
          cx="128"
          cy="128"
          r={radius}
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx="128"
          cy="128"
          r={radius}
          stroke="url(#scoreGoldGradient)"
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
        <div className="flex items-center gap-1 text-accent mb-1">
          <Sparkles className="w-4 h-4" />
          <span className="text-[11px] uppercase tracking-widest font-bold font-mono text-accent">Índice IMD</span>
        </div>
        <span className="text-5xl font-black font-display text-white tracking-tight leading-none">
          {imd}<span className="text-accent text-3xl font-bold">%</span>
        </span>
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent font-bold text-xs uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" />
          {level}
        </div>
      </div>
    </div>
  );
}
