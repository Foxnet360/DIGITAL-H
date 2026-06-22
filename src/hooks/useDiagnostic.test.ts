import { renderHook } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useDiagnostic } from './useDiagnostic';
import { clearSession } from '../sessionStorage';
import { trackEvent, trackLeadformComplete } from '../utils/analytics';

vi.mock('../sessionStorage', () => ({
  clearSession: vi.fn(),
}));

vi.mock('../utils/analytics', () => ({
  trackEvent: vi.fn(),
  trackLeadformComplete: vi.fn(),
}));

const mockLead = {
  name: 'Test User',
  email: 'test@example.com',
  company: 'ACME',
  size: '11-50',
  score: 0,
  level: '',
};

const mockAnswers = Object.fromEntries(
  Array.from({ length: 48 }, (_, i) => [`q${i + 1}`, 4])
);

describe('useDiagnostic', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('happy path - successful API response', async () => {
    const mockResponse = {
      success: true,
      id: 1,
      share_token: 'uuid-token',
      email_sent: true,
    };
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const setLead = vi.fn();
    const setScreen = vi.fn();

    const { result } = renderHook(() => useDiagnostic());
    await result.current.finishDiagnostic(mockAnswers, mockLead, setLead, setScreen);

    expect(global.fetch).toHaveBeenCalledWith('./api/diagnostic.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: mockLead.name,
        email: mockLead.email,
        company: mockLead.company,
        size: mockLead.size,
        imd: 80,
        level: 'Excelente',
        answers: mockAnswers,
        gdprConsent: false,
        gdprTimestamp: undefined,
      }),
    });

    expect(setLead).toHaveBeenCalledWith({
      ...mockLead,
      score: 80,
      level: 'Excelente',
      id: 1,
      share_token: 'uuid-token',
      diagnosticId: 1,
      shareToken: 'uuid-token',
      shareUrl: 'http://localhost:3000/#results/1/uuid-token',
    });

    expect(setScreen).toHaveBeenCalledWith('results');
    expect(clearSession).toHaveBeenCalled();
  });

  it('sends all fields required for the email report', async () => {
    const mockResponse = {
      success: true,
      id: 1,
      share_token: 'uuid-token',
      email_sent: true,
    };
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const setLead = vi.fn();
    const setScreen = vi.fn();
    const gdprTimestamp = Date.now();
    const leadWithConsent = { ...mockLead, gdprConsent: true, gdprTimestamp };

    const { result } = renderHook(() => useDiagnostic());
    await result.current.finishDiagnostic(mockAnswers, leadWithConsent, setLead, setScreen);

    const callBody = JSON.parse((global.fetch as any).mock.calls[0][1].body);
    expect(callBody).toMatchObject({
      name: leadWithConsent.name,
      company: leadWithConsent.company,
      imd: 80,
      level: 'Excelente',
      answers: mockAnswers,
      gdprConsent: true,
      gdprTimestamp,
    });
    expect(callBody.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it('fetch network error fallback path', async () => {
    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    const setLead = vi.fn();
    const setScreen = vi.fn();

    const { result } = renderHook(() => useDiagnostic());
    await result.current.finishDiagnostic(mockAnswers, mockLead, setLead, setScreen);

    expect(setLead).toHaveBeenCalledWith({
      ...mockLead,
      score: 80,
      level: 'Excelente',
    });

    expect(setScreen).toHaveBeenCalledWith('results');
    expect(clearSession).toHaveBeenCalled();
  });

  it('non-OK HTTP response fallback path', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
    });

    const setLead = vi.fn();
    const setScreen = vi.fn();

    const { result } = renderHook(() => useDiagnostic());
    await result.current.finishDiagnostic(mockAnswers, mockLead, setLead, setScreen);

    expect(setLead).toHaveBeenCalledWith({
      ...mockLead,
      score: 80,
      level: 'Excelente',
    });

    expect(setScreen).toHaveBeenCalledWith('results');
    expect(clearSession).toHaveBeenCalled();
  });

  it('analytics events are fired on success', async () => {
    const mockResponse = {
      success: true,
      id: 1,
      share_token: 'uuid-token',
      email_sent: true,
    };
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const setLead = vi.fn();
    const setScreen = vi.fn();

    const { result } = renderHook(() => useDiagnostic());
    await result.current.finishDiagnostic(mockAnswers, mockLead, setLead, setScreen);

    expect(trackEvent).toHaveBeenCalledWith('digital_h_complete', {
      score: 80,
      level: 'Excelente',
      company_size: mockLead.size,
      industry: 'N/A',
      flow_version: 'v2_q48_capture',
    });
    expect(trackLeadformComplete).toHaveBeenCalledWith(80, 'Excelente');
  });
});
