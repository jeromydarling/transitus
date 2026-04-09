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
import { MultiSelect } from '@/components/ui/multi-select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Radio } from 'lucide-react';
import type { SignalSource, SignalCategory } from '@/types/transitus';
import { SIGNAL_SOURCE_LABELS } from '@/types/transitus';

const SOURCE_OPTIONS: { value: SignalSource; label: string }[] = (
  Object.entries(SIGNAL_SOURCE_LABELS) as [SignalSource, string][]
).map(([value, label]) => ({ value, label }));

const CATEGORY_OPTIONS: { value: SignalCategory; label: string }[] = [
  { value: 'permit_filing', label: 'Permit Filing' },
  { value: 'enforcement_action', label: 'Enforcement Action' },
  { value: 'hearing_notice', label: 'Hearing Notice' },
  { value: 'climate_alert', label: 'Climate Alert' },
  { value: 'funding_opportunity', label: 'Funding Opportunity' },
  { value: 'policy_change', label: 'Policy Change' },
  { value: 'community_report', label: 'Community Report' },
  { value: 'job_announcement', label: 'Job Announcement' },
  { value: 'project_update', label: 'Project Update' },
];

const SEVERITY_OPTIONS = [
  { value: 'informational', label: 'Informational' },
  { value: 'notable', label: 'Notable' },
  { value: 'urgent', label: 'Urgent' },
] as const;

interface CreateSignalFormProps {
  trigger?: React.ReactNode;
  defaultPlaceId?: string;
}

export function CreateSignalForm({ trigger, defaultPlaceId }: CreateSignalFormProps) {
  const { places, addSignal } = useTransitusData();
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [source, setSource] = useState<SignalSource>('news');
  const [category, setCategory] = useState<SignalCategory>('community_report');
  const [severity, setSeverity] = useState<'informational' | 'notable' | 'urgent'>('informational');
  const [placeIds, setPlaceIds] = useState<string[]>(defaultPlaceId ? [defaultPlaceId] : []);
  const [url, setUrl] = useState('');

  const resetForm = () => {
    setTitle('');
    setSummary('');
    setSource('news');
    setCategory('community_report');
    setSeverity('informational');
    setPlaceIds(defaultPlaceId ? [defaultPlaceId] : []);
    setUrl('');
  };

  const placeOptions = places.map(p => ({ value: p.id, label: p.name }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addSignal({
      title: title.trim(),
      summary: summary.trim(),
      source,
      category,
      severity,
      place_ids: placeIds,
      url: url.trim() || undefined,
      published_at: new Date().toISOString(),
      is_read: false,
    });

    toast.success('Signal created');
    resetForm();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button
            className="bg-[hsl(16_65%_48%)] hover:bg-[hsl(12_55%_35%)] text-white touch-target"
          >
            <Radio className="h-4 w-4 mr-1" />
            New Signal
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="bg-[hsl(38_30%_95%)] h-[90vh] rounded-t-2xl flex flex-col"
      >
        <SheetHeader className="pb-2">
          <SheetTitle className="font-serif text-xl text-[hsl(20_25%_12%)]">
            New Signal
          </SheetTitle>
          <SheetDescription>
            Log a new signal — news, regulatory action, or community report.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <form id="signal-form" onSubmit={handleSubmit} className="space-y-5 pb-6">
            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="What happened?"
                required
              />
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Summary
              </Label>
              <Textarea
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="Brief description of the signal..."
                rows={3}
              />
            </div>

            {/* Source */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Source
              </Label>
              <Select value={source} onValueChange={(v) => setSource(v as SignalSource)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_OPTIONS.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Category
              </Label>
              <Select value={category} onValueChange={(v) => setCategory(v as SignalCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Severity */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Severity
              </Label>
              <Select value={severity} onValueChange={(v) => setSeverity(v as typeof severity)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEVERITY_OPTIONS.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Place Links */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Linked Places
              </Label>
              <MultiSelect
                options={placeOptions}
                selected={placeIds}
                onChange={setPlaceIds}
                placeholder="Select places..."
              />
            </div>

            {/* URL */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                URL (optional)
              </Label>
              <Input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </form>
        </ScrollArea>

        <div className="pt-4 border-t border-[hsl(30_18%_82%)]">
          <Button
            type="submit"
            form="signal-form"
            className="w-full bg-[hsl(16_65%_48%)] hover:bg-[hsl(12_55%_35%)] text-white touch-target"
            disabled={!title.trim()}
          >
            Create Signal
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CreateSignalForm;
