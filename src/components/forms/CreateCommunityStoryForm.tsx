/**
 * CreateCommunityStoryForm -- Sheet form for recording a community story.
 * Designed for field agents to capture testimony with dignity and care.
 */

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
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import type { FieldNoteTag } from '@/types/transitus';
import { FIELD_NOTE_TAG_LABELS } from '@/types/transitus';

const CONSENT_LEVELS = [
  { value: 'local_only', label: 'Local Only -- shared only within the immediate team' },
  { value: 'trusted_allies', label: 'Trusted Allies -- shared with coalition partners' },
  { value: 'institutional', label: 'Institutional -- available to organizations and funders' },
  { value: 'public', label: 'Public -- may be shared publicly and in reports' },
] as const;

const ALL_TAGS: FieldNoteTag[] = [
  'air', 'water', 'labor', 'health', 'housing', 'energy', 'food',
  'land_use', 'permitting', 'safety', 'faith', 'culture', 'displacement', 'jobs',
];

interface CreateCommunityStoryFormProps {
  trigger?: React.ReactNode;
}

export function CreateCommunityStoryForm({ trigger }: CreateCommunityStoryFormProps) {
  const { places, addCommunityStory } = useTransitusData();
  const [open, setOpen] = useState(false);

  const [personName, setPersonName] = useState('');
  const [locationDetail, setLocationDetail] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [story, setStory] = useState('');
  const [quote, setQuote] = useState('');
  const [healthImpacts, setHealthImpacts] = useState('');
  const [yearsInCommunity, setYearsInCommunity] = useState('');
  const [familyContext, setFamilyContext] = useState('');
  const [consentLevel, setConsentLevel] = useState<'local_only' | 'trusted_allies' | 'institutional' | 'public'>('local_only');
  const [tags, setTags] = useState<FieldNoteTag[]>([]);

  const resetForm = () => {
    setPersonName('');
    setLocationDetail('');
    setPlaceId('');
    setStory('');
    setQuote('');
    setHealthImpacts('');
    setYearsInCommunity('');
    setFamilyContext('');
    setConsentLevel('local_only');
    setTags([]);
  };

  const toggleTag = (tag: FieldNoteTag) => {
    setTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim() || !story.trim()) return;

    const healthArr = healthImpacts
      .split(',')
      .map(s => s.trim().replace(/\s+/g, '_').toLowerCase())
      .filter(Boolean);

    addCommunityStory({
      person_name: personName.trim(),
      location_detail: locationDetail.trim() || undefined,
      place_id: placeId || places[0]?.id || '',
      story: story.trim(),
      quote: quote.trim() || undefined,
      health_impacts: healthArr.length > 0 ? healthArr : undefined,
      years_in_community: yearsInCommunity ? parseInt(yearsInCommunity, 10) : undefined,
      family_context: familyContext.trim() || undefined,
      consent_level: consentLevel,
      collected_by: 's-1', // current user placeholder
      tags: tags as string[],
    });

    toast.success('Community story recorded with care');
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
            <Heart className="h-4 w-4 mr-1" />
            Record a Story
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="bg-[hsl(38_30%_95%)] h-[90vh] rounded-t-2xl flex flex-col"
      >
        <SheetHeader className="pb-2">
          <SheetTitle className="font-serif text-xl text-[hsl(20_25%_12%)]">
            Record a Community Story
          </SheetTitle>
          <SheetDescription>
            Listen with care. Write what you heard. Respect what was shared.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <form id="community-story-form" onSubmit={handleSubmit} className="space-y-5 pb-6">
            {/* Person's Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Person's Name <span className="text-destructive">*</span>
              </Label>
              <Input
                value={personName}
                onChange={e => setPersonName(e.target.value)}
                placeholder="e.g. Maria Elena Rodriguez"
                required
              />
            </div>

            {/* Location Detail */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Location Detail
              </Label>
              <Input
                value={locationDetail}
                onChange={e => setLocationDetail(e.target.value)}
                placeholder="e.g. 106th and Burley"
              />
            </div>

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

            {/* Story */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Story <span className="text-destructive">*</span>
              </Label>
              <Textarea
                value={story}
                onChange={e => setStory(e.target.value)}
                placeholder="Write the story as you witnessed and heard it. Be faithful to their experience."
                required
                rows={6}
                className="font-serif leading-relaxed"
              />
            </div>

            {/* Direct Quote */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Direct Quote
              </Label>
              <Textarea
                value={quote}
                onChange={e => setQuote(e.target.value)}
                placeholder="Their own words, exactly as they said them."
                rows={3}
                className="font-serif italic leading-relaxed"
              />
            </div>

            {/* Health Impacts */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Health Impacts
              </Label>
              <Input
                value={healthImpacts}
                onChange={e => setHealthImpacts(e.target.value)}
                placeholder="e.g. asthma, headaches, sleep disruption (comma-separated)"
              />
            </div>

            {/* Years in Community */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Years in Community
              </Label>
              <Input
                type="number"
                value={yearsInCommunity}
                onChange={e => setYearsInCommunity(e.target.value)}
                placeholder="e.g. 31"
                min="0"
              />
            </div>

            {/* Family Context */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Family Context
              </Label>
              <Textarea
                value={familyContext}
                onChange={e => setFamilyContext(e.target.value)}
                placeholder="e.g. Mother of 3, grandmother lives next door"
                rows={2}
              />
            </div>

            {/* Consent Level */}
            <div className="space-y-1.5">
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
              <p className="text-[10px] text-[hsl(20_10%_50%)]">
                This determines who can see this story. Always honor the person's wishes.
              </p>
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
          </form>
        </ScrollArea>

        <div className="pt-4 border-t border-[hsl(30_18%_82%)]">
          <Button
            type="submit"
            form="community-story-form"
            className="w-full bg-[hsl(16_65%_48%)] hover:bg-[hsl(12_55%_35%)] text-white touch-target"
            disabled={!personName.trim() || !story.trim()}
          >
            Record Story
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CreateCommunityStoryForm;
