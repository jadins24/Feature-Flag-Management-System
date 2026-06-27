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

/** Organization entity */
export interface Organization {
  id: string;
  name: string;
  created_at: string;
}

/** Auth state shape for Redux */
export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

/** Orgs state shape for Redux */
export interface OrgsState {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
}

/** Login request body */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Auth API response */
export interface AuthResponse {
  token: string;
  user: User;
}
