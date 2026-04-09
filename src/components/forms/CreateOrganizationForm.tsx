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
import { Building2 } from 'lucide-react';
import type { OrgType } from '@/types/transitus';

const ORG_TYPE_OPTIONS: { value: OrgType; label: string }[] = [
  { value: 'ej_group', label: 'EJ Group' },
  { value: 'church', label: 'Church' },
  { value: 'neighborhood_association', label: 'Neighborhood Association' },
  { value: 'developer', label: 'Developer' },
  { value: 'utility', label: 'Utility' },
  { value: 'labor_group', label: 'Labor Group' },
  { value: 'health_system', label: 'Health System' },
  { value: 'diocese', label: 'Diocese' },
  { value: 'foundation', label: 'Foundation' },
  { value: 'government_agency', label: 'Government Agency' },
  { value: 'ngo', label: 'NGO' },
  { value: 'community_land_trust', label: 'Community Land Trust' },
  { value: 'cooperative', label: 'Cooperative' },
  { value: 'school', label: 'School' },
  { value: 'other', label: 'Other' },
];

interface CreateOrganizationFormProps {
  trigger?: React.ReactNode;
}

export function CreateOrganizationForm({ trigger }: CreateOrganizationFormProps) {
  const { places, addOrganization } = useTransitusData();
  const [open, setOpen] = useState(false);

  const [name, setName] = useState('');
  const [orgType, setOrgType] = useState<OrgType>('ngo');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [placeIds, setPlaceIds] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState('');

  const resetForm = () => {
    setName('');
    setOrgType('ngo');
    setDescription('');
    setWebsite('');
    setPlaceIds([]);
    setTagsInput('');
  };

  const placeOptions = places.map(p => ({ value: p.id, label: p.name }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    addOrganization({
      name: name.trim(),
      org_type: orgType,
      description: description.trim(),
      website: website.trim() || undefined,
      place_ids: placeIds,
      stakeholder_ids: [],
      tags,
    });

    toast.success('Organization added');
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
            <Building2 className="h-4 w-4 mr-1" />
            New Organization
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="bg-[hsl(38_30%_95%)] h-[85vh] rounded-t-2xl flex flex-col"
      >
        <SheetHeader className="pb-2">
          <SheetTitle className="font-serif text-xl text-[hsl(20_25%_12%)]">
            New Organization
          </SheetTitle>
          <SheetDescription>
            Add an organization to your network.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <form id="org-form" onSubmit={handleSubmit} className="space-y-5 pb-6">
            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Organization name"
                required
              />
            </div>

            {/* Org Type */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Type
              </Label>
              <Select value={orgType} onValueChange={(v) => setOrgType(v as OrgType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORG_TYPE_OPTIONS.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Description
              </Label>
              <Textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="What does this organization do?"
                rows={3}
              />
            </div>

            {/* Website */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Website
              </Label>
              <Input
                type="url"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                placeholder="https://example.org"
              />
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

            {/* Tags */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Tags
              </Label>
              <Input
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="Comma-separated: energy, labor, faith"
              />
              <p className="text-xs text-muted-foreground">Separate with commas</p>
            </div>
          </form>
        </ScrollArea>

        <div className="pt-4 border-t border-[hsl(30_18%_82%)]">
          <Button
            type="submit"
            form="org-form"
            className="w-full bg-[hsl(16_65%_48%)] hover:bg-[hsl(12_55%_35%)] text-white touch-target"
            disabled={!name.trim()}
          >
            Add Organization
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CreateOrganizationForm;
