## ADDED Requirements

### Requirement: Auto-save quiz state to localStorage
The system SHALL persist the current quiz state (answers map, current question index, accumulated points, and unlocked badges) to the browser's localStorage automatically as the user progresses.

#### Scenario: User answers a question
- **WHEN** the user selects an answer for any question
- **THEN** the system SHALL serialize the current state to localStorage under the key `digitalh_session` within 2 seconds (debounced)

### Requirement: Restore quiz state on page reload
The system SHALL detect an existing saved session on application load and offer the user the option to resume from where they left off.

#### Scenario: Page reload with existing session
- **WHEN** the application initializes and finds a valid `digitalh_session` entry in localStorage
- **THEN** the system SHALL display a resume prompt ("Continuar donde lo dejaste?")
- **AND** if the user accepts, restore `answers`, `currentIdx`, `points`, and `unlockedBadges`
- **AND** redirect the user to the `questionnaire` screen at the restored index

#### Scenario: Fresh start with no session
- **WHEN** the application initializes and finds no `digitalh_session` entry
- **THEN** the system SHALL start a new diagnostic from the `landing` screen

### Requirement: Clear session on completion or explicit reset
The system SHALL remove the persisted session once the diagnostic is fully completed or if the user explicitly chooses to restart.

#### Scenario: Diagnostic completed successfully
- **WHEN** the user finishes all 48 questions and the lead is saved to Firestore
- **THEN** the system SHALL delete the `digitalh_session` key from localStorage

#### Scenario: User chooses to restart
- **WHEN** the user clicks a "Reiniciar" or "Nuevo diagnóstico" action
- **THEN** the system SHALL clear localStorage and reset all state to initial values
