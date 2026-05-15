export type UtmSource = 'instagram' | 'facebook' | 'google' | 'email' | 'linkedin' | 'organico';

export interface UtmMessages {
  headline: string;
  subheadline: string;
  badge?: string;
  showUrgency: boolean;
  urgencyMessage?: string;
  ctaText: string;
}

const DEFAULT_MESSAGES: UtmMessages = {
  headline: "¿Tu empresa está perdiendo dinero por procesos manuales?",
  subheadline: "Descubre en 15 minutos tu nivel de madurez digital y recibe un plan de acción personalizado para transformar tu empresa",
  showUrgency: false,
  ctaText: "Obtener mi diagnóstico gratuito"
};

export const UTM_MESSAGE_MAP: Record<UtmSource, UtmMessages> = {
  instagram: {
    headline: "¿Viste nuestro contenido? Obtén tu diagnóstico personalizado",
    subheadline: "Descubre en 15 minutos qué tan madura es digitalmente tu empresa y recibe un plan de acción",
    badge: "¿Viste nuestro contenido? Obtén tu diagnóstico",
    showUrgency: false,
    ctaText: "Obtener mi diagnóstico gratuito"
  },
  facebook: {
    headline: "¿Tu empresa pierde dinero con procesos manuales?",
    subheadline: "Únete a las 50+ empresas que ya descubrieron su nivel de madurez digital",
    badge: "Transformación Digital para empresas de cualquier tamaño",
    showUrgency: false,
    ctaText: "Obtener mi diagnóstico gratuito"
  },
  google: {
    headline: "Diagnóstico gratuito de madurez digital",
    subheadline: "Evalúa 6 dimensiones críticas de tu empresa y obtén un reporte profesional en PDF",
    badge: "Herramienta profesional gratuita",
    showUrgency: false,
    ctaText: "Comenzar evaluación gratuita"
  },
  email: {
    headline: "Bienvenido. Tu diagnóstico de madurez digital está listo",
    subheadline: "Evalúa las 6 dimensiones críticas y recibe tu reporte personalizado con recomendaciones",
    badge: "Recomendado por el equipo de Acrux Consultores",
    showUrgency: false,
    ctaText: "Iniciar mi diagnóstico"
  },
  linkedin: {
    headline: "¿Tu empresa está lista para la transformación digital?",
    subheadline: "Mide tu madurez digital en 6 dimensiones y compara con empresas de tu sector",
    badge: "Herramienta profesional para líderes",
    showUrgency: false,
    ctaText: "Evaluar mi empresa"
  },
  organico: DEFAULT_MESSAGES
};

export function getUtmSource(): UtmSource {
  const params = new URLSearchParams(window.location.search);
  const source = params.get('utm_source')?.toLowerCase() || '';
  
  if (['ig', 'instagram'].includes(source)) return 'instagram';
  if (['fb', 'facebook'].includes(source)) return 'facebook';
  if (['google', 'adwords', 'gads'].includes(source)) return 'google';
  if (['email', 'newsletter', 'mail'].includes(source)) return 'email';
  if (['linkedin', 'li'].includes(source)) return 'linkedin';
  
  return 'organico';
}

export function getUtmMessages(source?: UtmSource): UtmMessages {
  const utmSource = source || getUtmSource();
  return UTM_MESSAGE_MAP[utmSource] || DEFAULT_MESSAGES;
}
