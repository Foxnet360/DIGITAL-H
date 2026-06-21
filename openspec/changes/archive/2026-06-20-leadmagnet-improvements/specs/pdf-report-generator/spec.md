# Delta for pdf-report-generator

## MODIFIED Requirements

### Requirement: Generate multi-page structured PDF report

The system SHALL generate a professional, multi-page PDF report containing all sections of the diagnostic result (Portada/Resumen Ejecutivo, Análisis por Dimensión, Radar de Madurez, Recomendaciones Priorizadas, Hoja de Ruta), wrapping lists cleanly to prevent layout overflows, using the unified professional roadmap copy, and ending with a closing CTA link.
(Previously: The system SHALL generate a professional, multi-page PDF report containing all sections of the diagnostic result, not merely a screenshot of the results page.)

#### Scenario: PDF generation triggered
- **GIVEN** a user has completed the questionnaire and form submission
- **WHEN** the user clicks "Descargar Reporte PDF" on the Results screen
- **THEN** the system SHALL generate a PDF document with: Portada/Resumen Ejecutivo, Análisis por Dimensión (tabla con puntuaciones), Radar de Madurez (imagen renderizada), Recomendaciones Priorizadas (with cleanly wrapped bullet points), and Hoja de Ruta (using unified professional copy)
- **AND** the final page SHALL feature a closing CTA link directing the user back to the booking page

### Requirement: PDF includes headers and metadata

The generated PDF SHALL include a header with the transparent Acrux logo, the user's company name, and the generation date on every page. The footer SHALL include the copyright year 2026, "acrux.life", and dynamic page numbers in the format "Página X de Y" without overlapping footer/header content.
(Previously: The generated PDF SHALL include a header with the Acrux logo placeholder text, the user's company name, and the generation date on every page.)

#### Scenario: PDF document structure
- **GIVEN** the PDF generation is active
- **WHEN** the PDF is generated
- **THEN** each page SHALL display a header with the transparent Acrux logo, "DIGITAL-H | Diagnóstico de Madurez Digital", and the company name
- **AND** the footer SHALL include the dynamic page number (e.g., "Página X de Y") and "Copyright 2026 Acrux | acrux.life"
- **AND** no content overlaps SHALL occur between headers, body content, and footers
