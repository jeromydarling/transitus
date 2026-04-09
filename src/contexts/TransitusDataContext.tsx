/**
 * TransitusDataContext — Local state management for all Transitus entities.
 *
 * Provides CRUD operations backed by React state + localStorage persistence.
 * When Lovable wires Supabase, replace useState+localStorage with
 * useQuery+useMutation from @tanstack/react-query + supabase client.
 *
 * Every entity operation follows the same pattern:
 *   const { places, addPlace, updatePlace, deletePlace } = useTransitusData();
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type {
  Place, Stakeholder, Organization, Commitment, FieldNote,
  Signal, Journey, LibraryItem, Report, CommunityStory,
} from '@/types/transitus';
import type { NRIChatMessage } from '@/types/nri';
import {
  MOCK_PLACES, MOCK_STAKEHOLDERS, MOCK_ORGS, MOCK_COMMITMENTS,
  MOCK_FIELD_NOTES, MOCK_SIGNALS, MOCK_JOURNEYS, MOCK_LIBRARY,
  MOCK_REPORTS, MOCK_COMMUNITY_STORIES,
} from '@/lib/mockData';

// ── Types ──

interface TransitusDataState {
  places: Place[];
  stakeholders: Stakeholder[];
  organizations: Organization[];
  commitments: Commitment[];
  fieldNotes: FieldNote[];
  signals: Signal[];
  journeys: Journey[];
  library: LibraryItem[];
  reports: Report[];
  communityStories: CommunityStory[];
  nriMessages: NRIChatMessage[];
  readSignalIds: Set<string>;
}

interface TransitusDataActions {
  // Field Notes
  addFieldNote: (note: Omit<FieldNote, 'id' | 'created_at'>) => FieldNote;
  updateFieldNote: (id: string, updates: Partial<FieldNote>) => void;
  deleteFieldNote: (id: string) => void;

  // Commitments
  addCommitment: (commitment: Omit<Commitment, 'id' | 'created_at' | 'updated_at'>) => Commitment;
  updateCommitment: (id: string, updates: Partial<Commitment>) => void;
  deleteCommitment: (id: string) => void;

  // Stakeholders
  addStakeholder: (person: Omit<Stakeholder, 'id' | 'created_at'>) => Stakeholder;
  updateStakeholder: (id: string, updates: Partial<Stakeholder>) => void;
  deleteStakeholder: (id: string) => void;

  // Organizations
  addOrganization: (org: Omit<Organization, 'id' | 'created_at'>) => Organization;
  updateOrganization: (id: string, updates: Partial<Organization>) => void;
  deleteOrganization: (id: string) => void;

  // Signals
  markSignalRead: (id: string) => void;
  markSignalUnread: (id: string) => void;
  markAllSignalsRead: () => void;
  isSignalRead: (id: string) => boolean;

  // Places
  addPlace: (place: Omit<Place, 'id' | 'created_at' | 'updated_at'>) => Place;
  updatePlace: (id: string, updates: Partial<Place>) => void;

  // Community Stories
  addCommunityStory: (story: Omit<CommunityStory, 'id' | 'collected_at'>) => CommunityStory;
  updateCommunityStory: (id: string, updates: Partial<CommunityStory>) => void;
  deleteCommunityStory: (id: string) => void;

  // NRI Chat
  addNriMessage: (msg: NRIChatMessage) => void;
  clearNriMessages: () => void;

  // Search
  searchAll: (query: string) => SearchResult[];
}

export interface SearchResult {
  type: 'place' | 'stakeholder' | 'organization' | 'commitment' | 'field_note' | 'signal' | 'journey' | 'library' | 'community_story';
  id: string;
  title: string;
  subtitle: string;
  route: string;
}

type TransitusDataContextType = TransitusDataState & TransitusDataActions;

const TransitusDataContext = createContext<TransitusDataContextType | null>(null);

// ── Persistence helpers ──

const STORAGE_KEY = 'transitus_data';
const STORAGE_VERSION = 2; // Increment when schema changes

function loadFromStorage(): Partial<TransitusDataState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Check version — if old, clear and return null
    if (parsed._version !== STORAGE_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    if (parsed.readSignalIds) {
      parsed.readSignalIds = new Set(parsed.readSignalIds);
    }
    return parsed;
  } catch { return null; }
}

function saveToStorage(state: TransitusDataState) {
  try {
    const serializable = {
      ...state,
      readSignalIds: Array.from(state.readSignalIds),
      _version: STORAGE_VERSION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  } catch { /* quota exceeded — fail silently */ }
}

// ── ID generator ──

let idCounter = Date.now();
function genId(prefix: string): string {
  return `${prefix}-${++idCounter}`;
}

// ── Provider ──

export function TransitusDataProvider({ children }: { children: ReactNode }) {
  const stored = loadFromStorage();

  const [places, setPlaces] = useState<Place[]>(stored?.places || MOCK_PLACES);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(stored?.stakeholders || MOCK_STAKEHOLDERS);
  const [organizations, setOrganizations] = useState<Organization[]>(stored?.organizations || MOCK_ORGS);
  const [commitments, setCommitments] = useState<Commitment[]>(stored?.commitments || MOCK_COMMITMENTS);
  const [fieldNotes, setFieldNotes] = useState<FieldNote[]>(stored?.fieldNotes || MOCK_FIELD_NOTES);
  const [signals, setSignals] = useState<Signal[]>(stored?.signals || MOCK_SIGNALS);
  const [journeys, setJourneys] = useState<Journey[]>(stored?.journeys || MOCK_JOURNEYS);
  const [library] = useState<LibraryItem[]>(stored?.library || MOCK_LIBRARY);
  const [reports] = useState<Report[]>(stored?.reports || MOCK_REPORTS);
  const [communityStories, setCommunityStories] = useState<CommunityStory[]>(stored?.communityStories || MOCK_COMMUNITY_STORIES);
  const [nriMessages, setNriMessages] = useState<NRIChatMessage[]>(stored?.nriMessages || []);
  const [readSignalIds, setReadSignalIds] = useState<Set<string>>(
    stored?.readSignalIds instanceof Set ? stored.readSignalIds : new Set()
  );

  // Persist on every change
  useEffect(() => {
    saveToStorage({ places, stakeholders, organizations, commitments, fieldNotes, signals, journeys, library, reports, communityStories, nriMessages, readSignalIds });
  }, [places, stakeholders, organizations, commitments, fieldNotes, signals, journeys, library, reports, communityStories, nriMessages, readSignalIds]);

  // ── Field Notes CRUD ──
  const addFieldNote = useCallback((note: Omit<FieldNote, 'id' | 'created_at'>) => {
    const newNote: FieldNote = { ...note, id: genId('fn'), created_at: new Date().toISOString() };
    setFieldNotes(prev => [newNote, ...prev]);
    return newNote;
  }, []);

  const updateFieldNote = useCallback((id: string, updates: Partial<FieldNote>) => {
    setFieldNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  }, []);

  const deleteFieldNote = useCallback((id: string) => {
    setFieldNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  // ── Commitments CRUD ──
  const addCommitment = useCallback((c: Omit<Commitment, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const newC: Commitment = { ...c, id: genId('c'), created_at: now, updated_at: now };
    setCommitments(prev => [newC, ...prev]);
    return newC;
  }, []);

  const updateCommitment = useCallback((id: string, updates: Partial<Commitment>) => {
    setCommitments(prev => prev.map(c => c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c));
  }, []);

  const deleteCommitment = useCallback((id: string) => {
    setCommitments(prev => prev.filter(c => c.id !== id));
  }, []);

  // ── Stakeholders CRUD ──
  const addStakeholder = useCallback((s: Omit<Stakeholder, 'id' | 'created_at'>) => {
    const newS: Stakeholder = { ...s, id: genId('s'), created_at: new Date().toISOString() };
    setStakeholders(prev => [newS, ...prev]);
    return newS;
  }, []);

  const updateStakeholder = useCallback((id: string, updates: Partial<Stakeholder>) => {
    setStakeholders(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const deleteStakeholder = useCallback((id: string) => {
    setStakeholders(prev => prev.filter(s => s.id !== id));
  }, []);

  // ── Organizations CRUD ──
  const addOrganization = useCallback((o: Omit<Organization, 'id' | 'created_at'>) => {
    const newO: Organization = { ...o, id: genId('org'), created_at: new Date().toISOString() };
    setOrganizations(prev => [newO, ...prev]);
    return newO;
  }, []);

  const updateOrganization = useCallback((id: string, updates: Partial<Organization>) => {
    setOrganizations(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  }, []);

  const deleteOrganization = useCallback((id: string) => {
    setOrganizations(prev => prev.filter(o => o.id !== id));
  }, []);

  // ── Signals ──
  const markSignalRead = useCallback((id: string) => {
    setReadSignalIds(prev => new Set([...prev, id]));
  }, []);

  const markSignalUnread = useCallback((id: string) => {
    setReadSignalIds(prev => { const next = new Set(prev); next.delete(id); return next; });
  }, []);

  const markAllSignalsRead = useCallback(() => {
    setReadSignalIds(new Set(signals.map(s => s.id)));
  }, [signals]);

  const isSignalRead = useCallback((id: string) => readSignalIds.has(id), [readSignalIds]);

  // ── Places ──
  const addPlace = useCallback((p: Omit<Place, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const newP: Place = { ...p, id: genId('place'), created_at: now, updated_at: now };
    setPlaces(prev => [newP, ...prev]);
    return newP;
  }, []);

  const updatePlace = useCallback((id: string, updates: Partial<Place>) => {
    setPlaces(prev => prev.map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p));
  }, []);

  // ── Community Stories CRUD ──
  const addCommunityStory = useCallback((s: Omit<CommunityStory, 'id' | 'collected_at'>) => {
    const newS: CommunityStory = { ...s, id: genId('cs'), collected_at: new Date().toISOString() };
    setCommunityStories(prev => [newS, ...prev]);
    return newS;
  }, []);

  const updateCommunityStory = useCallback((id: string, updates: Partial<CommunityStory>) => {
    setCommunityStories(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const deleteCommunityStory = useCallback((id: string) => {
    setCommunityStories(prev => prev.filter(s => s.id !== id));
  }, []);

  // ── NRI Chat ──
  const addNriMessage = useCallback((msg: NRIChatMessage) => {
    setNriMessages(prev => [...prev, msg]);
  }, []);

  const clearNriMessages = useCallback(() => {
    setNriMessages([]);
  }, []);

  // ── Global Search ──
  const searchAll = useCallback((query: string): SearchResult[] => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const results: SearchResult[] = [];

    places.forEach(p => {
      if (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.geography.toLowerCase().includes(q)) {
        results.push({ type: 'place', id: p.id, title: p.name, subtitle: p.geography, route: `/app/places/${p.id}` });
      }
    });

    stakeholders.forEach(s => {
      if (s.name.toLowerCase().includes(q) || (s.bio?.toLowerCase().includes(q)) || (s.title?.toLowerCase().includes(q))) {
        results.push({ type: 'stakeholder', id: s.id, title: s.name, subtitle: s.title || s.role, route: `/app/people/${s.id}` });
      }
    });

    organizations.forEach(o => {
      if (o.name.toLowerCase().includes(q) || o.description.toLowerCase().includes(q)) {
        results.push({ type: 'organization', id: o.id, title: o.name, subtitle: o.org_type, route: `/app/people` });
      }
    });

    commitments.forEach(c => {
      if (c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) {
        results.push({ type: 'commitment', id: c.id, title: c.title, subtitle: c.status, route: `/app/commitments` });
      }
    });

    fieldNotes.forEach(fn => {
      if (fn.content.toLowerCase().includes(q) || (fn.what_i_saw?.toLowerCase().includes(q))) {
        results.push({ type: 'field_note', id: fn.id, title: fn.note_type.replace(/_/g, ' '), subtitle: fn.content.slice(0, 60) + '...', route: `/app/field-notes` });
      }
    });

    signals.forEach(s => {
      if (s.title.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q)) {
        results.push({ type: 'signal', id: s.id, title: s.title, subtitle: s.source, route: `/app/signals` });
      }
    });

    journeys.forEach(j => {
      if (j.title.toLowerCase().includes(q) || j.description.toLowerCase().includes(q)) {
        results.push({ type: 'journey', id: j.id, title: j.title, subtitle: j.journey_type.replace(/_/g, ' '), route: `/app/journeys/${j.id}` });
      }
    });

    library.forEach(l => {
      if (l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) || l.content.toLowerCase().includes(q)) {
        results.push({ type: 'library', id: l.id, title: l.title, subtitle: l.category.replace(/_/g, ' '), route: `/app/library` });
      }
    });

    communityStories.forEach(cs => {
      if (cs.person_name.toLowerCase().includes(q) || cs.story.toLowerCase().includes(q) || (cs.quote?.toLowerCase().includes(q)) || (cs.location_detail?.toLowerCase().includes(q))) {
        results.push({ type: 'community_story', id: cs.id, title: cs.person_name, subtitle: cs.location_detail || 'Community Story', route: `/app/community-stories` });
      }
    });

    return results.slice(0, 20);
  }, [places, stakeholders, organizations, commitments, fieldNotes, signals, journeys, library, communityStories]);

  const value: TransitusDataContextType = {
    places, stakeholders, organizations, commitments, fieldNotes, signals,
    journeys, library, reports, communityStories, nriMessages, readSignalIds,
    addFieldNote, updateFieldNote, deleteFieldNote,
    addCommitment, updateCommitment, deleteCommitment,
    addStakeholder, updateStakeholder, deleteStakeholder,
    addOrganization, updateOrganization, deleteOrganization,
    markSignalRead, markSignalUnread, markAllSignalsRead, isSignalRead,
    addPlace, updatePlace,
    addCommunityStory, updateCommunityStory, deleteCommunityStory,
    addNriMessage, clearNriMessages,
    searchAll,
  };

  return (
    <TransitusDataContext.Provider value={value}>
      {children}
    </TransitusDataContext.Provider>
  );
}

export function useTransitusData() {
  const ctx = useContext(TransitusDataContext);
  if (!ctx) throw new Error('useTransitusData must be used within TransitusDataProvider');
  return ctx;
}
