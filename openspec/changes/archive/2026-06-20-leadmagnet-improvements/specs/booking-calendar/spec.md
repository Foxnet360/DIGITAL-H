# Delta for booking-calendar

## MODIFIED Requirements

### Requirement: Custom booking calendar replaces Calendly

The system SHALL provide a custom booking interface embedded directly in the Results page, replacing the external Calendly widget. All call-to-actions (CTAs) that previously triggered Calendly SHALL link to `#booking-section`.
(Previously: The system SHALL provide a custom booking interface embedded directly in the Results page, replacing the external Calendly widget.)

#### Scenario: Booking section appears in Results
- **GIVEN** a user completes the diagnostic and lands on the Results page
- **WHEN** the Results page loads
- **THEN** the system SHALL display a booking section with the title: "Reserva tu sesión de 30 min con nuestros profesionales"
- **AND** SHALL show a calendar date picker and available time slots

#### Scenario: User clicks booking CTA
- **GIVEN** a user is viewing the Results page
- **WHEN** the user clicks any booking CTA in `ResultsCTA.tsx`
- **THEN** the viewport SHALL scroll to the `#booking-section` element

#### Scenario: User selects date and time
- **GIVEN** a user is selecting a slot in the custom booking interface
- **WHEN** the user selects a date from the calendar
- **THEN** the system SHALL fetch busy slots from the local database for that date
- **AND** display available 30-minute time slots, marking unavailable/busy slots as disabled

#### Scenario: User submits booking
- **GIVEN** a user has selected a date and time slot
- **WHEN** the user clicks "Confirm Booking"
- **THEN** the system validates the slot is still available
- **AND** saves the booking to the database with: lead email, name, company, selected date/time, created timestamp
- **AND** sends a confirmation email to the user and notification to Acrux
