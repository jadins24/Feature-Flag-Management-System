import { Request, Response } from 'express';
import { createOrg, getAllOrgs, updateOrg as updateOrgModel } from '../models/organization.model';

/**
 * POST /orgs
 * Create a new organization. Super admin only.
 */
export async function createOrganization(req: Request, res: Response): Promise<void> {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({ error: 'Organization name is required.', statusCode: 400 });
      return;
    }

    const org = await createOrg(name.trim());
    res.status(201).json(org);
  } catch (err) {
    console.error('Create org error:', err);
    res.status(500).json({ error: 'Internal server error.', statusCode: 500 });
  }
}

/**
 * PATCH /orgs/:id
 * Update an organization name. Super admin only.
 */
export async function updateOrganization(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({ error: 'Organization name is required.', statusCode: 400 });
      return;
    }

    const org = await updateOrgModel(id, name.trim());
    res.status(200).json(org);
  } catch (err) {
    console.error('Update org error:', err);
    res.status(500).json({ error: 'Internal server error.', statusCode: 500 });
  }
}

/**
 * GET /orgs
 * List all organizations.
 */
export async function listOrganizations(_req: Request, res: Response): Promise<void> {
  try {
    const orgs = await getAllOrgs();
    res.status(200).json(orgs);
  } catch (err) {
    console.error('List orgs error:', err);
    res.status(500).json({ error: 'Internal server error.', statusCode: 500 });
  }
}
