import { InferenceClient } from "@huggingface/inference";
export async function sendPromptToLlama(prompt) {
  const HF_API_TOKEN = import.meta.env.VITE_HF_TOKEN;
  if (!HF_API_TOKEN) {
    console.error("❌ Missing HuggingFace API Token");
    throw new Error("Missing HuggingFace API Token!");
  }
  try {
    const client = new InferenceClient(HF_API_TOKEN);
    const response = await client.chatCompletion({
      model: "meta-llama/Llama-3.3-70B-Instruct:groq",
      messages: [
        { role: "user", content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });
    // Validate response format
    if (!response || !response.choices || !response.choices[0]) {
      console.error("❌ Invalid API response:", response);
      throw new Error("Invalid Llama API response format.");
    }
    const message = response.choices[0].message?.content;
    return message || "No output generated.";
  } catch (error) {
    // Known HuggingFace SDK Errors
    if (error?.response?.status) {
      console.error("❌ HuggingFace API Error:", error.response.status, error.message);
      switch (error.response.status) {
        case 401:
          throw new Error("Invalid or expired HuggingFace API token.");
        case 403:
          throw new Error("Access denied. Check your model permissions.");
        case 429:
          throw new Error("Rate limit exceeded. Try again later.");
        case 500:
          throw new Error("HuggingFace server error. Please try again.");
        default:
          throw new Error(`API Error: ${error.response.status}`);
      }
    }
    // Network / JS errors
    console.error("❌ Unexpected Error:", error);
    throw new Error("Something went wrong while connecting to Llama API.");
  }
}