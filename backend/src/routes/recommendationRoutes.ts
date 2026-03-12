import { Router } from 'express';
import * as recommendationController from '../controllers/recommendationController';

const router = Router();

// Similar prompts for a specific prompt
// /api/prompts/:id/similar
router.get('/:id/similar', recommendationController.getSimilarPromptRecommendations);

// Personalized prompts for a user
// /api/recommendations/personalized
router.get('/personalized', recommendationController.getPersonalizedRecommendations);

export default router;
