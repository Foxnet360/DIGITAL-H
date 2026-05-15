## ADDED Requirements

### Requirement: Results page displays dynamic urgency message by maturity level
The Results page SHALL display a contextual urgency message based on the user's maturity level, emphasizing productivity loss or opportunity cost.

#### Scenario: Low maturity level (Inicial/Emergente)
- **WHEN** the user's maturity level is "Inicial" or "Emergente"
- **THEN** the system displays: "Your company could be losing up to 30% weekly productivity to manual processes and rework. Every month of delay represents hours you will never recover."
- **AND** shows the message in an attention-grabbing banner (orange/red accent)

#### Scenario: Medium maturity level (Desarrollo/Avanzado)
- **WHEN** the user's maturity level is "Desarrollo" or "Avanzado"
- **THEN** the system displays: "You are just 2-3 strategic actions away from the next level. 68% of companies at your stage regress without specialized support."
- **AND** shows the message in a motivational banner (blue accent)

#### Scenario: High maturity level (Excelente/Referente)
- **WHEN** the user's maturity level is "Excelente" or "Referente"
- **THEN** the system displays: "Maintaining your competitive advantage requires continuous review. Leading companies reassess their digital maturity every 6 months."
- **AND** shows the message in a prestige banner (green accent)

### Requirement: Results page includes analysis validity countdown
The Results page SHALL display a temporal urgency indicator showing that the analysis has an expiration window.

#### Scenario: Validity countdown appears
- **WHEN** the Results page loads
- **THEN** the system displays: "This analysis is valid for 30 days. Market and technology conditions change rapidly — what is an opportunity today may be a threat tomorrow."
- **AND** shows a visual countdown or date of expiration

### Requirement: Results page displays sector comparison
The Results page SHALL display a simulated or real sector comparison to create social proof and urgency.

#### Scenario: Sector percentile shown
- **WHEN** the Results page loads
- **THEN** the system displays: "73% of companies your size are at Development level or higher. You are at percentile X."
- **AND** the percentile is calculated based on maturity level (simulated data for MVP)

### Requirement: Results page has optimized CTA hierarchy
The Results page SHALL present calls-to-action in a clear hierarchy optimized for SQL conversion.

#### Scenario: Primary CTA is booking
- **WHEN** the Results page loads
- **THEN** the primary CTA button reads: "Book my 30-min session with Organizational Psychologist"
- **AND** uses the most prominent visual treatment (full color, large size)

#### Scenario: Secondary CTA is PDF download
- **WHEN** the Results page loads
- **THEN** the secondary CTA button reads: "Download PDF Report"
- **AND** uses a less prominent but still visible treatment (outlined style)

#### Scenario: Tertiary CTA is share
- **WHEN** the Results page loads
- **THEN** the tertiary CTA reads: "Share on LinkedIn"
- **AND** uses minimal visual treatment (text link or icon button)
