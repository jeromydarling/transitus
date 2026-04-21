# Transitus — Lovable Build Spec

> **CRITICAL RULE: "No compile errors" does NOT mean "done."**
> Every feature must be wired end-to-end: UI → mutation → database → query → UI display → refresh persistence.
> If a user creates a Field Note, closes the browser, reopens it, and the note is gone — NOT done.
> If a login page renders but doesn't authenticate — NOT done.
> If a button exists but clicking it does nothing — NOT done.
> API keys and secrets are the LAST step.

---

## What Already Exists (DO NOT REBUILD)

This repo has a **complete Supabase backend already built**. Do not create new tables from scratch. The infrastructure is:

- **Supabase project**: `zmeawjhxbgvtcfcfcygf` (configured in `supabase/config.toml`)
- **424 SQL migrations** already applied (28,401 lines of schema)
- **598 tables** defined in `src/integrations/supabase/types.ts`
- **Supabase client**: `src/integrations/supabase/client.ts` — already configured with auth
- **200+ React hooks** using `@tanstack/react-query` + `supabase-js` in `src/hooks/`
- **311 edge functions** in `supabase/functions/`
- **Auth context**: `src/contexts/AuthContext.tsx` already exists
- **Type aliases**: `src/types/cros.ts` maps legacy names → Transitus names

### CROS → Transitus Entity Map

The backend uses CROS-era table names. The Transitus frontend uses new names. Here's what maps to what:

| Supabase Table | CROS Name | Transitus Feature | Existing Hook |
|---|---|---|---|
| `opportunities` | Opportunity/Partner | Commitments + Places | `useOpportunities.ts` |
| `contacts` | Contact/Person | Stakeholders | `useContacts.ts` |
| `metros` | Metro | Places / Territories | `useMetros.ts` |
| `activities` | Activity/TouchPoint | Field Notes | `useActivities.ts` |
| `events` | Event/CommunityEvent | Calendar / Community Events | `useEvents.ts` |
| `grants` | Grant | Signals / Library | `useGrants.ts` |
| `volunteers` | Volunteer | Participation | `useVolunteers.ts` |
| `impulsus_entries` | Impulsus | Journal | `useImpulsusEntries.ts` |
| `testimonium_events` | Testimonium | Community Stories | `useTestimoniumCapture.ts` |
| `communio_groups` | Communio | Coalition Network | `useCommunioGovernance.ts` |
| `narrative_threads` | Narrative | Journeys | various narrative hooks |

**DO NOT** create duplicate tables. Wire the Transitus pages to the existing tables via the existing hooks or thin adapter hooks.

---

## What This App Is

Transitus is a **Just Transition stewardship platform** for environmental justice coalitions. It tracks places burdened by pollution, the people who live there, the commitments made to them, and whether those commitments are being kept.

The NEW frontend (what you're wiring) lives under `/app/*` with:
- 21 app routes, all rendering with full UI
- 12 data entry forms with validation
- 10 entity types with CRUD operations
- 12 external API connector stubs (EPA, Census, NOAA, NASA, etc.)
- Role-based permissions (Steward / Companion / Observer)
- Consent-level system for community stories
- Full-text search across all entities
- **Currently uses localStorage** via `TransitusDataContext.tsx` — this is what you're replacing

The EXISTING admin console lives under `/gardener/*` — keep it working.

---

## Phase 1: Wire TransitusDataContext to Existing Supabase

### Strategy

Replace the localStorage internals of `src/contexts/TransitusDataContext.tsx` with calls to the **existing** Supabase tables via the **existing** hooks or direct `supabase.from()` queries. Keep the same context API so all 21 pages and 12 forms keep working.

For each Transitus entity, either:
- **Reuse the existing hook** (e.g., `useContacts()` feeds stakeholder data) with a thin mapping layer
- **Write a new adapter hook** if the existing table needs column mapping (e.g., `opportunities.organization` → `commitment.title`)

### Entity Wiring Checklist

Every entity must pass: **Create → refresh → persists → edit → refresh → persists → delete → refresh → gone.**

| Transitus Entity | Wire To | Via |
|---|---|---|
| Places | `metros` table | Adapt `useMetros()` or query `metros` directly |
| Stakeholders | `contacts` table | Adapt `useContacts()` |
| Organizations | `opportunities` table (org records) | Adapt `useOpportunities()` or separate org query |
| Commitments | `opportunities` table or new columns | Map commitment fields to opportunity columns |
| Field Notes | `activities` table | Adapt `useActivities()` |
| Signals | `grants` + external API results | Adapt `useGrants()` for grant-type signals |
| Journeys | `narrative_threads` table | Adapt narrative hooks |
| Community Stories | `testimonium_events` table | Adapt `useTestimoniumCapture()` |
| Journal | `impulsus_entries` table | Adapt `useImpulsusEntries()` |
| Coalition | `communio_groups` + related tables | Adapt communio hooks |
| Participation | `volunteers` + `volunteer_shifts` | Adapt `useVolunteers()` |
| Comments | Check if comments table exists, create if not | New hook or existing |
| NRI Messages | Check if nri table exists, create if not | New hook |
| Calendar/Events | `events` table | Adapt `useEvents()` |

**If a table doesn't exist for a Transitus entity** (e.g., comments, NRI messages), THEN create it. But check first — most things already have tables.

### Column Mapping Example

The `contacts` table has columns like `name`, `email`, `phone`, `title`, `opportunity_id`. Transitus calls these "stakeholders" with `role`, `trust_level`, `bio`, `place_ids`. You may need to:
- Add missing columns via a new migration (e.g., `alter table contacts add column trust_level text`)
- Or use existing columns with mapping (e.g., contacts already has tags, notes fields)

**Inspect the actual table schema** in `src/integrations/supabase/types.ts` before deciding.

---

## Phase 2: Auth (Already Partially Built)

### What Exists
- `src/contexts/AuthContext.tsx` — already exists
- `src/integrations/supabase/client.ts` — Supabase client configured with auth
- Login/Signup pages exist in the router

### What to Verify/Wire
- [ ] AuthContext wraps the app and provides `user`, `session`, `signIn`, `signUp`, `signOut`
- [ ] Login.tsx calls `supabase.auth.signInWithPassword()` — not a placeholder
- [ ] Signup.tsx calls `supabase.auth.signUp()` — creates user + profile
- [ ] `/app/*` routes redirect unauthenticated users to `/login`
- [ ] User role comes from database, not localStorage
- [ ] Sign out clears session, redirects to `/`

---

## Phase 3: Relationship Queries

These currently work via mock data IDs. After wiring, they must use real joins:

- PlaceDetail sidebar: stakeholders for this place → join through existing relationship tables
- PlaceDetail sidebar: commitments for this place → query with place filter
- PlaceDetail sidebar: field notes for this place → `activities` filtered by place/metro
- PersonDetail: linked commitments and notes → query by contact ID
- Home dashboard: recent activity, upcoming items → real ordered queries

---

## Phase 4: Real-Time (Supabase Realtime)

- [ ] Subscribe to activity/field note inserts → live updates on PlaceDetail
- [ ] Subscribe to signal inserts → update dashboard counts
- [ ] Subscribe to commitment status changes → live cards

---

## Phase 5: External API Wiring (LAST)

Each file in `src/lib/api/` returns mock data. Replace with real calls. **Only after all CRUD works.**

1. `ejscreen.ts` — EPA EJScreen (free, no key)
2. `census.ts` — Census ACS (free, key recommended)
3. `echo.ts` — EPA ECHO (free, no key)
4. `noaa.ts` — NOAA Weather (free, no key)
5. `nasa.ts` — NASA Earth Imagery (key required → `VITE_NASA_API_KEY`)
6. `cejst.ts` — Justice40 CEJST (free)
7. `grants.ts` — Grants.gov (free)
8. Remaining stubs: `usgs.ts`, `archives.ts`, `wri.ts`, `nrdc.ts`

---

## Completion Checklist

**NOT done until ALL pass:**

### Auth
- [ ] Signup creates account → redirects to /app
- [ ] Login persists across refresh
- [ ] Logout clears session
- [ ] Protected routes redirect to login
- [ ] Role-based permissions work from database

### Data Persistence (EACH entity)
- [ ] Create via form → appears immediately
- [ ] Refresh → still there (Supabase, not localStorage)
- [ ] Edit → persists after refresh
- [ ] Delete → gone after refresh
- [ ] Relationships work across entities

### Pages (EACH loads with data)
- [ ] /app — dashboard with real data
- [ ] /app/places — place list
- [ ] /app/places/:id — full detail with map + sidebar entities
- [ ] /app/people — stakeholder directory
- [ ] /app/people/:id — profile with linked data
- [ ] /app/commitments — filterable list
- [ ] /app/field-notes — feed with tags
- [ ] /app/signals — feed with read/unread
- [ ] /app/journeys + /app/journeys/:id
- [ ] /app/library, /app/reports, /app/community-stories
- [ ] /app/compass, /app/journal, /app/coalition, /app/settings, /app/seasons, /app/graph
- [ ] Global search (Cmd+K) returns results from Supabase
- [ ] /gardener/* admin console still works

### Forms (EACH submits to database)
- [ ] All 12 CreateX / EditX / AddX forms write to Supabase
- [ ] Form data appears on relevant pages after submission

### Map
- [ ] Mapbox renders with Classic style default
- [ ] All 5 layer toggles work (Poverty, Burdens, Facilities, People, Work)
- [ ] Environmental Burden Index gradient bar visible
- [ ] PDF export works with real data

### Environment Variables (LAST)
- [ ] `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY` (may already be set)
- [ ] `VITE_MAPBOX_TOKEN`
- [ ] `VITE_NASA_API_KEY`

---

## Anti-Patterns

1. **DO NOT** create new Supabase tables when equivalent CROS tables already exist
2. **DO NOT** declare done because it compiles — test actual persistence
3. **DO NOT** leave `// TODO` comments — wire it now
4. **DO NOT** use localStorage for data — all data from Supabase
5. **DO NOT** skip the completion checklist
6. **DO NOT** wire API keys before CRUD works
7. **DO NOT** delete legacy hooks/contexts/edge functions — they are the backend
8. **DO NOT** create placeholder auth — it must actually authenticate
9. **DO NOT** rebuild what already exists — inspect `src/integrations/supabase/types.ts` first
10. **DO NOT** skip seed data — demo data must exist on first load

---

## Key Files

| What | Where |
|------|-------|
| Supabase client | `src/integrations/supabase/client.ts` |
| Supabase types (table schemas) | `src/integrations/supabase/types.ts` |
| CROS→Transitus type aliases | `src/types/cros.ts` |
| Transitus domain types | `src/types/transitus.ts` |
| Data context (replace internals) | `src/contexts/TransitusDataContext.tsx` |
| Auth context (already exists) | `src/contexts/AuthContext.tsx` |
| Existing hooks (200+) | `src/hooks/*.ts` |
| Mock data (for seed reference) | `src/lib/mockData.ts` |
| API stubs (wire last) | `src/lib/api/*.ts` |
| Forms (12) | `src/components/forms/*.tsx` |
| Router | `src/components/routing/AppRouter.tsx` |
| Edge functions (311) | `supabase/functions/` |
| Migrations (424) | `supabase/migrations/` |
