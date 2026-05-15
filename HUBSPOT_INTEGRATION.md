# HubSpot Integration Guide for DIGITAL-H

## Overview

This document outlines the fields and webhook endpoints needed to integrate DIGITAL-H with HubSpot for automated lead nurturing and CRM synchronization.

## Current Data Fields

### Contact Properties to Create in HubSpot

Create these custom properties in HubSpot Contact records:

| Property Name | API Name | Type | Description |
|---------------|----------|------|-------------|
| IMD Score | imd_score | Number | Índice de Madurez Digital (0-100) |
| Maturity Level | maturity_level | String | Nivel: Inicial, Emergente, Desarrollo, Avanzado, Excelente, Referente |
| Digital-H Dimension Weak | dimension_weak | String | Dimensión más débil del diagnóstico |
| Digital-H Completion Date | digitalh_completion_date | Date | Fecha de completitud del diagnóstico |
| Company Size | company_size | String | Tamaño de empresa (1-10, 11-50, etc.) |
| GDPR Consent | gdpr_consent | Boolean | Consentimiento GDPR otorgado |

### Deal Properties

| Property Name | API Name | Type | Description |
|---------------|----------|------|-------------|
| Source | source | String | Valor fijo: "DIGITAL-H" |
| Diagnostic Score | diagnostic_score | Number | IMD Score del lead |

## Webhook Payload Format

When sending data to HubSpot, use this JSON structure:

```json
{
  "email": "user@example.com",
  "firstname": "Juan",
  "lastname": "Pérez",
  "company": "Empresa XYZ",
  "imd_score": 65,
  "maturity_level": "Desarrollo",
  "dimension_weak": "estrategia",
  "company_size": "11-50",
  "gdpr_consent": true,
  "digitalh_completion_date": "2024-01-15T10:30:00Z",
  "source": "DIGITAL-H"
}
```

## Integration Endpoints

### Option 1: HubSpot Forms API

Submit directly to HubSpot forms:

```
POST https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formGuid}
```

### Option 2: HubSpot Contacts API

Create/update contact via API:

```
POST https://api.hubapi.com/crm/v3/objects/contacts
```

Headers:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Option 3: HubSpot Webhooks (Inbound)

Configure webhook URL in `public/digital-h/api/hubspot-webhook.php` to receive HubSpot events.

## Implementation Steps

1. **Create Custom Properties**: Log into HubSpot → Settings → Properties → Contact Properties → Create properties listed above

2. **Generate API Key**: HubSpot → Settings → Integrations → API Key

3. **Update PHP Backend**: Modify `diagnostic.php` to include HubSpot API call after saving to local database:

```php
// After saving to MySQL, send to HubSpot
function syncToHubSpot($data) {
    $apiKey = getenv('HUBSPOT_API_KEY');
    $url = "https://api.hubapi.com/crm/v3/objects/contacts?hapikey=$apiKey";
    
    $payload = [
        "properties" => [
            "email" => $data['email'],
            "firstname" => $data['name'],
            "company" => $data['company'],
            "imd_score" => $data['imd'],
            "maturity_level" => $data['level'],
            "company_size" => $data['size'],
            "gdpr_consent" => $data['gdprConsent'] ? "true" : "false"
        ]
    ];
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
    
    return $response;
}
```

4. **Add Environment Variable**: Add `HUBSPOT_API_KEY` to `.env` and `config.php`

5. **Test Integration**: Submit a test diagnostic and verify contact appears in HubSpot with all custom properties

## Email Sequences

Recommended HubSpot email sequences based on maturity level:

### Inicial/Emergente (Score 0-45)
- Day 0: Welcome + PDF Report
- Day 2: Educational content about digital transformation basics
- Day 7: Case study of similar company that improved
- Day 14: CTA for free consultation

### Desarrollo/Avanzado (Score 46-75)
- Day 0: Welcome + PDF Report
- Day 2: Advanced strategies for their weakest dimension
- Day 5: Industry benchmark comparison
- Day 10: CTA for strategy session

### Excelente/Referente (Score 76-100)
- Day 0: Welcome + PDF Report + Recognition
- Day 3: Thought leadership content
- Day 7: Invitation to exclusive webinar
- Day 14: CTA for partnership discussion

## Notes

- Always check for existing contacts before creating (use email as unique identifier)
- Handle API rate limits (HubSpot allows 100 requests/10 seconds for free tier)
- Log all HubSpot API errors for debugging
- Consider using HubSpot's batch API for bulk operations
