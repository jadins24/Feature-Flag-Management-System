import { supabase } from '../config/db';
import { FeatureFlag } from '../types';

export async function createFlag(
  orgId: string,
  featureKey: string,
  createdBy: string
): Promise<FeatureFlag> {
  const { data, error } = await supabase
    .from('feature_flags')
    .insert({ org_id: orgId, feature_key: featureKey, enabled: false, created_by: createdBy })
    .select()
    .single();

  if (error) throw error;
  return data as FeatureFlag;
}

export async function getFlagsByOrg(orgId: string): Promise<FeatureFlag[]> {
  const { data, error } = await supabase
    .from('feature_flags')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as FeatureFlag[]) || [];
}

export async function getFlagById(id: string): Promise<FeatureFlag | null> {
  const { data, error } = await supabase
    .from('feature_flags')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return (data as FeatureFlag) || null;
}

export async function updateFlag(
  id: string,
  updates: { enabled?: boolean; feature_key?: string }
): Promise<FeatureFlag> {
  const payload: Record<string, any> = {};
  if (updates.enabled !== undefined) payload.enabled = updates.enabled;
  if (updates.feature_key !== undefined) payload.feature_key = updates.feature_key;
  payload.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('feature_flags')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as FeatureFlag;
}

export async function deleteFlag(id: string): Promise<void> {
  const { error } = await supabase.from('feature_flags').delete().eq('id', id);
  if (error) throw error;
}

export async function checkFlag(
  orgId: string,
  featureKey: string
): Promise<{ enabled: boolean } | null> {
  const { data, error } = await supabase
    .from('feature_flags')
    .select('enabled')
    .eq('org_id', orgId)
    .eq('feature_key', featureKey)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return { enabled: data.enabled };
}
