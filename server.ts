import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import pool from './src/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting: max 5 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiadas solicitudes. Intenta más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
app.use(express.json());

// Email transporter (using environment variables)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

import { DiagnosticRequest } from './src/types/shared';
import { USER_LEVELS } from './src/levels';

app.post('/api/diagnostic', limiter, async (req, res) => {
  try {
    const { email, name, company, size, imd, level, answers, gdprConsent, gdprTimestamp }: DiagnosticRequest = req.body;

    // Validation
    if (!email || !name || !company || !imd || !level || !answers) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Calculate dimension scores from answers
    const dimensions = calculateDimensions(answers);

    // Save to database
    const [result] = await pool.execute(
      `INSERT INTO digitalh_results 
       (name, email, company, company_size, imd_score, maturity_level, answers_json,
        dimension_strategy, dimension_culture, dimension_talent, dimension_tech, 
        dimension_process, dimension_wellbeing, gdpr_consent, gdpr_timestamp) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        company,
        size || 'No especificado',
        imd,
        level,
        JSON.stringify(answers),
        dimensions.strategy,
        dimensions.culture,
        dimensions.talent,
        dimensions.tech,
        dimensions.process,
        dimensions.wellbeing,
        gdprConsent,
        gdprTimestamp ? new Date(gdprTimestamp) : null
      ]
    );

    // Send thank you email
    await sendThankYouEmail({ email, name, company, imd, level });

    res.json({ 
      success: true, 
      message: 'Diagnóstico guardado correctamente',
      id: (result as any).insertId 
    });
  } catch (error) {
    console.error('Error saving diagnostic:', error);
    res.status(500).json({ error: 'Error al guardar el diagnóstico' });
  }
});

async function sendThankYouEmail(data: { email: string; name: string; company: string; imd: number; level: string }) {
  const { email, name, company, imd, level } = data;
  const userLevel = USER_LEVELS[level]?.name || 'Explorador Digital';

  const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Gracias por tu diagnóstico DIGITAL-H</title>
    </head>
    <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2e86ab 100%); padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0;">
        <img src="https://acrux.life/acrux_logo.svg" alt="Acrux Consultores" style="height: 48px; margin-bottom: 16px;" />
        <h1 style="color: white; margin: 0; font-size: 28px;">DIGITAL-H</h1>
        <p style="color: #00d4ff; margin: 10px 0 0 0; font-size: 16px;">Diagnóstico de Madurez Digital</p>
      </div>
      
      <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px;">
        <h2 style="color: #1e3a5f; margin-top: 0;">¡Hola ${name}! 👋</h2>
        
        <p>Gracias por completar el diagnóstico de madurez digital de <strong>${company}</strong>.</p>
        
        <div style="background: #f0f4f8; padding: 24px; border-radius: 12px; margin: 24px 0; text-align: center;">
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Tu Índice de Madurez Digital</p>
          <div style="font-size: 48px; font-weight: 800; color: #1e3a5f; margin: 8px 0;">${imd}%</div>
          <div style="display: inline-block; background: #00d4ff; color: #1e3a5f; padding: 8px 16px; border-radius: 20px; font-weight: 700; font-size: 14px;">
            ${level} — ${userLevel}
          </div>
        </div>
        
        <p>${getLevelDescription(imd)}</p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
        
        <h3 style="color: #1e3a5f;">¿Quiénes somos?</h3>
        <p><strong>Acrux Consultores</strong> somos expertos en transformación digital y desarrollo organizacional. Ayudamos a empresas como la tuya a alcanzar su máximo potencial a través de soluciones innovadoras y estrategias personalizadas.</p>
        
        <div style="margin: 24px 0;">
          <a href="https://acrux.life" style="display: inline-block; background: #1e3a5f; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 700;">Conoce más sobre nosotros →</a>
        </div>
        
        <p style="font-size: 14px; color: #64748b;">
          📍 Armenia, Quindío, Colombia<br>
          🌐 <a href="https://acrux.life" style="color: #1e3a5f;">www.acrux.life</a><br>
          📧 contacto@acrux.life
        </p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
        
        <p style="font-size: 13px; color: #94a3b8; margin: 0;">
          Este diagnóstico fue generado por <strong>DIGITAL-H</strong>, una herramienta de <a href="https://acrux.life" style="color: #1e3a5f;">Acrux Consultores</a>.
        </p>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"DIGITAL-H | Acrux Consultores" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: `Gracias por tu diagnóstico DIGITAL-H, ${name}`,
    html: emailTemplate,
  });
}

function calculateDimensions(answers: Record<string, number>) {
  // Dimension mapping based on question ID prefixes
  const dimensionMap: Record<string, number[]> = {
    strategy: [],    // E1.1 - E1.8
    culture: [],     // C2.1 - C2.8
    talent: [],      // T3.1 - T3.8
    tech: [],        // I4.1 - I4.8
    process: [],     // P5.1 - P5.8
    wellbeing: []    // B6.1 - B6.8
  };

  Object.entries(answers).forEach(([id, value]) => {
    const prefix = id.charAt(0);
    switch (prefix) {
      case 'E': dimensionMap.strategy.push(value); break;
      case 'C': dimensionMap.culture.push(value); break;
      case 'T': dimensionMap.talent.push(value); break;
      case 'I': dimensionMap.tech.push(value); break;
      case 'P': dimensionMap.process.push(value); break;
      case 'B': dimensionMap.wellbeing.push(value); break;
    }
  });

  const avg = (arr: number[]) => arr.length > 0 ? parseFloat((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)) : 0;

  return {
    strategy: avg(dimensionMap.strategy),
    culture: avg(dimensionMap.culture),
    talent: avg(dimensionMap.talent),
    tech: avg(dimensionMap.tech),
    process: avg(dimensionMap.process),
    wellbeing: avg(dimensionMap.wellbeing)
  };
}

function getLevelDescription(imd: number): string {
  if (imd <= 30) return 'Tu organización está en una etapa inicial de transformación digital. Es el momento perfecto para comenzar a construir una estrategia sólida.';
  if (imd <= 45) return 'Has dado los primeros pasos hacia la transformación digital. Hay oportunidades claras para estructurar y acelerar tu maduración.';
  if (imd <= 60) return 'Tu transformación digital está en curso. Continúa fortaleciendo los fundamentos para lograr un impacto mayor.';
  if (imd <= 75) return 'Tienes una buena madurez digital. Es momento de optimizar procesos y escalar las iniciativas exitosas.';
  if (imd <= 90) return '¡Excelente nivel de madurez! Tu organización está liderando la transformación digital. Mantén la innovación continua.';
  return 'Eres un referente en madurez digital. Tu organización es un modelo a seguir en transformación e innovación.';
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await pool.execute('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email service: ${process.env.SMTP_HOST || 'Not configured'}`);
  console.log(`🗄️  Database: ${process.env.DB_HOST || 'localhost'}`);
});

export default app;
