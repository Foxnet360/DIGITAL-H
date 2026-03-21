import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateIMD(answers: Record<string, number>): number {
  const values = Object.values(answers);
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Math.round((sum / 240) * 100);
}

export function getMaturityLevel(imd: number) {
  if (imd <= 30) return { name: 'Inicial', color: '#94A3B8', description: 'Transformación digital no iniciada. Urgente intervención.' };
  if (imd <= 45) return { name: 'Emergente', color: '#F87171', description: 'Primeros pasos digitales. Necesita estructuración.' };
  if (imd <= 60) return { name: 'Desarrollo', color: '#FBBF24', description: 'Transformación en curso. Fortalecer fundamentos.' };
  if (imd <= 75) return { name: 'Avanzado', color: '#60A5FA', description: 'Buena madurez digital. Optimizar y escalar.' };
  if (imd <= 90) return { name: 'Excelente', color: '#34D399', description: 'Alta madurez. Innovación y liderazgo.' };
  return { name: 'Referente', color: '#818CF8', description: 'Excelencia digital. Modelo para otros.' };
}
