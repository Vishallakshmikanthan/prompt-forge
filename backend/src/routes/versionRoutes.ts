import { Router } from 'express';
import { getPromptVersions } from '../controllers/versionController';

const router = Router();

// GET /api/prompts/:id/versions
router.get('/:id/versions', getPromptVersions);

export default router;
