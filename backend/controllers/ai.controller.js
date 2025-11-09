import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";
dotenv.config();

const HF_API_KEY = process.env.HF_API_KEY;
// Using a model that supports text-generation with the router
const HF_MODEL = "meta-llama/Llama-3.2-3B-Instruct"; // Supports text-generation
const hf = new HfInference(HF_API_KEY);

export const generatePost = async (req, res) => {
  try {
    const { topic, tone } = req.body;
    
    console.log("=== AI POST GENERATION REQUEST ===");
    console.log("Topic:", topic);
    console.log("Tone:", tone);
    console.log("API Key exists:", !!HF_API_KEY);
    console.log("API Key length:", HF_API_KEY?.length);
    console.log("Model:", HF_MODEL);
    
    if (!topic) return res.status(400).json({ message: "Topic is required" });
    
    if (!HF_API_KEY) {
      console.error("❌ HF_API_KEY is not set!");
      return res.status(500).json({ 
        message: "AI service not configured. Please set HF_API_KEY in .env file" 
      });
    }

    const systemMessage = `You are a professional LinkedIn content creator. Generate engaging, professional LinkedIn posts.`;
    const userMessage = `Write a professional LinkedIn post about "${topic}". 
The tone should be ${tone || 'professional and engaging'}. 
Include relevant insights and keep it concise (150-250 words). 
Make it engaging with a clear message.

IMPORTANT: Do NOT use markdown formatting. Do NOT use ** for bold, # for headings, or any other markdown symbols. Write in plain text only with natural paragraphs.`;

    console.log("🚀 Sending request to Hugging Face Router API...");

    // Use chatCompletion instead of textGeneration
    const output = await hf.chatCompletion({
      model: HF_MODEL,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    console.log("✅ Response received from Hugging Face");
    console.log("Output type:", typeof output);

    let generatedText = output?.choices?.[0]?.message?.content?.trim() || "";
    
    // Remove markdown formatting
    generatedText = generatedText
      .replace(/\*\*/g, '') // Remove ** bold
      .replace(/\*/g, '')   // Remove * italic
      .replace(/^#{1,6}\s+/gm, '') // Remove # headings
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Convert [text](url) to text
      .replace(/`{1,3}([^`]+)`{1,3}/g, '$1') // Remove ` code blocks
      .trim();
    
    console.log("Generated text length:", generatedText.length);

    return res.status(200).json({
      message: "Post generated successfully",
      generatedPost: generatedText,
      topic
    });
  } catch (error) {
    console.error("❌ Error generating post:", error.message);
    console.error("Error details:", error);
    return res.status(500).json({
      message: "Error generating post. " + error.message,
      error: error.message
    });
  }
};

// Generate professional comment suggestions
export const generateCommentSuggestions = async (req, res) => {
  try {
    const { postContent } = req.body;

    if (!postContent) {
      return res.status(400).json({ message: "Post content is required" });
    }

    const systemMessage = `You are a professional LinkedIn user who writes thoughtful, engaging comments.`;
    const userMessage = `Based on this LinkedIn post, suggest 3 professional and thoughtful comments.

Post:
"${postContent}"

Generate 3 different comment suggestions (each 1–2 sentences). Number them clearly.`;

    console.log("🚀 Sending request for comment suggestions...");

    // Use chatCompletion API
    const output = await hf.chatCompletion({
      model: HF_MODEL,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      max_tokens: 200,
      temperature: 0.8,
    });

    const generatedText = output?.choices?.[0]?.message?.content?.trim() || "";

    return res.status(200).json({
      message: "Comment suggestions generated successfully",
      suggestions: generatedText,
    });
  } catch (error) {
    console.error("❌ Error generating comments:", error);
    return res.status(500).json({
      message: "Error generating comments",
      error: error.message,
    });
  }
};