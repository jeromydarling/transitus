import { useState } from 'react';
import { useTransitusData } from '@/contexts/TransitusDataContext';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { Plus } from 'lucide-react';
import type { EnvironmentalBurden, Place } from '@/types/transitus';

const BURDEN_CATEGORIES: { value: EnvironmentalBurden['category']; label: string }[] = [
  { value: 'air', label: 'Air' },
  { value: 'water', label: 'Water' },
  { value: 'land', label: 'Land' },
  { value: 'health', label: 'Health' },
  { value: 'climate', label: 'Climate' },
  { value: 'infrastructure', label: 'Infrastructure' },
];

const SEVERITY_OPTIONS: { value: EnvironmentalBurden['severity']; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

interface AddBurdenFormProps {
  place: Place;
  trigger?: React.ReactNode;
}

export function AddBurdenForm({ place, trigger }: AddBurdenFormProps) {
  const { updatePlace } = useTransitusData();
  const [open, setOpen] = useState(false);

  const [category, setCategory] = useState<EnvironmentalBurden['category']>('air');
  const [name, setName] = useState('');
  const [severity, setSeverity] = useState<EnvironmentalBurden['severity']>('moderate');
  const [description, setDescription] = useState('');
  const [source, setSource] = useState('');

  const resetForm = () => {
    setCategory('air');
    setName('');
    setSeverity('moderate');
    setDescription('');
    setSource('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newBurden: EnvironmentalBurden = {
      category,
      name: name.trim(),
      severity,
      description: description.trim(),
      source: source.trim() || undefined,
    };

    updatePlace(place.id, {
      environmental_burdens: [...place.environmental_burdens, newBurden],
    });

    toast.success('Environmental burden added');
    resetForm();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <button className="p-1 rounded hover:bg-[hsl(30_18%_82%/0.5)] text-[hsl(16_65%_48%)]">
            <Plus className="h-4 w-4" />
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-[hsl(38_30%_95%)] border border-[hsl(30_18%_82%)]" align="end">
        <form onSubmit={handleSubmit} className="space-y-3">
          <p className="text-sm font-serif font-medium text-[hsl(20_25%_12%)]">Add Environmental Burden</p>

          <div className="space-y-1">
            <Label className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
              Category
            </Label>
            <Select value={category} onValueChange={(v) => setCategory(v as EnvironmentalBurden['category'])}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BURDEN_CATEGORIES.map(c => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Particulate matter from I-94"
              required
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
              Severity
            </Label>
            <Select value={severity} onValueChange={(v) => setSeverity(v as EnvironmentalBurden['severity'])}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SEVERITY_OPTIONS.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
              Description
            </Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the burden..."
              rows={2}
              className="text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
              Source
            </Label>
            <Input
              value={source}
              onChange={e => setSource(e.target.value)}
              placeholder="e.g. EPA EJScreen, local report"
              className="h-8 text-xs"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-8 text-xs bg-[hsl(16_65%_48%)] hover:bg-[hsl(12_55%_35%)] text-white"
            disabled={!name.trim()}
          >
            Add Burden
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}

export default AddBurdenForm;
