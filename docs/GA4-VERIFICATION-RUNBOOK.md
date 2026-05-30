# GA4 Event Verification Runbook

## Overview

This document provides step-by-step procedures for verifying that all Google Analytics 4 events are firing correctly across the Acrux ecosystem (acrux.life, DIGITAL-H, PULSO-H).

## Prerequisites

- Access to GA4 Property: `acrux.life`
- Chrome browser with DevTools
- DebugView enabled in GA4 (Admin > Data Streams > Web Stream > DebugView)

---

## Verification Procedure

### Step 1: Enable GA4 Debug Mode

1. Open Chrome DevTools (F12)
2. Go to Application tab > Local Storage
3. Add key: `ga_debug_mode`, value: `true`
4. Refresh page
5. Open GA4 DebugView in parallel (Realtime > DebugView)

### Step 2: DIGITAL-H Event Verification

#### 2.1 Landing Page Events

| Test | URL | Expected Event | Parameters |
|------|-----|----------------|------------|
| Direct visit | `/digital-h/` | `digital_h_landing_view` | `source: "direct"` |
| UTM visit | `/digital-h/?utm_source=instagram` | `digital_h_landing_view` | `utm_source: "instagram"` |
| UTM full | `/digital-h/?utm_source=email&utm_medium=newsletter&utm_campaign=q2_2026` | `digital_h_landing_view` | `utm_source`, `utm_medium`, `utm_campaign` |

**Verify**: Event appears in DebugView within 10 seconds of page load.

#### 2.2 Pre-Test Flow

1. Click "Comenzar diagnóstico"
   - Expected: `digital_h_pretest_view`
   
2. Check GDPR checkbox, click "Comenzar"
   - Expected: `digital_h_pretest_accept`
   - Parameters: `gdpr_consent: true`

**Verify**: Both events fire sequentially without errors.

#### 2.3 Questionnaire Events

1. First question answered
   - Expected: `digital_h_questionnaire_start` (on first answer)
   - Expected: `digital_h_question_answered`
   - Parameters: `question_number: 1`, `dimension_id: "strategy"`

2. Answer all 48 questions
   - Expected: `digital_h_questionnaire_complete`
   - Parameters: `score`, `level`, `duration_minutes`

**Verify**: Events increment correctly, dimension_id matches question category.

#### 2.4 Lead Form Events

1. Lead form displayed (after questionnaire)
   - Expected: `digital_h_leadform_start`

2. Submit form with all fields
   - Expected: `digital_h_leadform_submit`
   - Parameters: `challenge`, `contact_method`
   - Expected: `digital_h_leadform_complete`
   - Expected: `generate_lead` (standard GA4)

**Verify**: `generate_lead` triggers as conversion event.

#### 2.5 Results Page Events

1. Results page loaded
   - Expected: `digital_h_results_view`
   - Parameters: `score`, `level`

2. Click "Descargar informe PDF"
   - Expected: `digital_h_pdf_download`

3. Click "Agendar consultoría"
   - Expected: `digital_h_cta_click`
   - Parameters: `type: "calendly_booking"`

#### 2.6 Abandonment Tracking

1. Start questionnaire
2. Answer 10 questions
3. Close browser tab
4. **Expected**: `digital_h_questionnaire_abandon`
   - Parameters: `progress_percentage: ~20`, `question_number: 10`

**Note**: This event fires via `beforeunload` handler.

### Step 3: PULSO-H Event Verification

Repeat the same procedure for PULSO-H with these event mappings:

| DIGITAL-H Event | PULSO-H Equivalent |
|-----------------|-------------------|
| `digital_h_landing_view` | `pulso_h_landing_view` |
| `digital_h_pretest_view` | `pulso_h_welcome_view` |
| `digital_h_pretest_accept` | `pulso_h_assessment_start` |
| `digital_h_question_answered` | `pulso_h_question_answered` |
| `digital_h_questionnaire_complete` | `pulso_h_assessment_complete` |
| `digital_h_leadform_start` | `pulso_h_lead_capture_start` |
| `digital_h_leadform_submit` | `pulso_h_lead_capture_complete` |
| `digital_h_results_view` | `pulso_h_results_view` |
| `digital_h_pdf_download` | `pulso_h_pdf_download` |
| `digital_h_cta_click` | `pulso_h_cta_click` |

**PULSO-H Specific Checks**:
- Clinical disclaimer checkbox must be checked before `pulso_h_assessment_start`
- Both disclaimer AND GDPR required for form submission

### Step 4: Cross-Project UTM Verification

1. Visit acrux.life with UTM params: `?utm_source=linkedin&utm_medium=social`
2. Click diagnostic card for DIGITAL-H
3. Verify `digital_h_landing_view` includes:
   - `utm_source: "linkedin"`
   - `utm_medium: "social"`
4. Complete funnel
5. Verify ALL subsequent events include UTM params

**Critical**: UTM parameters must persist through entire funnel.

---

## Troubleshooting Guide

### Issue: Events not appearing in DebugView

**Checks**:
1. ✅ `gtag` script loaded in `<head>`
2. ✅ No ad blockers enabled
3. ✅ `ga_debug_mode` set in localStorage
4. ✅ Correct GA4 Measurement ID (G-XXXXXXXXXX)
5. ✅ Event name matches exactly (case-sensitive)

**Debug Commands**:
```javascript
// Check if gtag is available
console.log(typeof window.gtag); // should be "function"

// Manually fire test event
window.gtag('event', 'test_event', { test: true });

// Check data layer
console.log(window.dataLayer);
```

### Issue: UTM parameters not tracking

**Checks**:
1. ✅ UTM params present in URL on landing
2. ✅ `getUtmParam()` function returns correct values
3. ✅ Events include UTM params in payload
4. ✅ URL params not stripped by redirects

**Debug**:
```javascript
// Check URL params
console.log(new URLSearchParams(window.location.search).get('utm_source'));

// Check analytics utility
import { trackLandingView } from './utils/analytics';
trackLandingView();
// Check network tab for outgoing requests
```

### Issue: Events appearing but with wrong parameters

**Common Causes**:
- State not updated before event fires (use `flushSync`)
- Variable name typos in event payload
- Type mismatches (string vs number)

**Fix**: Verify event payload structure matches GA4_EVENTS definitions.

### Issue: Conversion events not counting

**Checks**:
1. ✅ `generate_lead` marked as conversion in GA4
2. ✅ Event fires after successful form submission
3. ✅ No errors in console preventing execution
4. ✅ Backend API responds with success

**GA4 Configuration**:
- Admin > Events > Mark as conversion
- Ensure `generate_lead` is in conversion list

---

## Event Verification Checklist

### DIGITAL-H

- [ ] `digital_h_landing_view` fires on page load
- [ ] `digital_h_pretest_view` fires on pre-test screen
- [ ] `digital_h_pretest_accept` fires with GDPR consent
- [ ] `digital_h_questionnaire_start` fires on first answer
- [ ] `digital_h_question_answered` fires for each question
- [ ] `digital_h_questionnaire_complete` fires at end
- [ ] `digital_h_leadform_start` fires when form shown
- [ ] `digital_h_leadform_submit` fires on submission
- [ ] `generate_lead` fires as conversion
- [ ] `digital_h_results_view` fires on results
- [ ] `digital_h_cta_click` fires on CTA clicks
- [ ] `digital_h_pdf_download` fires on PDF download
- [ ] `digital_h_booking_created` fires on Calendly booking
- [ ] `digital_h_questionnaire_abandon` fires on close tab
- [ ] UTM params present in all events

### PULSO-H

- [ ] `pulso_h_landing_view` fires on page load
- [ ] `pulso_h_assessment_start` fires with both consents
- [ ] `pulso_h_question_answered` fires for each question
- [ ] `pulso_h_assessment_complete` fires at end
- [ ] `pulso_h_lead_capture_start` fires when form shown
- [ ] `pulso_h_lead_capture_complete` fires on submission
- [ ] `generate_lead` fires as conversion
- [ ] `pulso_h_results_view` fires on results
- [ ] `pulso_h_cta_click` fires on CTA clicks
- [ ] `pulso_h_pdf_download` fires on PDF download
- [ ] UTM params present in all events

---

## Verification Schedule

| Frequency | Task | Owner |
|-----------|------|-------|
| Weekly | Check DebugView for missing events | Marketing |
| Monthly | Full event verification (this runbook) | QA |
| After deploy | Verify all events post-deployment | Dev + QA |
| Quarterly | Review event naming consistency | Analytics |

---

## Resources

- GA4 DebugView: https://analytics.google.com/analytics/web/#/a123456789p987654321/admin/streams/table
- gtag Documentation: https://developers.google.com/analytics/devguides/collection/gtagjs
- Event Parameters: https://support.google.com/analytics/answer/9267568

---

**Last Updated**: 2026-05-30
**Version**: 1.0
**Owner**: Development Team
