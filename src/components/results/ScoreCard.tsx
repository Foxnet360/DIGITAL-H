import React from 'react';
import { motion } from 'motion/react';

interface ScoreCardProps {
  imd: number;
  level: string;
  levelColor: string;
}

export default function ScoreCard({ imd, level: _level, levelColor: _levelColor }: ScoreCardProps) {
  const radius = 110;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative w-64 h-64 flex items-center justify-center flex-shrink-0">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="128"
          cy="128"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-100"
        />
        <motion.circle
          cx="128"
          cy="128"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - imd / 100) }}
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
  );
}
