import { calculateIMD, getMaturityLevel } from '../utils';
import { clearSession } from '../sessionStorage';
import { Lead } from '../types';

export function useDiagnostic() {
  const finishDiagnostic = async (answers: Record<string, number>, lead: Lead, setLead: (lead: Lead) => void, setScreen: (screen: any) => void) => {
    const imd = calculateIMD(answers);
    const level = getMaturityLevel(imd);
    
    const diagnosticData = {
      name: lead.name,
      email: lead.email,
      company: lead.company,
      size: lead.size,
      imd,
      level: level.name,
      answers,
      gdprConsent: lead.gdprConsent || false,
      gdprTimestamp: lead.gdprTimestamp,
    };

    try {
      const response = await fetch('./api/diagnostic.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(diagnosticData),
      });

      if (!response.ok) {
        throw new Error('Error saving diagnostic');
      }

      const result = await response.json();

      // Track diagnostic completion
      if (window.gtag) {
        window.gtag('event', 'digital_h_complete', {
          score: imd,
          level: level.name,
          company_size: lead.size,
          industry: lead.industry || 'N/A',
          flow_version: 'v2_q48_capture'
        });
      }

      setLead({
        ...lead,
        score: imd,
        level: level.name,
        id: result.id,
      });

      clearSession(); // clear session on completion
      setScreen('results');
    } catch (error) {
      console.error('Error saving diagnostic:', error);
      // Still show results even if save fails
      setLead({
        ...lead,
        score: imd,
        level: level.name,
      });
      clearSession();
      setScreen('results');
    }
  };

  return { finishDiagnostic };
}
