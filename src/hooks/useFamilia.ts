/**
 * useFamilia — Hooks for Familia™ organizational kinship.
 *
 * WHAT: Queries familias, memberships, and suggestions for the current tenant.
 * WHERE: Settings → Familia card, Onboarding → Familia step, Gardener insights.
 * WHY: Lightweight relational container — never forced, always optional.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';

export interface Familia {
  id: string;
  name: string;
  created_by_tenant_id: string;
  created_at: string;
}

export interface FamiliaMembership {
  id: string;
  familia_id: string;
  tenant_id: string;
  role: 'founder' | 'member';
  status: 'pending' | 'active';
  created_at: string;
}

export interface FamiliaSuggestion {
  id: string;
  tenant_id: string;
  candidate_tenant_id: string | null;
  candidate_hint: string;
  kinship_score: number;
  reasons: Record<string, unknown>;
  status: 'open' | 'snoozed' | 'dismissed' | 'linked';
  created_at: string;
}

export function useFamiliaStatus() {
  const { tenant } = useTenant();
  const tenantId = tenant?.id;

  return useQuery({
    queryKey: ['familia-status', tenantId],
    enabled: !!tenantId,
    queryFn: async () => {
      // Check active membership
      const { data: memberships } = await supabase
        .from('familia_memberships')
        .select('*, familias:familia_id(id, name)')
        .eq('tenant_id', tenantId)
        .eq('status', 'active');

      const activeMembership = memberships?.[0] ?? null;

      return {
        isInFamilia: !!activeMembership,
        membership: activeMembership as (FamiliaMembership & { familias: Familia }) | null,
      };
    },
  });
}

export function useFamiliaSuggestions() {
  const { tenant } = useTenant();
  const tenantId = tenant?.id;

  return useQuery({
    queryKey: ['familia-suggestions', tenantId],
    enabled: !!tenantId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('familia_suggestions')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('status', 'open')
        .order('kinship_score', { ascending: false })
        .limit(5);
      if (error) throw error;
      return (data ?? []) as FamiliaSuggestion[];
    },
  });
}

export function useCreateFamilia() {
  const { tenant } = useTenant();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const tenantId = tenant?.id;
      if (!tenantId) throw new Error('No tenant');

      // Create familia
      const { data: familia, error: fErr } = await supabase
        .from('familias')
        .insert({ name, created_by_tenant_id: tenantId })
        .select()
        .single();
      if (fErr) throw fErr;

      // Create founder membership
      const { error: mErr } = await supabase
        .from('familia_memberships')
        .insert({
          familia_id: familia.id,
          tenant_id: tenantId,
          role: 'founder',
          status: 'active',
        });
      if (mErr) throw mErr;

      // Update tenant
      await supabase
        .from('tenants')
        .update({ familia_id: familia.id })
        .eq('id', tenantId);

      return familia as Familia;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['familia-status'] });
    },
  });
}

export function useLeaveFamilia() {
  const { tenant } = useTenant();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const tenantId = tenant?.id;
      if (!tenantId) throw new Error('No tenant');

      // Remove membership
      await supabase
        .from('familia_memberships')
        .delete()
        .eq('tenant_id', tenantId);

      // Clear tenant familia_id
      await supabase
        .from('tenants')
        .update({ familia_id: null })
        .eq('id', tenantId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['familia-status'] });
    },
  });
}

export function useDismissSuggestion() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (suggestionId: string) => {
      const { error } = await supabase
        .from('familia_suggestions')
        .update({ status: 'dismissed' })
        .eq('id', suggestionId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['familia-suggestions'] });
    },
  });
}

export function useSnoozeSuggestion() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (suggestionId: string) => {
      const { error } = await supabase
        .from('familia_suggestions')
        .update({ status: 'snoozed' })
        .eq('id', suggestionId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['familia-suggestions'] });
    },
  });
}
