import { Dimension, Question, Badge } from './types';

export const DIMENSIONS: Dimension[] = [
  {
    id: 'estrategia',
    name: 'Estrategia Digital',
    description: 'Visión, roadmap, alineación con negocio, gobernanza',
    color: '#2e86ab', // Teal (Primary)
    icon: 'Rocket',
    badge: 'Estratega'
  },
  {
    id: 'cultura',
    name: 'Cultura y Liderazgo',
    description: 'Mindset digital, liderazgo consciente, valores organizacionales',
    color: '#1b1f3b', // Navy (Secondary)
    icon: 'Heart',
    badge: 'Cultivador'
  },
  {
    id: 'talento',
    name: 'Talento y Competencias',
    description: 'People analytics, desarrollo, RRHH 4.0, habilidades digitales',
    color: '#5fe8ff', // Cyan (Accent)
    icon: 'Users',
    badge: 'Talent Keeper'
  },
  {
    id: 'tecnologia',
    name: 'Tecnología e Infraestructura',
    description: 'Stack tecnológico, ciberseguridad, integración, automatización',
    color: '#3586ab', // Teal shade
    icon: 'Cpu',
    badge: 'Tech Master'
  },
  {
    id: 'procesos',
    name: 'Procesos y Datos',
    description: 'Gestión de procesos, analítica de datos, toma de decisiones',
    color: '#174a62', // Dark Teal
    icon: 'BarChart3',
    badge: 'Data Driver'
  },
  {
    id: 'bienestar',
    name: 'Experiencia y Bienestar',
    description: 'Engagement, bienestar humano, experiencia del empleado',
    color: '#88c1d8', // Soft Teal
    icon: 'Star',
    badge: 'Wellness Champion'
  }
];

export const QUESTIONS: Question[] = [
  // Estrategia Digital
  { id: 'E1.1', dimension: 'estrategia', text: 'La empresa cuenta con una estrategia digital documentada y comunicada' },
  { id: 'E1.2', dimension: 'estrategia', text: 'Los objetivos digitales están alineados con la estrategia general de negocio' },
  { id: 'E1.3', dimension: 'estrategia', text: 'Existe un roadmap tecnológico con horizontes definidos' },
  { id: 'E1.4', dimension: 'estrategia', text: 'Se realizan revisiones periódicas de la estrategia digital' },
  { id: 'E1.5', dimension: 'estrategia', text: 'La alta dirección lidera activamente la transformación digital' },
  { id: 'E1.6', dimension: 'estrategia', text: 'Se asignan recursos específicos para iniciativas digitales' },
  { id: 'E1.7', dimension: 'estrategia', text: 'Se miden KPIs específicos de transformación digital' },
  { id: 'E1.8', dimension: 'estrategia', text: 'La estrategia digital considera aspectos éticos y sostenibles' },
  // Cultura y Liderazgo
  { id: 'C2.1', dimension: 'cultura', text: 'Los líderes promueven activamente la experimentación digital' },
  { id: 'C2.2', dimension: 'cultura', text: 'Se fomenta una cultura de aprendizaje continuo' },
  { id: 'C2.3', dimension: 'cultura', text: 'Existe tolerancia al error en proyectos de innovación' },
  { id: 'C2.4', dimension: 'cultura', text: 'La comunicación interna utiliza canales digitales efectivamente' },
  { id: 'C2.5', dimension: 'cultura', text: 'Se reconoce y premia la adopción de nuevas tecnologías' },
  { id: 'C2.6', dimension: 'cultura', text: 'Los equipos colaboran de manera transversal usando herramientas digitales' },
  { id: 'C2.7', dimension: 'cultura', text: 'Los líderes practican escucha activa y empatía' },
  { id: 'C2.8', dimension: 'cultura', text: 'Existe coherencia entre los valores declarados y las prácticas reales' },
  // Talento y Competencias
  { id: 'T3.1', dimension: 'talento', text: 'Se evalúan competencias digitales de los colaboradores' },
  { id: 'T3.2', dimension: 'talento', text: 'Existe un plan de formación en habilidades digitales' },
  { id: 'T3.3', dimension: 'talento', text: 'Se utilizan herramientas de people analytics' },
  { id: 'T3.4', dimension: 'talento', text: 'Los procesos de selección evalúan competencias digitales' },
  { id: 'T3.5', dimension: 'talento', text: 'Existe una estrategia de retención de talento digital' },
  { id: 'T3.6', dimension: 'talento', text: 'Se promueve la movilidad interna basada en habilidades' },
  { id: 'T3.7', dimension: 'talento', text: 'Los equipos tienen autonomía para tomar decisiones' },
  { id: 'T3.8', dimension: 'talento', text: 'Se practica el feedback continuo y constructivo' },
  // Tecnología e Infraestructura
  { id: 'I4.1', dimension: 'tecnologia', text: 'La infraestructura tecnológica es escalable y segura' },
  { id: 'I4.2', dimension: 'tecnologia', text: 'Se utilizan soluciones en la nube' },
  { id: 'I4.3', dimension: 'tecnologia', text: 'Los sistemas están integrados y comparten datos' },
  { id: 'I4.4', dimension: 'tecnologia', text: 'Se aplican medidas de ciberseguridad apropiadas' },
  { id: 'I4.5', dimension: 'tecnologia', text: 'Se utilizan herramientas de colaboración en equipo' },
  { id: 'I4.6', dimension: 'tecnologia', text: 'Se han automatizado procesos repetitivos' },
  { id: 'I4.7', dimension: 'tecnologia', text: 'Se exploran tecnologías emergentes (IA, IoT, etc.)' },
  { id: 'I4.8', dimension: 'tecnologia', text: 'Existe un plan de continuidad tecnológica' },
  // Procesos y Datos
  { id: 'P5.1', dimension: 'procesos', text: 'Los procesos clave están documentados y optimizados' },
  { id: 'P5.2', dimension: 'procesos', text: 'Se toman decisiones basadas en datos' },
  { id: 'P5.3', dimension: 'procesos', text: 'Existe gobernanza de datos clara' },
  { id: 'P5.4', dimension: 'procesos', text: 'Los datos son accesibles y de calidad' },
  { id: 'P5.5', dimension: 'procesos', text: 'Se utilizan dashboards y reportes automatizados' },
  { id: 'P5.6', dimension: 'procesos', text: 'Se aplican metodologías ágiles' },
  { id: 'P5.7', dimension: 'procesos', text: 'Los procesos son medidos y mejorados continuamente' },
  { id: 'P5.8', dimension: 'procesos', text: 'Se gestiona el conocimiento organizacional' },
  // Experiencia y Bienestar
  { id: 'B6.1', dimension: 'bienestar', text: 'Se mide el engagement de los colaboradores' },
  { id: 'B6.2', dimension: 'bienestar', text: 'Existen programas de bienestar integral' },
  { id: 'B6.3', dimension: 'bienestar', text: 'Se promueve el equilibrio vida-trabajo' },
  { id: 'B6.4', dimension: 'bienestar', text: 'Se previene y gestiona el riesgo psicosocial' },
  { id: 'B6.5', dimension: 'bienestar', text: 'Los colaboradores tienen acceso a apoyo emocional' },
  { id: 'B6.6', dimension: 'bienestar', text: 'Se fomenta la diversidad e inclusión' },
  { id: 'B6.7', dimension: 'bienestar', text: 'La experiencia del empleado es prioridad estratégica' },
  { id: 'B6.8', dimension: 'bienestar', text: 'Se mide y mejora la eNPS regularmente' }
];

export const BADGES: Badge[] = [
  { id: 'primeros-pasos', name: 'Primeros Pasos', description: 'Completar las primeras 8 preguntas', icon: 'Zapato', condition: '8 preguntas' },
  { id: 'mitad-camino', name: 'Mitad del Camino', description: 'Llegar a la pregunta 24', icon: 'Bandera', condition: '24 preguntas' },
  { id: 'explorador', name: 'Explorador Completo', description: 'Finalizar todos los módulos', icon: 'Mapa', condition: '48 preguntas' },
  { id: 'especialista', name: 'Especialista', description: 'Obtener +4 en cualquier dimensión', icon: 'Medalla', condition: 'Puntuacion >= 4' },
  { id: 'maestro', name: 'Maestro Digital', description: 'Obtener +4 en 3+ dimensiones', icon: 'Corona', condition: '3+ dimensiones >= 4' },
  { id: 'visionario', name: 'Visionario', description: 'Alcanzar IMD > 75%', icon: 'Ojo', condition: 'IMD > 75%' }
];
