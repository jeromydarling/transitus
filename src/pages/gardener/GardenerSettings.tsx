/**
 * Gardener Settings — Platform configuration, tone charter, data management.
 */

import { useState } from 'react';
import { getCurrentSeason, SEASONS, type TransitionSeason } from '@/lib/transitionCalendar';
import {
  Settings, Globe, Sun, FileText, Trash2, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

function SectionHeader({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-4 h-4 text-[hsl(16_65%_48%)]" />
      <h3 className="text-xs font-semibold text-[hsl(20_25%_12%)] uppercase tracking-wider">{label}</h3>
    </div>
  );
}

export default function GardenerSettings() {
  const currentSeason = getCurrentSeason();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleDataReset = () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      return;
    }
    // Clear Transitus data
    localStorage.removeItem('transitus_data');
    localStorage.removeItem('transitus_feedback');
    localStorage.removeItem('transitus_user_role');
    toast('Data cleared. Refresh to reload default data.');
    setShowResetConfirm(false);
  };

  const seasonKeys = Object.keys(SEASONS) as TransitionSeason[];

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-[hsl(16_65%_48%)]" />
          <h2 className="font-serif text-2xl text-[hsl(20_25%_12%)]">Settings</h2>
        </div>
        <p className="text-sm text-[hsl(20_25%_12%/0.5)]">
          Platform configuration and maintenance tools.
        </p>
      </div>

      {/* Platform name */}
      <div className="bg-white rounded-xl border border-[hsl(30_18%_82%)] p-5">
        <SectionHeader icon={Globe} label="Platform Identity" />
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[hsl(20_25%_12%/0.5)] uppercase tracking-wider font-medium block mb-1">
              Platform Name
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                readOnly
                value="Transitus"
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-[hsl(30_18%_82%)] bg-[hsl(38_30%_95%)] text-[hsl(20_25%_12%)] cursor-not-allowed"
              />
              <span className="text-[10px] text-[hsl(20_25%_12%/0.3)] italic">Read-only in demo</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-[hsl(20_25%_12%/0.5)] uppercase tracking-wider font-medium block mb-1">
              Tagline
            </label>
            <input
              type="text"
              readOnly
              value="The Operating System for Places Under Change"
              className="w-full px-3 py-2 text-sm rounded-lg border border-[hsl(30_18%_82%)] bg-[hsl(38_30%_95%)] text-[hsl(20_25%_12%)] cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Season display */}
      <div className="bg-white rounded-xl border border-[hsl(30_18%_82%)] p-5">
        <SectionHeader icon={Sun} label="Default Season Display" />
        <div className="mb-4">
          <p className="text-sm text-[hsl(20_25%_12%/0.6)] mb-3">
            The platform automatically determines the current season based on the calendar.
            Current: <span className="font-semibold" style={{ color: currentSeason.color }}>{currentSeason.label}</span>.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {seasonKeys.map(key => {
            const s = SEASONS[key];
            const isCurrent = currentSeason.season === key;
            return (
              <div
                key={key}
                className={`p-3 rounded-lg border transition-colors ${
                  isCurrent
                    ? 'border-[hsl(16_65%_48%/0.3)] bg-[hsl(16_65%_48%/0.04)]'
                    : 'border-[hsl(30_18%_82%/0.5)] bg-[hsl(38_30%_95%/0.5)]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-xs font-semibold text-[hsl(20_25%_12%)]">{s.label}</span>
                  {isCurrent && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[hsl(16_65%_48%/0.1)] text-[hsl(16_65%_48%)] font-medium uppercase tracking-wider">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-[hsl(20_25%_12%/0.5)] italic">{s.posture}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tone charter preview */}
      <div className="bg-white rounded-xl border border-[hsl(30_18%_82%)] p-5">
        <SectionHeader icon={FileText} label="Tone Charter Preview" />
        <div className="space-y-4 text-sm text-[hsl(20_25%_12%/0.7)] leading-relaxed">
          <div>
            <p className="text-xs font-semibold text-[hsl(20_25%_12%)] uppercase tracking-wider mb-1">Core Identity</p>
            <p>Pastoral, Steady, Human-centered</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[hsl(20_25%_12%)] uppercase tracking-wider mb-1">Never</p>
            <p>Corporate, Gamified, Transactional, Urgent, Manipulative</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[hsl(20_25%_12%)] uppercase tracking-wider mb-1">Foundational Principles</p>
            <ol className="list-decimal list-inside space-y-0.5 text-xs">
              <li>Assume good intent.</li>
              <li>Never shame.</li>
              <li>Never rush.</li>
              <li>Never gamify.</li>
              <li>Never exaggerate urgency.</li>
              <li>Always preserve dignity.</li>
              <li>Prefer continuity over productivity.</li>
            </ol>
          </div>
          <div>
            <p className="text-xs font-semibold text-[hsl(20_25%_12%)] uppercase tracking-wider mb-1">Confirmation Language</p>
            <div className="flex gap-3">
              <div>
                <p className="text-[10px] text-[hsl(152_40%_28%)] font-medium uppercase tracking-wider mb-0.5">Use</p>
                <p className="text-xs">Noted. Held. Updated. Recorded.</p>
              </div>
              <div>
                <p className="text-[10px] text-[hsl(0_50%_45%)] font-medium uppercase tracking-wider mb-0.5">Never</p>
                <p className="text-xs">Success! Great job! Done!</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-[hsl(20_25%_12%/0.3)] mt-4 italic">
          Full charter: src/lib/toneCharter.ts
        </p>
      </div>

      {/* Data reset */}
      <div className="bg-white rounded-xl border border-[hsl(0_50%_45%/0.15)] p-5">
        <SectionHeader icon={Trash2} label="Data Management" />
        <p className="text-sm text-[hsl(20_25%_12%/0.6)] mb-4">
          Clear all locally stored data. This removes all entities, feedback, and preferences.
          Default mock data will be restored on the next page load.
        </p>

        {showResetConfirm && (
          <div className="bg-[hsl(0_50%_45%/0.05)] border border-[hsl(0_50%_45%/0.15)] rounded-lg p-3 mb-4 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-[hsl(0_50%_45%)] shrink-0 mt-0.5" />
            <p className="text-xs text-[hsl(0_50%_45%)]">
              This action cannot be undone. Click again to confirm data reset.
            </p>
          </div>
        )}

        <button
          onClick={handleDataReset}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showResetConfirm
              ? 'bg-[hsl(0_50%_45%)] text-white hover:bg-[hsl(0_50%_40%)]'
              : 'bg-[hsl(0_50%_45%/0.08)] text-[hsl(0_50%_45%)] hover:bg-[hsl(0_50%_45%/0.15)]'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          {showResetConfirm ? 'Confirm Reset' : 'Reset All Data'}
        </button>

        {showResetConfirm && (
          <button
            onClick={() => setShowResetConfirm(false)}
            className="ml-2 text-xs text-[hsl(20_25%_12%/0.4)] hover:text-[hsl(20_25%_12%/0.7)]"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
