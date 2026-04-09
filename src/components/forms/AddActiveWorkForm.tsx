import { useState } from 'react';
import { useTransitusData } from '@/contexts/TransitusDataContext';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { Plus } from 'lucide-react';
import type { ActiveWork, Place } from '@/types/transitus';

const WORK_TYPES: { value: ActiveWork['type']; label: string }[] = [
  { value: 'hearing', label: 'Hearing' },
  { value: 'campaign', label: 'Campaign' },
  { value: 'funding_ask', label: 'Funding Ask' },
  { value: 'engagement_round', label: 'Engagement Round' },
  { value: 'project_milestone', label: 'Project Milestone' },
  { value: 'coalition_meeting', label: 'Coalition Meeting' },
];

const STATUS_OPTIONS: { value: ActiveWork['status']; label: string }[] = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

interface AddActiveWorkFormProps {
  place: Place;
  trigger?: React.ReactNode;
}

export function AddActiveWorkForm({ place, trigger }: AddActiveWorkFormProps) {
  const { updatePlace } = useTransitusData();
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [workType, setWorkType] = useState<ActiveWork['type']>('hearing');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState<ActiveWork['status']>('upcoming');

  const resetForm = () => {
    setTitle('');
    setWorkType('hearing');
    setDate('');
    setStatus('upcoming');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newWork: ActiveWork = {
      id: `aw-${Date.now()}`,
      title: title.trim(),
      type: workType,
      date: date || undefined,
      status,
    };

    updatePlace(place.id, {
      active_work: [...place.active_work, newWork],
    });

    toast.success('Active work added');
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
          <p className="text-sm font-serif font-medium text-[hsl(20_25%_12%)]">Add Active Work</p>

          <div className="space-y-1">
            <Label className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Community hearing on rezoning"
              required
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
              Type
            </Label>
            <Select value={workType} onValueChange={(v) => setWorkType(v as ActiveWork['type'])}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WORK_TYPES.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
              Date (optional)
            </Label>
            <Input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
              Status
            </Label>
            <Select value={status} onValueChange={(v) => setStatus(v as ActiveWork['status'])}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full h-8 text-xs bg-[hsl(16_65%_48%)] hover:bg-[hsl(12_55%_35%)] text-white"
            disabled={!title.trim()}
          >
            Add Work
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}

export default AddActiveWorkForm;
