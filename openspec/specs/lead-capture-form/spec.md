# lead-capture-form Specification

## Purpose
Define the requirements for the lead capture form that collects user contact information and consent before presenting diagnostic results.

## Requirements

### Requirement: Explicit GDPR consent checkbox
The lead capture form SHALL include a mandatory, unchecked checkbox that the user MUST tick to confirm explicit consent for data processing before submitting the form.

#### Scenario: User attempts to submit without consent
- **WHEN** the user fills all fields but leaves the GDPR checkbox unchecked
- **THEN** the form submission SHALL be prevented
- **AND** the system SHALL display a validation message next to the checkbox

#### Scenario: User provides explicit consent
- **WHEN** the user ticks the GDPR checkbox and submits the form
- **THEN** the form SHALL submit successfully
- **AND** the consent timestamp SHALL be recorded alongside the lead data in Firestore

### Requirement: Enhanced trust signals in form UI
The lead form SHALL display trust signals (e.g., a lock icon, a brief privacy note, and a visual reassurance that the data is secure) to increase conversion confidence.

#### Scenario: Form rendered
- **WHEN** the LeadForm screen is displayed
- **THEN** a lock icon SHALL appear in the header
- **AND** a one-line privacy note ("Tus datos están protegidos y nunca serán compartidos.") SHALL appear below the submit button

### Requirement: Company size selection remains required
The company size dropdown SHALL remain a required field, validating that a valid option is selected before submission.

#### Scenario: Incomplete form submission
- **WHEN** the user submits the form with "Selecciona una opción" still active in the size dropdown
- **THEN** the system SHALL prevent submission and highlight the dropdown with an error state

### Requirement: Scroll viewport to top on screen and question transitions

The application SHALL scroll the viewport to the top (y=0) when transitioning between screens or changing questions to ensure optimal readability.

#### Scenario: Question or screen transition
- **GIVEN** the user is navigating the application or answering questions
- **WHEN** the active question in the questionnaire changes or a screen transition occurs
- **THEN** the system SHALL scroll the viewport to the top position
