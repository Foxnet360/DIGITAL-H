# Delta for lead-capture-form

## ADDED Requirements

### Requirement: Scroll viewport to top on screen and question transitions

The application SHALL scroll the viewport to the top (y=0) when transitioning between screens or changing questions to ensure optimal readability.

#### Scenario: Question or screen transition
- **GIVEN** the user is navigating the application or answering questions
- **WHEN** the active question in the questionnaire changes or a screen transition occurs
- **THEN** the system SHALL scroll the viewport to the top position
