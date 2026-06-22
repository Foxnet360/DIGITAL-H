import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DIMENSIONS } from './constants';
import { getMaturityLevel } from './utils';

interface PDFData {
  answers: Record<string, number>;
  lead: {
    name: string;
    email: string;
    company: string;
    size: string;
    score: number;
    level: string;
  };
}

async function loadLogoAsDataUrl(): Promise<string | null> {
  try {
    const response = await fetch('./logo.png');
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generateReportPDF(data: PDFData) {
  const { answers, lead } = data;
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  
  // Load logo
  const logoData = await loadLogoAsDataUrl();

  // Helper for consistent headers
  const addHeader = () => {
    doc.setFillColor(30, 58, 95); // #1E3A5F
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('DIGITAL-H | Diagnóstico de Madurez Digital', margin, 12);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(lead.company, pageWidth - margin - 28, 14, { align: 'right' });
    
    doc.setTextColor(0, 212, 255); // #00D4FF
    doc.setFontSize(8);
    doc.text('acrux.life', margin, 18);
    
    if (logoData) {
      doc.addImage(logoData, 'PNG', pageWidth - margin - 25, 6, 25, 10);
    }
  };

  // PAGE 1: Cover
  addHeader();

  // Title section
  doc.setTextColor(30, 58, 95);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('Diagnóstico de', margin, 55);
  doc.text('Madurez Digital', margin, 67);

  doc.setTextColor(0, 212, 255);
  doc.setFontSize(16);
  doc.text('DIGITAL-H', margin, 80);

  // Company info box
  doc.setFillColor(240, 244, 248);
  doc.roundedRect(margin, 95, pageWidth - margin * 2, 50, 5, 5, 'F');
  
  doc.setTextColor(30, 58, 95);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Empresa:', margin + 10, 110);
  doc.setFont('helvetica', 'normal');
  doc.text(lead.company, margin + 50, 110);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Evaluado por:', margin + 10, 120);
  doc.setFont('helvetica', 'normal');
  doc.text(lead.name, margin + 50, 120);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Fecha:', margin + 10, 130);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }), margin + 50, 130);

  // Score display
  doc.setFillColor(30, 58, 95);
  doc.roundedRect(margin, 160, pageWidth - margin * 2, 60, 10, 10, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Índice de Madurez Digital', pageWidth / 2, 180, { align: 'center' });
  
  doc.setTextColor(0, 212, 255);
  doc.setFontSize(48);
  doc.setFont('helvetica', 'bold');
  doc.text(`${lead.score}%`, pageWidth / 2, 205, { align: 'center' });
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(lead.level, pageWidth / 2, 215, { align: 'center' });

  doc.addPage();

  // PAGE 2: Dimension Analysis
  addHeader();
  
  doc.setTextColor(30, 58, 95);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Análisis por Dimensión', margin, 40);

  const dimensionPrefixMap: Record<string, string> = {
    estrategia: 'E',
    cultura: 'C',
    talento: 'T',
    tecnologia: 'I',
    procesos: 'P',
    bienestar: 'B',
  };

  const dimensionData = DIMENSIONS.map(dim => {
    const prefix = dimensionPrefixMap[dim.id];
    const dimAnswers = Object.entries(answers)
      .filter(([id]) => prefix ? id.startsWith(prefix) : false)
      .map(([_, val]) => val);
    const avg = dimAnswers.reduce((a, b) => a + b, 0) / (dimAnswers.length || 1);
    const percentage = Math.round((avg / 5) * 100);
    return [
      dim.name,
      `${avg.toFixed(1)}/5.0`,
      `${percentage}%`,
      getMaturityLevel(percentage).name,
    ];
  });

  autoTable(doc, {
    startY: 50,
    head: [['Dimensión', 'Puntuación', 'Porcentaje', 'Nivel']],
    body: dimensionData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 58, 95],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 244, 248],
    },
    styles: {
      fontSize: 11,
      cellPadding: 8,
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
    },
  });

  // Dimension descriptions
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Descripción de Dimensiones:', margin, finalY);
  
  let descY = finalY + 10;
  DIMENSIONS.forEach((dim, i) => {
    if (descY > pageHeight - 60) {
      doc.addPage();
      addHeader();
      descY = 40;
    }
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 95);
    doc.text(`${i + 1}. ${dim.name}`, margin, descY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    const splitDesc = doc.splitTextToSize(dim.description, pageWidth - margin * 2);
    doc.text(splitDesc, margin, descY + 5);
    descY += 10 + splitDesc.length * 4;
  });

  doc.addPage();

  // PAGE 3: Recommendations & Roadmap
  addHeader();
  
  doc.setTextColor(30, 58, 95);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Recomendaciones Priorizadas', margin, 40);

  const recommendations = [
    {
      title: 'Hoja de Ruta Estratégica',
      desc: 'Define objetivos claros por trimestre, asigna responsables y presupuestos específicos para cada iniciativa digital.',
      priority: 'Alta',
    },
    {
      title: 'Capacitación en IA',
      desc: 'Capacita a tu equipo en el uso de herramientas generativas para aumentar la productividad en un 40% según benchmarks.',
      priority: 'Alta',
    },
    {
      title: 'Automatización Operativa',
      desc: 'Identifica cuellos de botella en la cadena de valor y aplica RPA o integraciones simples para liberar tiempo estratégico.',
      priority: 'Media',
    },
    {
      title: 'Gobernanza de Datos',
      desc: 'Conecta tus fuentes de datos (CRM, ERP, Google Analytics) en un solo tablero visual para decisiones basadas en evidencia.',
      priority: 'Media',
    },
  ];

  let recY = 55;
  recommendations.forEach((rec) => {
    if (recY > pageHeight - 80) {
      doc.addPage();
      addHeader();
      recY = 40;
    }
    
    doc.setFillColor(240, 244, 248);
    doc.roundedRect(margin, recY, pageWidth - margin * 2, 38, 5, 5, 'F');
    
    doc.setTextColor(30, 58, 95);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(rec.title, margin + 5, recY + 10);
    
    const priorityColor = rec.priority === 'Alta' ? [239, 68, 68] : [245, 158, 11];
    doc.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2]);
    doc.roundedRect(pageWidth - margin - 30, recY + 4, 25, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(rec.priority, pageWidth - margin - 17.5, recY + 9.5, { align: 'center' });
    
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const splitDesc = doc.splitTextToSize(rec.desc, pageWidth - margin * 2 - 10);
    doc.text(splitDesc, margin + 5, recY + 18);
    
    recY += 46;
  });

  // Roadmap section
  if (recY > pageHeight - 100) {
    doc.addPage();
    addHeader();
    recY = 40;
  }

  doc.setTextColor(30, 58, 95);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Hoja de Ruta de Transformación', margin, recY + 15);

  const roadmap = [
    { phase: 'Fase 1: Cimientos', time: 'Mes 1-2', task: 'Establecer la alineación de liderazgo, evaluar las capacidades tecnológicas actuales, capacitar en fundamentos digitales y configurar las herramientas esenciales para asegurar una base operativa sólida.', status: 'Prioritario' },
    { phase: 'Fase 2: Adopción', time: 'Mes 3-5', task: 'Implementar la automatización de flujos de trabajo clave, fomentar la adopción activa de nuevas herramientas mediante talleres prácticos y rediseñar los procesos para mejorar la eficiencia del equipo.', status: 'Enfoque' },
    { phase: 'Fase 3: Escalamiento', time: 'Mes 6+', task: 'Integrar sistemas de analítica avanzada para la toma de decisiones basada en datos, escalar la automatización a nivel de toda la organización y establecer un ciclo de innovación y optimización continua.', status: 'Visión' },
  ];

  autoTable(doc, {
    startY: recY + 25,
    head: [['Fase', 'Plazo', 'Objetivo', 'Estado']],
    body: roadmap.map(r => [r.phase, r.time, r.task, r.status]),
    theme: 'grid',
    headStyles: {
      fillColor: [30, 58, 95],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 244, 248],
    },
    styles: {
      fontSize: 10,
      cellPadding: 6,
    },
  });

  // PAGE 4: Closing and Call to Action
  doc.addPage();
  addHeader();
  
  doc.setTextColor(30, 58, 95);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Próximos Pasos', margin, 55);
  
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  const closingText = 'La transformación digital es un camino continuo de adaptación y aprendizaje. En Acrux Consultores te acompañamos a materializar estas recomendaciones, diseñar tu hoja de ruta personalizada y potenciar las capacidades de tu equipo.';
  const splitClosing = doc.splitTextToSize(closingText, pageWidth - margin * 2);
  doc.text(splitClosing, margin, 70);
  
  // Call to action button/box
  doc.setFillColor(30, 58, 95);
  doc.roundedRect(margin, 105, pageWidth - margin * 2, 45, 8, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Agenda tu Sesión de Diagnóstico Gratis', pageWidth / 2, 120, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 220, 240);
  doc.text('Reserva 30 minutos con nuestros especialistas para analizar tu reporte.', pageWidth / 2, 128, { align: 'center' });
  
  doc.setFillColor(0, 212, 255); // Accent color
  doc.roundedRect(pageWidth / 2 - 40, 135, 80, 10, 5, 5, 'F');
  
  doc.setTextColor(30, 58, 95);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Reservar Ahora', pageWidth / 2, 141.5, { align: 'center' });
  doc.link(pageWidth / 2 - 40, 135, 80, 10, { url: 'https://acrux.life' });
  
  // Visítanos
  doc.setTextColor(30, 58, 95);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Visítanos en acrux.life', pageWidth / 2, 175, { align: 'center' });
  doc.link(pageWidth / 2 - 30, 170, 60, 8, { url: 'https://acrux.life' });

  // Add footers on all pages
  const totalPages = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(240, 244, 248);
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
    doc.text('© 2026 Acrux Consultores - Todos los derechos reservados', margin, pageHeight - 6);
  }

  // Save
  doc.save(`Diagnostico_DigitalH_${lead.company.replace(/\s+/g, '_')}.pdf`);
}
