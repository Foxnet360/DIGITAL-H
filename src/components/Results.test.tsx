import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Results from './Results';
import { Lead } from '../types';
import { QUESTIONS } from '../constants';

describe('Results', () => {
  const mockLead: Lead = {
    name: 'Empresa Test',
    email: 'test@empresa.com',
    company: 'Empresa Test',
    size: '11-50',
    score: 80,
    level: 'Excelente'
  };

  const allFours = QUESTIONS.reduce((acc, q) => {
    acc[q.id] = 4;
    return acc;
  }, {} as Record<string, number>);

  it('renders participant, level and IMD from the lead', () => {
    render(<Results answers={allFours} lead={mockLead} />);

    expect(
      screen.getByRole('heading', { name: /Tu Madurez Digital es Excelente/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Has obtenido un índice de madurez del 80%/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText('Participante:', { exact: false })
    ).toBeInTheDocument();
  });

  it('renders roadmap and resources sections', () => {
    render(<Results answers={allFours} lead={mockLead} />);

    expect(
      screen.getByRole('heading', { name: /Hoja de Ruta de Transformación/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Recursos Exclusivos para ti/i })
    ).toBeInTheDocument();
  });

  it('renders dimension analysis and recommendations', () => {
    render(<Results answers={allFours} lead={mockLead} />);

    expect(
      screen.getByRole('heading', { name: /Análisis por Dimensión/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Próximos Pasos Sugeridos/i })
    ).toBeInTheDocument();
  });
});
