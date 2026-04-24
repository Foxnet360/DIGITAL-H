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
    doc.text(lead.company, pageWidth - margin, 12, { align: 'right' });
    doc.setTextColor(0, 212, 255); // #00D4FF
    doc.setFontSize(8);
    doc.text('acrux.life', margin, 18);
  };

  const addFooter = (pageNum: number, totalPages: number) => {
    doc.setFillColor(240, 244, 248);
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.text(`Página ${pageNum} de ${totalPages}`, pageWidth / 2, pageHeight - 6, { align: 'center' });
    doc.text('© 2025 Acrux Consultores - Todos los derechos reservados', margin, pageHeight - 6);
  };

  let currentPage = 1;

  // PAGE 1: Cover
  addHeader();

  // Logo SVG
  if (logoData) {
    doc.addImage(logoData, 'PNG', pageWidth / 2 - 20, 30, 40, 16);
  }

  // Title section
  doc.setTextColor(30, 58, 95);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('Diagnóstico de', margin, 50);
  doc.text('Madurez Digital', margin, 62);

  doc.setTextColor(0, 212, 255);
  doc.setFontSize(16);
  doc.text('DIGITAL-H', margin, 75);

  // Company info box
  doc.setFillColor(240, 244, 248);
  doc.roundedRect(margin, 90, pageWidth - margin * 2, 50, 5, 5, 'F');
  
  doc.setTextColor(30, 58, 95);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Empresa:', margin + 10, 105);
  doc.setFont('helvetica', 'normal');
  doc.text(lead.company, margin + 50, 105);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Evaluado por:', margin + 10, 115);
  doc.setFont('helvetica', 'normal');
  doc.text(lead.name, margin + 50, 115);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Fecha:', margin + 10, 125);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }), margin + 50, 125);

  // Score display
  doc.setFillColor(30, 58, 95);
  doc.roundedRect(margin, 155, pageWidth - margin * 2, 60, 10, 10, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Índice de Madurez Digital', pageWidth / 2, 175, { align: 'center' });
  
  doc.setTextColor(0, 212, 255);
  doc.setFontSize(48);
  doc.setFont('helvetica', 'bold');
  doc.text(`${lead.score}%`, pageWidth / 2, 200, { align: 'center' });
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(lead.level, pageWidth / 2, 210, { align: 'center' });

  addFooter(currentPage, 4);
  doc.addPage();
  currentPage++;

  // PAGE 2: Dimension Analysis
  addHeader();
  
  doc.setTextColor(30, 58, 95);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Análisis por Dimensión', margin, 40);

  const dimensionData = DIMENSIONS.map(dim => {
    const dimAnswers = Object.entries(answers)
      .filter(([id]) => id.startsWith(dim.id.charAt(0).toUpperCase()))
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
      addFooter(currentPage, 4);
      doc.addPage();
      currentPage++;
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

  addFooter(currentPage, 4);
  doc.addPage();
  currentPage++;

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
      addFooter(currentPage, 4);
      doc.addPage();
      currentPage++;
      addHeader();
      recY = 40;
    }
    
    doc.setFillColor(240, 244, 248);
    doc.roundedRect(margin, recY, pageWidth - margin * 2, 35, 5, 5, 'F');
    
    doc.setTextColor(30, 58, 95);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(rec.title, margin + 5, recY + 10);
    
    const priorityColor = rec.priority === 'Alta' ? [239, 68, 68] : [245, 158, 11];
    doc.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2]);
    doc.roundedRect(pageWidth - margin - 35, recY + 5, 30, 12, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(rec.priority, pageWidth - margin - 20, recY + 12, { align: 'center' });
    
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const splitDesc = doc.splitTextToSize(rec.desc, pageWidth - margin * 2 - 10);
    doc.text(splitDesc, margin + 5, recY + 18);
    
    recY += 45;
  });

  // Roadmap section
  if (recY > pageHeight - 100) {
    addFooter(currentPage, 4);
    doc.addPage();
    currentPage++;
    addHeader();
    recY = 40;
  }

  doc.setTextColor(30, 58, 95);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Hoja de Ruta de Transformación', margin, recY + 15);

  const roadmap = [
    { phase: 'Fase 1: Cimientos', time: 'Mes 1-2', task: 'Alineación estratégica y setup de infraestructura básica.', status: 'Prioritario' },
    { phase: 'Fase 2: Adopción', time: 'Mes 3-5', task: 'Capacitación de equipos y automatización de procesos clave.', status: 'Enfoque' },
    { phase: 'Fase 3: Escalamiento', time: 'Mes 6+', task: 'Analítica avanzada y optimización continua basada en datos.', status: 'Visión' },
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

  addFooter(currentPage, 4);

  // Save
  doc.save(`Diagnostico_DigitalH_${lead.company.replace(/\s+/g, '_')}.pdf`);
}
