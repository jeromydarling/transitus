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
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { NotebookPen } from 'lucide-react';
import type { FieldNoteType, FieldNoteTag } from '@/types/transitus';
import { FIELD_NOTE_TAG_LABELS } from '@/types/transitus';

const NOTE_TYPES: { value: FieldNoteType; label: string }[] = [
  { value: 'site_visit', label: 'Site Visit' },
  { value: 'listening_session', label: 'Listening Session' },
  { value: 'community_meeting', label: 'Community Meeting' },
  { value: 'prayer_vigil', label: 'Prayer Vigil' },
  { value: 'utility_meeting', label: 'Utility Meeting' },
  { value: 'household_interview', label: 'Household Interview' },
  { value: 'corridor_observation', label: 'Corridor Observation' },
  { value: 'quick_note', label: 'Quick Note' },
];

const ALL_TAGS: FieldNoteTag[] = [
  'air', 'water', 'labor', 'health', 'housing', 'energy', 'food',
  'land_use', 'permitting', 'safety', 'faith', 'culture', 'displacement', 'jobs',
];

const CONSENT_LEVELS = [
  { value: 'local_only', label: 'Local Only' },
  { value: 'trusted_allies', label: 'Trusted Allies' },
  { value: 'institutional', label: 'Institutional' },
  { value: 'public', label: 'Public' },
] as const;

interface CreateFieldNoteFormProps {
  trigger?: React.ReactNode;
  defaultPlaceId?: string;
}

export function CreateFieldNoteForm({ trigger, defaultPlaceId }: CreateFieldNoteFormProps) {
  const { places, addFieldNote } = useTransitusData();
  const [open, setOpen] = useState(false);

  const [placeId, setPlaceId] = useState(defaultPlaceId || '');
  const [noteType, setNoteType] = useState<FieldNoteType>('quick_note');
  const [content, setContent] = useState('');
  const [whatISaw, setWhatISaw] = useState('');
  const [whoISpokeWith, setWhoISpokeWith] = useState('');
  const [whatChanged, setWhatChanged] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [tags, setTags] = useState<FieldNoteTag[]>([]);
  const [isTestimony, setIsTestimony] = useState(false);
  const [consentLevel, setConsentLevel] = useState<'local_only' | 'trusted_allies' | 'institutional' | 'public'>('local_only');

  const resetForm = () => {
    setPlaceId(defaultPlaceId || '');
    setNoteType('quick_note');
    setContent('');
    setWhatISaw('');
    setWhoISpokeWith('');
    setWhatChanged('');
    setFollowUp('');
    setTags([]);
    setIsTestimony(false);
    setConsentLevel('local_only');
  };

  const toggleTag = (tag: FieldNoteTag) => {
    setTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    addFieldNote({
      author_id: 's-1',
      place_id: placeId || places[0]?.id || '',
      note_type: noteType,
      content: content.trim(),
      what_i_saw: whatISaw.trim() || undefined,
      who_i_spoke_with: whoISpokeWith.trim() || undefined,
      what_changed: whatChanged.trim() || undefined,
      follow_up: followUp.trim() || undefined,
      tags,
      is_testimony: isTestimony,
      consent_level: isTestimony ? consentLevel : undefined,
    });

    toast.success('Field note recorded');
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
            <NotebookPen className="h-4 w-4 mr-1" />
            New Field Note
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="bg-[hsl(38_30%_95%)] h-[90vh] rounded-t-2xl flex flex-col"
      >
        <SheetHeader className="pb-2">
          <SheetTitle className="font-serif text-xl text-[hsl(20_25%_12%)]">
            New Field Note
          </SheetTitle>
          <SheetDescription>
            Record what you witnessed, heard, and learned.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <form id="field-note-form" onSubmit={handleSubmit} className="space-y-5 pb-6">
            {/* Place */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Place
              </Label>
              <Select value={placeId} onValueChange={setPlaceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a place..." />
                </SelectTrigger>
                <SelectContent>
                  {places.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Note Type */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Note Type
              </Label>
              <Select value={noteType} onValueChange={(v) => setNoteType(v as FieldNoteType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NOTE_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Content <span className="text-destructive">*</span>
              </Label>
              <Textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="What happened? What did you observe?"
                required
                rows={4}
              />
            </div>

            {/* What I Saw */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                What I Saw
              </Label>
              <Textarea
                value={whatISaw}
                onChange={e => setWhatISaw(e.target.value)}
                placeholder="Describe what you observed..."
                rows={2}
              />
            </div>

            {/* Who I Spoke With */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Who I Spoke With
              </Label>
              <Textarea
                value={whoISpokeWith}
                onChange={e => setWhoISpokeWith(e.target.value)}
                placeholder="Names, roles, or descriptions..."
                rows={2}
              />
            </div>

            {/* What Changed */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                What Changed
              </Label>
              <Textarea
                value={whatChanged}
                onChange={e => setWhatChanged(e.target.value)}
                placeholder="Any shifts, new developments..."
                rows={2}
              />
            </div>

            {/* Follow-up Needed */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Follow-up Needed
              </Label>
              <Textarea
                value={followUp}
                onChange={e => setFollowUp(e.target.value)}
                placeholder="Next steps, people to contact..."
                rows={2}
              />
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Tags
              </Label>
              <div className="flex flex-wrap gap-2">
                {ALL_TAGS.map(tag => (
                  <Badge
                    key={tag}
                    variant={tags.includes(tag) ? 'default' : 'outline'}
                    className={`cursor-pointer transition-colors ${
                      tags.includes(tag)
                        ? 'bg-[hsl(152_40%_24%)] text-white hover:bg-[hsl(152_40%_30%)]'
                        : 'hover:bg-[hsl(38_35%_90%)] text-[hsl(20_25%_12%)]'
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {FIELD_NOTE_TAG_LABELS[tag]}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Testimony Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[hsl(38_25%_97%)] border border-[hsl(30_18%_82%)]">
              <div>
                <Label className="text-sm font-medium text-[hsl(20_25%_12%)]">
                  This is testimony
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Mark if this contains personal witness or testimony
                </p>
              </div>
              <Switch
                checked={isTestimony}
                onCheckedChange={setIsTestimony}
              />
            </div>

            {/* Consent Level */}
            {isTestimony && (
              <div className="space-y-1.5 animate-fade-in">
                <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                  Consent Level
                </Label>
                <Select value={consentLevel} onValueChange={(v) => setConsentLevel(v as typeof consentLevel)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONSENT_LEVELS.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </form>
        </ScrollArea>

        <div className="pt-4 border-t border-[hsl(30_18%_82%)]">
          <Button
            type="submit"
            form="field-note-form"
            className="w-full bg-[hsl(16_65%_48%)] hover:bg-[hsl(12_55%_35%)] text-white touch-target"
            disabled={!content.trim()}
          >
            Record Field Note
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CreateFieldNoteForm;
