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
import { UserPlus } from 'lucide-react';
import type { TransitusRole } from '@/types/transitus';
import { ROLE_LABELS } from '@/types/transitus';

const ROLE_OPTIONS: { value: TransitusRole; label: string }[] = (
  Object.entries(ROLE_LABELS) as [TransitusRole, string][]
).map(([value, label]) => ({ value, label }));

const TRUST_LEVELS = [
  { value: 'new', label: 'New' },
  { value: 'building', label: 'Building' },
  { value: 'established', label: 'Established' },
  { value: 'deep', label: 'Deep' },
] as const;

interface CreateStakeholderFormProps {
  trigger?: React.ReactNode;
  defaultPlaceId?: string;
}

export function CreateStakeholderForm({ trigger, defaultPlaceId }: CreateStakeholderFormProps) {
  const { places, organizations, addStakeholder } = useTransitusData();
  const [open, setOpen] = useState(false);

  const [name, setName] = useState('');
  const [role, setRole] = useState<TransitusRole>('listener');
  const [organizationId, setOrganizationId] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [placeIds, setPlaceIds] = useState<string[]>(defaultPlaceId ? [defaultPlaceId] : []);
  const [tagsInput, setTagsInput] = useState('');
  const [trustLevel, setTrustLevel] = useState<'new' | 'building' | 'established' | 'deep'>('new');

  const resetForm = () => {
    setName('');
    setRole('listener');
    setOrganizationId('');
    setTitle('');
    setEmail('');
    setPhone('');
    setBio('');
    setPlaceIds(defaultPlaceId ? [defaultPlaceId] : []);
    setTagsInput('');
    setTrustLevel('new');
  };

  const placeOptions = places.map(p => ({ value: p.id, label: p.name }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    addStakeholder({
      name: name.trim(),
      role,
      organization_id: organizationId || undefined,
      title: title.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      bio: bio.trim() || undefined,
      place_ids: placeIds,
      tags,
      trust_level: trustLevel,
    });

    toast.success('Stakeholder added');
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
            <UserPlus className="h-4 w-4 mr-1" />
            New Person
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="bg-[hsl(38_30%_95%)] h-[90vh] rounded-t-2xl flex flex-col"
      >
        <SheetHeader className="pb-2">
          <SheetTitle className="font-serif text-xl text-[hsl(20_25%_12%)]">
            New Stakeholder
          </SheetTitle>
          <SheetDescription>
            Add a person to your relational map.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <form id="stakeholder-form" onSubmit={handleSubmit} className="space-y-5 pb-6">
            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full name"
                required
              />
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Role
              </Label>
              <Select value={role} onValueChange={(v) => setRole(v as TransitusRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map(r => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Organization */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Organization
              </Label>
              <Select value={organizationId} onValueChange={setOrganizationId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select organization..." />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map(o => (
                    <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Title
              </Label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Job title or role description"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Email
              </Label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@example.org"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Phone
              </Label>
              <Input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Bio
              </Label>
              <Textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Brief background or context..."
                rows={3}
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
                placeholder="Comma-separated: labor, housing, faith"
              />
              <p className="text-xs text-muted-foreground">Separate with commas</p>
            </div>

            {/* Trust Level */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
                Trust Level
              </Label>
              <Select value={trustLevel} onValueChange={(v) => setTrustLevel(v as typeof trustLevel)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRUST_LEVELS.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>
        </ScrollArea>

        <div className="pt-4 border-t border-[hsl(30_18%_82%)]">
          <Button
            type="submit"
            form="stakeholder-form"
            className="w-full bg-[hsl(16_65%_48%)] hover:bg-[hsl(12_55%_35%)] text-white touch-target"
            disabled={!name.trim()}
          >
            Add Stakeholder
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CreateStakeholderForm;
