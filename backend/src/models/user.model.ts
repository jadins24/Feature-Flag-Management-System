import { supabase } from '../config/db';
import { User } from '../types';

export async function createUser(
  email: string,
  passwordHash: string,
  role: 'super_admin' | 'org_admin' | 'end_user',
  orgId: string | null = null
): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .insert({ email, password_hash: passwordHash, role, org_id: orgId })
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (error) throw error;
  return (data as User) || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return (data as User) || null;
}
