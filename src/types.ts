export type DimensionId = 'estrategia' | 'cultura' | 'talento' | 'tecnologia' | 'procesos' | 'bienestar';

export interface Question {
  id: string;
  dimension: DimensionId;
  text: string;
}

export interface Dimension {
  id: DimensionId;
  name: string;
  description: string;
  color: string;
  icon: string;
  badge: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
}

export interface Lead {
  name: string;
  email: string;
  company: string;
  size: string;
  timestamp: any;
  answers: Record<string, number>;
  score: number;
  level: string;
}
