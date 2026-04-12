# Transitus — Lovable Build Spec

> **CRITICAL RULE: "No compile errors" does NOT mean "done."**
> Every feature listed below must be wired end-to-end: UI form → mutation → database write → query → UI display → refresh persistence.
> If a user creates a Field Note, closes the browser, reopens it, and the note is gone — that feature is NOT done.
> If a login page renders but doesn't authenticate — that feature is NOT done.
> If a button exists but clicking it does nothing — that feature is NOT done.
> API keys and secrets are the LAST step. Everything else must work first.

---

## What This App Is

Transitus is a **Just Transition stewardship platform** for environmental justice coalitions, faith-based investors, community land trusts, and municipal resilience offices. It tracks places burdened by pollution, the people who live there, the commitments made to them, and whether those commitments are being kept.

The codebase is a complete React 18 + Vite + TypeScript + Tailwind + shadcn/ui app with:
- 21 app routes, all rendering with full UI
- 12 data entry forms with validation
- 10 entity types with CRUD operations
- 12 external API connector stubs (EPA, Census, NOAA, NASA, etc.)
- A role-based permission system (Steward / Companion / Observer)
- A consent-level system for community stories (local_only / trusted_allies / institutional / public)
- Full-text search across all entities
- localStorage persistence (TransitusDataContext.tsx)

**Your job: replace localStorage with Supabase. Wire auth. Wire real-time. Make it production-ready.**

---

## Phase 1: Supabase Schema (Do This First)

Create these tables in this order (foreign keys depend on earlier tables).

### 1.1 Core Tables

```sql
-- Users (extends Supabase auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  avatar_url text,
  role text not null default 'observer' check (role in ('steward', 'companion', 'observer')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Places
create table public.places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  place_type text not null default 'neighborhood',
  geography text,
  lat double precision not null,
  lng double precision not null,
  communities text[] default '{}',
  key_institutions text[] default '{}',
  land_use text[] default '{}',
  transition_issues text[] default '{}',
  population_estimate integer,
  human_impact_summary text,
  most_affected_populations text[] default '{}',
  health_snapshot text,
  displacement_pressure text check (displacement_pressure in ('low', 'moderate', 'high', 'critical')),
  environmental_burdens jsonb default '[]',
  active_work jsonb default '[]',
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Organizations
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  org_type text not null default 'other',
  description text,
  website text,
  tags text[] default '{}',
  created_at timestamptz default now()
);

-- Stakeholders
create table public.stakeholders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default 'listener',
  email text,
  phone text,
  organization_id uuid references public.organizations(id),
  title text,
  bio text,
  tags text[] default '{}',
  last_contact timestamptz,
  trust_level text default 'new' check (trust_level in ('new', 'building', 'established', 'deep')),
  created_at timestamptz default now()
);

-- Commitments
create table public.commitments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  commitment_type text not null,
  status text not null default 'proposed',
  made_by_org_id uuid references public.organizations(id),
  made_by_stakeholder_id uuid references public.stakeholders(id),
  made_to_place_id uuid references public.places(id),
  made_to_org_id uuid references public.organizations(id),
  context text,
  community_interpretation text,
  evidence jsonb default '[]',
  renewal_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Field Notes
create table public.field_notes (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id),
  place_id uuid references public.places(id),
  note_type text not null default 'quick_note',
  content text not null,
  what_i_saw text,
  who_i_spoke_with text,
  what_changed text,
  follow_up text,
  tags text[] default '{}',
  is_testimony boolean default false,
  consent_level text default 'local_only',
  photos text[] default '{}',
  voice_note_url text,
  lat double precision,
  lng double precision,
  created_at timestamptz default now()
);

-- Signals
create table public.signals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  source text not null,
  category text not null,
  url text,
  published_at timestamptz,
  severity text default 'informational' check (severity in ('informational', 'notable', 'urgent')),
  created_at timestamptz default now()
);

-- Journeys
create table public.journeys (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  journey_type text not null,
  place_id uuid references public.places(id),
  description text,
  chapters jsonb default '[]',
  tensions text[] default '{}',
  open_questions text[] default '{}',
  started_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Community Stories
create table public.community_stories (
  id uuid primary key default gen_random_uuid(),
  person_name text not null,
  stakeholder_id uuid references public.stakeholders(id),
  location_detail text,
  place_id uuid references public.places(id),
  story text not null,
  health_impacts text[] default '{}',
  years_in_community integer,
  family_context text,
  quote text,
  consent_level text not null default 'local_only' check (consent_level in ('local_only', 'trusted_allies', 'institutional', 'public')),
  collected_by uuid references public.profiles(id),
  collected_at timestamptz default now(),
  tags text[] default '{}',
  photo_description text
);

-- Comments (threaded, on any entity)
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  author_id uuid references public.profiles(id),
  author_name text not null,
  content text not null,
  parent_id uuid references public.comments(id),
  created_at timestamptz default now()
);

-- NRI Chat Messages
create table public.nri_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);
```

### 1.2 Junction Tables

```sql
-- Place ↔ Stakeholder
create table public.place_stakeholders (
  place_id uuid references public.places(id) on delete cascade,
  stakeholder_id uuid references public.stakeholders(id) on delete cascade,
  primary key (place_id, stakeholder_id)
);

-- Place ↔ Organization
create table public.place_organizations (
  place_id uuid references public.places(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  primary key (place_id, organization_id)
);

-- Organization ↔ Stakeholder
create table public.org_stakeholders (
  organization_id uuid references public.organizations(id) on delete cascade,
  stakeholder_id uuid references public.stakeholders(id) on delete cascade,
  primary key (organization_id, stakeholder_id)
);

-- Commitment ↔ Place
create table public.commitment_places (
  commitment_id uuid references public.commitments(id) on delete cascade,
  place_id uuid references public.places(id) on delete cascade,
  primary key (commitment_id, place_id)
);

-- Signal ↔ Place
create table public.signal_places (
  signal_id uuid references public.signals(id) on delete cascade,
  place_id uuid references public.places(id) on delete cascade,
  primary key (signal_id, place_id)
);

-- Journey ↔ Stakeholder
create table public.journey_stakeholders (
  journey_id uuid references public.journeys(id) on delete cascade,
  stakeholder_id uuid references public.stakeholders(id) on delete cascade,
  primary key (journey_id, stakeholder_id)
);

-- Journey ↔ Commitment
create table public.journey_commitments (
  journey_id uuid references public.journeys(id) on delete cascade,
  commitment_id uuid references public.commitments(id) on delete cascade,
  primary key (journey_id, commitment_id)
);

-- Signal read tracking (per user)
create table public.signal_reads (
  user_id uuid references public.profiles(id) on delete cascade,
  signal_id uuid references public.signals(id) on delete cascade,
  read_at timestamptz default now(),
  primary key (user_id, signal_id)
);
```

### 1.3 Row-Level Security

```sql
-- Enable RLS on ALL tables
alter table public.profiles enable row level security;
alter table public.places enable row level security;
alter table public.organizations enable row level security;
alter table public.stakeholders enable row level security;
alter table public.commitments enable row level security;
alter table public.field_notes enable row level security;
alter table public.signals enable row level security;
alter table public.journeys enable row level security;
alter table public.community_stories enable row level security;
alter table public.comments enable row level security;
alter table public.nri_messages enable row level security;

-- All authenticated users can read (role filtering happens in app layer)
-- Stewards can write everything; Companions can create; Observers read-only
-- Apply this pattern to every table:

create policy "Authenticated users can read" on public.places
  for select using (auth.role() = 'authenticated');
create policy "Stewards and companions can insert" on public.places
  for insert with check (
    auth.role() = 'authenticated' and
    exists (select 1 from public.profiles where id = auth.uid() and role in ('steward', 'companion'))
  );
create policy "Stewards can update" on public.places
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'steward')
  );
create policy "Stewards can delete" on public.places
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'steward')
  );

-- REPEAT the above pattern for: organizations, stakeholders, commitments,
-- field_notes, signals, journeys, community_stories, comments

-- Community stories: additional consent-level filter
-- (App code filters by user role → max consent level visible)

-- NRI messages: users see only their own
create policy "Users see own messages" on public.nri_messages
  for select using (user_id = auth.uid());
create policy "Users create own messages" on public.nri_messages
  for insert with check (user_id = auth.uid());
create policy "Users delete own messages" on public.nri_messages
  for delete using (user_id = auth.uid());

-- Profiles: users can read all, update only own
create policy "Anyone can read profiles" on public.profiles
  for select using (auth.role() = 'authenticated');
create policy "Users update own profile" on public.profiles
  for update using (id = auth.uid());

-- Junction tables: same read/write policies as parent tables
-- Apply read-all + steward/companion-write pattern to all junction tables
```

### 1.4 Seed Data

Insert ALL mock data from `src/lib/mockData.ts` into the Supabase tables. This is the demo dataset. Do NOT skip this — the app must have data on first load. Use a seed migration file.

---

## Phase 2: Authentication

### 2.1 What Exists

- `src/pages/Login.tsx` and `src/pages/Signup.tsx` exist but are NOT wired to Supabase Auth
- Routes exist in AppRouter.tsx
- User role is stored in localStorage key `transitus_user_role`

### 2.2 What Must Be Wired

1. **Supabase Auth client** — initialize in a new `src/lib/supabase.ts`
2. **AuthContext** — wrap app in auth provider, expose `user`, `session`, `signIn`, `signUp`, `signOut`
3. **Login.tsx** — wire form submit to `supabase.auth.signInWithPassword()`
4. **Signup.tsx** — wire form submit to `supabase.auth.signUp()`, create profile row on signup
5. **Protected routes** — redirect unauthenticated users to `/login`
6. **Role from profile** — fetch `profiles.role` after auth, replace localStorage role
7. **Sign out** — clear session, redirect to landing page
8. **Auth state listener** — `supabase.auth.onAuthStateChange()` to handle token refresh

### 2.3 Acceptance Criteria

- [ ] User can sign up with email/password → profile row created → redirected to /app
- [ ] User can log in → session persists across browser refresh
- [ ] User can log out → session cleared → redirected to /
- [ ] Unauthenticated user visiting /app/* is redirected to /login
- [ ] User role (steward/companion/observer) is read from profiles table, not localStorage
- [ ] Permission checks (canCreate, canEditPlaces, etc.) work based on real role

---

## Phase 3: Replace localStorage with Supabase Queries

### 3.1 Migration Strategy

Replace `TransitusDataContext.tsx` internals. Keep the same context API signature so all 21 pages and 12 forms continue working without changes.

**Current pattern (remove):**
```ts
const [places, setPlaces] = useState<Place[]>(loadFromStorage());
const addPlace = (p) => { setPlaces(prev => [...prev, p]); saveToStorage(); };
```

**New pattern (implement):**
```ts
// Use @tanstack/react-query + supabase-js
const { data: places } = useQuery({ queryKey: ['places'], queryFn: () => supabase.from('places').select('*') });
const addPlace = useMutation({ mutationFn: (p) => supabase.from('places').insert(p), onSuccess: () => queryClient.invalidateQueries(['places']) });
```

### 3.2 Entity Migration Checklist

Every entity below must pass this test: **Create → refresh page → data persists → edit → refresh → edit persists → delete → refresh → data gone.**

- [ ] **Places** — full CRUD via Supabase, including environmental_burdens (JSONB) and active_work (JSONB)
- [ ] **Stakeholders** — CRUD + junction tables (place_stakeholders, org_stakeholders)
- [ ] **Organizations** — CRUD + junction tables (place_organizations, org_stakeholders)
- [ ] **Commitments** — CRUD + status transitions + evidence (JSONB) + junction (commitment_places)
- [ ] **Field Notes** — CRUD + author_id from auth session + place_id linkage
- [ ] **Signals** — CRUD + junction (signal_places) + per-user read tracking (signal_reads)
- [ ] **Journeys** — CRUD + chapters (JSONB) + junction tables (journey_stakeholders, journey_commitments)
- [ ] **Community Stories** — CRUD + consent_level filtering based on user role + collected_by from auth
- [ ] **Comments** — CRUD on any entity type + threaded (parent_id)
- [ ] **NRI Messages** — CRUD scoped to current user
- [ ] **Search** — `searchAll()` must query Supabase full-text search, not in-memory arrays

### 3.3 Relationship Queries

These currently work because mock data has hardcoded ID references. After migration, they must use real joins:

- PlaceDetail sidebar: stakeholders linked to this place → `place_stakeholders` join
- PlaceDetail sidebar: organizations linked to this place → `place_organizations` join
- PlaceDetail sidebar: commitments made to this place → `commitments.made_to_place_id` + `commitment_places`
- PlaceDetail sidebar: field notes for this place → `field_notes.place_id`
- PlaceDetail sidebar: signals for this place → `signal_places` join
- PersonDetail: commitments involving this person → `commitments.made_by_stakeholder_id`
- PersonDetail: field notes by this person → `field_notes.author_id`
- JourneyDetail: linked stakeholders → `journey_stakeholders` join
- JourneyDetail: linked commitments → `journey_commitments` join
- Home dashboard: recent signals, upcoming commitments, activity feed → real queries with ordering

---

## Phase 4: Real-Time Subscriptions

Add Supabase Realtime so team members see each other's changes without refreshing.

- [ ] Subscribe to `places` table changes → auto-update place lists
- [ ] Subscribe to `field_notes` inserts → show new notes on PlaceDetail
- [ ] Subscribe to `signals` inserts → update signal count on Home dashboard
- [ ] Subscribe to `commitments` status changes → update commitment cards
- [ ] Subscribe to `comments` inserts → live comment threads

---

## Phase 5: External API Wiring

Each file in `src/lib/api/` returns mock data. Replace with real API calls. **Do this LAST — after all CRUD and auth work.**

Priority order:
1. `ejscreen.ts` — EPA EJScreen (free, no key needed, CORS proxy may be required)
2. `census.ts` — Census ACS API (free, key recommended)
3. `echo.ts` — EPA ECHO (free, no key needed)
4. `noaa.ts` — NOAA Weather API (free, no key needed)
5. `nasa.ts` — NASA Earth Imagery (free, key required → `VITE_NASA_API_KEY`)
6. `cejst.ts` — Justice40 CEJST (free, no key needed)
7. `grants.ts` — Grants.gov (free, no key needed)
8. `usgs.ts` — USGS (free, no key needed)
9. `archives.ts` — Library of Congress (free, no key needed)
10. `wri.ts` — WRI datasets (free, varies)
11. `nrdc.ts` — NRDC Carto (free, varies)

**Mapbox** is already wired via `VITE_MAPBOX_TOKEN` — just ensure the env var is set in Supabase/Lovable secrets.

---

## Phase 6: PDF Export

`src/lib/reports/generatePdf.ts` uses jspdf. Verify it works with real Supabase data (not just mock). The "Download Brief" button on PlaceDetail must generate a real PDF with current data.

---

## Completion Checklist

**The app is NOT done until ALL of these pass:**

### Auth
- [ ] Sign up creates account + profile row
- [ ] Login persists across refresh
- [ ] Logout clears session
- [ ] Protected routes redirect to login
- [ ] Role-based permissions work (steward sees edit buttons, observer doesn't)

### Data Persistence (test EACH entity)
- [ ] Create entity via form → appears in list immediately
- [ ] Refresh page → entity still there (Supabase, not localStorage)
- [ ] Edit entity → changes persist after refresh
- [ ] Delete entity → gone after refresh
- [ ] Relationships work: stakeholder linked to place shows on PlaceDetail sidebar

### Pages (test EACH page loads with data)
- [ ] /app (Home dashboard) — shows real signals, commitments, activity
- [ ] /app/places — lists all places with map thumbnails
- [ ] /app/places/:id — full detail with map, burdens, stakeholders, commitments, notes, signals
- [ ] /app/people — stakeholder directory with filters
- [ ] /app/people/:id — profile with linked data
- [ ] /app/commitments — filterable list with status badges
- [ ] /app/field-notes — feed with tags and place links
- [ ] /app/signals — feed with source badges and read/unread
- [ ] /app/journeys — journey cards
- [ ] /app/journeys/:id — chapter timeline with linked artifacts
- [ ] /app/library — category grid
- [ ] /app/reports — report list with PDF download
- [ ] /app/community-stories — consent-filtered story cards
- [ ] /app/compass — compass walk view
- [ ] /app/journal — personal journal entries
- [ ] /app/coalition — network visualization
- [ ] /app/settings — user settings with role display
- [ ] /app/seasons — seasonal calendar view
- [ ] /app/graph — stakeholder relationship graph
- [ ] Global search (Cmd+K) returns results from Supabase

### Map
- [ ] Mapbox renders with custom styles (Classic default)
- [ ] Poverty dot-density layer shows real census data
- [ ] Burden heatmap renders from place environmental_burdens
- [ ] Layer control panel toggles all 5 layers
- [ ] Environmental Burden Index gradient bar visible

### Forms (test EACH form submits successfully)
- [ ] CreatePlaceForm → row in places table
- [ ] CreateStakeholderForm → row in stakeholders + junction rows
- [ ] CreateOrganizationForm → row in organizations + junction rows
- [ ] CreateCommitmentForm → row in commitments + junction rows
- [ ] CreateFieldNoteForm → row in field_notes with author_id
- [ ] CreateSignalForm → row in signals + junction rows
- [ ] CreateJourneyForm → row in journeys + junction rows
- [ ] CreateCommunityStoryForm → row in community_stories with collected_by
- [ ] EditCommitmentStatusForm → updates commitment status
- [ ] EditHumanImpactForm → updates place human_impact fields
- [ ] AddBurdenForm → appends to place environmental_burdens JSONB
- [ ] AddActiveWorkForm → appends to place active_work JSONB

### Integration
- [ ] Comments work on places, commitments, and other entities
- [ ] NRI chat messages persist per user
- [ ] Email suggestions inbox renders on Home
- [ ] PDF export generates with real data
- [ ] Marketing site (/) still works alongside app (/app/*)

### Environment Variables (set these LAST)
- [ ] `VITE_SUPABASE_URL` — Supabase project URL
- [ ] `VITE_SUPABASE_ANON_KEY` — Supabase anon key
- [ ] `VITE_MAPBOX_TOKEN` — Mapbox GL JS token
- [ ] `VITE_NASA_API_KEY` — NASA Earth Imagery API key

---

## File Reference

| What | Where |
|------|-------|
| All types | `src/types/transitus.ts` (484 lines) |
| Data context (replace internals) | `src/contexts/TransitusDataContext.tsx` (424 lines) |
| Mock data (seed Supabase) | `src/lib/mockData.ts` |
| API stubs (wire last) | `src/lib/api/*.ts` (12 files) |
| Forms | `src/components/forms/*.tsx` (12 files) |
| Router | `src/components/routing/AppRouter.tsx` |
| App layout | `src/components/layout/TransitusLayout.tsx` |
| Map (Mapbox) | `src/components/map/MapboxPlaceMap.tsx` |
| Map (SVG fallback) | `src/components/map/PlaceMap.tsx` |
| Comments | `src/components/comments/CommentThread.tsx` |
| Search | Global search in TransitusDataContext.searchAll() |
| PDF export | `src/lib/reports/generatePdf.ts` |
| Brand config | `src/config/brand.ts` |
| Transition calendar | `src/lib/transitionCalendar.ts` |
| Slugify + lookup | `src/lib/slugify.ts` |

---

## Anti-Patterns to Avoid

1. **DO NOT** declare a feature done because the page renders without errors
2. **DO NOT** leave `// TODO: wire to Supabase` comments — wire it now
3. **DO NOT** skip junction table writes when creating entities with relationships
4. **DO NOT** use localStorage as a fallback — remove all localStorage persistence for data
5. **DO NOT** hardcode mock data in components — all data comes from Supabase queries
6. **DO NOT** skip RLS policies — every table must have them enabled
7. **DO NOT** create placeholder/skeleton auth — it must actually authenticate
8. **DO NOT** skip seed data — the app must have demo data on first load
9. **DO NOT** wire API keys before CRUD works — APIs are Phase 5, CRUD is Phase 3
10. **DO NOT** skip the completion checklist — every checkbox must be manually verified
