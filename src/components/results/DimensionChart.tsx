import React from 'react';
import { motion } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { DIMENSIONS } from '../../constants';

interface DimensionChartProps {
  answers: Record<string, number>;
}

export default function DimensionChart({ answers }: DimensionChartProps) {
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

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 h-full flex flex-col"
    >
      <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center">
        <TrendingUp className="w-6 h-6 mr-2 text-primary-500" />
        Análisis por Dimensión
      </h3>
      <div className="h-[400px] w-full flex-1">
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
  );
}
