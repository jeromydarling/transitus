/**
 * Transition Calendar — Seasonal rhythm engine for Transitus.
 *
 * Maps the liturgical calendar to the natural seasons of Just Transition work.
 * Nobody needs to know this is liturgical. Catholics will recognize the rhythm.
 * Everyone else will feel: "This app understands the seasons of this work."
 *
 * The calendar drives: dashboard tone, compass emphasis, journal prompts,
 * NRI voice, report framing, and weekly rhythm.
 */

// ── Season Types ──

export type TransitionSeason =
  | 'preparation'    // Advent → waiting, planning, hope in darkness
  | 'recognition'    // Christmas/Epiphany → something new revealed
  | 'early_labor'    // Ordinary Time I → steady, quiet faithfulness
  | 'reckoning'      // Lent → honest examination, what's broken
  | 'the_cost'       // Holy Week → grief, setback, holding pain
  | 'breakthrough'   // Easter → unexpected hope, new life
  | 'the_long_work'; // Ordinary Time II → the majority of the year

export interface SeasonInfo {
  season: TransitionSeason;
  label: string;
  posture: string;
  description: string;
  color: string; // HSL string for accent
  compassEmphasis: 'north' | 'east' | 'south' | 'west';
  greeting: string;
  journalPrompt: string;
  nriTone: string;
  weeklyFocus: string;
}

// ── Season Definitions ──

export const SEASONS: Record<TransitionSeason, Omit<SeasonInfo, 'season'>> = {
  preparation: {
    label: 'Preparation',
    posture: 'Waiting and planning',
    description: 'The year turns. Review what was promised. Prepare for the work ahead. Hold hope in the quiet months.',
    color: 'hsl(270 30% 40%)',
    compassEmphasis: 'west',
    greeting: 'A season of preparation.',
    journalPrompt: 'What are you carrying into the year ahead? What needs to be released before new work can begin?',
    nriTone: 'reflective and forward-looking',
    weeklyFocus: 'Review last year\u2019s commitments. Plan the season ahead. Attend to what needs rest.',
  },
  recognition: {
    label: 'Recognition',
    posture: 'Naming what has arrived',
    description: 'Something new has been revealed. A commitment was signed. A community found its voice. A signal emerged. Name what you see.',
    color: 'hsl(38 80% 55%)',
    compassEmphasis: 'north',
    greeting: 'A season of recognition.',
    journalPrompt: 'What has arrived that you didn\u2019t expect? What new reality are you being asked to see clearly?',
    nriTone: 'attentive and celebratory',
    weeklyFocus: 'Name what\u2019s new. Welcome emerging voices. Document what you\u2019re seeing for the first time.',
  },
  early_labor: {
    label: 'Early Labor',
    posture: 'Steady, faithful presence',
    description: 'The quiet work between revelations. Show up. Document. Build relationships. Nothing dramatic \u2014 just faithful presence.',
    color: 'hsl(152 35% 35%)',
    compassEmphasis: 'south',
    greeting: 'A season of faithful presence.',
    journalPrompt: 'Who did you simply show up for today? Where is trust quietly building?',
    nriTone: 'steady and encouraging',
    weeklyFocus: 'Deepen relationships. Document the ordinary. Trust that presence is enough.',
  },
  reckoning: {
    label: 'Reckoning',
    posture: 'Honest examination',
    description: 'Face what\u2019s broken honestly. Which commitments were breached? Which communities still suffer? What assumptions need to die?',
    color: 'hsl(16 50% 40%)',
    compassEmphasis: 'east',
    greeting: 'A season of honest reckoning.',
    journalPrompt: 'What have you been avoiding? What truth is waiting to be spoken? Where is repair needed?',
    nriTone: 'honest and compassionate',
    weeklyFocus: 'Audit commitments. Face delays with honesty. Have the hard conversations.',
  },
  the_cost: {
    label: 'The Cost',
    posture: 'Holding grief without rushing',
    description: 'The hardest days. When a hearing goes badly. When a promise is broken. When a leader burns out. Hold the grief without rushing to fix it.',
    color: 'hsl(0 25% 30%)',
    compassEmphasis: 'west',
    greeting: 'A season of cost.',
    journalPrompt: 'What loss are you carrying? Can you hold it without rushing toward a solution?',
    nriTone: 'gentle and unhurried',
    weeklyFocus: 'Be present to what\u2019s painful. Don\u2019t rush. Let the grief teach you.',
  },
  breakthrough: {
    label: 'Breakthrough',
    posture: 'Unexpected hope',
    description: 'Something shifted that nobody expected. A permit denied. A coalition held. A utility came to the table. New life from what looked dead.',
    color: 'hsl(38 70% 50%)',
    compassEmphasis: 'north',
    greeting: 'A season of breakthrough.',
    journalPrompt: 'Where did new life appear? What surprised you? Who made it possible?',
    nriTone: 'joyful and grounded',
    weeklyFocus: 'Celebrate what\u2019s emerged. Document the turning points. Thank the people who held on.',
  },
  the_long_work: {
    label: 'The Long Work',
    posture: 'Daily faithfulness',
    description: 'The majority of the year. The daily practice of accompaniment, documentation, presence, and patience. Where most transition happens \u2014 slowly, faithfully.',
    color: 'hsl(152 40% 28%)',
    compassEmphasis: 'south',
    greeting: 'The long, faithful work continues.',
    journalPrompt: 'What small, faithful act did you do today that no report will capture? Who did you accompany?',
    nriTone: 'warm and patient',
    weeklyFocus: 'Stay present. The ordinary is where transformation lives. Trust the slow work.',
  },
};

// ── Date Computation ──

/**
 * Compute Easter Sunday for a given year using the Anonymous Gregorian algorithm.
 */
function computeEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

/**
 * Get the seasonal boundaries for a given year.
 */
function getSeasonBoundaries(year: number) {
  const easter = computeEaster(year);

  // Ash Wednesday = Easter - 46 days
  const ashWednesday = new Date(easter);
  ashWednesday.setDate(easter.getDate() - 46);

  // Holy Thursday = Easter - 3
  const holyThursday = new Date(easter);
  holyThursday.setDate(easter.getDate() - 3);

  // Pentecost = Easter + 49
  const pentecost = new Date(easter);
  pentecost.setDate(easter.getDate() + 49);

  // Advent = Sunday nearest Nov 30 (4 Sundays before Christmas)
  // Simplified: ~Nov 27-Dec 3
  const advent = new Date(year, 10, 27); // Nov 27 approximation
  const adventDay = advent.getDay();
  advent.setDate(advent.getDate() - adventDay); // previous Sunday

  return {
    advent,
    christmas: new Date(year, 11, 25),
    epiphanyEnd: new Date(year + 1, 0, 12), // Jan 12 next year
    ashWednesday,
    holyThursday,
    easter,
    pentecost,
  };
}

/**
 * Determine the current Transition Season for a given date.
 */
export function getCurrentSeason(date: Date = new Date()): SeasonInfo {
  const year = date.getFullYear();
  const current = getSeasonBoundaries(year);
  const prev = getSeasonBoundaries(year - 1);

  // Check if we're in the tail of previous year's Advent/Christmas
  if (date < new Date(year, 0, 12)) {
    // Jan 1-11: Recognition (Christmas/Epiphany from previous year)
    if (date >= prev.christmas) {
      return { season: 'recognition', ...SEASONS.recognition };
    }
  }

  const m = date.getMonth();
  const d = date.getDate();

  // Advent (current year)
  if (date >= current.advent) {
    if (date < current.christmas) {
      return { season: 'preparation', ...SEASONS.preparation };
    }
    // Dec 25-31: Recognition
    return { season: 'recognition', ...SEASONS.recognition };
  }

  // Jan 12 - Ash Wednesday: Early Labor
  if (date >= new Date(year, 0, 12) && date < current.ashWednesday) {
    return { season: 'early_labor', ...SEASONS.early_labor };
  }

  // Ash Wednesday - Holy Thursday: Reckoning
  if (date >= current.ashWednesday && date < current.holyThursday) {
    return { season: 'reckoning', ...SEASONS.reckoning };
  }

  // Holy Thursday - Easter: The Cost
  if (date >= current.holyThursday && date < current.easter) {
    return { season: 'the_cost', ...SEASONS.the_cost };
  }

  // Easter - Pentecost: Breakthrough
  if (date >= current.easter && date < current.pentecost) {
    return { season: 'breakthrough', ...SEASONS.breakthrough };
  }

  // Pentecost - Advent: The Long Work
  if (date >= current.pentecost && date < current.advent) {
    return { season: 'the_long_work', ...SEASONS.the_long_work };
  }

  // Fallback
  return { season: 'the_long_work', ...SEASONS.the_long_work };
}

// ── Time of Day ──

export type TimeOfDay = 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';

export interface DayMoment {
  timeOfDay: TimeOfDay;
  label: string;
  greeting: string;
  prompt: string;
}

export function getDayMoment(date: Date = new Date()): DayMoment {
  const h = date.getHours();

  if (h < 6) return {
    timeOfDay: 'night',
    label: 'Compline',
    greeting: 'Rest. The work continues tomorrow.',
    prompt: 'Let it go for now. What are you grateful for today?',
  };
  if (h < 10) return {
    timeOfDay: 'morning',
    label: 'Morning',
    greeting: 'Good morning.',
    prompt: 'What are you carrying into today? Who are you visiting?',
  };
  if (h < 13) return {
    timeOfDay: 'midday',
    label: 'Midday',
    greeting: 'Midday pause.',
    prompt: 'What have you noticed so far? Consider logging a field note.',
  };
  if (h < 17) return {
    timeOfDay: 'afternoon',
    label: 'Afternoon',
    greeting: 'The afternoon work.',
    prompt: 'Check on your commitments. Is there a conversation waiting?',
  };
  return {
    timeOfDay: 'evening',
    label: 'Evening',
    greeting: 'Evening.',
    prompt: 'What did you witness today? What stirred in you? Time to journal.',
  };
}

// ── Day of Week Rhythm ──

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface WeekRhythm {
  day: WeekDay;
  focus: string;
  compassDirection?: 'north' | 'east' | 'south' | 'west';
  prompt: string;
}

export function getWeekRhythm(date: Date = new Date()): WeekRhythm {
  const dayNames: WeekDay[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const day = dayNames[date.getDay()];

  const rhythms: Record<WeekDay, Omit<WeekRhythm, 'day'>> = {
    monday: {
      focus: 'Compass Walk',
      compassDirection: 'north',
      prompt: 'Begin the week with a compass walk. What\u2019s shifting in your places?',
    },
    tuesday: {
      focus: 'Commitments',
      compassDirection: 'east',
      prompt: 'Are commitments advancing? Which conversations need to happen this week?',
    },
    wednesday: {
      focus: 'Field Work',
      compassDirection: 'south',
      prompt: 'Midweek. Who needs accompaniment today? Where is your presence most needed?',
    },
    thursday: {
      focus: 'Coalition & Signals',
      compassDirection: 'north',
      prompt: 'What signals arrived this week? What\u2019s the coalition noticing together?',
    },
    friday: {
      focus: 'Weekly Reflection',
      compassDirection: 'west',
      prompt: 'End the week gently. What went well? What\u2019s unfinished? What needs repair?',
    },
    saturday: {
      focus: 'Rest',
      prompt: 'Rest is part of the work. Let the week settle. Be present to what\u2019s around you.',
    },
    sunday: {
      focus: 'Rest & Renewal',
      prompt: 'Sabbath. The transition continues without you today. Trust the slow work.',
    },
  };

  return { day, ...rhythms[day] };
}

// ── Transition Milestones (secular feast days) ──

export interface TransitionMilestone {
  date: string; // MM-DD format
  name: string;
  description: string;
  relevance: string;
}

export const TRANSITION_MILESTONES: TransitionMilestone[] = [
  { date: '01-15', name: 'Dr. King\u2019s Legacy', description: 'Martin Luther King Jr. Day', relevance: 'The intersection of justice, nonviolence, and beloved community \u2014 the spiritual roots of environmental justice.' },
  { date: '02-01', name: 'Black History Month Begins', description: 'Honoring the history of environmental racism and the communities that have organized against it.', relevance: 'Many of the neighborhoods bearing the worst environmental burdens are historically Black communities shaped by redlining.' },
  { date: '03-22', name: 'World Water Day', description: 'UN World Water Day', relevance: 'Clean water access is a Just Transition issue \u2014 from Flint to the Calumet River.' },
  { date: '04-22', name: 'Earth Day', description: 'Global day of environmental awareness and action.', relevance: 'A day to celebrate the land and communities you\u2019re stewarding.' },
  { date: '05-01', name: 'May Day / Workers\u2019 Day', description: 'International Workers\u2019 Day', relevance: 'Just Transition is inseparable from labor justice. Honor the workers in your places.' },
  { date: '06-05', name: 'World Environment Day', description: 'UN World Environment Day', relevance: 'Global solidarity with local action. What\u2019s your places\u2019 story today?' },
  { date: '06-19', name: 'Juneteenth', description: 'Freedom Day', relevance: 'Liberation is ongoing. Environmental justice is part of the unfinished work of freedom.' },
  { date: '09-01', name: 'Season of Creation Begins', description: 'Ecumenical season of prayer and action for creation (Sep 1 \u2013 Oct 4).', relevance: 'Faith communities worldwide turn attention to care for creation. A natural moment for coalition work.' },
  { date: '10-04', name: 'Feast of St. Francis', description: 'Patron of ecology. End of Season of Creation.', relevance: 'The patron saint of environmentalism. A moment to celebrate stewardship.' },
  { date: '11-01', name: 'All Saints / D\u00eda de los Muertos', description: 'Remembering those who came before.', relevance: 'Honor the community members who didn\u2019t live to see the transition they fought for.' },
];

/**
 * Get any milestones near the current date (within 7 days).
 */
export function getNearbyMilestones(date: Date = new Date(), windowDays: number = 7): TransitionMilestone[] {
  const mmdd = (d: Date) => `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const nearby: TransitionMilestone[] = [];
  for (let i = -1; i <= windowDays; i++) {
    const check = new Date(date);
    check.setDate(date.getDate() + i);
    const key = mmdd(check);
    const match = TRANSITION_MILESTONES.find(m => m.date === key);
    if (match) nearby.push(match);
  }
  return nearby;
}
