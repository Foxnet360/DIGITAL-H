import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateReportPDF } from './generateReportPDF';

const mockDoc = {
  internal: {
    pageSize: {
      getWidth: vi.fn(() => 210),
      getHeight: vi.fn(() => 297),
    },
    getNumberOfPages: vi.fn(() => 1),
    lastAutoTable: { finalY: 100 },
  },
  setFillColor: vi.fn(),
  setTextColor: vi.fn(),
  setFontSize: vi.fn(),
  setFont: vi.fn(),
  rect: vi.fn(),
  roundedRect: vi.fn(),
  text: vi.fn(),
  addImage: vi.fn(),
  addPage: vi.fn(function () {
    const current = mockDoc.internal.getNumberOfPages();
    mockDoc.internal.getNumberOfPages = vi.fn(() => current + 1);
  }),
  splitTextToSize: vi.fn((text: string) => [text]),
  link: vi.fn(),
  setPage: vi.fn(),
  save: vi.fn(),
};

const autoTableCalls: { doc: typeof mockDoc; options: Record<string, unknown> }[] = [];

vi.mock('jspdf', () => ({
  default: function MockJsPDF() {
    return mockDoc;
  },
}));

vi.mock('jspdf-autotable', () => ({
  default: vi.fn((doc, options) => {
    autoTableCalls.push({ doc, options });
    (doc as any).lastAutoTable = { finalY: 100 };
  }),
}));

vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('No logo in test'))));

const sampleAnswers: Record<string, number> = {
  'E1.1': 5, 'E1.2': 4, 'E1.3': 3, 'E1.4': 2, 'E1.5': 1, 'E1.6': 5, 'E1.7': 4, 'E1.8': 3,
  'C2.1': 1, 'C2.2': 2, 'C2.3': 3, 'C2.4': 4, 'C2.5': 5, 'C2.6': 4, 'C2.7': 3, 'C2.8': 2,
  'T3.1': 5, 'T3.2': 5, 'T3.3': 5, 'T3.4': 5, 'T3.5': 5, 'T3.6': 5, 'T3.7': 5, 'T3.8': 5,
  'I4.1': 4, 'I4.2': 4, 'I4.3': 4, 'I4.4': 4, 'I4.5': 4, 'I4.6': 4, 'I4.7': 4, 'I4.8': 4,
  'P5.1': 3, 'P5.2': 3, 'P5.3': 3, 'P5.4': 3, 'P5.5': 3, 'P5.6': 3, 'P5.7': 3, 'P5.8': 3,
  'B6.1': 2, 'B6.2': 2, 'B6.3': 2, 'B6.4': 2, 'B6.5': 2, 'B6.6': 2, 'B6.7': 2, 'B6.8': 2,
};

const sampleLead = {
  name: 'María López',
  email: 'maria@example.com',
  company: 'Acrux Test',
  size: '11-50',
  score: 58,
  level: 'Desarrollo',
};

describe('generateReportPDF', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    autoTableCalls.length = 0;
    mockDoc.internal.getNumberOfPages = vi.fn(() => 1);
  });

  it('generates a multi-page PDF and saves it with the company name', async () => {
    await generateReportPDF({ answers: sampleAnswers, lead: sampleLead });

    expect(mockDoc.save).toHaveBeenCalledTimes(1);
    expect(mockDoc.save).toHaveBeenCalledWith(expect.stringContaining('Acrux_Test'));
    expect(mockDoc.internal.getNumberOfPages()).toBeGreaterThanOrEqual(4);
  });

  it('includes the company name in every page header', async () => {
    await generateReportPDF({ answers: sampleAnswers, lead: sampleLead });

    const headerTextCalls = (mockDoc.text as any).mock.calls.filter(
      (call: [string | string[], number, number, object?]) => {
        const text = Array.isArray(call[0]) ? call[0][0] : call[0];
        return text === sampleLead.company;
      }
    );
    expect(headerTextCalls.length).toBeGreaterThanOrEqual(mockDoc.internal.getNumberOfPages());
  });

  it('renders a dimension table that matches the provided answers', async () => {
    await generateReportPDF({ answers: sampleAnswers, lead: sampleLead });

    const dimensionTable = autoTableCalls.find(
      (call) =>
        Array.isArray(call.options.head) &&
        JSON.stringify(call.options.head[0]) === JSON.stringify(['Dimensión', 'Puntuación', 'Porcentaje', 'Nivel'])
    );

    expect(dimensionTable).toBeDefined();
    const body = dimensionTable!.options.body as string[][];
    expect(body).toHaveLength(6);

    const estrategiaRow = body.find((row) => row[0] === 'Estrategia Digital');
    expect(estrategiaRow).toBeDefined();
    expect(estrategiaRow![1]).toMatch(/^3\.4\/5\.0$/);

    const tecnologiaRow = body.find((row) => row[0] === 'Tecnología e Infraestructura');
    expect(tecnologiaRow).toBeDefined();
    expect(tecnologiaRow![1]).toMatch(/^4\.0\/5\.0$/);
    expect(tecnologiaRow![2]).toBe('80%');
  });

  it('gracefully handles logo fetch failure without crashing', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Network failure'));

    await expect(
      generateReportPDF({ answers: sampleAnswers, lead: sampleLead })
    ).resolves.not.toThrow();

    expect(mockDoc.save).toHaveBeenCalled();
  });

  it('produces at least two pages for minimal sample data', async () => {
    const minimalAnswers: Record<string, number> = {
      'E1.1': 3, 'C2.1': 3, 'T3.1': 3, 'I4.1': 3, 'P5.1': 3, 'B6.1': 3,
    };

    await generateReportPDF({ answers: minimalAnswers, lead: sampleLead });

    expect(mockDoc.internal.getNumberOfPages()).toBeGreaterThanOrEqual(2);
  });
});
