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
import { MapPin } from 'lucide-react';
import type { PlaceType } from '@/types/transitus';

const PLACE_TYPE_OPTIONS: { value: PlaceType; label: string }[] = [
  { value: 'neighborhood', label: 'Neighborhood' },
  { value: 'corridor', label: 'Corridor' },
  { value: 'watershed', label: 'Watershed' },
  { value: 'parish_territory', label: 'Parish Territory' },
  { value: 'utility_service_area', label: 'Utility Service Area' },
  { value: 'port_zone', label: 'Port Zone' },
  { value: 'plant_footprint', label: 'Plant Footprint' },
  { value: 'city_initiative', label: 'City Initiative' },
  { value: 'tribal_area', label: 'Tribal Area' },
  { value: 'custom_region', label: 'Custom Region' },
];

interface CreatePlaceFormProps {
  trigger?: React.ReactNode;
}

export function CreatePlaceForm({ trigger }: CreatePlaceFormProps) {
  const { addPlace } = useTransitusData();
  const [open, setOpen] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [placeType, setPlaceType] = useState<PlaceType>('neighborhood');
  const [geography, setGeography] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [communitiesInput, setCommunitiesInput] = useState('');
  const [institutionsInput, setInstitutionsInput] = useState('');
  const [issuesInput, setIssuesInput] = useState('');

  const resetForm = () => {
    setName('');
    setDescription('');
    setPlaceType('neighborhood');
    setGeography('');
    setLat('');
    setLng('');
    setCommunitiesInput('');
    setInstitutionsInput('');
    setIssuesInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const communities = communitiesInput.split(',').map(s => s.trim()).filter(Boolean);
    const key_institutions = institutionsInput.split(',').map(s => s.trim()).filter(Boolean);
    const transition_issues = issuesInput.split(',').map(s => s.trim()).filter(Boolean);

    addPlace({
      name: name.trim(),
      description: description.trim(),
      place_type: placeType,
      geography: geography.trim(),
      lat: parseFloat(lat) || 0,
      lng: parseFloat(lng) || 0,
      communities,
      key_institutions,
      land_use: [],
      transition_issues,
      environmental_burdens: [],
      active_work: [],
    });

    toast.success('Place added');
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
            <MapPin className="h-4 w-4 mr-1" />
            New Place
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="bg-[hsl(38_30%_95%)] h-[90vh] rounded-t-2xl flex flex-col"
      >
        <SheetHeader className="pb-2">
          <SheetTitle className="font-serif text-xl text-[hsl(20_25%_12%)]">
            New Place
          </SheetTitle>
          <SheetDescription>
            Add a community, corridor, or territory to track.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <form id="place-form" onSubmit={handleSubmit} className="space-y-5 pb-6">
            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Place name"
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
                placeholder="Describe this place and its significance..."
                rows={3}
              />
            </div>

            {/* Place Type */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Type
              </Label>
              <Select value={placeType} onValueChange={(v) => setPlaceType(v as PlaceType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLACE_TYPE_OPTIONS.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Geography */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Geography
              </Label>
              <Input
                value={geography}
                onChange={e => setGeography(e.target.value)}
                placeholder="e.g. Chicago, IL or Suffolk County, MA"
              />
            </div>

            {/* Lat/Lng */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                  Latitude
                </Label>
                <Input
                  type="number"
                  step="any"
                  value={lat}
                  onChange={e => setLat(e.target.value)}
                  placeholder="41.8781"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                  Longitude
                </Label>
                <Input
                  type="number"
                  step="any"
                  value={lng}
                  onChange={e => setLng(e.target.value)}
                  placeholder="-87.6298"
                />
              </div>
            </div>

            {/* Communities */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Communities
              </Label>
              <Input
                value={communitiesInput}
                onChange={e => setCommunitiesInput(e.target.value)}
                placeholder="Comma-separated: Little Village, Pilsen"
              />
              <p className="text-xs text-muted-foreground">Separate with commas</p>
            </div>

            {/* Key Institutions */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Key Institutions
              </Label>
              <Input
                value={institutionsInput}
                onChange={e => setInstitutionsInput(e.target.value)}
                placeholder="Comma-separated: City Hall, Local Parish"
              />
              <p className="text-xs text-muted-foreground">Separate with commas</p>
            </div>

            {/* Transition Issues */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Transition Issues
              </Label>
              <Input
                value={issuesInput}
                onChange={e => setIssuesInput(e.target.value)}
                placeholder="Comma-separated: air quality, displacement, jobs"
              />
              <p className="text-xs text-muted-foreground">Separate with commas</p>
            </div>
          </form>
        </ScrollArea>

        <div className="pt-4 border-t border-[hsl(30_18%_82%)]">
          <Button
            type="submit"
            form="place-form"
            className="w-full bg-[hsl(16_65%_48%)] hover:bg-[hsl(12_55%_35%)] text-white touch-target"
            disabled={!name.trim()}
          >
            Add Place
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CreatePlaceForm;
