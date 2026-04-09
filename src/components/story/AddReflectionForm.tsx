import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddReflection } from '@/hooks/useReflections';
import { Feather, Loader2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddReflectionFormProps {
  opportunityId: string;
}

const CHAR_SOFT_LIMIT = 5500;
const CHAR_HARD_LIMIT = 6000;

export function AddReflectionForm({ opportunityId }: AddReflectionFormProps) {
  const [body, setBody] = useState('');
  const [visibility, setVisibility] = useState<'team' | 'private'>('team');
  const [error, setError] = useState<string | null>(null);
  const submittingRef = useRef(false);
  const addReflection = useAddReflection();

  const trimmed = body.trim();
  const charCount = trimmed.length;
  const overSoft = charCount > CHAR_SOFT_LIMIT;
  const overHard = charCount > CHAR_HARD_LIMIT;

  const handleSubmit = async () => {
    if (!trimmed || overHard || submittingRef.current) return;
    submittingRef.current = true;
    setError(null);
    try {
      await addReflection.mutateAsync({ opportunityId, body: trimmed, visibility });
      setBody('');
    } catch (err: any) {
      setError(err?.message || 'Failed to add reflection. Please try again.');
    } finally {
      submittingRef.current = false;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Feather className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Add a reflection</span>
      </div>
      <Textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="What have you noticed, learned, or felt about this relationship?"
        className="min-h-[80px] text-sm"
        maxLength={CHAR_HARD_LIMIT + 100} // Allow a small buffer for UX, enforce on submit
      />
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Select value={visibility} onValueChange={v => setVisibility(v as 'team' | 'private')}>
            <SelectTrigger className="w-32 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="team">Team visible</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
          {charCount > 0 && (
            <span className={cn(
              'text-[10px]',
              overHard ? 'text-destructive font-medium' : overSoft ? 'text-warning' : 'text-muted-foreground/60',
            )}>
              {charCount.toLocaleString()}/{CHAR_HARD_LIMIT.toLocaleString()}
            </span>
          )}
        </div>
        <Button
          size="sm"
          className="gap-1.5 h-7 text-xs"
          disabled={!trimmed || overHard || addReflection.isPending}
          onClick={handleSubmit}
        >
          {addReflection.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
          Add reflection
        </Button>
      </div>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
