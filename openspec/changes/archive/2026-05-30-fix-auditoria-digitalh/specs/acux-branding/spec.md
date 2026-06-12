## ADDED Requirements

### Requirement: Apply Acrux corporate color palette
The user interface SHALL use the official Acrux Consultores color palette instead of the generic Tailwind Indigo defaults.

#### Scenario: Primary brand colors applied
- **WHEN** any screen renders interactive elements such as primary buttons, active progress bars, or selected answer cards
- **THEN** the primary color SHALL be `#1E3A5F` (Azul Profundo)
- **AND** the accent/secondary color SHALL be `#00D4FF` (Cyan Vibrante)

#### Scenario: Semantic colors applied
- **WHEN** the system displays success states, warnings, or errors
- **THEN** success SHALL use `#10B981` (Verde Esmeralda)
- **AND** warnings SHALL use `#F59E0B` (Ámbar)
- **AND** errors SHALL use `#EF4444` (Coral)

### Requirement: Load Inter typeface
The application SHALL load and use the "Inter" font family for all text content to ensure consistency with the Acrux brand guidelines.

#### Scenario: Font loaded on application start
- **WHEN** the application loads
- **THEN** the font family for headings and body text SHALL be "Inter", falling back to the system-ui stack

### Requirement: Cohesive visual identity across all screens
All screens, including Landing, Welcome, Questionnaire, LeadForm, and Results, SHALL share a unified visual identity that feels like a native extension of acrux.life.

#### Scenario: Consistent UI components
- **WHEN** the user navigates between any two screens
- **THEN** border radii, shadows, spacing, and button styles SHALL remain consistent
- **AND** there SHALL be no visual "jumps" between generic and branded styles
