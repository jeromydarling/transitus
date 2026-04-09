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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Handshake } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { CommitmentType, CommitmentStatus } from '@/types/transitus';
import { COMMITMENT_STATUS_LABELS } from '@/types/transitus';

const COMMITMENT_TYPES: { value: CommitmentType; label: string }[] = [
  { value: 'public_pledge', label: 'Public Pledge' },
  { value: 'legal_agreement', label: 'Legal Agreement' },
  { value: 'cba', label: 'Community Benefits Agreement' },
  { value: 'shareholder_engagement', label: 'Shareholder Engagement' },
  { value: 'diocesan_policy', label: 'Diocesan Policy' },
  { value: 'utility_promise', label: 'Utility Promise' },
  { value: 'grant_condition', label: 'Grant Condition' },
  { value: 'informal_promise', label: 'Informal Promise' },
];

const STATUS_OPTIONS: { value: CommitmentStatus; label: string }[] = (
  Object.entries(COMMITMENT_STATUS_LABELS) as [CommitmentStatus, string][]
).map(([value, label]) => ({ value, label }));

interface CreateCommitmentFormProps {
  trigger?: React.ReactNode;
  defaultPlaceId?: string;
}

export function CreateCommitmentForm({ trigger, defaultPlaceId }: CreateCommitmentFormProps) {
  const { places, addCommitment } = useTransitusData();
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [commitmentType, setCommitmentType] = useState<CommitmentType>('public_pledge');
  const [status, setStatus] = useState<CommitmentStatus>('proposed');
  const [placeIds, setPlaceIds] = useState<string[]>(defaultPlaceId ? [defaultPlaceId] : []);
  const [context, setContext] = useState('');
  const [communityInterpretation, setCommunityInterpretation] = useState('');
  const [renewalDate, setRenewalDate] = useState<Date | undefined>(undefined);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCommitmentType('public_pledge');
    setStatus('proposed');
    setPlaceIds(defaultPlaceId ? [defaultPlaceId] : []);
    setContext('');
    setCommunityInterpretation('');
    setRenewalDate(undefined);
  };

  const placeOptions = places.map(p => ({ value: p.id, label: p.name }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addCommitment({
      title: title.trim(),
      description: description.trim(),
      commitment_type: commitmentType,
      status,
      place_ids: placeIds,
      context: context.trim(),
      community_interpretation: communityInterpretation.trim() || undefined,
      renewal_date: renewalDate ? renewalDate.toISOString().split('T')[0] : undefined,
      evidence: [],
    });

    toast.success('Commitment created');
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
            <Handshake className="h-4 w-4 mr-1" />
            New Commitment
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="bg-[hsl(38_30%_95%)] h-[90vh] rounded-t-2xl flex flex-col"
      >
        <SheetHeader className="pb-2">
          <SheetTitle className="font-serif text-xl text-[hsl(20_25%_12%)]">
            New Commitment
          </SheetTitle>
          <SheetDescription>
            Track a promise, agreement, or pledge.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <form id="commitment-form" onSubmit={handleSubmit} className="space-y-5 pb-6">
            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="What was committed?"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Description
              </Label>
              <Textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Details about this commitment..."
                rows={3}
              />
            </div>

            {/* Commitment Type */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Type
              </Label>
              <Select value={commitmentType} onValueChange={(v) => setCommitmentType(v as CommitmentType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMMITMENT_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Status
              </Label>
              <Select value={status} onValueChange={(v) => setStatus(v as CommitmentStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(s => (
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

            {/* Context */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Context
              </Label>
              <Textarea
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder="Where and when was this commitment made?"
                rows={2}
              />
            </div>

            {/* Community Interpretation */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Community Interpretation
              </Label>
              <Textarea
                value={communityInterpretation}
                onChange={e => setCommunityInterpretation(e.target.value)}
                placeholder="How does the community understand this commitment?"
                rows={2}
              />
            </div>

            {/* Renewal Date */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Renewal Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !renewalDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {renewalDate ? format(renewalDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={renewalDate}
                    onSelect={setRenewalDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </form>
        </ScrollArea>

        <div className="pt-4 border-t border-[hsl(30_18%_82%)]">
          <Button
            type="submit"
            form="commitment-form"
            className="w-full bg-[hsl(16_65%_48%)] hover:bg-[hsl(12_55%_35%)] text-white touch-target"
            disabled={!title.trim()}
          >
            Create Commitment
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CreateCommitmentForm;
