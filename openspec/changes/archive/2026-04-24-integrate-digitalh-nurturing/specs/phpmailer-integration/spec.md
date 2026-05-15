## ADDED Requirements

### Requirement: Send Day 0 email via PHPMailer
The system SHALL use PHPMailer with SMTP authentication to send the Day 0 thank-you email instead of PHP's native `mail()` function.

#### Scenario: PHPMailer sends Day 0 email
- **WHEN** the diagnostic results are successfully saved
- **THEN** the system SHALL use PHPMailer to send the custom DIGITAL-H Day 0 email with SMTP host `smtp.hostinger.com`, port `465`, and SSL encryption

#### Scenario: PHPMailer fallback on failure
- **WHEN** PHPMailer fails to send the Day 0 email
- **THEN** the system SHALL log the error and return `email_sent: false` in the API response without failing the entire request

### Requirement: Reuse centralized SMTP configuration
The system SHALL reuse the existing PHPMailer configuration from acrux.life instead of maintaining duplicate SMTP credentials.

#### Scenario: Load PHPMailer from acrux.life config
- **WHEN** the diagnostic endpoint needs to send an email
- **THEN** the system SHALL require the PHPMailer configuration from acrux.life's centralized config file or include the PHPMailer autoloader from the shared vendor directory

#### Scenario: No duplicate credentials in DIGITAL-H
- **WHEN** deploying DIGITAL-H updates
- **THEN** the system SHALL NOT include hardcoded SMTP credentials in `public/digital-h/api/config.php`; all email sending SHALL use the shared configuration
