import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

export interface ChatSession {
  id: string;
  user_id: string;
  title: string | null;
  started_at: string;
  last_message_at: string;
  message_count: number;
  is_active: boolean;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  metadata: Record<string, unknown> | null;
}

export function useChatSessions() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['ai-chat-sessions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('ai_chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('last_message_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data as ChatSession[];
    },
    enabled: !!user?.id,
  });
}

export function useChatMessages(sessionId: string | null) {
  return useQuery({
    queryKey: ['ai-chat-messages', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      
      const { data, error } = await supabase
        .from('ai_chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as ChatMessage[];
    },
    enabled: !!sessionId,
  });
}

// Simplified hook for getting current active session with messages
export function useAIChatSession() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['ai-chat-active-session', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      // Get or create active session
      const { data: sessions, error: sessionsError } = await supabase
        .from('ai_chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('last_message_at', { ascending: false })
        .limit(1);
      
      if (sessionsError) throw sessionsError;
      
      let session = sessions?.[0] || null;
      
      // If no active session, create one
      if (!session) {
        const { data: newSession, error: createError } = await supabase
          .from('ai_chat_sessions')
          .insert({
            user_id: user.id,
            is_active: true,
            title: 'New Chat',
            message_count: 0,
          })
          .select()
          .single();
        
        if (createError) throw createError;
        session = newSession;
      }
      
      // Get messages for this session
      const { data: messages, error: messagesError } = await supabase
        .from('ai_chat_messages')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });
      
      if (messagesError) throw messagesError;
      
      return {
        ...session,
        messages: (messages || []) as ChatMessage[],
      };
    },
    enabled: !!user?.id,
  });
}

export function useSendChatMessage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (message: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      
      // Get active session ID
      const activeSession = queryClient.getQueryData<{ id: string }>(['ai-chat-active-session', user?.id]);
      const sessionId = activeSession?.id;
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/profunda-ai?mode=chat`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message, sessionId }),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429 && errorData.error === 'AI_QUOTA_EXCEEDED') {
          throw new Error(errorData.message || 'AI usage limit reached for this period.');
        }
        throw new Error(errorData.message || 'Chat failed');
      }
      
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Chat failed');
      
      // Surface usage warning via toast if present
      if (data.usage_warning) {
        const { toast: toastFn } = await import('sonner');
        toastFn.warning(data.usage_warning);
      }
      
      return data as { success: boolean; session_id: string; message: string; actions_created?: string[]; usage_warning?: string };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ai-chat-active-session'] });
      queryClient.invalidateQueries({ queryKey: ['ai-chat-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['ai-bundles'] });
      queryClient.invalidateQueries({ queryKey: ['ai-suggestions'] });
      
      if (data.actions_created && data.actions_created.length > 0) {
        queryClient.invalidateQueries({ queryKey: ['contacts'] });
        queryClient.invalidateQueries({ queryKey: ['opportunities'] });
        queryClient.invalidateQueries({ queryKey: ['activities'] });
        queryClient.invalidateQueries({ queryKey: ['reflections'] });
        queryClient.invalidateQueries({ queryKey: ['events'] });
        queryClient.invalidateQueries({ queryKey: ['volunteers'] });
        queryClient.invalidateQueries({ queryKey: ['grants'] });
        queryClient.invalidateQueries({ queryKey: ['provisions'] });
        queryClient.invalidateQueries({ queryKey: ['story-events'] });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send message');
    },
  });
}

export function useClearChatSession() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');
      
      // Delete all messages from active sessions and deactivate them
      const { data: activeSessions } = await supabase
        .from('ai_chat_sessions')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true);
      
      for (const session of activeSessions || []) {
        await supabase
          .from('ai_chat_messages')
          .delete()
          .eq('session_id', session.id);
        
        await supabase
          .from('ai_chat_sessions')
          .update({ is_active: false })
          .eq('id', session.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-chat-active-session'] });
      queryClient.invalidateQueries({ queryKey: ['ai-chat-sessions'] });
      toast.success('Chat cleared');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to clear chat');
    },
  });
}

export function useDeleteChatSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase
        .from('ai_chat_sessions')
        .delete()
        .eq('id', sessionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-chat-sessions'] });
      toast.success('Chat session deleted');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete session');
    },
  });
}
