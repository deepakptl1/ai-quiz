import OpenAI from "openai";

let _client = null;
function getClient() {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }
  return _client;
}

export async function askAIForJSON(prompt, maxTokens = 2000) {
  const response = await getClient().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });

  let text = response.choices[0].message.content.trim();

  // Strip markdown code fences
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

  // Fallback: extract between first { and last }
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1) {
    text = text.slice(start, end + 1);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Failed to parse AI response as JSON: ${text.slice(0, 200)}`);
  }
}
