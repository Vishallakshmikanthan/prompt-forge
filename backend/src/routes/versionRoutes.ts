import { Router } from 'express';
import { getPromptVersions, restoreVersion } from '../controllers/versionController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// GET /api/prompts/:id/versions
router.get('/:id/versions', getPromptVersions);

// PATCH /api/prompts/:id/versions/:versionId/restore
router.patch('/:id/versions/:versionId/restore', authenticate, restoreVersion);

export default router;
