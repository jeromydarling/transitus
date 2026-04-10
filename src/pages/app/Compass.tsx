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

        {/* ── Compass Cross Layout with SVG Rose ── */}
        <div className="relative mb-8">
          {/* SVG Compass Rose — background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="-20 -20 640 640" preserveAspectRatio="xMidYMid meet" style={{ opacity: 0.14 }}>
            {/* Rings */}
            <circle cx="300" cy="300" r="270" fill="none" stroke="hsl(20 25% 30%)" strokeWidth="1.2" />
            <circle cx="300" cy="300" r="210" fill="none" stroke="hsl(20 25% 30%)" strokeWidth="0.6" strokeDasharray="4 4" />
            <circle cx="300" cy="300" r="150" fill="none" stroke="hsl(20 25% 30%)" strokeWidth="0.5" strokeDasharray="2 4" />
            <circle cx="300" cy="300" r="80" fill="none" stroke="hsl(20 25% 30%)" strokeWidth="0.4" strokeDasharray="1 3" />
            {/* Cross lines */}
            <line x1="300" y1="15" x2="300" y2="585" stroke="hsl(20 25% 30%)" strokeWidth="0.8" />
            <line x1="15" y1="300" x2="585" y2="300" stroke="hsl(20 25% 30%)" strokeWidth="0.8" />
            {/* Diagonal tick marks */}
            <line x1="105" y1="105" x2="145" y2="145" stroke="hsl(20 25% 30%)" strokeWidth="0.6" />
            <line x1="495" y1="105" x2="455" y2="145" stroke="hsl(20 25% 30%)" strokeWidth="0.6" />
            <line x1="105" y1="495" x2="145" y2="455" stroke="hsl(20 25% 30%)" strokeWidth="0.6" />
            <line x1="495" y1="495" x2="455" y2="455" stroke="hsl(20 25% 30%)" strokeWidth="0.6" />
            {/* Degree tick marks on outer ring */}
            {Array.from({ length: 36 }, (_, i) => {
              const angle = (i * 10) * Math.PI / 180;
              const r1 = 264; const r2 = 276;
              return <line key={i} x1={300 + r1 * Math.sin(angle)} y1={300 - r1 * Math.cos(angle)} x2={300 + r2 * Math.sin(angle)} y2={300 - r2 * Math.cos(angle)} stroke="hsl(20 25% 30%)" strokeWidth={i % 9 === 0 ? "1.5" : "0.4"} />;
            })}
            {/* Cardinal arrows — larger, more visible */}
            {/* North arrow */}
            <polygon points="300,-8 288,22 300,14 312,22" fill="hsl(198 55% 42%)" opacity="0.9" />
            <line x1="300" y1="22" x2="300" y2="50" stroke="hsl(198 55% 42%)" strokeWidth="2" opacity="0.7" />
            {/* East arrow */}
            <polygon points="608,300 578,288 586,300 578,312" fill="hsl(16 65% 48%)" opacity="0.9" />
            <line x1="578" y1="300" x2="550" y2="300" stroke="hsl(16 65% 48%)" strokeWidth="2" opacity="0.7" />
            {/* South arrow */}
            <polygon points="300,608 288,578 300,586 312,578" fill="hsl(152 40% 28%)" opacity="0.9" />
            <line x1="300" y1="578" x2="300" y2="550" stroke="hsl(152 40% 28%)" strokeWidth="2" opacity="0.7" />
            {/* West arrow */}
            <polygon points="-8,300 22,288 14,300 22,312" fill="hsl(38 80% 55%)" opacity="0.9" />
            <line x1="22" y1="300" x2="50" y2="300" stroke="hsl(38 80% 55%)" strokeWidth="2" opacity="0.7" />
            {/* N E S W labels — larger */}
            <text x="300" y="70" textAnchor="middle" fontSize="16" fontWeight="800" fill="hsl(198 55% 42%)" fontFamily="Inter" letterSpacing="0.15em">N</text>
            <text x="535" y="306" textAnchor="middle" fontSize="16" fontWeight="800" fill="hsl(16 65% 48%)" fontFamily="Inter" letterSpacing="0.15em">E</text>
            <text x="300" y="545" textAnchor="middle" fontSize="16" fontWeight="800" fill="hsl(152 40% 28%)" fontFamily="Inter" letterSpacing="0.15em">S</text>
            <text x="65" y="306" textAnchor="middle" fontSize="16" fontWeight="800" fill="hsl(38 80% 55%)" fontFamily="Inter" letterSpacing="0.15em">W</text>
            {/* Center dot */}
            <circle cx="300" cy="300" r="4" fill="hsl(16 65% 48%)" opacity="0.5" />
            <circle cx="300" cy="300" r="1.5" fill="hsl(20 25% 30%)" />
          </svg>

          {/* Compass directions: stacked on mobile, cross on desktop */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {/* NORTH — spans both columns, centered */}
            <div className="md:col-span-2 md:max-w-md md:mx-auto w-full">
              <div className="relative rounded-xl bg-white/90 backdrop-blur-sm border border-[hsl(30_18%_82%)] p-5 overflow-hidden" style={{ borderTopWidth: 4, borderTopColor: DIR_COLORS.north }}>
                {/* Background arrow */}
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-20 w-12 pointer-events-none" viewBox="0 0 40 80" fill="none"><path d="M20 75 L20 5 M20 5 L8 20 M20 5 L32 20" stroke={DIR_COLORS.north} strokeWidth="2.5" strokeLinecap="round" opacity="0.08" /></svg>
                <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <ArrowUp className="h-4 w-4" style={{ color: DIR_COLORS.north }} />
                  <span className="font-sans text-xs font-semibold uppercase tracking-widest" style={{ color: DIR_COLORS.north }}>North — Place Intelligence</span>
                </div>
                <p className="text-xs italic text-[hsl(20_25%_12%/0.5)] mb-3">What's shifting in your places?</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-[hsl(20_25%_12%)]">
                    <Radio className="h-3.5 w-3.5 text-[hsl(20_8%_48%)]" />
                    <span><strong>{weekSignals.length}</strong> new signals this week</span>
                  </div>
                  {topSignals.map(s => (<div key={s.id} className="ml-5 text-xs text-[hsl(20_8%_48%)]">{s.title}</div>))}
                  {topSignals.length === 0 && <p className="ml-5 text-xs text-[hsl(20_8%_52%)] italic">No unread signals.</p>}
                </div>
                <Link to="/app/signals" className="flex items-center gap-1 text-xs font-medium hover:underline" style={{ color: DIR_COLORS.north }}>View signals <ChevronRight className="h-3 w-3" /></Link>
                </div>
              </div>
            </div>

            {/* WEST — left column, RIGHT-ALIGNED text */}
            <div className="relative rounded-xl bg-white/90 backdrop-blur-sm border border-[hsl(30_18%_82%)] p-5 overflow-hidden" style={{ borderLeftWidth: 4, borderLeftColor: DIR_COLORS.west }}>
              {/* Background arrow pointing left */}
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-12 w-20 pointer-events-none" viewBox="0 0 80 40" fill="none"><path d="M75 20 L5 20 M5 20 L20 8 M5 20 L20 32" stroke={DIR_COLORS.west} strokeWidth="2.5" strokeLinecap="round" opacity="0.08" /></svg>
              <div className="relative text-right">
              <div className="flex items-center gap-2 mb-3 justify-end">
                <span className="font-sans text-xs font-semibold uppercase tracking-widest" style={{ color: DIR_COLORS.west }}>West — Stewardship</span>
                <ArrowLeft className="h-4 w-4" style={{ color: DIR_COLORS.west }} />
              </div>
              <p className="text-xs italic text-[hsl(20_25%_12%/0.5)] mb-3">What needs mending or rest?</p>
              <div className="space-y-2 mb-4">
                {breached.length > 0 && <div className="flex items-center gap-2 text-sm text-[hsl(0_50%_45%)] justify-end"><span><strong>{breached.length}</strong> repair ready</span><AlertTriangle className="h-3.5 w-3.5" /></div>}
                {delayed.length > 0 && <div className="flex items-center gap-2 text-sm text-[hsl(16_50%_48%)] justify-end"><span><strong>{delayed.length}</strong> conversation needed</span><Clock className="h-3.5 w-3.5" /></div>}
                {heavyEntries.length > 0 && <div className="flex items-center gap-2 text-sm text-[hsl(20_25%_12%)] justify-end"><span><strong>{heavyEntries.length}</strong> carrying weight</span><NotebookPen className="h-3.5 w-3.5 text-[hsl(20_8%_48%)]" /></div>}
                {breached.length === 0 && delayed.length === 0 && heavyEntries.length === 0 && <p className="text-sm text-[hsl(20_8%_52%)] italic">Rest well. Nothing urgent.</p>}
                <p className="text-xs text-[hsl(20_25%_12%/0.5)] italic mt-2">How is your team's capacity?</p>
              </div>
              <Link to="/app/journal" className="inline-flex items-center gap-1 text-xs font-medium hover:underline" style={{ color: DIR_COLORS.west }}>Open journal <ChevronRight className="h-3 w-3" /></Link>
              </div>
            </div>

            {/* EAST — right column */}
            <div className="relative rounded-xl bg-white/90 backdrop-blur-sm border border-[hsl(30_18%_82%)] p-5 overflow-hidden" style={{ borderRightWidth: 4, borderRightColor: DIR_COLORS.east }}>
              {/* Background arrow pointing right */}
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-12 w-20 pointer-events-none" viewBox="0 0 80 40" fill="none"><path d="M5 20 L75 20 M75 20 L60 8 M75 20 L60 32" stroke={DIR_COLORS.east} strokeWidth="2.5" strokeLinecap="round" opacity="0.08" /></svg>
              <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <ArrowRight className="h-4 w-4" style={{ color: DIR_COLORS.east }} />
                <span className="font-sans text-xs font-semibold uppercase tracking-widest" style={{ color: DIR_COLORS.east }}>East — Transition</span>
              </div>
              <p className="text-xs italic text-[hsl(20_25%_12%/0.5)] mb-3">Are commitments advancing?</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-[hsl(20_25%_12%)]"><Handshake className="h-3.5 w-3.5 text-[hsl(20_8%_48%)]" /><span><strong>{inMotion.length}</strong> being honored</span></div>
                {delayed.length > 0 && <div className="flex items-center gap-2 text-sm text-[hsl(16_50%_48%)]"><AlertTriangle className="h-3.5 w-3.5" /><span><strong>{delayed.length}</strong> conversation needed</span></div>}
                {approachingRenewal.length > 0 && <div className="flex items-center gap-2 text-sm text-[hsl(20_25%_12%)]"><Clock className="h-3.5 w-3.5 text-[hsl(20_8%_48%)]" /><span><strong>{approachingRenewal.length}</strong> approaching renewal</span></div>}
              </div>
              <Link to="/app/commitments" className="flex items-center gap-1 text-xs font-medium hover:underline" style={{ color: DIR_COLORS.east }}>View commitments <ChevronRight className="h-3 w-3" /></Link>
              </div>
            </div>

            {/* SOUTH — spans both columns, centered */}
            <div className="md:col-span-2 md:max-w-md md:mx-auto w-full">
              <div className="relative rounded-xl bg-white/90 backdrop-blur-sm border border-[hsl(30_18%_82%)] p-5 overflow-hidden" style={{ borderBottomWidth: 4, borderBottomColor: DIR_COLORS.south }}>
                {/* Background arrow pointing down */}
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-20 w-12 pointer-events-none" viewBox="0 0 40 80" fill="none"><path d="M20 5 L20 75 M20 75 L8 60 M20 75 L32 60" stroke={DIR_COLORS.south} strokeWidth="2.5" strokeLinecap="round" opacity="0.08" /></svg>
                <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <ArrowDown className="h-4 w-4" style={{ color: DIR_COLORS.south }} />
                  <span className="font-sans text-xs font-semibold uppercase tracking-widest" style={{ color: DIR_COLORS.south }}>South — Community Presence</span>
                </div>
                <p className="text-xs italic text-[hsl(20_25%_12%/0.5)] mb-3">Who needs attention?</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-[hsl(20_25%_12%)]"><Users className="h-3.5 w-3.5 text-[hsl(20_8%_48%)]" /><span><strong>{quietStakeholders.length}</strong> waiting for reconnection</span></div>
                  {recentStories.length > 0 && <div className="flex items-center gap-2 text-sm text-[hsl(20_25%_12%)]"><Sparkles className="h-3.5 w-3.5 text-[hsl(20_8%_48%)]" /><span><strong>{recentStories.length}</strong> new community stories</span></div>}
                  <div className="flex items-center gap-2 text-sm text-[hsl(20_25%_12%)]"><NotebookPen className="h-3.5 w-3.5 text-[hsl(20_8%_48%)]" /><span><strong>{recentFieldNotes.length}</strong> field notes this week</span></div>
                </div>
                <Link to="/app/people" className="flex items-center gap-1 text-xs font-medium hover:underline" style={{ color: DIR_COLORS.south }}>View people <ChevronRight className="h-3 w-3" /></Link>
                </div>
              </div>
            </div>
          </div>
        </div>

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
