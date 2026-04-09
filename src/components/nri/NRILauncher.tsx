/**
 * NRILauncher — Floating compass button that opens the NRI chat drawer.
 *
 * Fixed in the bottom-right corner (desktop) or above the tab bar (mobile).
 * Shows a subtle glow pulse when there are unread nudges.
 */

import { useState } from 'react';
import { Globe, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NRIChatDrawer } from './NRIChatDrawer';

export function NRILauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'fixed z-40 flex items-center justify-center rounded-full shadow-lg transition-all duration-300',
          'w-12 h-12 sm:w-14 sm:h-14',
          // Mobile: above tab bar
          'bottom-[76px] right-4 lg:bottom-6 lg:right-6',
          // Glow effect
          'hover:scale-105 active:scale-95',
          open && 'opacity-0 pointer-events-none',
        )}
        style={{
          backgroundColor: 'hsl(20 28% 10%)',
          boxShadow: '0 4px 20px hsl(16 65% 48% / 0.25), 0 0 0 0 hsl(16 65% 48% / 0.1)',
          animation: 'nri-glow 4s ease-in-out infinite',
        }}
        aria-label="Open NRI companion"
      >
        <Globe className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: 'hsl(38 80% 55%)' }} />
      </button>

      {/* Chat drawer */}
      <NRIChatDrawer open={open} onClose={() => setOpen(false)} />

      {/* Glow keyframes */}
      <style>{`
        @keyframes nri-glow {
          0%, 100% { box-shadow: 0 4px 20px hsl(16 65% 48% / 0.2), 0 0 0 0px hsl(16 65% 48% / 0.08); }
          50% { box-shadow: 0 4px 24px hsl(16 65% 48% / 0.35), 0 0 0 8px hsl(16 65% 48% / 0); }
        }
      `}</style>
    </>
  );
}
