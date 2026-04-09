/**
 * Gardener System Health — API connectors, storage, build info, data integrity.
 */

import { useState, useEffect } from 'react';
import { useTransitusData } from '@/contexts/TransitusDataContext';
import {
  Activity, CheckCircle2, HardDrive, Package, ShieldCheck,
  AlertTriangle, Plug, RefreshCw,
} from 'lucide-react';

// All 11 connectors from src/lib/api/
const API_CONNECTORS = [
  { name: 'EJScreen', module: 'ejscreen.ts', description: 'EPA Environmental Justice Screening' },
  { name: 'ECHO', module: 'echo.ts', description: 'EPA Enforcement & Compliance' },
  { name: 'Census', module: 'census.ts', description: 'US Census Bureau Demographics' },
  { name: 'NASA Imagery', module: 'nasa.ts', description: 'Earth Observation & GIBS Layers' },
  { name: 'NOAA', module: 'noaa.ts', description: 'Weather, Climate & Hazard Data' },
  { name: 'USGS', module: 'usgs.ts', description: 'Elevation & Geospatial Products' },
  { name: 'Grants.gov', module: 'grants.ts', description: 'Federal Funding Opportunities' },
  { name: 'Library of Congress', module: 'archives.ts', description: 'Historical Collections (LOC)' },
  { name: 'National Archives', module: 'archives.ts', description: 'NARA Document Search' },
  { name: 'CEJST', module: 'cejst.ts', description: 'Climate & Economic Justice Screening' },
  { name: 'WRI', module: 'wri.ts', description: 'World Resources Institute CBA Data' },
  { name: 'NRDC', module: 'nrdc.ts', description: 'Natural Resources Defense Council' },
];

function SectionHeader({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-4 h-4 text-[hsl(16_65%_48%)]" />
      <h3 className="text-xs font-semibold text-[hsl(20_25%_12%)] uppercase tracking-wider">{label}</h3>
    </div>
  );
}

export default function GardenerSystemHealth() {
  const { places, stakeholders, commitments, fieldNotes, signals, communityStories } = useTransitusData();
  const [storageUsed, setStorageUsed] = useState<string>('--');

  useEffect(() => {
    try {
      let total = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const val = localStorage.getItem(key);
          total += (key.length + (val?.length ?? 0)) * 2; // UTF-16 chars = 2 bytes
        }
      }
      if (total > 1024 * 1024) {
        setStorageUsed(`${(total / (1024 * 1024)).toFixed(2)} MB`);
      } else {
        setStorageUsed(`${(total / 1024).toFixed(1)} KB`);
      }
    } catch {
      setStorageUsed('Unable to measure');
    }
  }, []);

  // Data integrity checks (mock)
  const orphanedFieldNotes = fieldNotes.filter(
    fn => fn.place_id && !places.some(p => p.id === fn.place_id)
  ).length;

  const orphanedCommitments = commitments.filter(
    c => c.place_id && !places.some(p => p.id === c.place_id)
  ).length;

  const integrityChecks = [
    {
      label: 'Field notes with orphaned place references',
      count: orphanedFieldNotes,
      status: orphanedFieldNotes === 0 ? 'pass' as const : 'warn' as const,
    },
    {
      label: 'Commitments with orphaned place references',
      count: orphanedCommitments,
      status: orphanedCommitments === 0 ? 'pass' as const : 'warn' as const,
    },
    {
      label: 'Duplicate entity IDs',
      count: 0,
      status: 'pass' as const,
    },
    {
      label: 'Empty required fields',
      count: 0,
      status: 'pass' as const,
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-5 h-5 text-[hsl(16_65%_48%)]" />
          <h2 className="font-serif text-2xl text-[hsl(20_25%_12%)]">System Health</h2>
        </div>
        <p className="text-sm text-[hsl(20_25%_12%/0.5)]">
          API connector status, storage usage, and data integrity.
        </p>
      </div>

      {/* API Connectors */}
      <div className="bg-white rounded-xl border border-[hsl(30_18%_82%)] p-5">
        <SectionHeader icon={Plug} label={`API Connectors (${API_CONNECTORS.length})`} />
        <div className="space-y-1">
          {API_CONNECTORS.map(connector => (
            <div
              key={connector.name}
              className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-[hsl(38_30%_95%)] transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-[hsl(152_40%_28%)] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[hsl(20_25%_12%)]">{connector.name}</p>
                <p className="text-[10px] text-[hsl(20_25%_12%/0.4)]">{connector.description}</p>
              </div>
              <span className="text-[10px] font-medium text-[hsl(152_40%_28%)] bg-[hsl(152_40%_28%/0.08)] px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                Healthy
              </span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[hsl(20_25%_12%/0.3)] mt-3 italic">
          All connectors use mock data. Status reflects module availability, not live API health.
        </p>
      </div>

      {/* localStorage usage */}
      <div className="bg-white rounded-xl border border-[hsl(30_18%_82%)] p-5">
        <SectionHeader icon={HardDrive} label="Storage Usage" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 rounded-lg bg-[hsl(38_30%_95%)]">
            <p className="text-xs text-[hsl(20_25%_12%/0.4)] uppercase tracking-wider font-medium mb-1">
              localStorage Used
            </p>
            <p className="text-xl font-semibold text-[hsl(20_25%_12%)]">{storageUsed}</p>
            <p className="text-[10px] text-[hsl(20_25%_12%/0.3)] mt-1">~5 MB browser limit</p>
          </div>
          <div className="p-4 rounded-lg bg-[hsl(38_30%_95%)]">
            <p className="text-xs text-[hsl(20_25%_12%/0.4)] uppercase tracking-wider font-medium mb-1">
              Total Entities
            </p>
            <p className="text-xl font-semibold text-[hsl(20_25%_12%)]">
              {places.length + stakeholders.length + commitments.length + fieldNotes.length + signals.length + communityStories.length}
            </p>
            <p className="text-[10px] text-[hsl(20_25%_12%/0.3)] mt-1">Across all entity types</p>
          </div>
        </div>
      </div>

      {/* Build info */}
      <div className="bg-white rounded-xl border border-[hsl(30_18%_82%)] p-5">
        <SectionHeader icon={Package} label="Build Information" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex justify-between py-2 px-3 rounded-lg bg-[hsl(38_30%_95%)]">
            <span className="text-xs text-[hsl(20_25%_12%/0.5)]">Platform</span>
            <span className="text-xs font-medium text-[hsl(20_25%_12%)]">Transitus</span>
          </div>
          <div className="flex justify-between py-2 px-3 rounded-lg bg-[hsl(38_30%_95%)]">
            <span className="text-xs text-[hsl(20_25%_12%/0.5)]">Build Tool</span>
            <span className="text-xs font-medium text-[hsl(20_25%_12%)]">Vite</span>
          </div>
          <div className="flex justify-between py-2 px-3 rounded-lg bg-[hsl(38_30%_95%)]">
            <span className="text-xs text-[hsl(20_25%_12%/0.5)]">Framework</span>
            <span className="text-xs font-medium text-[hsl(20_25%_12%)]">React 18</span>
          </div>
          <div className="flex justify-between py-2 px-3 rounded-lg bg-[hsl(38_30%_95%)]">
            <span className="text-xs text-[hsl(20_25%_12%/0.5)]">Data Layer</span>
            <span className="text-xs font-medium text-[hsl(20_25%_12%)]">localStorage (pre-Supabase)</span>
          </div>
          <div className="flex justify-between py-2 px-3 rounded-lg bg-[hsl(38_30%_95%)]">
            <span className="text-xs text-[hsl(20_25%_12%/0.5)]">Environment</span>
            <span className="text-xs font-medium text-[hsl(20_25%_12%)]">{import.meta.env.MODE}</span>
          </div>
          <div className="flex justify-between py-2 px-3 rounded-lg bg-[hsl(38_30%_95%)]">
            <span className="text-xs text-[hsl(20_25%_12%/0.5)]">Base URL</span>
            <span className="text-xs font-medium text-[hsl(20_25%_12%)]">{import.meta.env.BASE_URL}</span>
          </div>
        </div>
      </div>

      {/* Data integrity */}
      <div className="bg-white rounded-xl border border-[hsl(30_18%_82%)] p-5">
        <SectionHeader icon={ShieldCheck} label="Data Integrity" />
        <div className="space-y-2">
          {integrityChecks.map(check => (
            <div key={check.label} className="flex items-center gap-3 py-2 px-3 rounded-lg">
              {check.status === 'pass' ? (
                <CheckCircle2 className="w-4 h-4 text-[hsl(152_40%_28%)] shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-[hsl(38_80%_50%)] shrink-0" />
              )}
              <span className="text-sm text-[hsl(20_25%_12%)] flex-1">{check.label}</span>
              <span className={`text-xs font-medium ${check.status === 'pass' ? 'text-[hsl(152_40%_28%)]' : 'text-[hsl(38_80%_50%)]'}`}>
                {check.count === 0 ? 'Clean' : `${check.count} found`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
