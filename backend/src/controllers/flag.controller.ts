import { Request, Response } from 'express';
import * as flagModel from '../models/flag.model';
import { getOrgById } from '../models/organization.model';

/**
 * POST /flags
 * Create a feature flag scoped to the admin's org.
 */
export async function createFlag(req: Request, res: Response): Promise<void> {
  try {
    const { feature_key } = req.body;
    const orgId = req.user!.orgId!;
    const userId = req.user!.userId;

    if (!feature_key || typeof feature_key !== 'string' || feature_key.trim().length === 0) {
      res.status(400).json({ error: 'feature_key is required.', statusCode: 400 });
      return;
    }

    const flag = await flagModel.createFlag(orgId, feature_key.trim(), userId);
    res.status(201).json(flag);
  } catch (err: any) {
    // Handle unique constraint violation
    if (err.code === '23505') {
      res.status(409).json({ error: 'A flag with this key already exists in your organization.', statusCode: 409 });
      return;
    }
    console.error('Create flag error:', err);
    res.status(500).json({ error: 'Internal server error.', statusCode: 500 });
  }
}

/**
 * GET /flags
 * List all flags for the admin's org.
 */
export async function listFlags(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.user!.orgId!;
    const flags = await flagModel.getFlagsByOrg(orgId);
    res.status(200).json(flags);
  } catch (err) {
    console.error('List flags error:', err);
    res.status(500).json({ error: 'Internal server error.', statusCode: 500 });
  }
}

/**
 * PATCH /flags/:id
 * Toggle enabled/disabled or update feature_key.
 * Verifies the flag belongs to the admin's org.
 */
export async function updateFlag(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const orgId = req.user!.orgId!;
    const { enabled, feature_key } = req.body;

    // Verify the flag exists
    const existingFlag = await flagModel.getFlagById(id);
    if (!existingFlag) {
      res.status(404).json({ error: 'Flag not found.', statusCode: 404 });
      return;
    }

    // Verify the flag belongs to the admin's org (tenant isolation)
    if (existingFlag.org_id !== orgId) {
      res.status(403).json({ error: 'You do not have permission to modify this flag.', statusCode: 403 });
      return;
    }

    // Build update object
    const updates: { enabled?: boolean; feature_key?: string } = {};
    if (enabled !== undefined) updates.enabled = Boolean(enabled);
    if (feature_key !== undefined) {
      if (typeof feature_key !== 'string' || feature_key.trim().length === 0) {
        res.status(400).json({ error: 'feature_key must be a non-empty string.', statusCode: 400 });
        return;
      }
      updates.feature_key = feature_key.trim();
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: 'No valid fields to update. Provide enabled and/or feature_key.', statusCode: 400 });
      return;
    }

    const updatedFlag = await flagModel.updateFlag(id, updates);
    res.status(200).json(updatedFlag);
  } catch (err: any) {
    if (err.code === '23505') {
      res.status(409).json({ error: 'A flag with this key already exists in your organization.', statusCode: 409 });
      return;
    }
    console.error('Update flag error:', err);
    res.status(500).json({ error: 'Internal server error.', statusCode: 500 });
  }
}

/**
 * DELETE /flags/:id
 * Delete a feature flag. Verifies org ownership.
 */
export async function deleteFlag(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const orgId = req.user!.orgId!;

    // Verify the flag exists
    const existingFlag = await flagModel.getFlagById(id);
    if (!existingFlag) {
      res.status(404).json({ error: 'Flag not found.', statusCode: 404 });
      return;
    }

    // Verify org ownership
    if (existingFlag.org_id !== orgId) {
      res.status(403).json({ error: 'You do not have permission to delete this flag.', statusCode: 403 });
      return;
    }

    await flagModel.deleteFlag(id);
    res.status(200).json({ message: 'Flag deleted successfully.' });
  } catch (err) {
    console.error('Delete flag error:', err);
    res.status(500).json({ error: 'Internal server error.', statusCode: 500 });
  }
}

/**
 * POST /flags/check
 * Public endpoint — check if a feature flag is enabled.
 */
export async function checkFlag(req: Request, res: Response): Promise<void> {
  try {
    const { org_id, feature_key } = req.body;

    if (!org_id || !feature_key) {
      res.status(400).json({ error: 'org_id and feature_key are required.', statusCode: 400 });
      return;
    }

    // Verify org exists
    const org = await getOrgById(org_id);
    if (!org) {
      res.status(404).json({ error: 'Organization not found.', statusCode: 404 });
      return;
    }

    const result = await flagModel.checkFlag(org_id, feature_key);
    if (!result) {
      res.status(404).json({ error: `Feature flag '${feature_key}' not found for this organization.`, statusCode: 404 });
      return;
    }

    res.status(200).json({ enabled: result.enabled });
  } catch (err) {
    console.error('Check flag error:', err);
    res.status(500).json({ error: 'Internal server error.', statusCode: 500 });
  }
}
