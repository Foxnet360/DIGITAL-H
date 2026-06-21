# acux-branding Specification

## Purpose
Define the visual identity and design system for the DIGITAL-H application, ensuring consistency with the Acrux Consultores corporate brand across all user interfaces.

## Requirements

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

All screens, including Landing, Welcome, Questionnaire, LeadForm, and Results, SHALL share a unified visual identity that feels like a native extension of acrux.life. The Acrux corporate logo (`public/acrux_logo.svg`) and favicon (`public/favicon.svg`) MUST use a transparent background to integrate correctly with dark themes.
(Previously: All screens, including Landing, Welcome, Questionnaire, LeadForm, and Results, SHALL share a unified visual identity that feels like a native extension of acrux.life.)

#### Scenario: Consistent UI components
- **GIVEN** a user is navigating the application
- **WHEN** the user navigates between any two screens
- **THEN** border radii, shadows, spacing, and button styles SHALL remain consistent
- **AND** there SHALL be no visual "jumps" between generic and branded styles

#### Scenario: Transparent branding assets
- **GIVEN** the application is rendering the visual assets
- **WHEN** the application displays the Acrux logo or favicon
- **THEN** the assets SHALL render with transparent backgrounds to blend with the container's background color

### Requirement: Unified Transformation Roadmap descriptions

The system SHALL display a unified, professional set of descriptions for the digital transformation roadmap across both the interactive Results UI and the generated PDF report.

#### Scenario: Roadmap description display
- **GIVEN** a user completes the diagnostic
- **WHEN** the user views the roadmap on the Results screen or generates the PDF report
- **THEN** the system SHALL display identical, professional descriptions for each phase of the transformation roadmap
