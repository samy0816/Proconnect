import dotenv from "dotenv";
dotenv.config();

const HF_API_KEY = process.env.HUGGING_FACE_API_KEY || process.env.HF_API_KEY;
const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.1";
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

// Call HF Inference API directly via fetch (bypasses SDK provider routing)
async function callHfApi(prompt, maxTokens = 300) {
  const response = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: maxTokens,
        temperature: 0.7,
        return_full_text: false,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`HF API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  // HF text-generation returns [{generated_text: "..."}]
  return Array.isArray(data) ? data[0]?.generated_text?.trim() : data?.generated_text?.trim() || "";
}

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

    console.log("🚀 Sending request to Hugging Face Inference API...");

    const prompt = `[INST] ${systemMessage}\n\n${userMessage} [/INST]`;
    let generatedText = await callHfApi(prompt, 350);
    
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
    console.error("HTTP status:", error.statusCode || error.status || 'N/A');
    console.error("API Key set:", !!HF_API_KEY);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return res.status(500).json({
      message: "Error generating post. " + error.message,
      error: error.message,
      hint: !HF_API_KEY ? 'HF_API_KEY is not set on the server' : undefined
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

    const prompt = `[INST] ${systemMessage}\n\n${userMessage} [/INST]`;
    const generatedText = await callHfApi(prompt, 250);

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