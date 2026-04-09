import { useState } from 'react';
import { useTransitusData } from '@/contexts/TransitusDataContext';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';
import type { CommitmentStatus } from '@/types/transitus';
import { COMMITMENT_STATUS_LABELS } from '@/types/transitus';

const STATUS_OPTIONS: { value: CommitmentStatus; label: string }[] = (
  Object.entries(COMMITMENT_STATUS_LABELS) as [CommitmentStatus, string][]
).map(([value, label]) => ({ value, label }));

interface EditCommitmentStatusFormProps {
  commitmentId: string;
  currentStatus: CommitmentStatus;
}

export function EditCommitmentStatusForm({ commitmentId, currentStatus }: EditCommitmentStatusFormProps) {
  const { updateCommitment } = useTransitusData();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<CommitmentStatus>(currentStatus);

  const handleSave = () => {
    if (status !== currentStatus) {
      updateCommitment(commitmentId, { status });
      toast.success('Status updated');
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) setStatus(currentStatus);
    }}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs font-medium text-[hsl(20_25%_12%)] hover:bg-[hsl(38_35%_90%)]"
        >
          {COMMITMENT_STATUS_LABELS[currentStatus]}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3 space-y-3" align="start">
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
          Update Status
        </p>
        <Select value={status} onValueChange={(v) => setStatus(v as CommitmentStatus)}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map(s => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          size="sm"
          className="w-full bg-[hsl(16_65%_48%)] hover:bg-[hsl(12_55%_35%)] text-white"
          onClick={handleSave}
        >
          Save
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export default EditCommitmentStatusForm;
