## 1. Pre-Implementation Verification

- [x] 1.1 Verify `email_sequences`, `email_logs`, and `email_templates` tables exist in production database with data
- [x] 1.2 Confirm PHPMailer is installed and accessible from acrux.life's `database/` directory
- [x] 1.3 Verify acrux.life's `database/config.php` contains valid PHPMailer configuration
- [x] 1.4 Test relative path resolution from `public/digital-h/api/` to acrux.life's `database/config.php`

## 2. Weak Dimension Calculation

- [x] 2.1 Implement `calculateWeakDimension()` function in `diagnostic.php` that maps answer prefixes to dimensions (E=Strategy, C=Culture, T=Talent, I=Technology, P=Processes, B=Wellbeing)
- [x] 2.2 Calculate average score per dimension from submitted answers array
- [x] 2.3 Identify dimension with lowest average score
- [x] 2.4 Map weak dimension key to Spanish label: "Estrategia", "Cultura", "Talento", "Tecnología", "Procesos", "Bienestar"
- [x] 2.5 Handle edge case where a dimension has no answers (assign 0)

## 3. Lead Sequence Registration

- [x] 3.1 Add `email_sequences` INSERT query after saving diagnostic results
- [x] 3.2 Set `sequence_type='digital-h'`, `current_step=1`, `status='active'`, `next_send_at=NOW()+INTERVAL 2 DAY`
- [x] 3.3 Store `digitalh_score`, `digitalh_maturity_level`, and `dimension_weak` in sequence record
- [x] 3.4 Use `ON DUPLICATE KEY UPDATE` to handle duplicate email addresses
- [x] 3.5 Only register if `gdprConsent=true`; skip registration if false
- [x] 3.6 Verify registration works by checking database after test submission

## 4. PHPMailer Integration for Day 0 Email

- [x] 4.1 Replace PHP `mail()` with PHPMailer in Day 0 email sending function
- [x] 4.2 Include/require acrux.life's `database/config.php` to get SMTP credentials
- [x] 4.3 Instantiate PHPMailer with Hostinger SMTP settings (host: smtp.hostinger.com, port: 465, SSL)
- [x] 4.4 Set sender as `DIGITAL-H <hola@acrux.life>` and reply-to `hola@acrux.life`
- [x] 4.5 Send HTML email with existing Day 0 template content (preserve all current branding and personalization)
- [x] 4.6 Add error handling: catch PHPMailer exceptions and return `email_sent: false` without failing request
- [x] 4.7 Test email delivery to confirm PHPMailer works correctly

## 5. Configuration Cleanup

- [x] 5.1 Remove duplicate SMTP credentials from `public/digital-h/api/config.php`
- [x] 5.2 Remove duplicate database credentials if acrux.life config is used
- [x] 5.3 Ensure DIGITAL-H's `config.php` only contains non-sensitive helper functions (e.g., `sendJSON`, `calculateDimensions`) or remove entirely if acrux.life provides equivalents
- [x] 5.4 Add old `config.php` to `.gitignore` to prevent accidental commits of credentials

## 6. Cron Job Setup

- [x] 6.1 Verify acrux.life's `database/email_sender.php` is executable and functional
- [x] 6.2 Log into Hostinger hPanel and create cron job running daily at 9:00 AM
- [x] 6.3 Set cron command to execute `php /home/u554044004/domains/acrux.life/database/email_sender.php`
- [x] 6.4 Add email logging output to cron (e.g., `>> /home/u554044004/domains/acrux.life/logs/email_cron.log 2>&1`)
- [x] 6.5 Test cron execution manually to verify emails are sent for pending sequences

## 7. Deployment & Testing

- [x] 7.1 Backup existing `diagnostic.php` and `config.php` before deployment
- [x] 7.2 Deploy modified `diagnostic.php` to production
- [x] 7.3 Submit test diagnostic with GDPR consent and verify:
  - [x] 7.3.1 Diagnostic saved to `digitalh_results`
  - [x] 7.3.2 `email_sequences` record created with `current_step=1`
  - [x] 7.3.3 Day 0 email received via PHPMailer
  - [x] 7.3.4 `next_send_at` set to 2 days in the future
- [x] 7.4 Submit test diagnostic WITHOUT GDPR consent and verify no sequence record created
- [x] 7.5 Verify `.htaccess` was not modified during deployment
- [x] 7.6 Run acrux.life's `email_sender.php` manually to test Day 2 email generation

## 8. Monitoring & Rollback

- [x] 8.1 Check `email_logs` table for any send errors after first cron run
- [x] 8.2 Monitor `email_sender.log` for exceptions or failures
- [x] 8.3 Document rollback procedure (restore backed-up files, delete test sequence records)
- [x] 8.4 Verify Day 2, Day 4, Day 7, and Day 14 emails are sent correctly for test leads
