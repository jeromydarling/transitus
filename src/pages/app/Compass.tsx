/**
 * Compass Walk — The Weekly Compass Walk page.
 *
 * Guides stewards through four directions with live data:
 *   North = Place Intelligence
 *   East  = Transition Progress
 *   South = Community Presence
 *   West  = Stewardship & Repair
 *
 * The single highest-impact Ignatian feature in the app.
 */

import { Link } from 'react-router-dom';
import {
  Compass as CompassIcon,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  Radio,
  Handshake,
  Users,
  NotebookPen,
  ChevronRight,
  Clock,
  AlertTriangle,
  MapPin,
  CalendarDays,
  Sparkles,
} from 'lucide-react';
import { useTransitusData } from '@/contexts/TransitusDataContext';
import { getCurrentSeason, getDayMoment, getWeekRhythm, getNearbyMilestones } from '@/lib/transitionCalendar';
import type { WeekDay } from '@/lib/transitionCalendar';

// ── Helpers ──

function daysAgo(iso: string): number {
  const now = new Date();
  const then = new Date(iso);
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Journal persistence (mirrors Journal.tsx) ──

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  place_id?: string;
  mood?: string;
}

function loadJournalEntries(): JournalEntry[] {
  try {
    const raw = localStorage.getItem('transitus_journal_entries');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ── Day rhythm data ──

const WEEK_DAYS: { key: WeekDay; short: string }[] = [
  { key: 'monday', short: 'Mon' },
  { key: 'tuesday', short: 'Tue' },
  { key: 'wednesday', short: 'Wed' },
  { key: 'thursday', short: 'Thu' },
  { key: 'friday', short: 'Fri' },
  { key: 'saturday', short: 'Sat' },
  { key: 'sunday', short: 'Sun' },
];

const DAY_FOCUS: Record<WeekDay, string> = {
  monday: 'Compass Walk',
  tuesday: 'Commitments',
  wednesday: 'Field Work',
  thursday: 'Coalition & Signals',
  friday: 'Weekly Reflection',
  saturday: 'Rest',
  sunday: 'Rest & Renewal',
};

// ── Directional colors ──

const DIR_COLORS = {
  north: 'hsl(198 55% 42%)',   // ocean
  east: 'hsl(16 65% 48%)',     // terracotta
  south: 'hsl(152 45% 28%)',   // forest
  west: 'hsl(38 80% 55%)',     // amber
} as const;

const DIR_BG = {
  north: 'hsl(198 55% 42% / 0.06)',
  east: 'hsl(16 65% 48% / 0.06)',
  south: 'hsl(152 45% 28% / 0.06)',
  west: 'hsl(38 80% 55% / 0.06)',
} as const;

// ── Main Page ──

export default function Compass() {
  const { signals, commitments, stakeholders, fieldNotes, communityStories, isSignalRead } = useTransitusData();

  const season = getCurrentSeason();
  const moment = getDayMoment();
  const rhythm = getWeekRhythm();
  const milestones = getNearbyMilestones();

  // NORTH — Place Intelligence
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weekSignals = signals.filter(s => new Date(s.created_at) >= oneWeekAgo);
  const unreadSignals = signals.filter(s => !isSignalRead(s.id));
  const topSignals = unreadSignals.slice(0, 2);

  // EAST — Transition Progress
  const inMotion = commitments.filter(c => c.status === 'in_motion');
  const delayed = commitments.filter(c => c.status === 'delayed');
  const approachingRenewal = commitments.filter(c => {
    if (!c.renewal_date) return false;
    const d = daysAgo(c.renewal_date);
    return d >= -30 && d <= 0; // within 30 days
  });

  // SOUTH — Community Presence
  const quietStakeholders = stakeholders.filter(s => {
    if (!s.last_contact) return true;
    return daysAgo(s.last_contact) > 30;
  });
  const recentFieldNotes = fieldNotes.filter(f => new Date(f.created_at) >= oneWeekAgo);
  const recentStories = communityStories.filter(s => {
    const collected = new Date(s.collected_at);
    return collected >= oneWeekAgo;
  });

  // WEST — Stewardship & Repair
  const breached = commitments.filter(c => c.status === 'breached');
  const journalEntries = loadJournalEntries();
  const weekJournalEntries = journalEntries.filter(e => {
    const d = new Date(e.date);
    return d >= oneWeekAgo;
  });
  const heavyEntries = weekJournalEntries.filter(
    e => e.mood === 'heavy' || e.mood === 'uncertain',
  );

  return (
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <CompassIcon className="h-5 w-5 text-[hsl(16_65%_48%)]" />
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
              Compass Walk
            </span>
            <span
              className="ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ backgroundColor: `${season.color} / 0.12)`.replace('hsl(', 'hsl(').replace(')', ' / 0.12)'), color: season.color }}
            >
              {season.label}
            </span>
          </div>
          <h1 className="font-serif text-2xl font-normal text-[hsl(20_10%_18%)] sm:text-3xl">
            {moment.greeting}{' '}
            <span className="text-[hsl(20_25%_12%/0.5)]">{season.posture}.</span>
          </h1>
          <p className="mt-2 text-sm text-[hsl(20_8%_40%)] leading-relaxed max-w-xl">
            {rhythm.day.charAt(0).toUpperCase() + rhythm.day.slice(1)}: {rhythm.focus}
          </p>
        </header>

        {/* ── Season Banner ── */}
        <div
          className="mb-8 rounded-xl border p-5"
          style={{
            backgroundColor: season.color.replace(')', ' / 0.05)').replace('hsl(', 'hsl('),
            borderColor: season.color.replace(')', ' / 0.15)').replace('hsl(', 'hsl('),
          }}
        >
          <p className="text-sm font-medium mb-1" style={{ color: season.color }}>
            {season.label} — {season.posture}
          </p>
          <p className="text-xs text-[hsl(20_25%_12%/0.65)] leading-relaxed">
            {season.description}
          </p>
          <p className="text-xs text-[hsl(20_25%_12%/0.5)] italic mt-2">
            {season.journalPrompt}
          </p>
        </div>

        {/* ── Four Quadrants ── */}
        <div className="grid gap-4 sm:grid-cols-2 mb-8">

          {/* NORTH — Place Intelligence */}
          <div className="rounded-lg bg-white border border-[hsl(30_18%_82%)] p-5" style={{ borderLeftWidth: 4, borderLeftColor: DIR_COLORS.north }}>
            <div className="flex items-center gap-2 mb-3">
              <ArrowUp className="h-4 w-4" style={{ color: DIR_COLORS.north }} />
              <span className="font-sans text-xs font-semibold uppercase tracking-widest" style={{ color: DIR_COLORS.north }}>
                North — Place Intelligence
              </span>
            </div>
            <p className="text-xs italic text-[hsl(20_25%_12%/0.5)] mb-3">
              What's shifting in your places?
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-[hsl(20_25%_12%)]">
                <Radio className="h-3.5 w-3.5 text-[hsl(20_8%_48%)]" />
                <span><span className="font-semibold">{weekSignals.length}</span> new signals this week</span>
              </div>
              {topSignals.map(s => (
                <div key={s.id} className="ml-5 text-xs text-[hsl(20_8%_48%)] leading-relaxed">
                  {s.title}
                </div>
              ))}
              {topSignals.length === 0 && (
                <p className="ml-5 text-xs text-[hsl(20_8%_52%)] italic">No unread signals.</p>
              )}
            </div>

            <Link
              to="/app/signals"
              className="flex items-center gap-1 text-xs font-medium hover:underline"
              style={{ color: DIR_COLORS.north }}
            >
              View signals <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {/* EAST — Transition Progress */}
          <div className="rounded-lg bg-white border border-[hsl(30_18%_82%)] p-5" style={{ borderLeftWidth: 4, borderLeftColor: DIR_COLORS.east }}>
            <div className="flex items-center gap-2 mb-3">
              <ArrowRight className="h-4 w-4" style={{ color: DIR_COLORS.east }} />
              <span className="font-sans text-xs font-semibold uppercase tracking-widest" style={{ color: DIR_COLORS.east }}>
                East — Transition Progress
              </span>
            </div>
            <p className="text-xs italic text-[hsl(20_25%_12%/0.5)] mb-3">
              Are commitments advancing?
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-[hsl(20_25%_12%)]">
                <Handshake className="h-3.5 w-3.5 text-[hsl(20_8%_48%)]" />
                <span><span className="font-semibold">{inMotion.length}</span> being honored</span>
              </div>
              {delayed.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-[hsl(16_50%_48%)]">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span><span className="font-semibold">{delayed.length}</span> conversation needed</span>
                </div>
              )}
              {approachingRenewal.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-[hsl(20_25%_12%)]">
                  <Clock className="h-3.5 w-3.5 text-[hsl(20_8%_48%)]" />
                  <span><span className="font-semibold">{approachingRenewal.length}</span> approaching renewal</span>
                </div>
              )}
            </div>

            <Link
              to="/app/commitments"
              className="flex items-center gap-1 text-xs font-medium hover:underline"
              style={{ color: DIR_COLORS.east }}
            >
              View commitments <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {/* SOUTH — Community Presence */}
          <div className="rounded-lg bg-white border border-[hsl(30_18%_82%)] p-5" style={{ borderLeftWidth: 4, borderLeftColor: DIR_COLORS.south }}>
            <div className="flex items-center gap-2 mb-3">
              <ArrowDown className="h-4 w-4" style={{ color: DIR_COLORS.south }} />
              <span className="font-sans text-xs font-semibold uppercase tracking-widest" style={{ color: DIR_COLORS.south }}>
                South — Community Presence
              </span>
            </div>
            <p className="text-xs italic text-[hsl(20_25%_12%/0.5)] mb-3">
              Who needs attention?
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-[hsl(20_25%_12%)]">
                <Users className="h-3.5 w-3.5 text-[hsl(20_8%_48%)]" />
                <span><span className="font-semibold">{quietStakeholders.length}</span> waiting for reconnection</span>
              </div>
              {recentStories.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-[hsl(20_25%_12%)]">
                  <Sparkles className="h-3.5 w-3.5 text-[hsl(20_8%_48%)]" />
                  <span><span className="font-semibold">{recentStories.length}</span> new community stories</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-[hsl(20_25%_12%)]">
                <NotebookPen className="h-3.5 w-3.5 text-[hsl(20_8%_48%)]" />
                <span><span className="font-semibold">{recentFieldNotes.length}</span> field notes this week</span>
              </div>
            </div>

            <Link
              to="/app/people"
              className="flex items-center gap-1 text-xs font-medium hover:underline"
              style={{ color: DIR_COLORS.south }}
            >
              View people <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {/* WEST — Stewardship & Repair */}
          <div className="rounded-lg bg-white border border-[hsl(30_18%_82%)] p-5" style={{ borderLeftWidth: 4, borderLeftColor: DIR_COLORS.west }}>
            <div className="flex items-center gap-2 mb-3">
              <ArrowLeft className="h-4 w-4" style={{ color: DIR_COLORS.west }} />
              <span className="font-sans text-xs font-semibold uppercase tracking-widest" style={{ color: DIR_COLORS.west }}>
                West — Stewardship & Repair
              </span>
            </div>
            <p className="text-xs italic text-[hsl(20_25%_12%/0.5)] mb-3">
              What needs mending or rest?
            </p>

            <div className="space-y-2 mb-4">
              {breached.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-[hsl(0_50%_45%)]">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span><span className="font-semibold">{breached.length}</span> repair ready</span>
                </div>
              )}
              {delayed.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-[hsl(16_50%_48%)]">
                  <Clock className="h-3.5 w-3.5" />
                  <span><span className="font-semibold">{delayed.length}</span> conversation needed</span>
                </div>
              )}
              {heavyEntries.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-[hsl(20_25%_12%)]">
                  <NotebookPen className="h-3.5 w-3.5 text-[hsl(20_8%_48%)]" />
                  <span><span className="font-semibold">{heavyEntries.length}</span> journal entries carrying weight</span>
                </div>
              )}
              {breached.length === 0 && delayed.length === 0 && heavyEntries.length === 0 && (
                <p className="text-sm text-[hsl(20_8%_52%)] italic">Nothing urgent needs mending right now.</p>
              )}
              <p className="text-xs text-[hsl(20_25%_12%/0.5)] italic mt-2">
                How is your team's capacity this week?
              </p>
            </div>

            <Link
              to="/app/journal"
              className="flex items-center gap-1 text-xs font-medium hover:underline"
              style={{ color: DIR_COLORS.west }}
            >
              Open journal <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* ── Weekly Rhythm Bar ── */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="h-4 w-4 text-[hsl(16_65%_48%)]" />
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
              Weekly Rhythm
            </span>
          </div>
          <div className="rounded-lg bg-white border border-[hsl(30_18%_82%)] p-4">
            <div className="grid grid-cols-7 gap-1">
              {WEEK_DAYS.map(({ key, short }) => {
                const isToday = key === rhythm.day;
                return (
                  <div
                    key={key}
                    className={`flex flex-col items-center rounded-lg py-2.5 px-1 transition-colors ${
                      isToday
                        ? 'bg-[hsl(16_65%_48%/0.08)] ring-1 ring-[hsl(16_65%_48%/0.2)]'
                        : 'hover:bg-[hsl(38_30%_95%)]'
                    }`}
                  >
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider ${
                        isToday ? 'text-[hsl(16_65%_48%)]' : 'text-[hsl(20_25%_12%/0.4)]'
                      }`}
                    >
                      {short}
                    </span>
                    <span
                      className={`mt-1 text-[9px] leading-tight text-center ${
                        isToday ? 'text-[hsl(16_65%_48%)] font-medium' : 'text-[hsl(20_25%_12%/0.45)]'
                      }`}
                    >
                      {DAY_FOCUS[key]}
                    </span>
                    {isToday && (
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-[hsl(16_65%_48%)]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Nearby Milestones ── */}
        {milestones.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-[hsl(38_70%_40%)]" />
              <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(38_70%_40%)]">
                Nearby Milestones
              </span>
            </div>
            <div className="space-y-3">
              {milestones.map(m => (
                <div
                  key={m.date}
                  className="rounded-lg bg-[hsl(38_80%_55%/0.08)] border border-[hsl(38_80%_55%/0.2)] p-4"
                >
                  <p className="text-sm font-semibold text-[hsl(38_70%_40%)]">{m.name}</p>
                  <p className="text-xs text-[hsl(20_25%_12%/0.6)] mt-1">{m.description}</p>
                  <p className="text-xs text-[hsl(20_25%_12%/0.5)] italic mt-1.5">{m.relevance}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
