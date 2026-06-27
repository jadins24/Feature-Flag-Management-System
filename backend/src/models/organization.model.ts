import { supabase } from '../config/db';
import { Organization } from '../types';

export async function createOrg(name: string): Promise<Organization> {
  const { data, error } = await supabase
    .from('organizations')
    .insert({ name })
    .select()
    .single();

  if (error) throw error;
  return data as Organization;
}

export async function getAllOrgs(): Promise<Organization[]> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as Organization[]) || [];
}

export async function updateOrg(id: string, name: string): Promise<Organization> {
  const { data, error } = await supabase
    .from('organizations')
    .update({ name })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Organization;
}

export async function getOrgById(id: string): Promise<Organization | null> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return (data as Organization) || null;
}
