import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransitusData } from '@/contexts/TransitusDataContext';
import type { SearchResult } from '@/contexts/TransitusDataContext';
import {
  CommandDialog, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import {
  Search, MapPin, Users, Building2, Handshake,
  NotebookPen, Radio, Route, BookOpen,
} from 'lucide-react';

const TYPE_META: Record<SearchResult['type'], { label: string; icon: React.ElementType }> = {
  place: { label: 'Places', icon: MapPin },
  stakeholder: { label: 'People', icon: Users },
  organization: { label: 'Organizations', icon: Building2 },
  commitment: { label: 'Commitments', icon: Handshake },
  field_note: { label: 'Field Notes', icon: NotebookPen },
  signal: { label: 'Signals', icon: Radio },
  journey: { label: 'Journeys', icon: Route },
  library: { label: 'Library', icon: BookOpen },
};

interface GlobalSearchProps {
  trigger?: React.ReactNode;
}

export function GlobalSearch({ trigger }: GlobalSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { searchAll } = useTransitusData();
  const navigate = useNavigate();

  const results = query.trim() ? searchAll(query) : [];

  // Group results by type
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  // Keyboard shortcut: Cmd+K / Ctrl+K
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setOpen(prev => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleSelect = (route: string) => {
    setOpen(false);
    setQuery('');
    navigate(route);
  };

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="gap-2 text-muted-foreground hover:text-foreground border-[hsl(30_18%_82%)] bg-[hsl(38_25%_97%)]"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">Search...</span>
          <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">&#8984;</span>K
          </kbd>
        </Button>
      )}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search places, people, commitments..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty className="py-8 text-center text-sm text-muted-foreground">
            No results found. Try a different search term.
          </CommandEmpty>

          {Object.entries(grouped).map(([type, items]) => {
            const meta = TYPE_META[type as SearchResult['type']];
            if (!meta) return null;
            const Icon = meta.icon;

            return (
              <CommandGroup key={type} heading={meta.label}>
                {items.map(item => (
                  <CommandItem
                    key={item.id}
                    value={`${item.title} ${item.subtitle}`}
                    onSelect={() => handleSelect(item.route)}
                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[hsl(38_35%_90%)] text-[hsl(16_65%_48%)]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-[hsl(20_25%_12%)] truncate">
                        {item.title}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {item.subtitle}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default GlobalSearch;
