## ADDED Requirements

### Requirement: Questionnaire displays continuous progress indicators
The Questionnaire component SHALL display visual progress indicators that update in real-time as the user answers questions, reinforcing the sense of accumulated investment.

#### Scenario: Progress bar updates on each answer
- **WHEN** the user answers any question
- **THEN** the progress bar updates to show (current_question / 48) * 100%
- **AND** displays "Question X of 48" text

#### Scenario: Dimension completion badges appear
- **WHEN** the user completes all questions in a dimension (8 questions each)
- **THEN** the system displays a badge notification: "Dimension Complete: [Dimension Name]"
- **AND** the dimension indicator in the module bar changes to "completed" state

### Requirement: Time invested counter displayed during questionnaire
The system SHALL display an estimated time invested counter that increases as the user progresses through questions.

#### Scenario: Time counter appears during questionnaire
- **WHEN** the user is answering questions
- **THEN** the system displays "Time invested: ~X minutes" based on average time per question (~20 seconds per question)
- **AND** updates every 5 questions

### Requirement: Gamification badges unlock at milestones
The system SHALL unlock achievement badges at predefined milestones to maintain engagement.

#### Scenario: Badge unlocks at question 8
- **WHEN** the user answers question 8
- **THEN** the system unlocks the "First Steps" badge
- **AND** displays a toast notification for 4 seconds

#### Scenario: Badge unlocks at question 24
- **WHEN** the user answers question 24
- **THEN** the system unlocks the "Halfway There" badge
- **AND** displays a toast notification for 4 seconds

#### Scenario: Badge unlocks at question 48
- **WHEN** the user answers question 48
- **THEN** the system unlocks the "Explorer Complete" badge
- **AND** triggers the transition to Lead Capture screen

### Requirement: Session persistence with resume capability
The system SHALL persist questionnaire progress in localStorage and offer resume on return.

#### Scenario: User returns after closing browser
- **WHEN** the user revisits the application and has saved progress
- **THEN** the system displays a modal: "Continue where you left off? You were on question X of 48"
- **AND** provides options to "Continue Diagnostic" or "Start New"

#### Scenario: Resume restores all state
- **WHEN** the user chooses to continue
- **THEN** the system restores: answers, current question index, points, unlocked badges
- **AND** navigates to the last answered question
