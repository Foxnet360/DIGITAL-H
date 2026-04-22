## ADDED Requirements

### Requirement: Trigger email delivery after diagnostic completion
The system SHALL automatically initiate an email delivery to the user immediately after the diagnostic is completed and the lead data is saved to Firestore.

#### Scenario: Successful diagnostic completion
- **WHEN** the user submits the lead form and finishes the final question (index 47)
- **THEN** the system SHALL invoke the email delivery mechanism with the user's email, name, company, score (IMD), maturity level, and a link to the full results page

### Requirement: Email content includes personalized results
The email sent to the user SHALL contain a personalized summary of their diagnostic results, including their IMD score, maturity level name, a direct link to view the interactive results, and a mention that a detailed PDF report is available for download.

#### Scenario: Email generated with results
- **WHEN** the email delivery is triggered
- **THEN** the email subject SHALL be "Tu diagnóstico de madurez digital está listo, {name}"
- **AND** the email body SHALL include the IMD percentage, the maturity level (e.g., "Avanzado"), a CTA button linking to the results screen, and a link to download the PDF report

### Requirement: Fallback on email delivery failure
If the email delivery fails, the system SHALL log the error but MUST NOT block the user from viewing their results.

#### Scenario: Email service unavailable
- **WHEN** the email delivery endpoint returns an error or times out
- **THEN** the system SHALL log the error to the console/Firestore
- **AND** the user SHALL still be redirected to the `results` screen without interruption
