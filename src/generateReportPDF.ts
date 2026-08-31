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

// Helper to load logo image without distortion
async function loadLogoImage(): Promise<{ dataUrl: string; width: number; height: number } | null> {
  try {
    const response = await fetch('./logo.png');
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const img = new Image();
        img.onload = () => {
          resolve({
            dataUrl,
            width: img.naturalWidth || 100,
            height: img.naturalHeight || 100,
          });
        };
        img.onerror = () => resolve(null);
        img.src = dataUrl;
      };
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
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Color Palette (ACRUX Official Tokens)
  const NAVY = [13, 17, 26];       // #0D111A Deep Night Navy
  const PRIMARY = [46, 134, 171];  // #2E86AB Primary Teal
  const GOLD = [245, 166, 35];     // #F5A623 Warm Accent Gold
  const SLATE = [100, 116, 139];   // #64748B Slate Text
  const LIGHT_BG = [248, 250, 252]; // #F8FAFC Light Card Fill
  const BORDER = [226, 232, 240];  // #E2E8F0 Subtle Border

  // Load logo
  const logoInfo = await loadLogoImage();

  // Helper for consistent headers
  const addHeader = (title: string = 'DIGITAL-H | Diagnóstico de Madurez Digital') => {
    // Header background bar
    doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.rect(0, 0, pageWidth, 22, 'F');

    // Bottom gold accent line
    doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.rect(0, 22, pageWidth, 1, 'F');

    // Brand logo
    if (logoInfo) {
      // Calculate proportional logo size (max height 12mm)
      const maxH = 12;
      const aspect = logoInfo.width / logoInfo.height;
      const logoW = maxH * aspect;
      doc.addImage(logoInfo.dataUrl, 'PNG', margin, 5, logoW, maxH);
    } else {
      doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('ACRUX ✦', margin, 14);
    }

    // Title right
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(title, pageWidth - margin, 12, { align: 'right' });

    doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(lead.company || 'Reporte Ejecutivo', pageWidth - margin, 17, { align: 'right' });
  };

  // Helper for page footers
  const addFooters = () => {
    const totalPages = (doc.internal as any).getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // Footer top border line
      doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
      doc.setLineWidth(0.5);
      doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

      doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('ACRUX Consultores S.A.S. • NIT 900.230.435-1 • acrux.life', margin, pageHeight - 6);
      doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
    }
  };

  // ==========================================
  // PAGE 1: Executive Cover, Score & Dimensions
  // ==========================================
  addHeader();

  let y = 30;

  // Title Box
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Informe Ejecutivo de Madurez Digital', margin, y);
  
  y += 6;
  doc.setTextColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Ecosistema de Transformación Organizacional ACRUX', margin, y);

  y += 8;

  // Participant & Metadata Card
  doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
  doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
  doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);

  doc.setFont('helvetica', 'bold');
  doc.text('Organización:', margin + 6, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(lead.company || 'No especificada', margin + 32, y + 7);

  doc.setFont('helvetica', 'bold');
  doc.text('Evaluado por:', margin + 6, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.text(lead.name || 'Directivo', margin + 32, y + 14);

  doc.setFont('helvetica', 'bold');
  doc.text('Fecha:', margin + 110, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }), margin + 125, y + 7);

  doc.setFont('helvetica', 'bold');
  doc.text('ID Análisis:', margin + 110, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.text(`DH-${Math.floor(100000 + Math.random() * 900000)}`, margin + 125, y + 14);

  y += 30;

  // Global Score Summary Card
  const imdScore = lead.score || 0;
  const levelInfo = getMaturityLevel(imdScore);

  doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.roundedRect(margin, y, contentWidth, 32, 4, 4, 'F');

  // Left Score Badge
  doc.setFillColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
  doc.roundedRect(margin + 6, y + 5, 36, 22, 3, 3, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`${imdScore}%`, margin + 24, y + 17, { align: 'center' });
  doc.setFontSize(7);
  doc.text('ÍNDICE IMD', margin + 24, y + 23, { align: 'center' });

  // Right Score Info
  doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Nivel de Madurez: ${levelInfo.name}`, margin + 48, y + 12);

  doc.setTextColor(230, 240, 250);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  const splitDesc = doc.splitTextToSize(levelInfo.description, contentWidth - 56);
  doc.text(splitDesc, margin + 48, y + 18);

  y += 38;

  // Dimension Analysis Header
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Desglose de Resultados por Dimensión', margin, y);

  y += 4;

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
    const avg = dimAnswers.length > 0 
      ? dimAnswers.reduce((a, b) => a + b, 0) / dimAnswers.length 
      : 3.5;
    const percentage = Math.round((avg / 5) * 100);
    const dimLevel = getMaturityLevel(percentage);

    return [
      dim.name,
      `${avg.toFixed(1)} / 5.0`,
      `${percentage}%`,
      dimLevel.name,
      percentage >= 70 ? 'Fortaleza' : percentage >= 50 ? 'En Desarrollo' : 'Brecha Crítica'
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [['Dimensión Evaluada', 'Promedio', 'Porcentaje', 'Nivel de Madurez', 'Estado']],
    body: dimensionData,
    theme: 'grid',
    headStyles: {
      fillColor: [NAVY[0], NAVY[1], NAVY[2]],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      cellPadding: 4,
    },
    alternateRowStyles: {
      fillColor: [LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]],
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 3.5,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 52 },
      1: { halign: 'center', cellWidth: 26 },
      2: { halign: 'center', cellWidth: 26 },
      3: { halign: 'center', cellWidth: 36, fontStyle: 'bold' },
      4: { halign: 'center', cellWidth: 38, fontStyle: 'bold' },
    },
    didParseCell: (dataCell) => {
      if (dataCell.section === 'body' && dataCell.column.index === 4) {
        const text = String(dataCell.cell.raw);
        if (text === 'Brecha Crítica') {
          dataCell.cell.styles.textColor = [220, 38, 38]; // Red
        } else if (text === 'Fortaleza') {
          dataCell.cell.styles.textColor = [16, 185, 129]; // Emerald
        } else {
          dataCell.cell.styles.textColor = [217, 119, 6]; // Amber
        }
      }
    }
  });

  // ==========================================
  // PAGE 2: Recommendations & Roadmap
  // ==========================================
  doc.addPage();
  addHeader('DIGITAL-H | Plan de Acción & Hoja de Ruta');

  y = 30;

  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Iniciativas Priorizadas de Transformación', margin, y);

  y += 6;

  const recommendations = [
    {
      title: '1. Gobernanza & Roadmap Estratégico',
      desc: 'Establecer objetivos trimestrales formalmente alineados con la C-Suite y asignar recursos dedicados para iniciativas digitales.',
      priority: 'Alta Prioridad',
      color: [220, 38, 38]
    },
    {
      title: '2. Upskilling Digital & Liderazgo de Cambio',
      desc: 'Implementar talleres de adopción tecnológica e IA para mitigar la resistencia al cambio y acelerar el time-to-market.',
      priority: 'Alta Prioridad',
      color: [220, 38, 38]
    },
    {
      title: '3. Automatización de Flujos de Trabajo',
      desc: 'Optimizar e integrar procesos clave reduciendo el trabajo manual repetitivo y eliminando silos entre áreas.',
      priority: 'Media Prioridad',
      color: [217, 119, 6]
    },
    {
      title: '4. Toma de Decisiones Basada en Datos (Analytics)',
      desc: 'Consolidar fuentes de datos en tableros de control ejecutivos para medir KPIs en tiempo real.',
      priority: 'Media Prioridad',
      color: [217, 119, 6]
    }
  ];

  recommendations.forEach((rec) => {
    doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
    doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
    doc.roundedRect(margin, y, contentWidth, 22, 3, 3, 'FD');

    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text(rec.title, margin + 5, y + 6);

    // Priority Tag
    doc.setFillColor(rec.color[0], rec.color[1], rec.color[2]);
    doc.roundedRect(pageWidth - margin - 32, y + 3, 27, 5.5, 1.5, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(rec.priority, pageWidth - margin - 18.5, y + 6.8, { align: 'center' });

    doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(rec.desc, contentWidth - 10);
    doc.text(descLines, margin + 5, y + 12);

    y += 26;
  });

  y += 4;

  // Roadmap Section Table
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Hoja de Ruta Sugerida (Roadmap)', margin, y);

  y += 4;

  const roadmapData = [
    ['Fase 1: Cimientos', 'Mes 1 - 2', 'Alineación de liderazgo, evaluación de stack tecnológico y configuración de herramientas clave.', 'Inmediato'],
    ['Fase 2: Adopción', 'Mes 3 - 5', 'Automatización de procesos repetitivos, talleres prácticos de upskilling y rediseño de flujos.', 'Enfoque'],
    ['Fase 3: Escalamiento', 'Mes 6+', 'Integración de analítica avanzada, inteligencia artificial y ciclo de optimización continua.', 'Estratégico']
  ];

  autoTable(doc, {
    startY: y,
    head: [['Fase de Transformación', 'Plazo', 'Objetivo Estratégico', 'Enfoque']],
    body: roadmapData,
    theme: 'grid',
    headStyles: {
      fillColor: [NAVY[0], NAVY[1], NAVY[2]],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      cellPadding: 4,
    },
    alternateRowStyles: {
      fillColor: [LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]],
    },
    styles: {
      fontSize: 8,
      cellPadding: 3.5,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 38 },
      1: { halign: 'center', cellWidth: 26 },
      2: { cellWidth: 88 },
      3: { halign: 'center', cellWidth: 26, fontStyle: 'bold' },
    }
  });

  // Final Call to Action Box
  const finalY = (doc as any).lastAutoTable.finalY + 8;

  doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.roundedRect(margin, finalY, contentWidth, 24, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('¿Listo para acelerar la transformación de tu empresa?', pageWidth / 2, finalY + 8, { align: 'center' });

  doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Agendá una sesión ejecutiva de 30 minutos con un consultor senior en acrux.life', pageWidth / 2, finalY + 16, { align: 'center' });

  // Add Footers to all pages
  addFooters();

  // Save PDF
  const companySlug = (lead.company || 'Empresa').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Diagnostico_DIGITAL-H_${companySlug}.pdf`);
}
