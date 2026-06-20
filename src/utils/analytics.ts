/**
 * DIGITAL-H Analytics Utility
 * Centralized GA4 event tracking for the conversion funnel
 * Following PULSO-H pattern for consistency
 */
import * as Sentry from '@sentry/react';

// GA4 Event Names
export const GA4_EVENTS = {
  // Pre-test
  PRETEST_VIEW: 'digital_h_pretest_view',
  PRETEST_ACCEPT: 'digital_h_pretest_accept',
  
  // Funnel
  LANDING_VIEW: 'digital_h_landing_view',
  QUESTIONNAIRE_START: 'digital_h_questionnaire_start',
  QUESTION_ANSWERED: 'digital_h_question_answered',
  QUESTIONNAIRE_COMPLETE: 'digital_h_questionnaire_complete',
  QUESTIONNAIRE_ABANDON: 'digital_h_questionnaire_abandon',
  
  // Lead capture
  LEADFORM_START: 'digital_h_leadform_start',
  LEADFORM_SUBMIT: 'digital_h_leadform_submit',
  LEADFORM_COMPLETE: 'digital_h_leadform_complete',
  
  // Results
  RESULTS_VIEW: 'digital_h_results_view',
  PDF_DOWNLOAD: 'digital_h_pdf_download',
  CTA_CLICK: 'digital_h_cta_click',
  BOOKING_CREATED: 'digital_h_booking_created',
  
  // Ecommerce (GA4 standard)
  GENERATE_LEAD: 'generate_lead',
} as const;

interface GA4EventParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Track a GA4 event
 */
export const trackEvent = (eventName: string, params?: GA4EventParams): void => {
  if (typeof window === 'undefined') return;

  if (!(window as any).gtag) {
    if (import.meta.env.DEV) {
      // Dev: warn so misconfigured environments are caught early
      console.warn('[analytics] gtag not available:', eventName, params);
    } else {
      // Prod: breadcrumb for observability without alert noise
      Sentry.addBreadcrumb({
        category: 'analytics',
        message: `gtag not available: ${eventName}`,
        data: params,
        level: 'info',
      });
    }
    return;
  }

  (window as any).gtag('event', eventName, params);
};

/**
 * Track page view
 */
export const trackPageView = (pageName: string, params?: GA4EventParams): void => {
  trackEvent('page_view', {
    page_title: pageName,
    page_location: window.location.href,
    ...params,
  });
};

/**
 * Funnel Events
 */
export const trackLandingView = (source?: string): void => {
  trackEvent(GA4_EVENTS.LANDING_VIEW, {
    source: source || 'direct',
    utm_source: getUtmParam('utm_source'),
    utm_medium: getUtmParam('utm_medium'),
    utm_campaign: getUtmParam('utm_campaign'),
  });
};

export const trackPretestView = (): void => {
  trackEvent(GA4_EVENTS.PRETEST_VIEW);
};

export const trackPretestAccept = (gdprConsent: boolean, marketingConsent: boolean): void => {
  trackEvent(GA4_EVENTS.PRETEST_ACCEPT, {
    gdpr_consent: gdprConsent,
    marketing_consent: marketingConsent,
  });
};

export const trackQuestionnaireStart = (): void => {
  trackEvent(GA4_EVENTS.QUESTIONNAIRE_START);
};

export const trackQuestionAnswered = (questionNumber: number, dimensionId: string): void => {
  trackEvent(GA4_EVENTS.QUESTION_ANSWERED, {
    question_number: questionNumber,
    dimension_id: dimensionId,
  });
};

export const trackQuestionnaireComplete = (score: number, level: string, durationMinutes: number): void => {
  trackEvent(GA4_EVENTS.QUESTIONNAIRE_COMPLETE, {
    score,
    level,
    duration_minutes: durationMinutes,
  });
};

export const trackQuestionnaireAbandon = (progress: number, questionNumber: number): void => {
  trackEvent(GA4_EVENTS.QUESTIONNAIRE_ABANDON, {
    progress_percentage: progress,
    question_number: questionNumber,
  });
};

export const trackLeadformStart = (completionRate?: number): void => {
  trackEvent(GA4_EVENTS.LEADFORM_START, {
    utm_source: getUtmParam('utm_source'),
    utm_medium: getUtmParam('utm_medium'),
    utm_campaign: getUtmParam('utm_campaign'),
    ...(completionRate !== undefined && { question_completion_rate: completionRate }),
  });
};

export const trackLeadformSubmit = (challenge?: string, contactMethod?: string): void => {
  trackEvent(GA4_EVENTS.LEADFORM_SUBMIT, {
    challenge: challenge || 'not_provided',
    contact_method: contactMethod || 'not_provided',
  });
};

export const trackLeadformComplete = (score: number, level: string): void => {
  trackEvent(GA4_EVENTS.LEADFORM_COMPLETE, {
    score,
    level,
  });
  // Standard GA4 conversion event
  trackEvent(GA4_EVENTS.GENERATE_LEAD, {
    lead_source: 'digital-h',
    score,
    level,
  });
};

export const trackResultsView = (score: number, level: string): void => {
  trackEvent(GA4_EVENTS.RESULTS_VIEW, {
    score,
    level,
  });
};

export const trackPDFDownload = (): void => {
  trackEvent(GA4_EVENTS.PDF_DOWNLOAD);
};

export const trackCTAClick = (type: string): void => {
  trackEvent(GA4_EVENTS.CTA_CLICK, {
    type,
  });
};

export const trackBookingCreated = (date: string, time: string): void => {
  trackEvent(GA4_EVENTS.BOOKING_CREATED, {
    date,
    time,
  });
};

// Helper to get UTM parameters
function getUtmParam(param: string): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param) || undefined;
}

export default {
  trackEvent,
  trackPageView,
  trackLandingView,
  trackPretestView,
  trackPretestAccept,
  trackQuestionnaireStart,
  trackQuestionAnswered,
  trackQuestionnaireComplete,
  trackQuestionnaireAbandon,
  trackLeadformStart,
  trackLeadformSubmit,
  trackLeadformComplete,
  trackResultsView,
  trackPDFDownload,
  trackCTAClick,
  trackBookingCreated,
};