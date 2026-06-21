# Delta for acux-branding

## ADDED Requirements

### Requirement: Unified Transformation Roadmap descriptions

The system SHALL display a unified, professional set of descriptions for the digital transformation roadmap across both the interactive Results UI and the generated PDF report.

#### Scenario: Roadmap description display
- **GIVEN** a user completes the diagnostic
- **WHEN** the user views the roadmap on the Results screen or generates the PDF report
- **THEN** the system SHALL display identical, professional descriptions for each phase of the transformation roadmap

## MODIFIED Requirements

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
