# Calendly Integration Documentation

## Overview

Calendly is integrated into the Acrux ecosystem as the primary booking mechanism for free 30-minute consultation calls. This document covers the configuration, implementation, and analytics tracking for Calendly across all projects.

## Calendly Configuration

### Account Setup

- **Account**: acrux-consultores
- **Event Type**: 30-minute consultation
- **URL**: `https://calendly.com/acrux-consultores/30min`
- **Alternative URL**: `https://calendly.com/acrux-life/30min` (legacy, being phased out)

### Event Settings

| Setting | Value | Notes |
|---------|-------|-------|
| Duration | 30 minutes | Standard consultation call |
| Buffer before | 15 minutes | Preparation time |
| Buffer after | 15 minutes | Follow-up notes |
| Minimum notice | 24 hours | Prevents last-minute bookings |
| Time slots | 9:00, 10:00, 11:00, 14:00, 15:00, 16:00 | Business hours only |
| Days available | Monday-Friday | No weekend appointments |
| Timezone | America/Mexico_City | CST/CDT |

## Implementation

### DIGITAL-H

**Location**: `src/components/Results.tsx`

Calendly links appear in three locations:
1. Primary CTA in hero section (line 230)
2. Secondary CTA in consultation section (line 428)
3. Final CTA at bottom of results (line 642)

**Code Pattern**:
```tsx
<a
  href="https://calendly.com/acrux-consultores/30min"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => {
    if (window.gtag) {
      window.gtag('event', 'digital_h_cta_click', {
        type: 'calendly',
        location: 'results_hero' // varies by position
      });
    }
  }}
>
  Agendar consultoría gratuita
</a>
```

**Analytics Event**: `digital_h_cta_click` with parameter `type: 'calendly'`

### PULSO-H

**Location**: `src/pages/ResultsPage.tsx`

**Code Pattern**:
```tsx
<a
  href="https://calendly.com/acrux-consultores/30min"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => trackCTAClick('calendly')}
>
  Agendar sesión de 30 minutos
</a>
```

**Analytics Event**: `pulso_h_cta_click` with parameter `type: 'calendly'`

### ACRUX.life

**Location**: Various CTA sections

**Code Pattern**:
```tsx
<a
  href="https://calendly.com/acrux-consultores/30min"
  target="_blank"
  rel="noopener noreferrer"
>
  Agendar consultoría
</a>
```

## UTM Parameters for Tracking

### Recommended UTM Structure

To track which project/channel drives bookings, append UTM parameters:

```
https://calendly.com/acrux-consultores/30min?utm_source=digital-h&utm_medium=results_page&utm_campaign=post_diagnostic
```

**Standard UTM Parameters by Source**:

| Source Project | UTM Source | UTM Medium | UTM Campaign |
|----------------|------------|------------|--------------|
| DIGITAL-H | `digital-h` | `results_page` | `post_diagnostic` |
| PULSO-H | `pulso-h` | `results_page` | `post_assessment` |
| acrux.life | `acrux-life` | `cta_button` | `homepage` |
| Email | `email` | `newsletter` | ` nurture_sequence` |
| Social | `instagram`/`linkedin` | `social` | `q2_2026` |

### Implementation in Code

```typescript
// Generate Calendly URL with UTM params
const getCalendlyUrl = (source: string, medium: string, campaign: string) => {
  const baseUrl = 'https://calendly.com/acrux-consultores/30min';
  const params = new URLSearchParams({
    utm_source: source,
    utm_medium: medium,
    utm_campaign: campaign
  });
  return `${baseUrl}?${params.toString()}`;
};

// Usage
<a href={getCalendlyUrl('digital-h', 'results_page', 'post_diagnostic')}>
  Agendar
</a>
```

## Analytics Event Mapping

### GA4 Events

| Action | Event Name | Parameters | Trigger |
|--------|------------|------------|---------|
| Click Calendly link | `digital_h_cta_click` | `type: 'calendly'` | Link click |
| Booking completed | `digital_h_booking_created` | `date`, `time` | Calendly webhook (optional) |

**Note**: Calendly booking completion can only be tracked if:
1. Calendly webhooks are configured
2. Or user returns to thank-you page after booking

### Calendly Webhooks (Optional Advanced Setup)

To track actual bookings (not just clicks), configure Calendly webhooks:

1. Go to Calendly Admin > Integrations > Webhooks
2. Add webhook endpoint: `https://acrux.life/api/calendly-webhook.php`
3. Subscribe to events:
   - `invitee.created` - Booking created
   - `invitee.canceled` - Booking canceled

**Webhook Payload**:
```json
{
  "event": "invitee.created",
  "payload": {
    "event_type": {
      "uuid": "ABC123",
      "name": "30 Minute Consultation"
    },
    "invitee": {
      "uuid": "DEF456",
      "name": "John Doe",
      "email": "john@company.com",
      "scheduled_event": {
        "start_time": "2026-06-01T14:00:00-05:00",
        "end_time": "2026-06-01T14:30:00-05:00"
      }
    },
    "tracking": {
      "utm_source": "digital-h",
      "utm_medium": "results_page"
    }
  }
}
```

## Testing Checklist

### Link Validation

- [ ] DIGITAL-H: All 3 Calendly links open correctly
- [ ] PULSO-H: Calendly link opens correctly
- [ ] acrux.life: All Calendly CTAs open correctly
- [ ] Links open in new tab (`target="_blank"`)
- [ ] `rel="noopener noreferrer"` present for security
- [ ] No 404 errors when opening links

### Analytics Tracking

- [ ] Clicking Calendly link fires `cta_click` event
- [ ] Event includes `type: 'calendly'` parameter
- [ ] Event appears in GA4 Real-Time report within 30 seconds
- [ ] UTM parameters are preserved in Calendly URL

### User Experience

- [ ] Links are visually distinct (button styling)
- [ ] Clear call-to-action text ("Agendar consultoría gratuita")
- [ ] Mobile-friendly tap targets (minimum 44px)
- [ ] Loading state not needed (external link)

## Troubleshooting

### Issue: Calendly link returns 404

**Check**:
1. URL spelling: `calendly.com/acrux-consultores/30min`
2. Event is active in Calendly admin
3. No typos in username or event slug

### Issue: Analytics event not firing

**Check**:
1. `window.gtag` is defined
2. Event name matches GA4_EVENTS constant
3. No JavaScript errors in console
4. Ad blockers not preventing gtag

### Issue: UTM parameters lost

**Check**:
1. UTM params included in href URL
2. Calendly is configured to capture UTM params
3. URL format: `?utm_source=X&utm_medium=Y`

## Maintenance

### Regular Tasks

| Task | Frequency | Owner |
|------|-----------|-------|
| Verify links work | Weekly | QA |
| Check Calendly availability | Weekly | Operations |
| Review booking analytics | Monthly | Marketing |
| Update UTM campaigns | Per campaign | Marketing |

### Calendly Admin Access

- Primary admin: ops@acrux.life
- Backup admin: [backup-email]
- Event management: https://calendly.com/app/event_types/user/me

---

**Last Updated**: 2026-05-30
**Version**: 1.0
**Owner**: Development Team
