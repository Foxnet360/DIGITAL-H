# Proposal: results-experience

## Problem

The current results screen (`Results.tsx`, 32KB) is a monolithic component that combines
score display, PDF download, booking calendar, recommendations, and testimonials in one file.
This makes it hard to maintain and impossible to share results externally.

Additionally, users who complete the diagnostic receive a thank-you email but have no way to
revisit their results later — the email has no link back to a web view of their report.

## Proposed Solution

1. **Decompose `Results.tsx`** into focused sub-components with single responsibilities.
2. **Create a public shareable results page** at `/results/:id` that renders the same diagnostic
   results given a diagnostic ID (already returned by the backend on completion).
3. **Update the thank-you email** to include the shareable link so users can revisit and share.

## User Value

- Users can bookmark and revisit their results at any time.
- Users can share their results with colleagues or management.
- The codebase becomes maintainable and testable at the component level.
- The email becomes a durable entry point back into the product.

## Scope

**In scope:**
- Decompose `Results.tsx` into: `ResultsHeader`, `ScoreCard`, `DimensionChart`,
  `RecommendationList`, `TestimonialSection`, `ResultsCTA`, `ResultsPDF`
- Add a new `ResultsPage` component that fetches results by ID from a new PHP endpoint
- Add `GET /api/diagnostic.php?id={id}` endpoint to retrieve saved results
- Update `sendThankYouEmail()` in `config.php` to include the shareable URL
- Add frontend routing for `/results/:id` (hash-based, no router library needed)

**Out of scope:**
- Authentication / private results (results are public by ID — link is the access token)
- PDF regeneration from the public page (future)
- HubSpot integration changes

## Non-goals

- Redesigning the visual output of Results
- Adding new result metrics or dimensions
- Server-side rendering

## Risks

- The `id` from the DB is a sequential integer — guessable. Consider adding a UUID column
  or a short token. Flagged as a risk to address in design.
- `Results.tsx` is tightly coupled to `App.tsx` state — decomposition must be careful
  not to break the existing in-app flow.
