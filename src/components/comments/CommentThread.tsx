/**
 * CommentThread — Reusable comment thread component for any Transitus entity.
 *
 * Stores comments in localStorage under `transitus_comments`.
 * Shows existing comments (newest-first) with a form to add new ones.
 */

import { useState, useMemo, useCallback } from 'react';
import { MessageSquare } from 'lucide-react';
import PersonAvatar from '@/components/ui/PersonAvatar';

// ── Types ──

export type CommentEntityType =
  | 'place'
  | 'commitment'
  | 'stakeholder'
  | 'field_note'
  | 'signal'
  | 'journey';

export interface Comment {
  id: string;
  entityType: string;
  entityId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface CommentThreadProps {
  entityType: CommentEntityType;
  entityId: string;
}

// ── Storage helpers ──

const STORAGE_KEY = 'transitus_comments';

function loadComments(): Comment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveComments(comments: Comment[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
}

/** Get comment count for a specific entity (useful externally) */
export function getCommentCount(entityType: string, entityId: string): number {
  const all = loadComments();
  return all.filter(
    (c) => c.entityType === entityType && c.entityId === entityId,
  ).length;
}

// ── Helpers ──

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function generateId(): string {
  return `cmt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ── Component ──

export default function CommentThread({ entityType, entityId }: CommentThreadProps) {
  const [allComments, setAllComments] = useState<Comment[]>(loadComments);
  const [newContent, setNewContent] = useState('');

  const entityComments = useMemo(
    () =>
      allComments
        .filter((c) => c.entityType === entityType && c.entityId === entityId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    [allComments, entityType, entityId],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = newContent.trim();
      if (!trimmed) return;

      const comment: Comment = {
        id: generateId(),
        entityType,
        entityId,
        authorName: 's-1',
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      const updated = [...allComments, comment];
      saveComments(updated);
      setAllComments(updated);
      setNewContent('');
    },
    [newContent, entityType, entityId, allComments],
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-[hsl(16_65%_48%)]" />
        <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
          Discussion
        </span>
        {entityComments.length > 0 && (
          <span className="text-xs text-[hsl(30_10%_50%)]">
            ({entityComments.length})
          </span>
        )}
      </div>

      {/* Comment list */}
      {entityComments.length === 0 ? (
        <p className="text-xs text-[hsl(20_8%_52%)] italic">
          No comments yet. Start the conversation.
        </p>
      ) : (
        <div className="space-y-3">
          {entityComments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-lg bg-white p-3 border border-[hsl(30_18%_82%)] border-l-[3px] border-l-[hsl(16_65%_48%)]"
            >
              <div className="flex items-center gap-2 mb-2">
                <PersonAvatar name={comment.authorName} size={24} />
                <span className="text-xs font-medium text-[hsl(20_10%_20%)]">
                  {comment.authorName}
                </span>
                <span className="text-[10px] text-[hsl(20_8%_52%)]">
                  {formatTimestamp(comment.createdAt)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[hsl(30_10%_35%)]">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
          className="w-full rounded-lg border border-[hsl(30_18%_82%)] bg-white px-3 py-2 text-sm text-[hsl(20_10%_20%)] placeholder:text-[hsl(20_8%_52%)] focus:border-[hsl(16_65%_48%)] focus:outline-none focus:ring-1 focus:ring-[hsl(16_65%_48%)] resize-none"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newContent.trim()}
            className="rounded-full bg-[hsl(16_65%_48%)] px-4 py-1.5 text-xs font-medium text-white hover:bg-[hsl(12_55%_35%)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Post Comment
          </button>
        </div>
      </form>
    </div>
  );
}
