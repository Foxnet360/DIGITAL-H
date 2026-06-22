# Proposal: Integrate DIGITAL-H with acrux.life Unified Nurturing

## Intent
DIGITAL-H currently sends a standalone thank-you email after diagnostic completion. acrux.life already runs a mature unified nurturing system (`nurturing_sequences`, `email_sender_unified.php`, open/click tracking). This change connects DIGITAL-H to that infrastructure so every GDPR-consented diagnostic completion enters the unified sequence and receives Email 1, while preserving the legacy email as a fallback.

## Scope

### In Scope
- Add PDO-based MySQL connection (`getPDOConnection`) in `public/api/config.php`.
- Replace hardcoded DB/SMTP credentials with environment-aware `env()` helper in `public/api/config.php`, `deploy/digital-h/api/config.php`, and `docker-config.php`.
- In `public/api/diagnostic.php`, after saving the diagnostic:
  - If GDPR consent is true, insert/update `nurturing_sequences` (product=`digital-h`) via `insertEmailSequence()`.
  - Send Email 1 via `sendEmail1()` with results CTA, Calendly link, and tracking pixel.
  - If unified nurturing fails or consent is absent, fall back to the existing `sendThankYouEmail()`.
- Document required env vars in `.env.example` and Hostinger deployment notes.

### Out of Scope
- Changes to the acrux.life unified nurturing scheduler or email templates beyond Email 1.
- PULSO-H integration (separate change).
- New front-end UI or analytics events.
- Removing the legacy thank-you email path.

## Capabilities

### New Capabilities
- `unified-nurturing-adapter`: Backend adapter that writes DIGITAL-H leads into `nurturing_sequences`, sends immediate Email 1 with tracking pixel, and falls back to legacy email on failure.

### Modified Capabilities
- `email-report-delivery`: Post-diagnostic email path now attempts unified Email 1 first and falls back to legacy thank-you email; failure must not block the diagnostic response.

## Approach
Extend the existing PHP diagnostic endpoint. Add a PDO connection that shares config with the current mysqli connection but targets the acrux.life database schema. Introduce small, testable helper functions (`env`, `calculateWeakDimension`, `insertEmailSequence`, `sendEmail1`) kept in the same file or config to avoid new include dependencies. Keep the legacy `sendThankYouEmail` untouched and call it only when unified nurturing is unavailable or fails. All sensitive credentials move to environment variables with safe defaults and `error_log` warnings instead of hardcoded secrets.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `public/api/diagnostic.php` | Modified | Adds nurturing insertion, Email 1 dispatch, fallback logic, helper functions. |
| `public/api/config.php` | Modified | Env helper, PDO connection, no hardcoded passwords. |
| `deploy/digital-h/api/config.php` | Modified | Same env-based config for Hostinger. |
| `docker-config.php` | Modified | Env-based SMTP/DB config for local Docker. |
| `.env.example` | Modified | Document DB/SMTP env vars expected by PHP. |
| `DEPLOY_HOSTINGER.md` | Modified | Document how to set env vars via Hostinger control panel or `.htaccess`. |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Missing env vars in production break email/DB | Med | Add `error_log` warnings; verify Hostinger env config before deploy; fallback email keeps user experience. |
| Unified DB schema differs from assumptions | Low | Confirm `nurturing_sequences` column names match acrux.life prod before merging. |
| Tracking pixel flagged by spam filters | Low | Use 1x1 pixel with base64-encoded sequence id; monitor deliverability. |
| PDO connection fails silently | Low | Return null on failure and fall back to legacy email. |

## Rollback Plan
- Revert `public/api/diagnostic.php` and config files to previous commit.
- Remove or unset new env vars in Hostinger.
- Re-enable legacy thank-you email path, which remains in code.

## Dependencies
- acrux.life `nurturing_sequences` table and `email_sender_unified.php` already deployed and stable.
- Hostinger environment variables configured for DB/SMTP.

## Success Criteria
- [ ] Completing the diagnostic with GDPR consent inserts a `digital-h` row in `nurturing_sequences`.
- [ ] Email 1 is received with results link, Calendly CTA, and tracking pixel.
- [ ] If unified nurturing fails, the legacy thank-you email is still sent.
- [ ] No hardcoded DB/SMTP credentials remain in committed PHP files.
- [ ] Diagnostic API response still returns `success: true` even if email paths fail.
