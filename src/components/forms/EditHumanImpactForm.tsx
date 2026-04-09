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
import { Pencil } from 'lucide-react';
import type { Place } from '@/types/transitus';

const DISPLACEMENT_OPTIONS: { value: NonNullable<Place['displacement_pressure']>; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

interface EditHumanImpactFormProps {
  place: Place;
  trigger?: React.ReactNode;
}

export function EditHumanImpactForm({ place, trigger }: EditHumanImpactFormProps) {
  const { updatePlace } = useTransitusData();
  const [open, setOpen] = useState(false);

  const [humanImpactSummary, setHumanImpactSummary] = useState(place.human_impact_summary || '');
  const [healthSnapshot, setHealthSnapshot] = useState(place.health_snapshot || '');
  const [mostAffectedPopulations, setMostAffectedPopulations] = useState(
    (place.most_affected_populations || []).join(', ')
  );
  const [displacementPressure, setDisplacementPressure] = useState<Place['displacement_pressure']>(
    place.displacement_pressure || 'low'
  );

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setHumanImpactSummary(place.human_impact_summary || '');
      setHealthSnapshot(place.health_snapshot || '');
      setMostAffectedPopulations((place.most_affected_populations || []).join(', '));
      setDisplacementPressure(place.displacement_pressure || 'low');
    }
    setOpen(isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const populations = mostAffectedPopulations
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

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

            {/* Most Affected Populations */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Most Affected Populations
              </Label>
              <Input
                value={mostAffectedPopulations}
                onChange={e => setMostAffectedPopulations(e.target.value)}
                placeholder="e.g. Children under 5, Elderly, Low-income families"
              />
              <p className="text-xs text-muted-foreground">Separate with commas</p>
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
