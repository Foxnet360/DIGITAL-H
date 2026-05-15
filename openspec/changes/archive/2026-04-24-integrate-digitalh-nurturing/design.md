## Context

DIGITAL-H is a React-based diagnostic tool deployed as a subdirectory (`/digital-h/`) within acrux.life. Both applications share the same MySQL database (`u554044004_acruxdb`) and Hostinger hosting environment. 

Currently, DIGITAL-H has its own PHP backend (`public/digital-h/api/diagnostic.php`) that:
1. Saves diagnostic results to `digitalh_results`
2. Sends a custom Day 0 thank-you email using PHP's `mail()` function
3. Does NOT register leads in acrux.life's `email_sequences` table

acrux.life has a complete email nurturing system (`database/email_sender.php` triggered by cron) that sends 5 emails over 14 days using PHPMailer. The system already supports segmentation by maturity level and weak dimension.

Both systems use the same SMTP credentials (Hostinger) but DIGITAL-H maintains a separate `config.php` with hardcoded duplicate credentials.

## Goals / Non-Goals

**Goals:**
- Register every DIGITAL-H diagnostic completer (with GDPR consent) into acrux.life's `email_sequences` table
- Calculate and store the weak dimension for personalized email content
- Replace PHP `mail()` with PHPMailer for Day 0 email (better deliverability, consistent with acrux.life)
- Use centralized configuration from acrux.life instead of duplicate credentials
- Maintain existing Day 0 email content and branding
- Ensure cron job sends Day 2 as next email (set `current_step=1`)

**Non-Goals:**
- Modify acrux.life's email templates or cron logic
- Change the frontend React code or API endpoint URL
- Implement email open/click tracking (already exists in acrux.life)
- Create new database tables (reuse existing schema)
- Support for non-GDPR markets (only handle explicit consent as-is)

## Decisions

### 1. Keep DIGITAL-H's Separate Endpoint
**Decision**: Modify `public/digital-h/api/diagnostic.php` rather than redirecting to acrux.life's `/api/diagnostic.php`.

**Rationale**: 
- Preserves DIGITAL-H's custom Day 0 email logic and branding
- No frontend changes required (keeps POSTing to same relative URL)
- Allows DIGITAL-H to maintain its own CORS and validation logic
- Easier deployment - no routing changes needed

**Alternative considered**: Unified endpoint in acrux.life. Rejected because it would require merging two different Day 0 email templates and complicate deployment.

### 2. Use `current_step=1` to Skip Day 0 in Cron
**Decision**: When inserting into `email_sequences`, set `current_step=1` and `next_send_at = NOW() + INTERVAL 2 DAY`.

**Rationale**:
- DIGITAL-H already sent Day 0 email immediately
- acrux.life's cron job sends the next step based on `current_step`
- Step 1 = Day 0 in acrux.life's template numbering, so setting step=1 tells cron to send step 2 (Day 2) next
- Avoids duplicate Day 0 emails and timing conflicts

### 3. Calculate Weak Dimension in PHP (Not Frontend)
**Decision**: Calculate the weakest dimension server-side in `diagnostic.php` before inserting into `email_sequences`.

**Rationale**:
- Keeps business logic on backend where database writes happen
- Frontend already sends raw answers; no need to add calculation there
- Can reuse existing `calculateDimensions()` logic from acrux.life
- Easier to modify algorithm later without redeploying frontend

**Algorithm**: Group answers by prefix (E=Strategy, C=Culture, T=Talent, I=Technology, P=Processes, B=Wellbeing), calculate average per group, identify minimum, map to Spanish label.

### 4. Reuse acrux.life PHPMailer Configuration
**Decision**: Include acrux.life's `database/config.php` and use its PHPMailer instance instead of maintaining duplicate SMTP credentials in DIGITAL-H.

**Rationale**:
- Single source of truth for SMTP credentials
- If password changes, only one file to update
- Already uses PHPMailer with proper Hostinger SMTP settings
- Reduces security risk of hardcoded credentials in multiple locations

**Implementation**: Use `require_once '../../../database/config.php'` (relative path from DIGITAL-H API to acrux.life database config). If PHPMailer isn't available at that path, fallback to including from `../../vendor/autoload.php`.

### 5. Preserve `.htaccess` During Deployment
**Decision**: Add `.htaccess` to `.gitignore` or deployment exclusions.

**Rationale**:
- Production `.htaccess` may have custom rewrite rules or SPA routing
- Overwriting it could break the application
- DIGITAL-H doesn't modify `.htaccess` as part of this change

## Risks / Trade-offs

**[Risk]** DIGITAL-H's `config.php` has hardcoded production credentials checked into git.
→ **Mitigation**: Remove `config.php` entirely and use acrux.life's shared config. Add the old `config.php` to `.gitignore` to prevent accidental commits.

**[Risk]** Relative path to acrux.life's `database/config.php` may break if directory structure changes.
→ **Mitigation**: Use `__DIR__` to build absolute paths. Document the expected directory structure in deployment notes.

**[Risk]** If `email_sequences` table has unique constraints on email, duplicate diagnostics may overwrite nurturing progress.
→ **Mitigation**: Use `ON DUPLICATE KEY UPDATE` to restart sequence (as acrux.life already does). This is acceptable behavior - if someone retakes the diagnostic, they restart the nurturing.

**[Risk]** PHPMailer may not be installed in DIGITAL-H's vendor directory.
→ **Mitigation**: Check for PHPMailer availability. If not found, provide clear error message and instructions to run `composer install` in acrux.life directory.

**[Risk]** Cron job timezone mismatch between Hostinger server and `next_send_at` timestamps.
→ **Mitigation**: Ensure both systems use the same timezone (America/Bogota) in MySQL connection. acrux.life's config already sets this.

## Migration Plan

1. **Pre-deployment**:
   - Verify `email_sequences` and `email_templates` tables exist and have data
   - Confirm PHPMailer is installed in acrux.life (`database/vendor/phpmailer` or similar)
   - Backup existing `public/digital-h/api/config.php` (for rollback)

2. **Deployment**:
   - Upload modified `diagnostic.php`
   - Remove or archive old `config.php` (keep backup)
   - Verify `database/config.php` from acrux.life is accessible from DIGITAL-H path
   - Test diagnostic submission with GDPR consent
   - Verify record appears in `email_sequences` with correct `current_step=1`
   - Check that Day 0 email is sent via PHPMailer

3. **Post-deployment**:
   - Set up Hostinger cron job (daily at 9:00 AM)
   - Monitor `email_logs` table for send failures
   - Check `email_sender.log` for errors

4. **Rollback**:
   - Restore original `diagnostic.php` and `config.php`
   - Delete any `email_sequences` records created during testing

## Open Questions

1. Should DIGITAL-H's Day 0 email use acrux.life's email template system instead of hardcoded HTML? (Would simplify maintenance but lose custom branding)
2. Do we need to handle the case where acrux.life's `database/config.php` doesn't expose a PHPMailer instance directly? (May need to instantiate our own with shared credentials)
3. Should we add a dry-run mode to `diagnostic.php` for testing without sending emails?
