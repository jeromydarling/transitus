/**
 * Steward's Journal — Personal reflective journal for field practitioners.
 *
 * The Impulsus adaptation. A private field notebook, not shared with the team.
 * Entries are stored in localStorage independently from the main data context.
 */

import { useState, useEffect, useCallback } from 'react';
import { NotebookPen, MapPin, X } from 'lucide-react';
import { useTransitusData } from '@/contexts/TransitusDataContext';
import { getCurrentSeason, getDayMoment } from '@/lib/transitionCalendar';

// ── Types ──

type Mood = 'energized' | 'steady' | 'heavy' | 'uncertain' | 'grateful';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  place_id?: string;
  mood?: Mood;
}

const MOOD_OPTIONS: { value: Mood; label: string }[] = [
  { value: 'energized', label: 'Energized' },
  { value: 'steady', label: 'Steady' },
  { value: 'heavy', label: 'Heavy' },
  { value: 'uncertain', label: 'Uncertain' },
  { value: 'grateful', label: 'Grateful' },
];

const MOOD_COLORS: Record<Mood, string> = {
  energized: 'bg-[hsl(38_80%_90%)] text-[hsl(38_80%_35%)]',
  steady: 'bg-[hsl(152_30%_90%)] text-[hsl(152_40%_28%)]',
  heavy: 'bg-[hsl(20_20%_88%)] text-[hsl(20_20%_38%)]',
  uncertain: 'bg-[hsl(220_30%_90%)] text-[hsl(220_30%_40%)]',
  grateful: 'bg-[hsl(280_30%_92%)] text-[hsl(280_30%_40%)]',
};

const JOURNAL_STORAGE_KEY = 'transitus_journal_entries';

// ── Persistence ──

function loadEntries(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(JOURNAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: JournalEntry[]) {
  try {
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));
  } catch { /* quota exceeded — fail silently */ }
}

// ── Helpers ──

let idCounter = Date.now();

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

// ── Main page ──

export default function Journal() {
  const { places } = useTransitusData();
  const season = getCurrentSeason();
  const moment = getDayMoment();
  const [entries, setEntries] = useState<JournalEntry[]>(loadEntries);

  // Form state
  const [content, setContent] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [placeId, setPlaceId] = useState('');
  const [mood, setMood] = useState<Mood | ''>('');

  // Persist on change
  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!content.trim()) return;

      const entry: JournalEntry = {
        id: `journal-${++idCounter}`,
        date: new Date(date + 'T12:00:00').toISOString(),
        content: content.trim(),
        place_id: placeId || undefined,
        mood: mood || undefined,
      };

      setEntries((prev) => [entry, ...prev]);
      setContent('');
      setDate(new Date().toISOString().slice(0, 10));
      setPlaceId('');
      setMood('');
    },
    [content, date, placeId, mood],
  );

  const handleDelete = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const placeNameById = (id: string): string => {
    const place = places.find((p) => p.id === id);
    return place ? place.name : id;
  };

  return (
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <NotebookPen className="h-4 w-4 text-[hsl(16_65%_48%)]" />
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
              Steward's Journal
            </span>
          </div>
          <h1 className="font-serif text-2xl font-normal text-[hsl(20_10%_18%)] sm:text-3xl">
            Your field notebook
          </h1>
          <p className="mt-2 text-sm text-[hsl(20_8%_40%)] leading-relaxed max-w-xl">
            A private space for reflection. What did you notice today? What is stirring?
            These entries stay with you — they are not shared with the team.
          </p>
        </header>

        {/* ── Reflection prompts (seasonal) ── */}
        <div className="mb-6 rounded-xl bg-[hsl(198_55%_42%/0.06)] border border-[hsl(198_55%_42%/0.15)] p-4">
          <p className="text-sm font-medium text-[hsl(198_55%_42%)] mb-2">{season.label} Reflection</p>
          <p className="text-xs text-[hsl(20_25%_12%/0.65)] italic mb-3">{season.journalPrompt}</p>
          <p className="text-xs text-[hsl(20_25%_12%/0.45)] mb-2">Also consider:</p>
          <ul className="text-xs text-[hsl(20_25%_12%/0.6)] space-y-1.5">
            <li>• Who did you meet today? What's their story?</li>
            <li>• What burden did you witness someone carrying?</li>
            <li>• What hope or resistance did you see?</li>
            <li>• Whose name should you remember?</li>
          </ul>
        </div>

        {/* ── New entry form ── */}
        <form
          onSubmit={handleSubmit}
          className="mb-10 rounded-lg bg-white p-5 border border-[hsl(30_18%_82%)] shadow-sm"
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? What did you see, hear, or feel today?"
            rows={4}
            className="w-full rounded-md border border-[hsl(30_18%_82%)] bg-[hsl(38_30%_97%)] px-3 py-2.5 font-serif-body text-sm text-[hsl(20_10%_20%)] leading-relaxed placeholder:text-[hsl(20_8%_58%)] focus:outline-none focus:ring-2 focus:ring-[hsl(16_65%_48%)]/30 focus:border-[hsl(16_65%_48%)]"
          />

          <div className="mt-3 flex flex-wrap items-end gap-3">
            {/* Date */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-medium uppercase tracking-wider text-[hsl(20_8%_48%)]">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-md border border-[hsl(30_18%_82%)] bg-[hsl(38_30%_97%)] px-2.5 py-1.5 text-xs text-[hsl(20_10%_20%)] focus:outline-none focus:ring-2 focus:ring-[hsl(16_65%_48%)]/30"
              />
            </div>

            {/* Place link */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-medium uppercase tracking-wider text-[hsl(20_8%_48%)]">
                Place (optional)
              </label>
              <select
                value={placeId}
                onChange={(e) => setPlaceId(e.target.value)}
                className="rounded-md border border-[hsl(30_18%_82%)] bg-[hsl(38_30%_97%)] px-2.5 py-1.5 text-xs text-[hsl(20_10%_20%)] focus:outline-none focus:ring-2 focus:ring-[hsl(16_65%_48%)]/30"
              >
                <option value="">No place</option>
                {places.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mood */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-medium uppercase tracking-wider text-[hsl(20_8%_48%)]">
                Mood (optional)
              </label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value as Mood | '')}
                className="rounded-md border border-[hsl(30_18%_82%)] bg-[hsl(38_30%_97%)] px-2.5 py-1.5 text-xs text-[hsl(20_10%_20%)] focus:outline-none focus:ring-2 focus:ring-[hsl(16_65%_48%)]/30"
              >
                <option value="">No mood</option>
                {MOOD_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={!content.trim()}
              className="ml-auto rounded-md bg-[hsl(16_65%_48%)] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[hsl(16_65%_38%)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save entry
            </button>
          </div>
        </form>

        {/* ── Timeline ── */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <NotebookPen className="h-4 w-4 text-[hsl(16_65%_48%)]" />
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
              Past reflections
            </span>
            {entries.length > 0 && (
              <span className="text-xs text-[hsl(20_8%_52%)]">
                ({entries.length} {entries.length === 1 ? 'entry' : 'entries'})
              </span>
            )}
          </div>

          {entries.length === 0 && (
            <div className="rounded-lg bg-white border border-[hsl(30_18%_82%)] p-8 text-center">
              <NotebookPen className="mx-auto h-8 w-8 text-[hsl(20_8%_68%)] mb-3" />
              <p className="text-sm text-[hsl(20_8%_48%)] italic font-serif-body">
                No entries yet. Begin by writing what you noticed today.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="group rounded-lg bg-white p-5 border border-[hsl(30_18%_82%)] hover:shadow-sm transition-shadow"
              >
                {/* Date + tags row */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-[hsl(20_8%_42%)]">
                    {formatDate(entry.date)}
                  </span>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[hsl(20_8%_68%)] hover:text-[hsl(0_55%_48%)]"
                    title="Delete entry"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Content */}
                <p className="font-serif-body text-sm text-[hsl(20_10%_22%)] leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </p>

                {/* Tags row */}
                {(entry.place_id || entry.mood) && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {entry.place_id && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(30_20%_92%)] px-2 py-0.5 text-[10px] font-medium text-[hsl(20_10%_40%)]">
                        <MapPin className="h-2.5 w-2.5" />
                        {placeNameById(entry.place_id)}
                      </span>
                    )}
                    {entry.mood && (
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${MOOD_COLORS[entry.mood]}`}
                      >
                        {MOOD_OPTIONS.find((m) => m.value === entry.mood)?.label}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
