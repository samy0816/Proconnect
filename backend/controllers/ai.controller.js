import dotenv from "dotenv";
dotenv.config();

const HF_API_KEY = process.env.HUGGING_FACE_API_KEY || process.env.HF_API_KEY;

// Chat-capable models using HF's OpenAI-compatible endpoint (newer API format)
const HF_CHAT_MODELS = [
  "mistralai/Mistral-7B-Instruct-v0.2",
  "HuggingFaceH4/zephyr-7b-beta",
  "microsoft/Phi-3-mini-4k-instruct",
];

// Call HF Inference API using the OpenAI-compatible /v1/chat/completions endpoint
async function callHfApi(systemMsg, userMsg, maxTokens = 300) {
  if (!HF_API_KEY) throw new Error("HF_API_KEY is not set on this server");

  let lastError;
  for (const model of HF_CHAT_MODELS) {
    const url = `https://api-inference.huggingface.co/models/${model}/v1/chat/completions`;
    try {
      console.log(`Trying model: ${model}`);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemMsg },
            { role: "user", content: userMsg },
          ],
          max_tokens: maxTokens,
          temperature: 0.7,
          stream: false,
        }),
      });

      const raw = await response.text();
      if (!response.ok) {
        console.warn(`Model ${model} → HTTP ${response.status}: ${raw.slice(0, 300)}`);
        lastError = new Error(`HF ${response.status} for ${model}: ${raw.slice(0, 200)}`);
        continue;
      }

      const data = JSON.parse(raw);
      if (data?.error) {
        console.warn(`Model ${model} returned error:`, data.error);
        lastError = new Error(data.error);
        continue;
      }

      const text = data?.choices?.[0]?.message?.content?.trim() || "";
      console.log(`✅ Success with model: ${model}, length: ${text.length}`);
      return text;
    } catch (err) {
      console.warn(`Model ${model} threw: ${err.message}`);
      lastError = err;
    }
  }
  throw lastError || new Error("All AI models failed");
}

export const generatePost = async (req, res) => {
  try {
    const { topic, tone } = req.body;
    
    console.log("=== AI POST GENERATION REQUEST ===");
    console.log("Topic:", topic);
    console.log("Tone:", tone);
    console.log("API Key exists:", !!HF_API_KEY);
    console.log("API Key length:", HF_API_KEY?.length);
    console.log("Models to try:", HF_CHAT_MODELS);
    
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

    let generatedText = await callHfApi(systemMessage, userMessage, 350);
    
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

    const generatedText = await callHfApi(systemMessage, userMessage, 250);

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