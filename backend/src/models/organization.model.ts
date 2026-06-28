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

export async function getOrgByName(name: string): Promise<Organization | null> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .ilike('name', name);

  if (error) throw error;
  return data && data.length > 0 ? (data[0] as Organization) : null;
}

export interface OrgAdmin {
  id: string;
  email: string;
  role: string;
  org_id: string;
  created_at: string;
  org_name: string;
}

export async function getOrgAdmins(): Promise<OrgAdmin[]> {
  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      email,
      role,
      org_id,
      created_at,
      organizations(name)
    `)
    .eq('role', 'org_admin')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return (data || []).map((user: any) => ({
    id: user.id,
    email: user.email,
    role: user.role,
    org_id: user.org_id,
    created_at: user.created_at,
    org_name: user.organizations?.name || 'Unknown',
  })) as OrgAdmin[];
}

export async function getOrgAdminById(id: string): Promise<OrgAdmin | null> {
  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      email,
      role,
      org_id,
      created_at,
      organizations(name)
    `)
    .eq('id', id)
    .eq('role', 'org_admin')
    .maybeSingle();

  if (error) throw error;
  
  if (!data) return null;
  
  return {
    id: data.id,
    email: data.email,
    role: data.role,
    org_id: data.org_id,
    created_at: data.created_at,
    org_name: (data as any).organizations?.name || 'Unknown',
  } as OrgAdmin;
}
