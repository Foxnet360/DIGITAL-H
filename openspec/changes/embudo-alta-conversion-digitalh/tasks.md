## 1. Foundation - Fix Broken Flow & Cleanup

- [x] 1.1 Fix Landing.tsx onStart to navigate to Questionnaire instead of LeadForm
- [x] 1.2 Update App.tsx screen flow: remove Welcome screen, fix handleNext to show LeadForm only after Q48
- [x] 1.3 Ensure handleLeadSubmit in App.tsx calls finishDiagnostic after collecting lead data
- [x] 1.4 Verify sessionStorage integration works with new flow (save/restore answers, currentIdx)
- [x] 1.5 Remove server.ts and src/db.ts (Express backend)
- [x] 1.6 Remove Express-related dependencies from package.json (express, mysql2, nodemailer, cors, express-rate-limit, dotenv)
- [x] 1.7 Remove Express-related devDependencies (@types/express, @types/cors, @types/express-rate-limit, @types/nodemailer)
- [x] 1.8 Clean up nested deploy directories (deploy/digital-h/digital-h/)
- [x] 1.9 Update deploy.sh to remove Express references and use PHP only
- [x] 1.10 Test end-to-end flow: Landing → Questionnaire → Q48 → LeadForm → Results

## 2. Sunk Cost Progress - Questionnaire Enhancements

- [x] 2.1 Add time invested counter to Questionnaire.tsx (estimated based on ~20s per question)
- [x] 2.2 Enhance progress bar with visual milestone markers (Q8, Q16, Q24, Q32, Q40, Q48)
- [x] 2.3 Add dimension completion indicators (show which of 6 dimensions are complete/in-progress)
- [ ] 2.4 Implement badge unlock notifications at Q8, Q24, Q48 with toast/overlay
- [x] 2.5 Add motivational messages during questionnaire ("You're making great progress", "Almost there", etc.)
- [x] 2.6 Enhance sessionStorage to persist indefinitely (not just session) for aggressive recovery
- [x] 2.7 Add "Don't abandon now" modal when user tries to leave questionnaire before Q48

## 3. Lead Capture at Q48 - Micro-commitments

- [x] 3.1 Create enhanced LeadForm screen with investment summary banner
- [x] 3.2 Add visual elements to LeadForm: time invested, questions answered (48/48), badges unlocked
- [x] 3.3 Add progress bar to LeadForm showing "95% complete → 100% on submit"
- [x] 3.4 Implement abandonment modal for LeadForm: "You are about to lose your complete analysis..."
- [x] 3.5 Verify GDPR consent checkbox is unchecked by default and required for submission
- [x] 3.6 Add tracking event `digital_h_leadform_start` with flow_version property
- [x] 3.7 Test LeadForm validation: email format, required fields, GDPR consent

## 4. Results Page - Urgency & Optimization

- [x] 4.1 Add dynamic urgency banner by maturity level (Inicial/Emergente = productivity loss, Desarrollo/Avanzado = next level opportunity, Excelente/Referente = maintain advantage)
- [x] 4.2 Add analysis validity countdown (30 days from completion)
- [x] 4.3 Add simulated sector comparison percentile based on maturity level
- [x] 4.4 Reorder CTAs: Primary = Book session, Secondary = Download PDF, Tertiary = Share LinkedIn
- [x] 4.5 Update primary CTA copy: "Book my 30-min session with Organizational Psychologist"
- [x] 4.6 Add flow_version property to all gtag events for analytics tracking
- [x] 4.7 Test all 6 maturity levels to verify correct urgency messages display

## 5. Custom Booking Calendar

- [x] 5.1 Create BookingCalendar.tsx component with date picker and time slot selector
- [x] 5.2 Implement availability rules: working hours only, no weekends, minimum 24h notice
- [x] 5.3 Add double-booking prevention with SQL transaction in PHP API
- [x] 5.4 Create PHP endpoint `api/booking.php` to save bookings and check availability
- [x] 5.5 Create MySQL table `digitalh_bookings` with fields: id, lead_email, lead_name, company, booking_date, booking_time, status, created_at
- [x] 5.6 Add booking section to Results.tsx (embedded, not external link)
- [x] 5.7 Implement booking confirmation email to user
- [x] 5.8 Implement booking notification email to Acrux team
- [x] 5.9 Test booking flow: select date → select time → confirm → receive email
- [x] 5.10 Handle edge case: slot becomes unavailable between selection and submission

## 6. Docker Development Environment

- [ ] 6.1 Create docker-compose.yml with PHP-Apache (port 8080), MySQL (port 3306), phpMyAdmin (port 8081)
- [ ] 6.2 Create Dockerfile for PHP-Apache with required extensions
- [ ] 6.3 Configure MySQL container to auto-initialize schema from database/digitalh_schema.sql
- [ ] 6.4 Mount public/ directory to PHP-Apache web root
- [ ] 6.5 Update README.md with Docker setup instructions (copy-paste commands)
- [ ] 6.6 Verify frontend (npm run dev) works independently of Docker backend
- [ ] 6.7 Test Docker environment: frontend calls PHP API successfully

## 7. QA & Deployment

- [x] 7.1 Run npm run lint and fix TypeScript errors
- [x] 7.2 Run npm run build and verify no compilation errors
- [ ] 7.3 Test complete flow on desktop: Landing → Q48 → LeadForm → Results → Book
- [ ] 7.4 Test on mobile viewport (375px) for responsive layout
- [ ] 7.5 Test session persistence: close browser at Q24, reopen, verify resume prompt
- [ ] 7.6 Verify analytics events fire correctly with new flow
- [ ] 7.7 Deploy to staging and test PHP API endpoints
- [ ] 7.8 Deploy to production with deploy.sh backup
- [ ] 7.9 Monitor for 48h: check error logs, booking submissions, completion rates
- [x] 7.10 Create HUBSPOT_INTEGRATION.md with field mapping and webhook documentation
