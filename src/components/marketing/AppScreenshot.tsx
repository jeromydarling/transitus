/**
 * AppScreenshot — Mini browser window with live React content inside.
 * Used on marketing pages to show real app UI, not static images.
 */

import { type ReactNode } from 'react';

interface AppScreenshotProps {
  title?: string;
  url?: string;
  children: ReactNode;
  className?: string;
  dark?: boolean;
}

export function AppScreenshot({ title = 'Transitus', url = 'transitus.app', children, className = '', dark = false }: AppScreenshotProps) {
  return (
    <div className={`rounded-xl overflow-hidden shadow-xl border ${dark ? 'border-[hsl(20_18%_20%)]' : 'border-[hsl(30_18%_82%)]'} ${className}`}>
      {/* Browser chrome */}
      <div className={`flex items-center gap-3 px-4 py-2.5 ${dark ? 'bg-[hsl(20_20%_14%)]' : 'bg-[hsl(30_15%_92%)]'}`}>
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[hsl(0_65%_55%)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[hsl(38_80%_55%)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[hsl(152_50%_42%)]" />
        </div>
        {/* URL bar */}
        <div className={`flex-1 rounded-md px-3 py-1 text-[10px] font-mono ${dark ? 'bg-[hsl(20_18%_10%)] text-[hsl(38_20%_50%)]' : 'bg-white text-[hsl(20_10%_45%)]'}`}>
          {url}
        </div>
      </div>
      {/* Content */}
      <div className={`overflow-hidden ${dark ? 'bg-[hsl(20_22%_10%)]' : 'bg-[hsl(38_30%_95%)]'}`} style={{ maxHeight: '320px' }}>
        <div className="transform scale-[0.65] origin-top-left" style={{ width: '153.8%' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Pre-built mini screenshots showing actual app sections.
 * These render real React components scaled down inside browser chrome.
 */

export function ScreenshotCompass() {
  return (
    <AppScreenshot url="transitus.app/app/compass" title="Compass Walk">
      <div className="p-6 bg-[hsl(38_30%_95%)]" style={{ minHeight: 500 }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[hsl(152_40%_28%)]" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">Compass Walk</span>
          <span className="text-xs text-[hsl(20_25%_12%/0.4)] ml-2">Current Season: Breakthrough</span>
        </div>
        {/* Mini compass cross */}
        <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
          <div className="col-span-2 max-w-xs mx-auto w-full rounded-lg bg-white border border-[hsl(30_18%_82%)] p-4" style={{ borderTopWidth: 3, borderTopColor: 'hsl(198 55% 42%)' }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(198_55%_42%)]">North — Place Intelligence</p>
            <p className="text-xs text-[hsl(20_25%_12%)] mt-1"><strong>3</strong> new signals this week</p>
          </div>
          <div className="rounded-lg bg-white border border-[hsl(30_18%_82%)] p-4" style={{ borderLeftWidth: 3, borderLeftColor: 'hsl(38 80% 55%)' }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(38_80%_55%)] text-right">West</p>
            <p className="text-xs text-[hsl(20_25%_12%)] mt-1 text-right"><strong>1</strong> conversation needed</p>
          </div>
          <div className="rounded-lg bg-white border border-[hsl(30_18%_82%)] p-4" style={{ borderRightWidth: 3, borderRightColor: 'hsl(16 65% 48%)' }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">East</p>
            <p className="text-xs text-[hsl(20_25%_12%)] mt-1"><strong>3</strong> being honored</p>
          </div>
          <div className="col-span-2 max-w-xs mx-auto w-full rounded-lg bg-white border border-[hsl(30_18%_82%)] p-4" style={{ borderBottomWidth: 3, borderBottomColor: 'hsl(152 40% 28%)' }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(152_40%_28%)]">South — Community</p>
            <p className="text-xs text-[hsl(20_25%_12%)] mt-1"><strong>3</strong> waiting for reconnection</p>
          </div>
        </div>
      </div>
    </AppScreenshot>
  );
}

export function ScreenshotPlaceDetail() {
  return (
    <AppScreenshot url="transitus.app/app/places/southeast-chicago" title="Place Detail">
      <div style={{ minHeight: 500 }}>
        {/* Mini map */}
        <div className="h-32 relative" style={{ background: 'linear-gradient(155deg, hsl(152 30% 25%) 0%, hsl(30 25% 35%) 35%, hsl(16 45% 40%) 65%, hsl(20 20% 30%) 100%)' }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-sm font-serif">Southeast Chicago Industrial Corridor</span>
          </div>
          <div className="absolute bottom-2 left-2 bg-black/30 rounded px-2 py-0.5 text-[9px] text-white/80 font-mono">41.7308°N, 87.5545°W</div>
        </div>
        <div className="p-4 bg-[hsl(38_30%_95%)]">
          {/* Human impact */}
          <div className="rounded-lg bg-white border-l-4 border-[hsl(16_65%_48%)] p-4 mb-3">
            <p className="font-serif text-lg text-[hsl(20_25%_12%)]">48,000 people live here.</p>
            <p className="text-xs text-[hsl(20_25%_12%/0.6)] mt-1 line-clamp-2">Mostly low-income families and communities of color — live surrounded by active industrial operations...</p>
          </div>
          {/* Burdens */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded bg-white border border-[hsl(30_18%_82%)] p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Diesel emissions</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-800">critical</span>
              </div>
            </div>
            <div className="rounded bg-white border border-[hsl(30_18%_82%)] p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">River contamination</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-800">high</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppScreenshot>
  );
}

export function ScreenshotCommunityStories() {
  return (
    <AppScreenshot url="transitus.app/app/community-stories" title="Stories">
      <div className="p-6 bg-[hsl(38_30%_95%)]" style={{ minHeight: 500 }}>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)] mb-4">Community Stories</p>
        <p className="font-serif-body text-xs italic text-[hsl(20_25%_12%/0.5)] mb-6 border-l-2 border-[hsl(16_65%_48%/0.3)] pl-3">
          "The people breathing the worst air are the ones with the least political power and the fewest resources to move."
        </p>
        {/* Story card */}
        <div className="rounded-lg bg-white border border-[hsl(30_18%_82%)] p-5 mb-3">
          <blockquote className="font-serif-body text-sm italic text-[hsl(20_25%_12%/0.75)] border-l-2 border-[hsl(16_65%_48%/0.4)] pl-3 mb-3">
            "I shouldn't have to choose between paying the electric bill and letting my grandson breathe."
          </blockquote>
          <p className="text-xs text-[hsl(20_25%_12%/0.55)]">
            <strong className="text-[hsl(20_25%_12%)]">Maria Elena Rodriguez</strong> — 106th and Burley Ave · 31 years in community
          </p>
        </div>
        <div className="rounded-lg bg-white border border-[hsl(30_18%_82%)] p-5">
          <blockquote className="font-serif-body text-sm italic text-[hsl(20_25%_12%/0.75)] border-l-2 border-[hsl(16_65%_48%/0.4)] pl-3 mb-3">
            "We turn mourning into motion."
          </blockquote>
          <p className="text-xs text-[hsl(20_25%_12%/0.55)]">
            <strong className="text-[hsl(20_25%_12%)]">Rev. Daniel Okonkwo</strong> — St. Kevin Parish · 9 years
          </p>
        </div>
      </div>
    </AppScreenshot>
  );
}

export function ScreenshotNRI() {
  return (
    <AppScreenshot url="transitus.app/app" title="NRI Companion" dark>
      <div className="p-0" style={{ minHeight: 500 }}>
        {/* Chat-like interface */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: 'hsl(20 28% 10%)' }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(152 45% 18%)' }}>
            <span className="text-[8px]" style={{ color: 'hsl(38 80% 55%)' }}>&#x1f310;</span>
          </div>
          <span className="text-xs font-semibold text-[hsl(38_35%_90%)]">NRI</span>
          <span className="text-[9px] text-[hsl(38_35%_90%/0.4)]">Stewardship Companion</span>
        </div>
        <div className="px-4 py-4 bg-[hsl(38_30%_95%)] space-y-3">
          {/* Assistant message */}
          <div className="max-w-[85%] rounded-xl bg-white border border-[hsl(30_18%_82%)] px-3 py-2.5">
            <p className="text-xs text-[hsl(20_25%_12%)] leading-relaxed">Good morning. It's Breakthrough — a season of unexpected hope. How can I help with your stewardship work today?</p>
          </div>
          {/* Quick prompts */}
          <div className="grid grid-cols-2 gap-1.5">
            {['What\'s shifting?', 'Log a site visit', 'Check commitments', 'Who\'s gone quiet?'].map(p => (
              <div key={p} className="rounded-lg border border-[hsl(30_18%_82%)] bg-white px-2.5 py-2 text-[10px] text-[hsl(20_25%_12%/0.6)]">
                {p}
              </div>
            ))}
          </div>
          {/* User message */}
          <div className="max-w-[85%] ml-auto rounded-xl px-3 py-2.5" style={{ backgroundColor: 'hsl(20 28% 10%)', color: 'hsl(38 35% 90%)' }}>
            <p className="text-xs">What's shifting in my places?</p>
          </div>
        </div>
      </div>
    </AppScreenshot>
  );
}
