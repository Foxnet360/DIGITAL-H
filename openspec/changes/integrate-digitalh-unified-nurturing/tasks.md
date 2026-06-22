# Tasks: Integrate DIGITAL-H with acrux.life Unified Nurturing

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~150–200 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | size-exception (not needed) |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Verify and align unified nurturing integration | Single PR | Includes config sync, logic review, manual test, docs |

## Phase 1: Verify Schema & Config Alignment

- [x] 1.1 Confirm acrux.life `nurturing_sequences` table has every column used by `insertEmailSequence()` in `public/api/diagnostic.php`.
- [x] 1.2 Add `env()` helper and `getPDOConnection()` to `deploy/digital-h/api/config.php` so production matches `public/api/config.php`.
- [x] 1.3 Align `docker-config.php` with `env()` helper, safe defaults, and `getPDOConnection()`.
- [x] 1.4 Update `.env.example`: rename `DB_PASSWORD` to `DB_PASS`, add `SMTP_FROM`, and document unified nurturing env vars.

## Phase 2: Verify Diagnostic Integration Logic

- [x] 2.1 Review `public/api/diagnostic.php`: ensure `getPDOConnection()` returning `null` always falls back to legacy email.
- [x] 2.2 Verify `insertEmailSequence()` maps weak dimension correctly and `ON DUPLICATE KEY UPDATE` resets step/state as intended.
- [x] 2.3 Verify `sendEmail1()` uses the correct results URL, Calendly link, 1x1 tracking pixel, and `SMTP_FROM` header.
- [x] 2.4 Verify fallback path: if GDPR consent is false or unified nurturing fails, `sendThankYouEmail()` runs and the API still returns `success: true`.

## Phase 3: Test the Integration

- [x] 3.1 Run a local POST to `public/api/diagnostic.php` with `gdprConsent=true` and confirm no PHP fatal errors or unbound functions.
- [ ] 3.2 In a staging/prod environment with real env vars, confirm a row with `product='digital-h'` is inserted in `nurturing_sequences`.
- [ ] 3.3 Confirm Email 1 is received with the results CTA, Calendly CTA, and tracking pixel; confirm legacy email is sent when unified path is disabled.

## Phase 4: Documentation & Cleanup

- [x] 4.1 Update `DEPLOY_HOSTINGER.md` with the unified nurturing env var list and Hostinger environment variable setup steps.
- [x] 4.2 Remove any leftover hardcoded passwords or temporary debug output from the four PHP files.
- [x] 4.3 Review `git diff` for `public/api/diagnostic.php`, `public/api/config.php`, `deploy/digital-h/api/config.php`, and `docker-config.php` to ensure the change stays under the 800-line review budget.
