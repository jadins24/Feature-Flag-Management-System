// ============================================
// Shared types for the Feature Flag Management System
// ============================================

/** User roles */
export type Role = 'super_admin' | 'org_admin' | 'end_user';

/** Organization entity */
export interface Organization {
  id: string;
  name: string;
  created_at: string;
}

/** User entity */
export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: Role;
  org_id: string | null;
  created_at: string;
}

/** User entity without sensitive fields (for API responses) */
export interface SafeUser {
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

/** JWT payload embedded in tokens */
export interface JwtPayload {
  userId: string;
  role: Role;
  orgId: string | null;
}

/** Standard API error shape */
export interface ApiError {
  error: string;
  statusCode: number;
}

/** Auth response returned from login/signup */
export interface AuthResponse {
  token: string;
  user: SafeUser;
}

/** Flag check request body */
export interface FlagCheckRequest {
  org_id: string;
  feature_key: string;
}

/** Flag check response */
export interface FlagCheckResponse {
  enabled: boolean;
}

// Extend Express Request to include user from JWT
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
