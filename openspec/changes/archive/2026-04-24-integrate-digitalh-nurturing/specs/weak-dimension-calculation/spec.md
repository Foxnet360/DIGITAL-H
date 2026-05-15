## ADDED Requirements

### Requirement: Calculate weakest dimension from diagnostic answers
The system SHALL calculate the average score for each of the six dimensions (Strategy, Culture, Talent, Technology, Processes, Wellbeing) and identify which dimension has the lowest average score.

#### Scenario: Calculate dimensions from answer keys
- **WHEN** the diagnostic answers are submitted with keys like `E1.1`, `C2.1`, `T3.1`, `I4.1`, `P5.1`, `B6.1`
- **THEN** the system SHALL group answers by prefix (E=Strategy, C=Culture, T=Talent, I=Technology, P=Processes, B=Wellbeing), calculate the average for each group, and return the dimension with the lowest average

#### Scenario: Handle missing dimension data
- **WHEN** no answers exist for a particular dimension prefix
- **THEN** the system SHALL assign an average of 0 to that dimension and still correctly identify the weakest dimension among the available data

#### Scenario: Store weak dimension in Spanish
- **WHEN** the weakest dimension is identified
- **THEN** the system SHALL store it as a Spanish label: "Estrategia", "Cultura", "Talento", "Tecnología", "Procesos", or "Bienestar"

### Requirement: Weak dimension used for email segmentation
The system SHALL use the calculated weak dimension to enable personalized content in the nurturing sequence.

#### Scenario: Weak dimension stored in email_sequences
- **WHEN** a diagnostic is registered in the email sequence
- **THEN** the `dimension_weak` field SHALL contain the identified weakest dimension for use by the email sender when selecting templates for Day 4

#### Scenario: Email template selection by weak dimension
- **WHEN** the email sender prepares the Day 4 email (step 3)
- **THEN** the system SHALL query `email_templates` where `step_number=3` and `dimension_weak` matches the lead's weakest dimension
