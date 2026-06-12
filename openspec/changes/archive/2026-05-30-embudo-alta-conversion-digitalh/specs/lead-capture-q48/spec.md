## ADDED Requirements

### Requirement: Lead capture occurs only after question 48
The system SHALL request the user's email address, name, and company ONLY after the user has answered all 48 questions of the diagnostic questionnaire.

#### Scenario: User starts diagnostic
- **WHEN** the user clicks "Start Diagnostic" on the Landing page
- **THEN** the system navigates directly to Questionnaire (question 1)
- **AND** does NOT display any lead capture form

#### Scenario: User reaches question 48
- **WHEN** the user answers question 48
- **THEN** the system navigates to the Lead Capture screen
- **AND** displays a summary of invested time and progress

#### Scenario: User submits lead form
- **WHEN** the user completes the lead form with valid email, name, company, and GDPR consent
- **THEN** the system saves the diagnostic results and sends the report
- **AND** navigates to the Results page

### Requirement: Lead form displays sunk cost investment summary
The Lead Capture screen SHALL display visual indicators of the user's invested time and effort to reinforce completion motivation.

#### Scenario: Lead form loads with investment banner
- **WHEN** the Lead Capture screen is displayed
- **THEN** the system shows a banner with: time invested (~15 min), questions answered (48/48), and badges unlocked
- **AND** displays the message "Your report is 95% ready — just one step left"

#### Scenario: Lead form shows abandonment warning
- **WHEN** the user attempts to leave the Lead Capture page without submitting
- **THEN** the system displays a modal: "You are about to lose your complete analysis and personalized benchmark. Your 15 minutes of progress will be lost."

### Requirement: GDPR consent with explicit opt-in
The Lead Capture form SHALL require explicit opt-in for GDPR consent before submission, with no pre-checked boxes.

#### Scenario: Submission without consent
- **WHEN** the user attempts to submit without checking the GDPR consent box
- **THEN** the system prevents submission and displays an error message
- **AND** highlights the consent checkbox in red

#### Scenario: Valid submission with consent
- **WHEN** the user checks the GDPR consent box and submits valid data
- **THEN** the system records the consent timestamp along with the lead data
- **AND** includes the consent record in the database
