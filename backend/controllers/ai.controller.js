import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";
dotenv.config();

const HF_API_KEY = process.env.HUGGING_FACE_API_KEY || process.env.HF_API_KEY;
const HF_MODEL = "Qwen/Qwen3-8B";
const hf = new HfInference(HF_API_KEY);

async function callHF(systemMsg, userMsg, maxTokens) {
  const output = await hf.chatCompletion({
    model: HF_MODEL,
    messages: [
      { role: "system", content: systemMsg },
      { role: "user", content: userMsg },
    ],
    max_tokens: maxTokens,
    temperature: 0.7,
  });
  return output?.choices?.[0]?.message?.content?.trim() || "";
}

export const generatePost = async (req, res) => {
  try {
    const { topic, tone } = req.body;

    console.log("=== AI POST GENERATION ===");
    console.log("Topic:", topic, "| Tone:", tone);
    console.log("API Key:", !!HF_API_KEY);

    if (!topic) return res.status(400).json({ message: "Topic is required" });
    if (!HF_API_KEY) return res.status(500).json({ message: "AI service not configured. Set HF_API_KEY." });

    const systemMsg = "You are a professional content writer. Generate engaging, thoughtful posts.";
    const userMsg = `Write a professional post about "${topic}". Tone: ${tone || 'professional and engaging'}. Keep it 120-200 words. Write in plain paragraphs — no markdown, no asterisks, no hashtags.`;

    console.log("🚀 Calling HF API...");
    let text = await callHF(systemMsg, userMsg, 350);

    text = text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/^#{1,6}\s+/gm, '').replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1').replace(/`{1,3}[^`]+`{1,3}/g, '').trim();

    console.log("✅ Generated, length:", text.length);
    return res.status(200).json({ message: "Post generated successfully", generatedPost: text, topic });
  } catch (error) {
    console.error("❌ Post gen error:", error.message);
    return res.status(500).json({ message: "Error generating post. " + error.message });
  }
};

export const generateCommentSuggestions = async (req, res) => {
  try {
    const { postContent } = req.body;
    if (!postContent) return res.status(400).json({ message: "Post content is required" });
    if (!HF_API_KEY) return res.status(500).json({ message: "AI service not configured." });

    const systemMsg = "You write thoughtful, professional comments on posts.";
    const userMsg = `Based on this post, suggest exactly 3 concise, professional comments. Number them 1, 2, 3.\n\nPost:\n"${postContent}"`;

    console.log("🚀 Calling HF for comments...");
    let text = await callHF(systemMsg, userMsg, 250);

    return res.status(200).json({ message: "Comment suggestions generated", suggestions: text });
  } catch (error) {
    console.error("❌ Comment gen error:", error.message);
    return res.status(500).json({ message: "Error generating comments", error: error.message });
  }
};

// ✨ AI Post Enhancer — polish a rough draft into a professional post
export const enhancePost = async (req, res) => {
  try {
    const { draft } = req.body;
    if (!draft) return res.status(400).json({ message: "Draft text is required" });
    if (!HF_API_KEY) return res.status(500).json({ message: "AI service not configured." });

    const systemMsg = "You are an expert editor for a professional networking platform. You polish rough drafts into engaging, professional posts.";
    const userMsg = `Polish this rough draft into a professional, engaging post. Fix grammar, improve flow, and make it more compelling. Keep the same core message and length. Return ONLY the polished text — no explanations, no markdown.\n\nDraft:\n"${draft}"`;

    console.log("🚀 Enhancing post...");
    let text = await callHF(systemMsg, userMsg, 400);

    text = text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/^#{1,6}\s+/gm, '').replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1').replace(/`{1,3}[^`]+`{1,3}/g, '').trim();

    console.log("✅ Enhanced, length:", text.length);
    return res.status(200).json({ message: "Post enhanced successfully", enhancedPost: text });
  } catch (error) {
    console.error("❌ Enhance error:", error.message);
    return res.status(500).json({ message: "Error enhancing post. " + error.message });
  }
};