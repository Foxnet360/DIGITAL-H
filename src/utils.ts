import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DimensionId } from './types';
import { QUESTIONS, DIMENSIONS } from './constants';
import { RECOMMENDATIONS, GENERIC_RECOMMENDATIONS, Recommendation } from './recommendations';
import { TESTIMONIALS, Testimonial } from './testimonials';
export type { Testimonial } from './testimonials';

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

export function getWeakDimensions(answers: Record<string, number>): { dimension: DimensionId; average: number }[] {
  // Calculate average for each dimension
  const dimensionAverages = DIMENSIONS.map(dim => {
    const dimQuestions = QUESTIONS.filter(q => q.dimension === dim.id);
    const dimAnswers = dimQuestions
      .filter(q => answers[q.id] !== undefined)
      .map(q => answers[q.id]);
    
    const average = dimAnswers.length > 0 
      ? dimAnswers.reduce((a, b) => a + b, 0) / dimAnswers.length 
      : 0;
    
    return {
      dimension: dim.id,
      average,
      answeredCount: dimAnswers.length,
      total: dimQuestions.length
    };
  });

  // Sort by average (ascending) and take the 2 weakest
  // In case of tie, prioritize dimensions with more answered questions
  const sorted = dimensionAverages
    .filter(d => d.answeredCount > 0) // Only consider dimensions with answers
    .sort((a, b) => {
      if (a.average !== b.average) {
        return a.average - b.average;
      }
      return b.answeredCount - a.answeredCount;
    });

  return sorted.slice(0, 2).map(d => ({ 
    dimension: d.dimension, 
    average: d.average 
  }));
}

export function getRecommendations(weakDimensions: { dimension: DimensionId; average: number }[]): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Add recommendations for weak dimensions (1 per dimension)
  weakDimensions.forEach(({ dimension }) => {
    const dimRecs = RECOMMENDATIONS.filter(r => r.dimension === dimension);
    if (dimRecs.length > 0) {
      // Prefer quick-win recommendations first
      const quickWins = dimRecs.filter(r => r.category === 'quick-win');
      const strategics = dimRecs.filter(r => r.category === 'estrategico');
      
      if (quickWins.length > 0) {
        recommendations.push(quickWins[0]);
      } else if (strategics.length > 0) {
        recommendations.push(strategics[0]);
      }
    }
  });

  // If we have less than 2 recommendations, add from other dimensions
  if (recommendations.length < 2) {
    const usedDimensions = new Set(weakDimensions.map(d => d.dimension));
    const otherRecs = RECOMMENDATIONS.filter(r => !usedDimensions.has(r.dimension));
    
    while (recommendations.length < 2 && otherRecs.length > 0) {
      const randomIndex = Math.floor(Math.random() * otherRecs.length);
      recommendations.push(otherRecs[randomIndex]);
      otherRecs.splice(randomIndex, 1);
    }
  }

  // Fill remaining slots with generic recommendations
  let genericIndex = 0;
  while (recommendations.length < 4 && genericIndex < GENERIC_RECOMMENDATIONS.length) {
    const generic = GENERIC_RECOMMENDATIONS[genericIndex];
    if (!recommendations.find(r => r.id === generic.id)) {
      recommendations.push(generic);
    }
    genericIndex++;
  }

  return recommendations.slice(0, 4);
}

export function getTestimonials(maturityLevel: string): Testimonial[] {
  // First try to get testimonials for the exact maturity level
  const exactMatches = TESTIMONIALS.filter(t => 
    t.maturityLevel.toLowerCase() === maturityLevel.toLowerCase()
  );
  
  if (exactMatches.length >= 2) {
    return exactMatches.slice(0, 2);
  }
  
  // If not enough, get from nearby levels
  const levelOrder = ['Inicial', 'Emergente', 'Desarrollo', 'Avanzado', 'Excelente', 'Referente'];
  const targetIndex = levelOrder.findIndex(l => l.toLowerCase() === maturityLevel.toLowerCase());
  
  if (targetIndex === -1) {
    return TESTIMONIALS.slice(0, 2);
  }
  
  // Get testimonials from nearby levels
  const nearbyTestimonials: Testimonial[] = [...exactMatches];
  
  // Look at lower levels first
  for (let i = targetIndex - 1; i >= 0 && nearbyTestimonials.length < 2; i--) {
    const levelTestimonials = TESTIMONIALS.filter(t => 
      t.maturityLevel === levelOrder[i]
    );
    nearbyTestimonials.push(...levelTestimonials);
  }
  
  // If still not enough, look at higher levels
  for (let i = targetIndex + 1; i < levelOrder.length && nearbyTestimonials.length < 2; i++) {
    const levelTestimonials = TESTIMONIALS.filter(t => 
      t.maturityLevel === levelOrder[i]
    );
    nearbyTestimonials.push(...levelTestimonials);
  }
  
  return nearbyTestimonials.slice(0, 2);
}
