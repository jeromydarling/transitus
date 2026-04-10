/**
 * Transitus Home — "Today in your places"
 *
 * A calm editorial front page for the Just Transition stewardship platform.
 * Surfaces what matters without the noise of a KPI dashboard.
 */

import { Link } from 'react-router-dom';
import {
  Radio,
  Handshake,
  NotebookPen,
  Users,
  MapPin,
  ChevronRight,
  Clock,
  Heart,
  Compass,
  Sparkles,
} from 'lucide-react';

import { MOCK_DASHBOARD } from '@/lib/mockData';
import { useTransitusData } from '@/contexts/TransitusDataContext';
import PersonAvatar from '@/components/ui/PersonAvatar';
import ActivitySparkline from '@/components/charts/ActivitySparkline';
import { getCurrentSeason, getDayMoment, getWeekRhythm, getNearbyMilestones } from '@/lib/transitionCalendar';

import {
  ROLE_LABELS,
  COMMITMENT_STATUS_LABELS,
  SIGNAL_SOURCE_LABELS,
} from '@/types/transitus';
import type {
  Signal,
  Commitment,
  FieldNote,
  Stakeholder,
  CommunityStory,
  CommitmentStatus,
  FieldNoteType,
} from '@/types/transitus';

// ── Local helpers ──

const FIELD_NOTE_TYPE_LABELS: Record<FieldNoteType, string> = {
  site_visit: 'Site Visit',
  listening_session: 'Listening Session',
  community_meeting: 'Community Meeting',
  prayer_vigil: 'Prayer Vigil',
  utility_meeting: 'Utility Meeting',
  household_interview: 'Household Interview',
  corridor_observation: 'Corridor Observation',
  quick_note: 'Quick Note',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysAgo(iso: string): number {
  const now = new Date();
  const then = new Date(iso);
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
}

/** Severity dot color */
function severityColor(severity?: Signal['severity']): string {
  switch (severity) {
    case 'urgent':
      return 'bg-[hsl(0_72%_51%)]';
    case 'notable':
      return 'bg-[hsl(36_77%_49%)]';
    default:
      return 'bg-[hsl(210_10%_58%)]';
  }
}

/** Commitment status badge styling */
function statusBadgeClasses(status: CommitmentStatus): string {
  const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  switch (status) {
    case 'proposed':
      return `${base} bg-[hsl(205_70%_93%)] text-[hsl(205_70%_35%)]`;
    case 'acknowledged':
      return `${base} bg-[hsl(220_40%_92%)] text-[hsl(220_40%_40%)]`;
    case 'accepted':
      return `${base} bg-[hsl(180_40%_90%)] text-[hsl(180_40%_32%)]`;
    case 'in_motion':
      return `${base} bg-[hsl(152_50%_90%)] text-[hsl(152_50%_28%)]`;
    case 'delayed':
      return `${base} bg-[hsl(16_65%_92%)] text-[hsl(16_65%_38%)]`;
    case 'breached':
      return `${base} bg-[hsl(0_60%_92%)] text-[hsl(0_60%_38%)]`;
    case 'repaired':
      return `${base} bg-[hsl(270_40%_92%)] text-[hsl(270_40%_38%)]`;
    case 'completed':
      return `${base} bg-[hsl(160_30%_90%)] text-[hsl(160_30%_32%)]`;
    default:
      return `${base} bg-gray-100 text-gray-600`;
  }
}

// ── Components ──

function SectionHeader({
  icon: Icon,
  label,
  linkTo,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  linkTo?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[hsl(16_65%_48%)]" />
        <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
          {label}
        </span>
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="flex items-center gap-1 text-xs text-[hsl(16_65%_48%)] hover:text-[hsl(16_65%_38%)] transition-colors"
        >
          View all <ChevronRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}

function SignalCard({ signal, placeNameById }: { signal: Signal; placeNameById: (id: string) => string }) {
  return (
    <Link
      to="/app/signals"
      className="rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)] hover:shadow-md transition-shadow block"
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${severityColor(signal.severity)}`}
          title={signal.severity ?? 'informational'}
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[hsl(20_10%_20%)] leading-snug">
            {signal.title}
          </p>
          <p className="mt-1 text-xs text-[hsl(20_8%_48%)] line-clamp-2">
            {signal.summary}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[hsl(30_20%_92%)] px-2 py-0.5 text-[10px] font-medium text-[hsl(20_10%_40%)]">
              {SIGNAL_SOURCE_LABELS[signal.source]}
            </span>
            {signal.place_ids.slice(0, 2).map((pid) => (
              <span
                key={pid}
                className="inline-flex items-center gap-1 text-[10px] text-[hsl(20_8%_52%)]"
              >
                <MapPin className="h-2.5 w-2.5" />
                {placeNameById(pid).length > 28
                  ? placeNameById(pid).slice(0, 28) + '\u2026'
                  : placeNameById(pid)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

function CommitmentRow({ commitment, placeNameById }: { commitment: Commitment; placeNameById: (id: string) => string }) {
  return (
    <Link
      to="/app/commitments"
      className="flex items-center justify-between gap-4 rounded-lg bg-white px-4 py-3 border border-[hsl(30_18%_82%)] hover:shadow-md transition-shadow"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[hsl(20_10%_20%)] truncate">
          {commitment.title}
        </p>
        <div className="mt-1 flex items-center gap-2 text-xs text-[hsl(20_8%_48%)]">
          {commitment.place_ids.slice(0, 1).map((pid) => (
            <span key={pid} className="flex items-center gap-1">
              <MapPin className="h-2.5 w-2.5" />
              {placeNameById(pid).length > 32
                ? placeNameById(pid).slice(0, 32) + '\u2026'
                : placeNameById(pid)}
            </span>
          ))}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {commitment.renewal_date && (
          <span className="flex items-center gap-1 text-xs text-[hsl(20_8%_48%)]">
            <Clock className="h-3 w-3" />
            {formatDate(commitment.renewal_date)}
          </span>
        )}
        <span className={statusBadgeClasses(commitment.status)}>
          {COMMITMENT_STATUS_LABELS[commitment.status]}
        </span>
      </div>
    </Link>
  );
}

function FieldNoteCard({ note, authorName, placeNameById }: { note: FieldNote; authorName: string; placeNameById: (id: string) => string }) {
  return (
    <Link
      to="/app/field-notes"
      className="rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)] hover:shadow-md transition-shadow block"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center rounded-full bg-[hsl(30_20%_92%)] px-2 py-0.5 text-[10px] font-medium text-[hsl(20_10%_40%)]">
          {FIELD_NOTE_TYPE_LABELS[note.note_type]}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-[hsl(20_8%_52%)]">
          <MapPin className="h-2.5 w-2.5" />
          {placeNameById(note.place_id).length > 30
            ? placeNameById(note.place_id).slice(0, 30) + '\u2026'
            : placeNameById(note.place_id)}
        </span>
      </div>
      <p className="text-sm text-[hsl(20_10%_25%)] line-clamp-3 leading-relaxed">
        {note.content}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs font-medium text-[hsl(20_10%_35%)]">
          {authorName}
        </span>
        <span className="text-[10px] text-[hsl(20_8%_52%)]">
          {formatDate(note.created_at)}
        </span>
      </div>
    </Link>
  );
}

function QuietStakeholderRow({ stakeholder }: { stakeholder: Stakeholder }) {
  const days = stakeholder.last_contact ? daysAgo(stakeholder.last_contact) : null;
  return (
    <Link
      to="/app/people"
      className="flex items-center justify-between gap-3 rounded-lg bg-white px-4 py-3 border border-[hsl(30_18%_82%)] hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3 min-w-0">
        <PersonAvatar name={stakeholder.name} size={28} />
        <div className="min-w-0">
          <p className="text-sm font-medium text-[hsl(20_10%_20%)]">{stakeholder.name}</p>
          <p className="text-xs text-[hsl(20_8%_48%)]">
            {ROLE_LABELS[stakeholder.role]}
            {stakeholder.title ? ` \u00b7 ${stakeholder.title}` : ''}
          </p>
        </div>
      </div>
      <div className="shrink-0 text-right">
        {days !== null && (
          <span className="flex items-center gap-1 text-xs text-[hsl(16_50%_48%)]">
            <Heart className="h-3 w-3" />
            {days}d ago
          </span>
        )}
      </div>
    </Link>
  );
}

// ── Main page ──

export default function Home() {
  const { places, signals, commitments, fieldNotes, stakeholders, visibleStories, isSignalRead } = useTransitusData();
  const { weekly_brief } = MOCK_DASHBOARD;

  const season = getCurrentSeason();
  const moment = getDayMoment();
  const rhythm = getWeekRhythm();
  const milestones = getNearbyMilestones();

  const placeNameById = (id: string): string => {
    const place = places.find((p) => p.id === id);
    return place ? place.name : id;
  };

  const stakeholderById = (id: string): Stakeholder | undefined => {
    return stakeholders.find((s) => s.id === id);
  };

  // Derived dashboard data from live context
  const recent_signals = signals.filter(s => !isSignalRead(s.id)).slice(0, 4);
  const upcoming_renewals = commitments.filter(c => c.renewal_date);
  const recent_field_notes = fieldNotes.slice(0, 3);
  const quiet_stakeholders = stakeholders.filter(s => s.last_contact && s.last_contact < '2026-02-01');
  const active_commitments = commitments.filter(c => c.status !== 'completed').length;

  // Generate deterministic-ish sparkline data per place (seeded by place index)
  const makeSparkData = (seed: number) =>
    Array.from({ length: 7 }, (_, i) => ({
      day: `Day ${i + 1}`,
      count: ((seed * 7 + i * 3 + 1) % 5) + 1,
    }));

  return (
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ── Welcome header (seasonal + time-of-day aware) ── */}
        <header className="mb-8">
          <div className="mb-8">
            <h1 className="font-serif text-2xl text-[hsl(20_25%_12%)]">
              {moment.greeting} <span className="text-[hsl(20_25%_12%/0.5)]">{season.label}.</span>
            </h1>
            <p className="font-serif-body text-sm text-[hsl(20_25%_12%/0.55)] mt-1 italic">
              {moment.prompt}
            </p>
            {rhythm.compassDirection && (
              <p className="text-xs text-[hsl(16_65%_48%)] mt-2">
                {rhythm.day.charAt(0).toUpperCase() + rhythm.day.slice(1)} focus: {rhythm.focus}
              </p>
            )}
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-[hsl(20_8%_40%)]">
            {weekly_brief}
          </p>
        </header>

        {/* ── Nearby Milestones ── */}
        {milestones.length > 0 && milestones.map(m => (
          <div key={m.date} className="rounded-lg bg-[hsl(38_80%_55%/0.08)] border border-[hsl(38_80%_55%/0.2)] p-3 mb-4">
            <p className="text-xs font-semibold text-[hsl(38_70%_40%)]">{m.name}</p>
            <p className="text-xs text-[hsl(20_25%_12%/0.55)]">{m.relevance}</p>
          </div>
        ))}

        {/* ── Compass This Week mini-widget ── */}
        <Link
          to="/app/compass"
          className="mb-10 flex items-center gap-3 rounded-lg bg-white border border-[hsl(30_18%_82%)] p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(16_65%_48%/0.1)]">
            <Compass className="h-5 w-5 text-[hsl(16_65%_48%)]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[hsl(20_10%_20%)]">Compass This Week</p>
            <p className="text-xs text-[hsl(20_8%_48%)]">
              {season.weeklyFocus}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-[hsl(20_8%_52%)]" />
        </Link>

        {/* ── Quick stats (small, editorial, not KPI tiles) ── */}
        <div className="mb-10 flex gap-4">
          <div className="flex items-center gap-2 rounded-md border border-[hsl(30_18%_82%)] bg-white px-3 py-2">
            <MapPin className="h-3.5 w-3.5 text-[hsl(20_8%_48%)]" />
            <span className="text-xs text-[hsl(20_8%_48%)]">
              <span className="font-semibold text-[hsl(20_10%_20%)]">{places.length}</span>{' '}
              places
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-[hsl(30_18%_82%)] bg-white px-3 py-2">
            <Handshake className="h-3.5 w-3.5 text-[hsl(20_8%_48%)]" />
            <span className="text-xs text-[hsl(20_8%_48%)]">
              <span className="font-semibold text-[hsl(20_10%_20%)]">{active_commitments}</span>{' '}
              active commitments
            </span>
          </div>
        </div>

        {/* ── Place Activity (sparklines) ── */}
        <section className="mb-10">
          <SectionHeader icon={MapPin} label="Place Activity This Week" linkTo="/app/places" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {places.slice(0, 6).map((place, idx) => (
              <Link
                key={place.id}
                to={`/app/places/${place.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)] hover:shadow-md transition-shadow block"
              >
                <p className="text-sm font-medium text-[hsl(20_10%_20%)] truncate mb-1">
                  {place.name}
                </p>
                <p className="text-[10px] text-[hsl(20_8%_52%)] mb-2">
                  {place.geography}
                </p>
                <ActivitySparkline
                  data={makeSparkData(idx)}
                  color="hsl(16, 65%, 48%)"
                />
                <p className="text-[10px] text-[hsl(20_8%_52%)] mt-1">
                  Field notes · past 7 days
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Community Voices ── */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-4 w-4 text-[hsl(16_65%_48%)]" />
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">Community Voices</span>
          </div>
          {/* Show 2 most recent stories with public consent */}
          {visibleStories.filter(s => s.consent_level === "public").slice(0, 2).map(story => (
            <div key={story.id} className="mb-4 rounded-lg bg-white border border-[hsl(30_18%_82%)] p-5">
              <blockquote className="font-serif-body text-base italic text-[hsl(20_25%_12%/0.8)] leading-relaxed border-l-[3px] border-[hsl(16_65%_48%/0.4)] pl-4 mb-3">
                "{story.quote}"
              </blockquote>
              <div className="flex items-center gap-2 text-xs text-[hsl(20_25%_12%/0.55)]">
                <PersonAvatar name={story.person_name} size={32} />
                <p>
                  <span className="font-medium text-[hsl(20_25%_12%)]">{story.person_name}</span> — {story.location_detail}
                  {story.years_in_community && ` · ${story.years_in_community} years in community`}
                </p>
              </div>
            </div>
          ))}
          <Link to="/app/community-stories" className="text-xs text-[hsl(16_65%_48%)] hover:underline flex items-center gap-1">
            All community stories <ChevronRight className="h-3 w-3" />
          </Link>
        </section>

        {/* ── New Signals ── */}
        <section className="mb-10">
          <SectionHeader icon={Radio} label="New Signals" linkTo="/app/signals" />
          <div className="grid gap-3 sm:grid-cols-2">
            {recent_signals.map((signal) => (
              <SignalCard key={signal.id} signal={signal} placeNameById={placeNameById} />
            ))}
          </div>
          {recent_signals.length === 0 && (
            <p className="text-sm text-[hsl(20_8%_52%)] italic">No unread signals right now.</p>
          )}
        </section>

        {/* ── Commitments approaching review ── */}
        <section className="mb-10">
          <SectionHeader
            icon={Handshake}
            label="Commitments approaching review"
            linkTo="/app/commitments"
          />
          <div className="flex flex-col gap-2">
            {upcoming_renewals.map((commitment) => (
              <CommitmentRow key={commitment.id} commitment={commitment} placeNameById={placeNameById} />
            ))}
          </div>
          {upcoming_renewals.length === 0 && (
            <p className="text-sm text-[hsl(20_8%_52%)] italic">
              No commitments approaching review.
            </p>
          )}
        </section>

        {/* ── Recent Field Notes ── */}
        <section className="mb-10">
          <SectionHeader icon={NotebookPen} label="Recent Field Notes" linkTo="/app/field-notes" />
          <div className="grid gap-3 sm:grid-cols-3">
            {recent_field_notes.slice(0, 3).map((note) => (
              <FieldNoteCard key={note.id} note={note} authorName={stakeholderById(note.author_id)?.name ?? 'Unknown'} placeNameById={placeNameById} />
            ))}
          </div>
          {recent_field_notes.length === 0 && (
            <p className="text-sm text-[hsl(20_8%_52%)] italic">No recent field notes.</p>
          )}
        </section>

        {/* ── Relationships waiting for reconnection ── */}
        <section className="mb-10">
          <SectionHeader icon={Heart} label="Relationships waiting for reconnection" linkTo="/app/people" />
          <p className="text-xs text-[hsl(20_8%_48%)] italic -mt-2 mb-3">
            A brief, warm check-in might deepen trust here.
          </p>
          <div className="flex flex-col gap-2">
            {quiet_stakeholders.map((s) => (
              <QuietStakeholderRow key={s.id} stakeholder={s} />
            ))}
          </div>
          {quiet_stakeholders.length === 0 && (
            <p className="text-sm text-[hsl(20_8%_52%)] italic">
              Everyone has been in touch recently.
            </p>
          )}
        </section>

        {/* ── Signs of Life (Consolation Signals) ── */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[hsl(152_45%_28%)]" />
              <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(152_45%_28%)]">
                Signs of Life
              </span>
            </div>
          </div>
          <div className="space-y-2">
            {/* Commitments being honored */}
            {commitments.filter(c => c.status === 'in_motion').slice(0, 2).map(c => (
              <Link
                key={c.id}
                to="/app/commitments"
                className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 border border-[hsl(30_18%_82%)] hover:shadow-md transition-shadow"
              >
                <Handshake className="h-4 w-4 shrink-0 text-[hsl(152_45%_28%)]" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[hsl(20_10%_20%)] truncate">{c.title}</p>
                  <p className="text-xs text-[hsl(152_45%_28%)]">Being honored</p>
                </div>
              </Link>
            ))}
            {/* Deep or established trust stakeholders */}
            {stakeholders.filter(s => s.trust_level === 'deep' || s.trust_level === 'established').slice(0, 2).map(s => (
              <Link
                key={s.id}
                to="/app/people"
                className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 border border-[hsl(30_18%_82%)] hover:shadow-md transition-shadow"
              >
                <Users className="h-4 w-4 shrink-0 text-[hsl(152_45%_28%)]" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[hsl(20_10%_20%)]">{s.name}</p>
                  <p className="text-xs text-[hsl(152_45%_28%)]">Trust: {s.trust_level}</p>
                </div>
              </Link>
            ))}
            {/* Recent community stories */}
            {visibleStories.filter(cs => cs.consent_level === 'public').slice(0, 1).map(cs => (
              <Link
                key={cs.id}
                to="/app/community-stories"
                className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 border border-[hsl(30_18%_82%)] hover:shadow-md transition-shadow"
              >
                <Heart className="h-4 w-4 shrink-0 text-[hsl(152_45%_28%)]" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[hsl(20_10%_20%)]">{cs.person_name}</p>
                  <p className="text-xs text-[hsl(152_45%_28%)]">Community story shared</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
