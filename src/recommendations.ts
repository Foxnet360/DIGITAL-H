import { DimensionId } from './types';

export type RecommendationCategory = 'quick-win' | 'estrategico';

export interface Recommendation {
  id: string;
  dimension: DimensionId;
  title: string;
  description: string;
  detail: string;
  icon: string;
  category: RecommendationCategory;
}

export const RECOMMENDATIONS: Recommendation[] = [
  // Estrategia Digital
  {
    id: 'E-1',
    dimension: 'estrategia',
    title: 'Definir Roadmap Digital',
    description: 'Crear un plan estratégico de 12 meses con objetivos claros y métricas.',
    detail: 'Organiza un workshop de 2 horas con el equipo directivo para definir 3 objetivos digitales prioritarios por trimestre. Asigna un responsable y presupuesto estimado a cada iniciativa.',
    icon: 'Rocket',
    category: 'estrategico'
  },
  {
    id: 'E-2',
    dimension: 'estrategia',
    title: 'KPIs de Transformación',
    description: 'Establecer 5 métricas clave para medir el progreso digital.',
    detail: 'Define KPIs específicos como: adopción de herramientas (% de equipo activo), eficiencia operativa (tiempo por proceso), satisfacción del cliente (NPS digital), y revisarlos mensualmente.',
    icon: 'BarChart3',
    category: 'quick-win'
  },
  {
    id: 'E-3',
    dimension: 'estrategia',
    title: 'Comité de Innovación',
    description: 'Formar un equipo multidisciplinario para liderar la transformación.',
    detail: 'Selecciona 4-6 personas de diferentes áreas (IT, Operaciones, Ventas, RRHH) y reúnase quincenalmente para evaluar avances y remover bloqueos.',
    icon: 'Users',
    category: 'estrategico'
  },
  
  // Cultura y Liderazgo
  {
    id: 'C-1',
    dimension: 'cultura',
    title: 'Programa de Reconocimiento',
    description: 'Implementar sistema de reconocimiento a la innovación y adopción digital.',
    detail: 'Crea un programa mensual donde el equipo pueda nominar colegas que hayan implementado mejoras digitales. Premios simbólicos + visibilidad en all-hands.',
    icon: 'Heart',
    category: 'quick-win'
  },
  {
    id: 'C-2',
    dimension: 'cultura',
    title: 'Capacitación en Mindset Digital',
    description: 'Talleres de 4 horas para todo el equipo sobre cultura digital.',
    detail: 'Contrata un facilitador externo o usa contenido online para sensibilizar al equipo sobre: experimentación segura, aprendizaje continuo, y colaboración digital.',
    icon: 'Star',
    category: 'estrategico'
  },
  {
    id: 'C-3',
    dimension: 'cultura',
    title: 'Comunicación Digital Efectiva',
    description: 'Estandarizar canales de comunicación interna y reducir email.',
    detail: 'Implementa 3 reglas de oro: (1) Chats para urgencias, (2) Wiki/documentos para información permanente, (3) Reuniones solo para decisiones. Mide adopción semanal.',
    icon: 'MessageCircle',
    category: 'quick-win'
  },
  
  // Talento y Competencias
  {
    id: 'T-1',
    dimension: 'talento',
    title: 'Evaluación de Competencias Digitales',
    description: 'Mapear habilidades digitales actuales del equipo.',
    detail: 'Usa una plantilla simple para evaluar 10 habilidades clave (Excel, herramientas colaborativas, análisis de datos, etc.) Identifica gaps y crea plan de formación.',
    icon: 'Users',
    category: 'quick-win'
  },
  {
    id: 'T-2',
    dimension: 'talento',
    title: 'Presupuesto de Formación',
    description: 'Asignar $500-2000 por persona anual en cursos digitales.',
    detail: 'Negocia con plataformas online (Coursera, Udemy, LinkedIn Learning) para obtener descuentos corporativos. Define 2 rutas de aprendizaje: básica y avanzada.',
    icon: 'BookOpen',
    category: 'estrategico'
  },
  {
    id: 'T-3',
    dimension: 'talento',
    title: 'Reclutamiento Digital-First',
    description: 'Incluir evaluación de habilidades digitales en procesos de selección.',
    detail: 'Agrega 3 preguntas sobre experiencia digital a tus entrevistas y un case study práctico (ej: "Organiza esta información en una hoja de cálculo").',
    icon: 'UserPlus',
    category: 'quick-win'
  },
  
  // Tecnología e Infraestructura
  {
    id: 'I-1',
    dimension: 'tecnologia',
    title: 'Auditoría de Stack Tecnológico',
    description: 'Inventariar todas las herramientas y eliminar redundancias.',
    detail: 'Crea una hoja con todas las herramientas (SAAS, licencias, suscripciones). Identifica duplicados y negocia descuentos por volumen. Objetivo: reducir 20% de costos.',
    icon: 'Cpu',
    category: 'quick-win'
  },
  {
    id: 'I-2',
    dimension: 'tecnologia',
    title: 'Migración a la Nube',
    description: 'Mover 3 procesos críticos a soluciones cloud en 90 días.',
    detail: 'Prioriza: (1) Almacenamiento de archivos, (2) Backup automático, (3) Herramienta de gestión de proyectos. Compara Google Workspace vs Microsoft 365 vs alternativas.',
    icon: 'Cloud',
    category: 'estrategico'
  },
  {
    id: 'I-3',
    dimension: 'tecnologia',
    title: 'Automatización de Reportes',
    description: 'Automatizar 3 reportes manuales que consumen más tiempo.',
    detail: 'Identifica los reportes que toman más de 2 horas semanales. Usa herramientas como Power BI, Google Data Studio, o Zapier para automatizar la extracción y envío.',
    icon: 'Zap',
    category: 'quick-win'
  },
  
  // Procesos y Datos
  {
    id: 'P-1',
    dimension: 'procesos',
    title: 'Mapeo de Procesos Clave',
    description: 'Documentar los 5 procesos más críticos de la empresa.',
    detail: 'Usa notación BPMN simple o flowcharts. Incluye: responsables, tiempos, insumos, y outputs. Identifica cuellos de botella y oportunidades de mejora.',
    icon: 'Map',
    category: 'quick-win'
  },
  {
    id: 'P-2',
    dimension: 'procesos',
    title: 'Dashboard de KPIs',
    description: 'Crear tablero visual con métricas en tiempo real.',
    detail: 'Conecta tus fuentes de datos (ventas, operaciones, marketing) en un solo dashboard. Actualización automática diaria. Accesible desde móvil.',
    icon: 'BarChart3',
    category: 'estrategico'
  },
  {
    id: 'P-3',
    dimension: 'procesos',
    title: 'Gobernanza de Datos',
    description: 'Establecer reglas claras sobre calidad, acceso y seguridad.',
    detail: 'Define: (1) Quién puede acceder a qué datos, (2) Formatos estándar, (3) Política de retención, (4) Responsable de calidad. Documento de 2 páginas máximo.',
    icon: 'Shield',
    category: 'estrategico'
  },
  
  // Experiencia y Bienestar
  {
    id: 'B-1',
    dimension: 'bienestar',
    title: 'Encuesta de eNPS',
    description: 'Implementar medición trimestral de employee Net Promoter Score.',
    detail: 'Usa Google Forms o Typeform. 2 preguntas clave: "¿Qué tan probable es que recomiendes esta empresa?" y "¿Por qué?". Comparte resultados y plan de acción.',
    icon: 'Heart',
    category: 'quick-win'
  },
  {
    id: 'B-2',
    dimension: 'bienestar',
    title: 'Programa de Bienestar Digital',
    description: 'Establecer límites saludables para uso de tecnología.',
    detail: 'Crea políticas de "desconexión digital": no emails después 7pm, reuniones máximo 30 min, fines de semana libres. Mide cumplimiento y satisfacción.',
    icon: 'Coffee',
    category: 'estrategico'
  },
  {
    id: 'B-3',
    dimension: 'bienestar',
    title: 'Onboarding Digital Mejorado',
    description: 'Crear experiencia de bienvenida 100% digital para nuevos.',
    detail: 'Diseña un portal con: videos de bienvenida, documentos clave, mentor asignado, checklist de primeros 30 días. Reduce tiempo de integración de 2 semanas a 3 días.',
    icon: 'UserPlus',
    category: 'quick-win'
  }
];

// Generic recommendations (used when we need to fill slots)
export const GENERIC_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'G-1',
    dimension: 'estrategia',
    title: 'Hoja de Ruta Estratégica',
    description: 'Digitalizar el roadmap estratégico con horizontes de 6-12 meses.',
    detail: 'Define objetivos claros por trimestre, asigna responsables y presupuestos específicos para cada iniciativa digital identificada en este diagnóstico.',
    icon: 'Rocket',
    category: 'estrategico'
  },
  {
    id: 'G-2',
    dimension: 'tecnologia',
    title: 'Capacitación en IA',
    description: 'Implementar un programa de formación continua en habilidades IA.',
    detail: 'Capacita a tu equipo en el uso de herramientas generativas para aumentar la productividad en un 40% según benchmarks del sector.',
    icon: 'Cpu',
    category: 'estrategico'
  },
  {
    id: 'G-3',
    dimension: 'procesos',
    title: 'Automatización Operativa',
    description: 'Automatizar los 3 procesos más repetitivos del área operativa.',
    detail: 'Identifica cuellos de botella en la cadena de valor y aplica RPA o integraciones simples para liberar tiempo de talento estratégico.',
    icon: 'Zap',
    category: 'quick-win'
  },
  {
    id: 'G-4',
    dimension: 'procesos',
    title: 'Gobernanza de Datos',
    description: 'Establecer un dashboard de KPIs en tiempo real para la dirección.',
    detail: 'Conecta tus fuentes de datos (CRM, ERP, Google Analytics) en un solo tablero visual para tomar decisiones basadas en evidencia.',
    icon: 'BarChart3',
    category: 'estrategico'
  }
];
