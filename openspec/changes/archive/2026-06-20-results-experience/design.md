# Design: results-experience

## Architecture Overview

```
src/
├── components/
│   ├── results/                     ← NEW directory
│   │   ├── ResultsHeader.tsx        ← score + level + name
│   │   ├── ScoreCard.tsx            ← IMD circular display
│   │   ├── DimensionChart.tsx       ← Recharts radar chart
│   │   ├── RecommendationList.tsx   ← 4 recommendations
│   │   ├── TestimonialSection.tsx   ← 2 testimonials
│   │   ├── ResultsCTA.tsx           ← booking + share CTAs
│   │   └── ResultsPDF.tsx           ← PDF download button
│   ├── PublicResultsPage.tsx        ← NEW: public /results/:id/:token view
│   └── Results.tsx                  ← Refactored: orchestrator only
├── hooks/
│   └── useDiagnostic.ts             ← Updated: stores share_token + id
└── types/shared.ts                  ← Updated: Lead gains share_token, diagnosticId

public/api/
├── config.php                       ← Updated: sendThankYouEmail gains $id + $token
└── diagnostic.php                   ← Updated: generates share_token, GET handler added
```

---

## Data Flow

### Completion flow (existing + changes)

```
useQuestionnaire.onComplete()
  → useDiagnostic.finishDiagnostic()
      → POST /api/diagnostic.php
          ← { success, id, share_token, email_sent }
      → setLead({ ...lead, score, level, id, share_token })
      → setScreen('results')
  → Results.tsx renders with lead.share_token available
```

### Public page flow (new)

```
Browser: https://acrux.life/digital-h/#results/42/abc-uuid-token
  → App.tsx detects hash on mount (useEffect)
  → Renders <PublicResultsPage id="42" token="abc-uuid-token" />
      → GET /api/diagnostic.php?id=42&token=abc-uuid-token
          ← { name, company, imd_score, maturity_level, answers_json }
      → Renders ResultsHeader + ScoreCard + DimensionChart + RecommendationList
```

---

## Component Contracts

### `Results.tsx` (orchestrator)
```typescript
interface ResultsProps {
  answers: Record<string, number>;
  lead: Lead | null;
}
// Composes sub-components. Contains zero business logic.
```

### `ResultsHeader.tsx`
```typescript
interface ResultsHeaderProps {
  name: string;
  company: string;
  imd: number;
  level: string;
  shareUrl?: string; // undefined = no share button shown
}
```

### `ScoreCard.tsx`
```typescript
interface ScoreCardProps {
  imd: number;
  level: string;
  levelColor: string;
}
```

### `DimensionChart.tsx`
```typescript
interface DimensionChartProps {
  answers: Record<string, number>;
}
// Internally calls getWeakDimensions() from utils.ts
```

### `RecommendationList.tsx`
```typescript
interface RecommendationListProps {
  answers: Record<string, number>;
}
// Internally calls getWeakDimensions() + getRecommendations()
```

### `PublicResultsPage.tsx`
```typescript
interface PublicResultsPageProps {
  id: string;
  token: string;
}
type FetchState = 'loading' | 'error' | 'forbidden' | 'success';
```

---

## Backend Changes

### `diagnostic.php` — POST handler addition
```php
// Generate share token on insert
$shareToken = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
    mt_rand(0, 0xffff), mt_rand(0, 0xffff),
    mt_rand(0, 0xffff),
    mt_rand(0, 0x0fff) | 0x4000,
    mt_rand(0, 0x3fff) | 0x8000,
    mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
);

// Add share_token column to INSERT
// Return share_token in response JSON
```

### `diagnostic.php` — GET handler (new)
```php
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
    $token = filter_input(INPUT_GET, 'token', FILTER_SANITIZE_STRING);
    // Validate, query, return JSON or 403/404
}
```

### DB migration required
```sql
ALTER TABLE digitalh_results
  ADD COLUMN share_token VARCHAR(36) NOT NULL DEFAULT '' AFTER id;

CREATE INDEX idx_share_token ON digitalh_results (share_token);
```

### `config.php` — `sendThankYouEmail()` signature update
```php
function sendThankYouEmail($email, $name, $company, $imd, $level, $id, $shareToken)
```
Email CTA HTML addition:
```html
<a href="https://acrux.life/digital-h/#results/{$id}/{$shareToken}">
  Ver mis resultados completos →
</a>
```

---

## Hash Routing in `App.tsx`

```typescript
// On mount, check if URL hash matches /results/{id}/{token}
useEffect(() => {
  const hash = window.location.hash;
  const match = hash.match(/^#results\/(\d+)\/([a-f0-9-]{36})$/);
  if (match) {
    setPublicResultsId(match[1]);
    setPublicResultsToken(match[2]);
    setScreen('public-results');
  }
}, []);
```

New screen added to `Screen` type: `'public-results'`

---

## Security Notes

- share_token is UUID v4 (2^122 entropy) — brute force infeasible
- No PII in the URL — name/email are in the response body, not the URL
- The GET endpoint returns only: name, company, imd_score, level, answers_json — NOT email
- CORS policy on the GET endpoint mirrors the existing POST policy

---

## Risk: Sequential IDs

The current `id` is `AUTO_INCREMENT`. Without `share_token`, sequential enumeration
would expose all diagnostics. The `share_token` requirement neutralizes this.
Even if the ID is guessed, the token check blocks access.
