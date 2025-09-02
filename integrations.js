/**
 * Dream Interpretation and Image Generation using OpenRouter AI
 * Models used:
 * - Dream Interpretation: "openrouter/mixtral-8x7b" (free)
 * - Image Generation: "stability-ai/sdxl" (free)
 * You need a free API key from https://openrouter.ai/
 *
 * Replace 'YOUR_OPENROUTER_API_KEY' with your actual API key.
 */

const OPENROUTER_API_KEY = "YOUR_OPENROUTER_API_KEY"; // <-- Put your key here

// Dream Interpretation Function (Text Generation)
export async function interpretDream(dreamText) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openrouter/mixtral-8x7b", // Free model; you can also try "openrouter/mythomax"
      messages: [
        { role: "system", content: "You are a mystical dream interpreter. Provide detailed, spiritual insights based on dreams." },
        { role: "user", content: dreamText }
      ],
      max_tokens: 500,
      temperature: 0.8
    })
  });
  const data = await response.json();
  // Defensive check for model response
  if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
    return data.choices[0].message.content;
  }
  return "Sorry, couldn't interpret the dream.";
}

// Image Generation Function (Stable Diffusion XL)
export async function generateImage(prompt) {
  const response = await fetch("https://openrouter.ai/api/v1/images/generations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "stability-ai/sdxl", // Free model for image generation
      prompt,
      n: 1, // Number of images
      size: "1024x1024"
    })
  });
  const data = await response.json();
  // Defensive check for image response
  if (data.data && data.data[0] && data.data[0].url) {
    return data.data[0].url;
  }
  return "Image generation failed.";
}
