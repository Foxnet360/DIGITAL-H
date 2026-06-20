import { calculateIMD, getMaturityLevel } from '../utils';
import { clearSession } from '../sessionStorage';
import { Lead } from '../types';
import { trackEvent, trackLeadformComplete } from '../utils/analytics';

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
      // Note: using 'digital_h_complete' (not GA4_EVENTS.QUESTIONNAIRE_COMPLETE)
      // to preserve historical GA4 event name and avoid breaking existing reports.
      trackEvent('digital_h_complete', {
        score: imd,
        level: level.name,
        company_size: lead.size,
        industry: (lead as any).industry || 'N/A',
        flow_version: 'v2_q48_capture',
      });
      trackLeadformComplete(imd, level.name);

      const id = result.id;
      const shareToken = result.share_token;
      const shareUrl = `${window.location.origin}${window.location.pathname}#results/${id}/${shareToken}`;

      setLead({
        ...lead,
        score: imd,
        level: level.name,
        id,
        share_token: shareToken,
        diagnosticId: id,
        shareToken: shareToken,
        shareUrl,
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
