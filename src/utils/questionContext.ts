// Contextual executive insights for questions in DIGITAL-H diagnostic

const QUESTION_CONTEXTS: Record<string, string> = {
  // Estrategia Digital
  'E1.1': 'Un roadmap digital documentado evita desperdiciar hasta un 35% del presupuesto en herramientas desconectadas.',
  'E1.2': 'La alineación entre TI y negocio aumenta un 2.4x la tasa de éxito en iniciativas de transformación.',
  'E1.3': 'Tener horizontes claros (1, 3 y 5 años) asegura la continuidad operativa frente a disrupciones del mercado.',
  'E1.4': 'Las revisiones trimestrales de la estrategia digital permiten ajustar el rumbo ante innovaciones emergentes.',
  'E1.5': 'El liderazgo activo de la C-Suite en transformación digital incrementa la adopción organizacional en un 70%.',
  'E1.6': 'Asignar presupuesto específico para innovación digital evita que el día a día absorba los recursos estratégicos.',
  'E1.7': 'Medir KPIs de adopción y ROI digital permite justificar la inversión ante la junta directiva.',
  'E1.8': 'La ética y sostenibilidad digital aseguran el cumplimiento regulatorio y la reputación de marca.',

  // Cultura y Liderazgo
  'C2.1': 'Los líderes que promueven la experimentación reducen en 40% la resistencia al cambio tecnológico.',
  'C2.2': 'El aprendizaje continuo evita la obsolescencia de habilidades del equipo directivo y operativo.',
  'C2.3': 'La tolerancia al error controlado es la base de las organizaciones verdaderamente innovadoras.',
  'C2.4': 'El uso efectivo de canales digitales elimina silos de comunicación entre departamentos.',
  'C2.5': 'Reconocer públicamente la adopción digital acelera la curva de aprendizaje de toda la empresa.',
  'C2.6': 'La colaboración transversal digital reduce los tiempos de lanzamiento al mercado (time-to-market).',
  'C2.7': 'La empatía del liderazgo durante cambios tecnológicos disminuye la rotación de talento clave.',
  'C2.8': 'La coherencia entre cultura declarada y prácticas digitales fortalece el compromiso del equipo.',

  // Talento y Competencias
  'T3.1': 'Auditar las brechas de competencias digitales es el primer paso para estructurar planes de capacitación efectivos.',
  'T3.2': 'El upskilling digital continuo incrementa la productividad operativa en más de un 25%.',
  'T3.3': 'People Analytics permite anticipar la fuga de talento y tomar decisiones basadas en datos de gestión humana.',
  'T3.4': 'Evaluar perfil digital desde la contratación asegura que los nuevos talentos impulsen la innovación.',
  'T3.5': 'Retener talento digital especializado cuesta 3 veces menos que reclutar y entrenar nuevo personal.',
  'T3.6': 'La movilidad interna basada en competencias aprovecha el conocimiento del negocio existente.',
  'T3.7': 'La autonomía de los equipos agiliza la toma de decisiones y fomenta el empoderamiento.',
  'T3.8': 'El feedback continuo en entornos digitales acelera la corrección de desviaciones operativas.',

  // Tecnología e Infraestructura
  'I4.1': 'Una infraestructura escalable en la nube garantiza el rendimiento sin importar los picos de demanda.',
  'I4.2': 'Migrar a soluciones Cloud reduce los costos de mantenimiento de hardware en un 30% promedio.',
  'I4.3': 'Sistemas integrados mediante APIs evitan la duplicación de datos y errores de digitación manual.',
  'I4.4': 'La ciberseguridad robusta protege el activo más valioso de la organización: la información.',
  'I4.5': 'Las herramientas de colaboración asíncrona mejoran la eficiencia en equipos híbridos o remotos.',
  'I4.6': 'Automatizar tareas repetitivas libera tiempo del personal para actividades estratégicas de mayor valor.',
  'I4.7': 'Explorar Inteligencia Artificial y tecnologías emergentes genera ventajas competitivas tempranas.',
  'I4.8': 'Un plan de continuidad de negocio (DRP) asegura la operación frente a caídas o ciberataques.',

  // Procesos y Datos
  'P5.1': 'Documentar y optimizar procesos antes de automatizarlos evita digitalizar la ineficiencia.',
  'P5.2': 'Las decisiones respaldadas por datos tienen un 3x más de probabilidad de lograr sus objetivos.',
  'P5.3': 'La gobernanza de datos garantiza la veracidad, privacidad y control de acceso a la información.',
  'P5.4': 'Datos limpios y accesibles en tiempo real reducen los tiempos de respuesta al cliente.',
  'P5.5': 'Dashboards automatizados sustituyen reportes manuales en Excel que toman horas en prepararse.',
  'P5.6': 'Las metodologías ágiles dividen grandes proyectos en entregables de valor frecuente.',
  'P5.7': 'Medir el rendimiento de los procesos en tiempo real permite la mejora continua basada en evidencia.',
  'P5.8': 'Gestionar el conocimiento organizacional evita perder know-how vital cuando rota el personal.',

  // Experiencia y Bienestar
  '6.1': 'Medir el eNPS (Employee Net Promoter Score) ayuda a predecir la satisfacción y clima laboral.',
  '6.2': 'El bienestar en entornos híbridos disminuye el síndrome de burnout y la fatiga digital.',
  '6.3': 'Diseñar la experiencia del empleado (EX) impacta directamente en la experiencia del cliente (CX).',
  '6.4': 'La flexibilidad de horarios y desconexión digital incrementa la lealtad de los colaboradores.',
  '6.5': 'Proporcionar las herramientas de trabajo adecuadas elimina la frustración del equipo.',
  '6.6': 'El equilibrio vida-trabajo fomenta un desempeño sostenible en el tiempo.',
  '6.7': 'Escuchar las sugerencias de los empleados impulsa mejoras operativas desde la base.',
  '6.8': 'Un entorno laboral saludable es el mayor imán para atraer profesionales de alto nivel.'
};

export function getQuestionContext(questionId: string, dimension: string): string {
  if (QUESTION_CONTEXTS[questionId]) {
    return QUESTION_CONTEXTS[questionId];
  }
  return 'Este indicador evalúa la madurez operativa y estratégica de tu organización en esta dimensión.';
}
