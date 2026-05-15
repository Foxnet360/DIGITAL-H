## ADDED Requirements

### Requirement: Register diagnostic completers into email sequences
The system SHALL insert a new record into the `email_sequences` table for every user who completes the DIGITAL-H diagnostic and provides GDPR consent.

#### Scenario: Successful registration after diagnostic completion
- **WHEN** a user submits the diagnostic form with valid data and `gdprConsent=true`
- **THEN** the system SHALL insert a record into `email_sequences` with `sequence_type='digital-h'`, `current_step=1`, `status='active'`, and `next_send_at` set to 2 days from now

#### Scenario: Registration without GDPR consent
- **WHEN** a user submits the diagnostic form with `gdprConsent=false`
- **THEN** the system SHALL save the diagnostic results but NOT create an `email_sequences` record

#### Scenario: Duplicate email handling
- **WHEN** a user with an existing email submits a new diagnostic
- **THEN** the system SHALL update the existing `email_sequences` record using `ON DUPLICATE KEY UPDATE` with the new diagnostic data and restart the sequence

### Requirement: Store segmentation data in sequences
The system SHALL store all diagnostic-derived segmentation data required for personalized nurturing emails.

#### Scenario: Complete segmentation data saved
- **WHEN** a diagnostic is saved and registered
- **THEN** the `email_sequences` record SHALL include `digitalh_score`, `digitalh_maturity_level`, and `dimension_weak`

#### Scenario: Data available for template personalization
- **WHEN** the email sender queries templates for the next email
- **THEN** the system SHALL use `digitalh_maturity_level` to select maturity-segmented templates (emails 2 and 4) and `dimension_weak` to select dimension-segmented templates (email 3)
