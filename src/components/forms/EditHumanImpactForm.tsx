import { useState } from 'react';
import { useTransitusData } from '@/contexts/TransitusDataContext';
import { toast } from '@/components/ui/sonner';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pencil, Check, Sparkles } from 'lucide-react';
import type { Place } from '@/types/transitus';
import type { CensusProfile } from '@/lib/api/census';

const DISPLACEMENT_OPTIONS: { value: NonNullable<Place['displacement_pressure']>; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const POPULATION_OPTIONS = [
  { value: 'children_under_5', label: 'Children under 5' },
  { value: 'children_under_12', label: 'Children under 12' },
  { value: 'elderly_over_65', label: 'Elderly (65+)' },
  { value: 'pregnant_women', label: 'Pregnant women' },
  { value: 'renters', label: 'Renters' },
  { value: 'uninsured', label: 'Uninsured residents' },
  { value: 'limited_english_speakers', label: 'Limited English speakers' },
  { value: 'immigrant_families', label: 'Immigrant families' },
  { value: 'undocumented_families', label: 'Undocumented families' },
  { value: 'low_income_households', label: 'Low-income households' },
  { value: 'people_with_disabilities', label: 'People with disabilities' },
  { value: 'outdoor_workers', label: 'Outdoor workers' },
  { value: 'workers_in_informal_economy', label: 'Workers in informal economy' },
  { value: 'people_without_vehicles', label: 'People without vehicles' },
  { value: 'residents_in_pre1960_housing', label: 'Residents in pre-1960 housing' },
  { value: 'children_with_respiratory_illness', label: 'Children with respiratory illness' },
  { value: 'elderly_long_term_residents', label: 'Long-term elderly residents' },
  { value: 'coastal_zone_residents', label: 'Coastal zone residents' },
  { value: 'communities_of_color', label: 'Communities of color' },
];

/**
 * Derive suggested populations from Census/ACS data.
 * These are pre-checked when the form opens if the user hasn't already selected populations.
 */
function suggestFromCensus(census?: CensusProfile | null): string[] {
  if (!census) return [];
  const suggestions: string[] = [];

  if (census.pct_below_poverty > 20) suggestions.push('low_income_households');
  if (census.pct_renter_occupied > 50) suggestions.push('renters');
  if (census.pct_cost_burdened_renters > 40) suggestions.push('renters');
  if (census.pct_uninsured > 10) suggestions.push('uninsured');
  if (census.pct_limited_english > 10) suggestions.push('limited_english_speakers');
  if (census.pct_limited_english > 10) suggestions.push('immigrant_families');
  if (census.pct_less_than_hs > 25) suggestions.push('low_income_households');
  if (census.pct_no_vehicle > 15) suggestions.push('people_without_vehicles');
  if (census.pct_built_before_1960 > 50) suggestions.push('residents_in_pre1960_housing');
  if (census.pct_white_alone < 50) suggestions.push('communities_of_color');
  if (census.unemployment_rate > 8) suggestions.push('low_income_households');

  // Deduplicate
  return [...new Set(suggestions)];
}

interface EditHumanImpactFormProps {
  place: Place;
  census?: CensusProfile | null;
  trigger?: React.ReactNode;
}

export function EditHumanImpactForm({ place, census, trigger }: EditHumanImpactFormProps) {
  const { updatePlace } = useTransitusData();
  const [open, setOpen] = useState(false);

  const censusSuggestions = suggestFromCensus(census);

  const [humanImpactSummary, setHumanImpactSummary] = useState(place.human_impact_summary || '');
  const [healthSnapshot, setHealthSnapshot] = useState(place.health_snapshot || '');
  const [selectedPopulations, setSelectedPopulations] = useState<Set<string>>(
    new Set(place.most_affected_populations || [])
  );
  const [displacementPressure, setDisplacementPressure] = useState<Place['displacement_pressure']>(
    place.displacement_pressure || 'low'
  );

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setHumanImpactSummary(place.human_impact_summary || '');
      setHealthSnapshot(place.health_snapshot || '');
      const existing = place.most_affected_populations || [];
      // Pre-populate from Census suggestions if user hasn't selected any yet
      const initial = existing.length > 0 ? existing : censusSuggestions;
      setSelectedPopulations(new Set(initial));
      setDisplacementPressure(place.displacement_pressure || 'low');
    }
    setOpen(isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const populations = Array.from(selectedPopulations);

    updatePlace(place.id, {
      human_impact_summary: humanImpactSummary.trim() || undefined,
      health_snapshot: healthSnapshot.trim() || undefined,
      most_affected_populations: populations.length > 0 ? populations : undefined,
      displacement_pressure: displacementPressure,
    });

    toast.success('Human impact data updated');
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <button className="p-1 rounded hover:bg-[hsl(30_18%_82%/0.5)] text-[hsl(16_65%_48%)]">
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="bg-[hsl(38_30%_95%)] h-[85vh] rounded-t-2xl flex flex-col"
      >
        <SheetHeader className="pb-2">
          <SheetTitle className="font-serif text-xl text-[hsl(20_25%_12%)]">
            Edit Human Impact
          </SheetTitle>
          <SheetDescription>
            Update the human dimension data for {place.name}.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <form id="human-impact-form" onSubmit={handleSubmit} className="space-y-5 pb-6">
            {/* Human Impact Summary */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Human Impact Summary
              </Label>
              <Textarea
                value={humanImpactSummary}
                onChange={e => setHumanImpactSummary(e.target.value)}
                placeholder="Describe who lives here and how they are affected..."
                rows={5}
              />
            </div>

            {/* Health Snapshot */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Health Snapshot
              </Label>
              <Textarea
                value={healthSnapshot}
                onChange={e => setHealthSnapshot(e.target.value)}
                placeholder="Key health impacts on the community..."
                rows={3}
              />
            </div>

            {/* Most Affected Populations — multi-select */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Most Affected Populations
              </Label>
              <p className="text-xs text-muted-foreground mb-2">
                Select all that apply
                {censusSuggestions.length > 0 && (
                  <span className="ml-2 inline-flex items-center gap-1 text-[hsl(198_55%_42%)]">
                    <Sparkles className="h-3 w-3" /> {censusSuggestions.length} suggested from Census data
                  </span>
                )}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[220px] overflow-y-auto rounded-lg border border-[hsl(30_18%_82%)] bg-white p-2">
                {POPULATION_OPTIONS.map(opt => {
                  const isSelected = selectedPopulations.has(opt.value);
                  const isSuggested = censusSuggestions.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSelectedPopulations(prev => {
                          const next = new Set(prev);
                          if (next.has(opt.value)) next.delete(opt.value);
                          else next.add(opt.value);
                          return next;
                        });
                      }}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-left transition-colors ${
                        isSelected
                          ? 'bg-[hsl(16_65%_48%/0.1)] text-[hsl(16_65%_48%)] font-medium'
                          : isSuggested
                          ? 'bg-[hsl(198_55%_42%/0.06)] text-[hsl(20_25%_12%/0.7)] ring-1 ring-[hsl(198_55%_42%/0.2)]'
                          : 'text-[hsl(20_25%_12%/0.6)] hover:bg-[hsl(30_18%_82%/0.3)]'
                      }`}
                    >
                      <span className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center ${
                        isSelected ? 'bg-[hsl(16_65%_48%)] border-[hsl(16_65%_48%)]' : isSuggested ? 'border-[hsl(198_55%_42%/0.4)]' : 'border-[hsl(30_18%_82%)]'
                      }`}>
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </span>
                      {opt.label}
                      {isSuggested && !isSelected && <Sparkles className="h-2.5 w-2.5 text-[hsl(198_55%_42%)] ml-auto shrink-0" />}
                    </button>
                  );
                })}
              </div>
              {selectedPopulations.size > 0 && (
                <p className="text-[10px] text-[hsl(20_25%_12%/0.4)] mt-1">
                  {selectedPopulations.size} selected
                </p>
              )}
            </div>

            {/* Displacement Pressure */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Displacement Pressure
              </Label>
              <Select
                value={displacementPressure || 'low'}
                onValueChange={(v) => setDisplacementPressure(v as Place['displacement_pressure'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DISPLACEMENT_OPTIONS.map(d => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>
        </ScrollArea>

        <div className="pt-4 border-t border-[hsl(30_18%_82%)]">
          <Button
            type="submit"
            form="human-impact-form"
            className="w-full bg-[hsl(16_65%_48%)] hover:bg-[hsl(12_55%_35%)] text-white touch-target"
          >
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default EditHumanImpactForm;
