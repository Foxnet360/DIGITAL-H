## ADDED Requirements

### Requirement: Custom booking calendar replaces Calendly
The system SHALL provide a custom booking interface embedded directly in the Results page, replacing the external Calendly widget.

#### Scenario: Booking section appears in Results
- **WHEN** the Results page loads
- **THEN** the system displays a booking section with title: "Book your 30-min session with Organizational Psychologist"
- **AND** shows a calendar date picker and available time slots

#### Scenario: User selects date and time
- **WHEN** the user selects a date from the calendar
- **THEN** the system displays available 30-minute time slots for that date
- **AND** marks unavailable slots as disabled

#### Scenario: User submits booking
- **WHEN** the user selects a date, time slot, and clicks "Confirm Booking"
- **THEN** the system validates the slot is still available
- **AND** saves the booking to the database with: lead email, name, company, selected date/time, created timestamp
- **AND** sends a confirmation email to the user and notification to Acrux

### Requirement: Booking availability rules
The booking system SHALL enforce availability rules to prevent double-booking and ensure reasonable scheduling.

#### Scenario: Minimum notice period
- **WHEN** the user tries to select a slot less than 24 hours in the future
- **THEN** the system disables that slot
- **AND** displays: "Please select a time at least 24 hours in advance"

#### Scenario: Double-booking prevention
- **WHEN** two users simultaneously select the same slot
- **THEN** the system allows only the first submission
- **AND** the second user sees: "This slot was just booked. Please select another time."

#### Scenario: Working hours only
- **WHEN** the calendar loads
- **THEN** the system only displays slots within configured working hours (e.g., 9:00-17:00)
- **AND** excludes weekends and holidays

### Requirement: Booking confirmation and notifications
The system SHALL send automated communications upon booking creation.

#### Scenario: User receives confirmation email
- **WHEN** a booking is successfully created
- **THEN** the system sends an email to the user with: booking date/time, psychologist name, session duration (30 min), cancellation instructions

#### Scenario: Acrux receives notification
- **WHEN** a booking is successfully created
- **THEN** the system sends an email to the Acrux team with: user details, selected date/time, maturity level, IMD score

### Requirement: Booking database schema
The database SHALL store booking records with all necessary fields.

#### Scenario: Booking record created
- **WHEN** a booking is saved
- **THEN** the record includes: id, lead_email, lead_name, company, booking_date, booking_time, status (pending/confirmed/cancelled), created_at, updated_at
