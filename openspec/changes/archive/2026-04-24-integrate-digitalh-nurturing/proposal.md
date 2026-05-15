## Why

DIGITAL-H captures leads through its diagnostic tool but fails to register them in acrux.life's email nurturing sequence. Users complete the diagnostic and receive only the immediate Day 0 thank-you email, missing the follow-up nurturing sequence (Days 2, 4, 7, 14) that guides them toward conversion. Both systems share the same MySQL database and SMTP credentials, making integration straightforward but currently unrealized.

## What Changes

- **Modify DIGITAL-H diagnostic endpoint** (`public/digital-h/api/diagnostic.php`) to insert leads into acrux.life's `email_sequences` table after saving diagnostic results
- **Calculate weak dimension** from diagnostic answers to enable segmented email content (Day 4 email varies by weak dimension)
- **Use PHPMailer** instead of PHP's native `mail()` function for Day 0 email to match acrux.life's infrastructure and improve deliverability
- **Set `current_step = 1`** in `email_sequences` so acrux.life's cron job sends Day 2 as the next email (avoiding duplicate Day 0)
- **Schedule Hostinger cron job** to run `database/email_sender.php` daily at 9:00 AM
- **Preserve existing `.htaccess`** file during deployment (do not overwrite)
- **Remove duplicate config.php** from DIGITAL-H and reuse acrux.life's centralized configuration

## Capabilities

### New Capabilities
- `lead-sequence-registration`: Register DIGITAL-H diagnostic completers into acrux.life's email nurturing sequence with proper segmentation data (maturity level, weak dimension, score)
- `phpmailer-integration`: Replace PHP `mail()` with PHPMailer for Day 0 email sending, reusing acrux.life's SMTP configuration
- `weak-dimension-calculation`: Calculate the weakest dimension from diagnostic answers to enable personalized nurturing content

### Modified Capabilities
- *(none - this is a backend integration that doesn't change existing spec-level behavior)*

## Impact

- **Affected Files**:
  - `public/digital-h/api/diagnostic.php` - Add sequence registration logic
  - `public/digital-h/api/config.php` - Remove duplicate credentials (use acrux.life's config)
  - `public/digital-h/api/diagnostic-simple.php` - May need alignment
  
- **Database**: MySQL `u554044004_acruxdb` (shared between both systems)
  - Reads from: `email_templates`, `digitalh_results`
  - Writes to: `email_sequences`, `email_logs`

- **Infrastructure**:
  - Hostinger hPanel cron job configuration
  - PHPMailer dependency (already present in acrux.life)
  - SMTP via `smtp.hostinger.com:465`

- **APIs**: No public API changes. DIGITAL-H frontend continues POSTing to same endpoint.

- **Email Flow**:
  - Day 0 (immediate): DIGITAL-H custom thank-you email with results
  - Day 2: acrux.life nurturing email (maturity level segmented)
  - Day 4: acrux.life nurturing email (weak dimension segmented)
  - Day 7: acrux.life nurturing email (maturity level segmented)
  - Day 14: acrux.life survey email
