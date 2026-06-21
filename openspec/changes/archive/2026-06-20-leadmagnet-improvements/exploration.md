# Exploration Report & Implementation Plan
**Change Name**: `leadmagnet-improvements`  
**Workspace**: `DIGITAL-H`  
**Date**: June 20, 2026

This document presents the detailed analysis, file references, and specific plans to resolve the 7 findings identified in the DIGITAL-H leadmagnet.

---

## 1. Logo in Navbar (Transparency)
* **Finding**: The logo in the navbar and footer does not have a transparent background, creating a visual white block on dark themes.
* **Analysis**:
  * **File references**: 
    * [FunnelHeader.tsx](file:///home/foxnet360/Documentos/dev/Acrux/DIGITAL-H/src/components/FunnelHeader.tsx#L35) & [L43](file:///home/foxnet360/Documentos/dev/Acrux/DIGITAL-H/src/components/FunnelHeader.tsx#L43) load `/acrux_logo.svg`.
    * [FunnelFooter.tsx](file:///home/foxnet360/Documentos/dev/Acrux/DIGITAL-H/src/components/FunnelFooter.tsx#L12) loads `/acrux_logo.svg`.
  * **Root Cause**: The file `public/acrux_logo.svg` contains two solid `<rect>` background layers right after the definitions:
    ```xml
    <rect x="-81" width="972" fill="#ffffff" y="-80.999999" height="971.999992" fill-opacity="1"/>
    <rect x="-81" width="972" fill="#fffcfa" y="-80.999999" height="971.999992" fill-opacity="1"/>
    ```
    These layers block transparency. The rest of the SVG draws the masked brand logo correctly.
* **Plan**:
  * Remove these two `<rect>` elements from `public/acrux_logo.svg` and `public/favicon.svg`.
  * Verify that the logo renders correctly on a transparent background on both dark (`bg-secondary`) and light screens.

---

## 2. Scroll to Top on Question Transition
* **Finding**: Navigating between questions or screen transitions scrolls the viewport to the bottom.
* **Analysis**:
  * **File references**: 
    * [App.tsx](file:///home/foxnet360/Documentos/dev/Acrux/DIGITAL-H/src/App.tsx#L54-L58) implements screen navigation via `transitionToScreen`.
    * [Questionnaire.tsx](file:///home/foxnet360/Documentos/dev/Acrux/DIGITAL-H/src/components/Questionnaire.tsx) handles question updates based on `currentIdx`.
* **Plan**:
  * **Funnel Navigation**: Add `window.scrollTo({ top: 0, behavior: 'smooth' })` inside `transitionToScreen` in `App.tsx`.
  * **Question Transitions**: Add a `useEffect` inside `Questionnaire.tsx` listening to `currentIdx` changes to scroll smoothly to the top of the questionnaire layout on each new question.

---

## 3. Acrux Native Booking System
* **Finding**: Unify terminology and use the native booking system on the results page rather than redirecting to external Calendly links.
* **Analysis**:
  * **File references**:
    * [ResultsCTA.tsx](file:///home/foxnet360/Documentos/dev/Acrux/DIGITAL-H/src/components/results/ResultsCTA.tsx#L21) contains hardcoded Calendly URLs (`https://calendly.com/acrux-consultores/30min`).
    * [Results.tsx](file:///home/foxnet360/Documentos/dev/Acrux/DIGITAL-H/src/components/Results.tsx#L189) renders `ResultsBookingSection` which renders `BookingCalendar.tsx`.
    * [booking.php](file:///home/foxnet360/Documentos/dev/Acrux/DIGITAL-H/public/api/booking.php) implements native SQL insertions to `digitalh_bookings` and sends notifications to `hola@acrux.life`.
    * [BookingCalendar.tsx](file:///home/foxnet360/Documentos/dev/Acrux/DIGITAL-H/src/components/BookingCalendar.tsx#L44) has static time slot states with a comment `"In real implementation, check against database"`.
* **Plan**:
  * **CTA Redirection**: Update all external Calendly links in `ResultsCTA.tsx` to smooth-scroll to `#booking-section` (e.g. `href="#booking-section"`). Add the `id="booking-section"` selector to the booking container in `Results.tsx`.
  * **Dynamic Availability**: Update `BookingCalendar.tsx` to execute a `GET ./api/booking.php?date=YYYY-MM-DD` request on date selection to dynamically retrieve booked slots from the local database, marking busy slots as disabled.
  * **Database & Notification**: Ensure `booking.php` successfully logs appointments in the `digitalh_bookings` table and fires notification emails to `hola@acrux.life` when reservations are completed.

---

## 4. Session Text Change
* **Finding**: The session description text should refer to "profesionales" instead of "Psicólogo Organizacional".
* **Analysis**:
  * **File references**:
    * [BookingCalendar.tsx](file:///home/foxnet360/Documentos/dev/Acrux/DIGITAL-H/src/components/BookingCalendar.tsx#L141): `<p className="text-sm text-slate-500">Con Psicólogo Organizacional</p>`
    * [ResultsCTA.tsx](file:///home/foxnet360/Documentos/dev/Acrux/DIGITAL-H/src/components/results/ResultsCTA.tsx#L34): `Reservar mi sesión de 30 min con Psicólogo Organizacional`
* **Plan**:
  * Change both occurrences to refer to "profesionales" (e.g., `Con profesionales` and `Reservar mi sesión de 30 min con profesionales`).

---

## 5. Transformation Roadmap Descriptions
* **Finding**: The roadmap phases require more detailed, professional descriptions.
* **Analysis**:
  * **File references**:
    * [Results.tsx](file:///home/foxnet360/Documentos/dev/Acrux/DIGITAL-H/src/components/Results.tsx#L28-L30) (Web display)
    * [generateReportPDF.ts](file:///home/foxnet360/Documentos/dev/Acrux/DIGITAL-H/src/generateReportPDF.ts#L284-L286) (PDF generation)
* **Plan**:
  * Update both arrays with the following unified descriptions:
    * **Fase 1: Cimientos (Mes 1-2)**: "Alineación estratégica con líderes de área, diagnóstico profundo de procesos críticos y configuración de la infraestructura tecnológica fundacional."
    * **Fase 2: Adopción (Mes 3-5)**: "Capacitación de equipos clave, adopción de herramientas colaborativas y automatización de flujos de trabajo rutinarios para liberar tiempo productivo."
    * **Fase 3: Escalamiento (Mes 6+)**: "Implementación de analítica de datos avanzada para toma de decisiones y escalamiento de las mejores prácticas digitales a toda la organización."

---

## 6. Exclusive Resources 404s
* **Finding**: PDF files in "Recursos Exclusivos" throw 404 errors due to file name/path mismatches.
* **Analysis**:
  * **File references**:
    * Sibling project `acrux.life/public/docs/` contains `10 Pasos Para la Transformacion.pdf` and `eBook - La PYME Digital del Siglo XXI.pdf`.
    * [Results.tsx](file:///home/foxnet360/Documentos/dev/Acrux/DIGITAL-H/src/components/Results.tsx#L38) & [L52](file:///home/foxnet360/Documentos/dev/Acrux/DIGITAL-H/src/components/Results.tsx#L52) link to `https://acrux.life/docs/10-Pasos-Para-la-Transformacion.pdf` and `https://acrux.life/docs/eBook-La-PYME-Digital-del-Siglo-XXI.pdf`.
* **Plan**:
  * Create `public/docs/` directory inside `DIGITAL-H`.
  * Copy both PDF files from the `acrux.life` project, renaming them to clean, hyphenated format to avoid spacing bugs:
    * `10-Pasos-Para-la-Transformacion.pdf`
    * `eBook-La-PYME-Digital-del-Siglo-XXI.pdf`
  * Update paths in `Results.tsx` to relative URLs (`/docs/10-Pasos-Para-la-Transformacion.pdf` and `/docs/eBook-La-PYME-Digital-del-Siglo-XXI.pdf`) so the leadmagnet hosts and serves them directly.
  * Update corresponding fallback links in `public/api/config.php` (email template).

---

## 7. PDF Template Overhaul
* **Finding**: Improve PDF layout, text overlaps, page number calculations, dates, and closing calls-to-action.
* **Analysis**:
  * **File references**:
    * [generateReportPDF.ts](file:///home/foxnet360/Documentos/dev/Acrux/DIGITAL-H/src/generateReportPDF.ts)
* **Plan**:
  * **Header Logo**:
    * Move the logo to the header bar inside `addHeader` (e.g., right-aligned or left-aligned within the header block, properly scaled at ~25x10mm).
    * Remove the large cover-page logo container (`doc.addImage` on line 73) to avoid redundancy and disproportionate scaling.
  * **Page Count Mismatch**:
    * Eliminate the hardcoded `4` total pages.
    * Perform header/footer injection in a post-generation pass. Loop through all generated pages using `doc.internal.getNumberOfPages()`, dynamically calculating and stamping page numbers (e.g., "Página 1 de 3").
  * **Footer Overlap & Year Update**:
    * Render the copyright on the left (`margin`) and the page count on the right (`pageWidth - margin` with `{ align: 'right' }`) to eliminate overlapping.
    * Update the copyright year from `2025` to `2026` in `generateReportPDF.ts`, `booking.php`, and `config.php`.
  * **Dimension Descriptions**:
    * Replace short lists in PDF with the professional descriptions of dimensions.
  * **Priority Tag Overlap**:
    * Adjust recommendations list card layout: Increase card height from `35mm` to `38mm`, increase card gap (`recY += 46`), and reduce priority tag height (to `7mm`). Wrap description text to `pageWidth - margin * 2 - 15` to preserve a clean 10mm right margin.
  * **Roadmap descriptions**:
    * Apply the same improved roadmap descriptions as Finding 5.
  * **Closing Call-To-Action**:
    * On the final page (Page 4, where the Roadmap renders), add a closing section containing a line separator, a warm closing invitation, and a clickable link redirecting users back to `https://acrux.life`.
