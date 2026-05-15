export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  industry: string;
  maturityLevel: string;
  metric: string;
  image?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  // Nivel: Inicial
  {
    id: 'T-1',
    quote: "El diagnóstico nos mostró exactamente por dónde empezar. En 3 meses pasamos de no tener estrategia digital a tener un roadmap claro.",
    author: "María González",
    role: "Directora General",
    company: "InnovaRetail",
    industry: "Retail",
    maturityLevel: "Inicial",
    metric: "Redujimos costos operativos en 25%"
  },
  {
    id: 'T-2',
    quote: "No teníamos idea de qué tan atrás estábamos. El reporte fue un wake-up call que nos impulsó a actuar de inmediato.",
    author: "Carlos Mendoza",
    role: "CEO",
    company: "Logística Express",
    industry: "Logística",
    maturityLevel: "Inicial",
    metric: "Aumentamos eficiencia en 30%"
  },
  
  // Nivel: Emergente
  {
    id: 'T-3',
    quote: "Pasamos de Emergente a Desarrollo en 6 meses siguiendo las recomendaciones del reporte. La automatización de procesos fue clave.",
    author: "Ana Lucía Torres",
    role: "Gerente de Operaciones",
    company: "Manufacturas del Norte",
    industry: "Manufactura",
    maturityLevel: "Emergente",
    metric: "Automatizamos 5 procesos clave"
  },
  {
    id: 'T-4',
    quote: "El análisis por dimensiones nos ayudó a enfocar nuestros esfuerzos. No intentamos mejorar todo a la vez, sino lo más crítico primero.",
    author: "Roberto Sánchez",
    role: "Director de Tecnología",
    company: "Servicios Financieros Sur",
    industry: "Finanzas",
    maturityLevel: "Emergente",
    metric: "Mejoramos satisfacción del cliente en 40%"
  },
  
  // Nivel: Desarrollo
  {
    id: 'T-5',
    quote: "Ya teníamos buena base digital, pero el diagnóstico nos mostró oportunidades que no veíamos. El roadmap nos dio dirección clara.",
    author: "Laura Jiménez",
    role: "VP de Transformación Digital",
    company: "SaludPlus",
    industry: "Salud",
    maturityLevel: "Desarrollo",
    metric: "Implementamos IA en 3 áreas en 4 meses"
  },
  {
    id: 'T-6',
    quote: "La capacitación en herramientas digitales que recomendaron transformó la productividad de nuestro equipo. ROI inmediato.",
    author: "Diego Herrera",
    role: "Gerente de RRHH",
    company: "Consultora Estratégica",
    industry: "Consultoría",
    maturityLevel: "Desarrollo",
    metric: "Aumentamos productividad en 35%"
  },
  
  // Nivel: Avanzado
  {
    id: 'T-7',
    quote: "Pensábamos que ya estábamos avanzados, pero el benchmark nos mostró que aún había espacio para mejorar. Excelente herramienta.",
    author: "Patricia Vega",
    role: "Directora de Innovación",
    company: "TechSolutions",
    industry: "Tecnología",
    maturityLevel: "Avanzado",
    metric: "Redujimos time-to-market en 50%"
  },
  {
    id: 'T-8',
    quote: "El diagnóstico confirmó nuestras fortalezas y nos dio un plan concreto para alcanzar la excelencia digital. Muy recomendable.",
    author: "Fernando Castro",
    role: "CIO",
    company: "Energía Renovable MX",
    industry: "Energía",
    maturityLevel: "Avanzado",
    metric: "Optimizamos costos TI en 20%"
  }
];

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
