import { Request, Response } from 'express';
import { getUserByEmail, createUser } from '../models/user.model';
import { createOrg, getOrgById } from '../models/organization.model';
import { hashPassword, comparePassword } from '../utils/hash';
import { signToken } from '../utils/jwt';
import { SafeUser } from '../types';

/**
 * POST /auth/register/org
 * Create a new organization and its first org_admin user in one step.
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

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: 'A user with this email already exists.', statusCode: 409 });
      return;
    }

    const org = await createOrg(orgName.trim());
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

    // --- Input validation ---
    if (!email || !password) {
      res.status(400).json({ error: 'email and password are required.', statusCode: 400 });
      return;
    }

    // --- Find user ---
    const user = await getUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.', statusCode: 401 });
      return;
    }

    // --- Verify password ---
    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password.', statusCode: 401 });
      return;
    }

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

    res.status(200).json({ token, user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error.', statusCode: 500 });
  }
}
