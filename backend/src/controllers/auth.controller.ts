import { Request, Response } from 'express';
import { getUserByEmail, createUser, getUsersByOrgId } from '../models/user.model';
import { getOrgByName, getOrgById } from '../models/organization.model';
import { hashPassword, comparePassword } from '../utils/hash';
import { signToken } from '../utils/jwt';
import { SafeUser } from '../types';

/**
 * POST /auth/register/org
 * Register a new org_admin user under an existing organization (looked up by name).
 */
export async function registerOrg(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, orgName } = req.body;

    if (!email || !password || !orgName) {
      res.status(400).json({ error: 'email, password, and orgName are required.', statusCode: 400 });
      return;
    }

    if (typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ error: 'Invalid email format.', statusCode: 400 });
      return;
    }

    if (typeof password !== 'string' || password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters.', statusCode: 400 });
      return;
    }

    if (typeof orgName !== 'string' || orgName.trim().length === 0) {
      res.status(400).json({ error: 'Organization name is required.', statusCode: 400 });
      return;
    }

    // Look up the organization by name — do NOT create a new one
    const org = await getOrgByName(orgName.trim());
    if (!org) {
      res.status(404).json({ error: 'Organization not found. Please contact your administrator.', statusCode: 404 });
      return;
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: 'A user with this email already exists.', statusCode: 409 });
      return;
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser(email, passwordHash, 'org_admin', org.id);

    const token = signToken({
      userId: user.id,
      role: user.role,
      orgId: user.org_id,
    });

    const safeUser: SafeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      org_id: user.org_id,
      created_at: user.created_at,
    };

    res.status(201).json({ token, user: safeUser });
  } catch (err) {
    console.error('Register org error:', err);
    res.status(500).json({ error: 'Internal server error.', statusCode: 500 });
  }
}

/**
 * POST /auth/signup
 * Register a new org_admin user.
 */
export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, org_id } = req.body;

    // --- Input validation ---
    if (!email || !password || !org_id) {
      res.status(400).json({ error: 'email, password, and org_id are required.', statusCode: 400 });
      return;
    }

    if (typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ error: 'Invalid email format.', statusCode: 400 });
      return;
    }

    if (typeof password !== 'string' || password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters.', statusCode: 400 });
      return;
    }

    // --- Verify organization exists ---
    const org = await getOrgById(org_id);
    if (!org) {
      res.status(404).json({ error: 'Organization not found.', statusCode: 404 });
      return;
    }

    // --- Check for existing user ---
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: 'A user with this email already exists.', statusCode: 409 });
      return;
    }

    // --- Create user ---
    const passwordHash = await hashPassword(password);
    const user = await createUser(email, passwordHash, 'org_admin', org_id);

    // --- Issue JWT ---
    const token = signToken({
      userId: user.id,
      role: user.role,
      orgId: user.org_id,
    });

    const safeUser: SafeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      org_id: user.org_id,
      created_at: user.created_at,
    };

    res.status(201).json({ token, user: safeUser });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error.', statusCode: 500 });
  }
}

/**
 * POST /auth/login
 * Authenticate a super_admin or org_admin user.
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'email and password are required.', statusCode: 400 });
      return;
    }

    const user = await getUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.', statusCode: 401 });
      return;
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password.', statusCode: 401 });
      return;
    }

    const token = signToken({
      userId: user.id,
      role: user.role,
      orgId: user.org_id,
    });

    const safeUser: SafeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      org_id: user.org_id,
      created_at: user.created_at,
    };

    res.status(200).json({ token, user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error.', statusCode: 500 });
  }
}

/**
 * POST /auth/users
 * Create an end_user under the authenticated org_admin's organization. Org admin only.
 */
export async function createEndUser(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const orgId = req.user?.orgId;

    if (!orgId) {
      res.status(401).json({ error: 'Org admin context required.', statusCode: 401 });
      return;
    }

    if (!email || !password) {
      res.status(400).json({ error: 'email and password are required.', statusCode: 400 });
      return;
    }

    if (typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ error: 'Invalid email format.', statusCode: 400 });
      return;
    }

    if (typeof password !== 'string' || password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters.', statusCode: 400 });
      return;
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: 'A user with this email already exists.', statusCode: 409 });
      return;
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser(email, passwordHash, 'end_user', orgId);

    const safeUser: SafeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      org_id: user.org_id,
      created_at: user.created_at,
    };

    res.status(201).json({ user: safeUser });
  } catch (err) {
    console.error('Create end user error:', err);
    res.status(500).json({ error: 'Internal server error.', statusCode: 500 });
  }
}

/**
 * GET /auth/users
 * List all users under the authenticated org_admin's organization. Org admin only.
 */
export async function listOrgUsers(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.user?.orgId;

    if (!orgId) {
      res.status(401).json({ error: 'Org admin context required.', statusCode: 401 });
      return;
    }

    const users = await getUsersByOrgId(orgId);
    res.status(200).json(users);
  } catch (err) {
    console.error('List org users error:', err);
    res.status(500).json({ error: 'Internal server error.', statusCode: 500 });
  }
}

/**
 * POST /auth/register/user
 * Public end-user registration under an existing organization name.
 */
export async function registerEndUser(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, orgName } = req.body;

    if (!email || !password || !orgName) {
      res.status(400).json({ error: 'email, password, and orgName are required.', statusCode: 400 });
      return;
    }

    if (typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ error: 'Invalid email format.', statusCode: 400 });
      return;
    }

    if (typeof password !== 'string' || password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters.', statusCode: 400 });
      return;
    }

    // Look up organization by name
    const org = await getOrgByName(orgName.trim());
    if (!org) {
      res.status(404).json({ error: 'Organization not found. Please contact your administrator.', statusCode: 404 });
      return;
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: 'A user with this email already exists.', statusCode: 409 });
      return;
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser(email, passwordHash, 'end_user', org.id);

    const token = signToken({
      userId: user.id,
      role: user.role,
      orgId: user.org_id,
    });

    const safeUser: SafeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      org_id: user.org_id,
      created_at: user.created_at,
    };

    res.status(201).json({ token, user: safeUser });
  } catch (err) {
    console.error('Register end user error:', err);
    res.status(500).json({ error: 'Internal server error.', statusCode: 500 });
  }
}
