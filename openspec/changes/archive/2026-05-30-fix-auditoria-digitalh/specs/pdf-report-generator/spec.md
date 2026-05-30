## ADDED Requirements

### Requirement: Generate multi-page structured PDF report
The system SHALL generate a professional, multi-page PDF report containing all sections of the diagnostic result, not merely a screenshot of the results page.

#### Scenario: PDF generation triggered
- **WHEN** the user clicks "Descargar Reporte PDF" on the Results screen
- **THEN** the system SHALL generate a PDF document with the following sections: Portada/Resumen Ejecutivo, Análisis por Dimensión (tabla con puntuaciones), Radar de Madurez (imagen renderizada), Recomendaciones Priorizadas, y Hoja de Ruta

### Requirement: PDF includes headers and metadata
The generated PDF SHALL include a header with the Acrux logo placeholder text, the user’s company name, and the generation date on every page.

#### Scenario: PDF document structure
- **WHEN** the PDF is generated
- **THEN** each page SHALL display a header with "DIGITAL-H | Diagnóstico de Madurez Digital" and the company name
- **AND** the footer SHALL include the page number and "acrux.life"

### Requirement: PDF content reflects actual user data
All data displayed in the PDF SHALL correspond exactly to the user’s answers, calculated IMD, maturity level, and dimension averages.

#### Scenario: Accurate data in PDF
- **WHEN** the PDF is generated for a user with IMD 58%
- **THEN** the cover page SHALL show "58%" and "Desarrollo"
- **AND** the dimension analysis table SHALL show the exact average for each of the 6 dimensions based on the user’s answers
