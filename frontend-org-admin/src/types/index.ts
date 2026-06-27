/** User roles */
export type Role = 'super_admin' | 'org_admin' | 'end_user';

/** User entity (safe, no password_hash) */
export interface User {
  id: string;
  email: string;
  role: Role;
  org_id: string | null;
  created_at: string;
}

/** Feature flag entity */
export interface FeatureFlag {
  id: string;
  org_id: string;
  feature_key: string;
  enabled: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

/** Auth state shape for Redux */
export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

/** Flags state shape for Redux */
export interface FlagsState {
  flags: FeatureFlag[];
  loading: boolean;
  error: string | null;
}

/** Login request body */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Signup request body */
export interface SignupRequest {
  email: string;
  password: string;
  org_id: string;
}

/** Auth API response */
export interface AuthResponse {
  token: string;
  user: User;
}
