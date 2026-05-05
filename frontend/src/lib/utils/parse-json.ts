/**
 * Sanitize AI response text and parse as JSON.
 * Strips markdown code fences (```json ... ```) and leading/trailing whitespace
 * that some LLMs return despite jsonMode being enabled.
 */
export function parseAIJson<T>(raw: string): T {
  let cleaned = raw.trim();

  // Strip markdown code fences: ```json ... ``` or ``` ... ```
  const fenceMatch = cleaned.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?\s*```$/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  // Some models prepend explanatory text before the JSON object
  const jsonStart = cleaned.indexOf('{');
  const jsonArrStart = cleaned.indexOf('[');
  let start = -1;
  if (jsonStart >= 0 && jsonArrStart >= 0) {
    start = Math.min(jsonStart, jsonArrStart);
  } else if (jsonStart >= 0) {
    start = jsonStart;
  } else if (jsonArrStart >= 0) {
    start = jsonArrStart;
  }

  if (start > 0) {
    cleaned = cleaned.slice(start);
  }

  // Also strip trailing non-JSON text after the last } or ]
  const lastBrace = cleaned.lastIndexOf('}');
  const lastBracket = cleaned.lastIndexOf(']');
  const end = Math.max(lastBrace, lastBracket);
  if (end >= 0 && end < cleaned.length - 1) {
    cleaned = cleaned.slice(0, end + 1);
  }

  return JSON.parse(cleaned) as T;
}
