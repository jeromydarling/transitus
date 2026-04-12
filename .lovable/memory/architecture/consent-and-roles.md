# Consent Levels & Role-Based Access

## User Roles (app access level)
- **Steward**: Full CRUD on everything. Sees all consent levels.
- **Companion**: Can create entities. Limited edit. Sees up to `institutional`.
- **Observer**: Read-only. Sees only `public` stories.

## Community Story Consent Levels
Stories have a `consent_level` field controlling visibility:
- `local_only` — Only stewards see this
- `trusted_allies` — Stewards + companions
- `institutional` — Stewards + companions
- `public` — Everyone including observers

## Implementation
The `visibleStories` computed property in TransitusDataContext filters based on the current user's role. This MUST be enforced in the Supabase query layer, not just the UI.

## Permission Matrix (from USER_ROLE_CONFIG in types/transitus.ts)
| Permission | Steward | Companion | Observer |
|---|---|---|---|
| canCreate | yes | yes | no |
| canEditPlaces | yes | no | no |
| canChangeCommitmentStatus | yes | no | no |
| canManageTeam | yes | no | no |
| maxConsentVisible | all 4 | up to institutional | public only |
