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
import { BookOpen } from 'lucide-react';
import type { JourneyType, ChapterType } from '@/types/transitus';
import { CHAPTER_TYPE_LABELS } from '@/types/transitus';

const JOURNEY_TYPE_OPTIONS: { value: JourneyType; label: string }[] = [
  { value: 'plant_closure', label: 'Plant Closure' },
  { value: 'utility_decarbonization', label: 'Utility Decarbonization' },
  { value: 'brownfield_redevelopment', label: 'Brownfield Redevelopment' },
  { value: 'parish_land_discernment', label: 'Parish Land Discernment' },
  { value: 'community_solar', label: 'Community Solar' },
  { value: 'neighborhood_resilience', label: 'Neighborhood Resilience' },
  { value: 'logistics_corridor', label: 'Logistics Corridor' },
  { value: 'investment_engagement', label: 'Investment Engagement' },
  { value: 'food_sovereignty', label: 'Food Sovereignty' },
  { value: 'housing_transition', label: 'Housing Transition' },
];

const CHAPTER_TYPE_OPTIONS: { value: ChapterType; label: string }[] = (
  Object.entries(CHAPTER_TYPE_LABELS) as [ChapterType, string][]
).map(([value, label]) => ({ value, label }));

interface CreateJourneyFormProps {
  trigger?: React.ReactNode;
  defaultPlaceId?: string;
}

export function CreateJourneyForm({ trigger, defaultPlaceId }: CreateJourneyFormProps) {
  const { places, addJourney } = useTransitusData();
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [journeyType, setJourneyType] = useState<JourneyType>('neighborhood_resilience');
  const [placeId, setPlaceId] = useState(defaultPlaceId || '');
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterType, setChapterType] = useState<ChapterType>('recognition');
  const [chapterNarrative, setChapterNarrative] = useState('');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setJourneyType('neighborhood_resilience');
    setPlaceId(defaultPlaceId || '');
    setChapterTitle('');
    setChapterType('recognition');
    setChapterNarrative('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const initialChapter = chapterTitle.trim()
      ? {
          id: `ch-${Date.now()}`,
          title: chapterTitle.trim(),
          chapter_type: chapterType,
          narrative: chapterNarrative.trim(),
          date_range: new Date().toISOString().split('T')[0],
          linked_note_ids: [],
          linked_commitment_ids: [],
          linked_signal_ids: [],
        }
      : null;

    addJourney({
      title: title.trim(),
      description: description.trim(),
      journey_type: journeyType,
      place_id: placeId || places[0]?.id || '',
      chapters: initialChapter ? [initialChapter] : [],
      stakeholder_ids: [],
      commitment_ids: [],
      tensions: [],
      open_questions: [],
    });

    toast.success('Journey created');
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
            <BookOpen className="h-4 w-4 mr-1" />
            New Journey
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="bg-[hsl(38_30%_95%)] h-[90vh] rounded-t-2xl flex flex-col"
      >
        <SheetHeader className="pb-2">
          <SheetTitle className="font-serif text-xl text-[hsl(20_25%_12%)]">
            New Journey
          </SheetTitle>
          <SheetDescription>
            Begin documenting a transition journey for a place.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <form id="journey-form" onSubmit={handleSubmit} className="space-y-5 pb-6">
            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Journey title"
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
                placeholder="What is this journey about?"
                rows={3}
              />
            </div>

            {/* Journey Type */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Journey Type
              </Label>
              <Select value={journeyType} onValueChange={(v) => setJourneyType(v as JourneyType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {JOURNEY_TYPE_OPTIONS.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            {/* Divider */}
            <div className="border-t border-[hsl(30_18%_82%)] pt-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)] mb-3">
                First Chapter (optional)
              </p>
            </div>

            {/* Chapter Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Chapter Title
              </Label>
              <Input
                value={chapterTitle}
                onChange={e => setChapterTitle(e.target.value)}
                placeholder="e.g. The First Listening"
              />
            </div>

            {/* Chapter Type */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Chapter Type
              </Label>
              <Select value={chapterType} onValueChange={(v) => setChapterType(v as ChapterType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHAPTER_TYPE_OPTIONS.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Chapter Narrative */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Chapter Narrative
              </Label>
              <Textarea
                value={chapterNarrative}
                onChange={e => setChapterNarrative(e.target.value)}
                placeholder="What happened in this chapter?"
                rows={4}
              />
            </div>
          </form>
        </ScrollArea>

        <div className="pt-4 border-t border-[hsl(30_18%_82%)]">
          <Button
            type="submit"
            form="journey-form"
            className="w-full bg-[hsl(16_65%_48%)] hover:bg-[hsl(12_55%_35%)] text-white touch-target"
            disabled={!title.trim()}
          >
            Create Journey
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CreateJourneyForm;
