import { Router } from "express";
import { generatePost, generateCommentSuggestions } from "../controllers/ai.controller.js";

const router = Router();

// AI Post Generation
router.route('/ai/generate-post').post(generatePost);

// AI Comment Suggestions
router.route('/ai/generate-comments').post(generateCommentSuggestions);

export default router;
