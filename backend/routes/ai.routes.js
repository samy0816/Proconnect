import { Router } from "express";
import { generatePost, generateCommentSuggestions, enhancePost } from "../controllers/ai.controller.js";

const router = Router();

// AI Post Generation
router.route('/ai/generate-post').post(generatePost);

// AI Comment Suggestions
router.route('/ai/generate-comments').post(generateCommentSuggestions);

// ✨ AI Post Enhancer
router.route('/ai/enhance-post').post(enhancePost);

export default router;
