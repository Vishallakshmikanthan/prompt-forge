import { Router } from 'express';
import * as searchController from '../controllers/searchController';
import { searchValidation } from '../middleware/validation';

const router = Router();

/**
 * Global Semantic Search
 * GET /api/search?q=...
 */
router.get('/', searchValidation, searchController.semanticSearch);

export default router;
