import OpenAI from "openai";
import { ExtractedLabel } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const STRUCTURING_PROMPT = `You are an expert at reading equipment labels and nameplates. You will be given raw OCR text extracted from an IT equipment label. Parse it and extract structured fields.

Return a JSON object with these fields:
- manufacturer: The brand or manufacturer name (e.g., "Dell", "HP", "Cisco", "Lenovo")
- model: The model number or name
- serialNumber: The serial number (S/N, Service Tag, etc.)
- assetTag: Any asset tag or inventory number
- extraFields: An object containing any OTHER identifiable fields (e.g., MAC address, part number, voltage, wattage, manufacturing date, firmware version, etc.)
- rawText: The original OCR text, passed through unchanged
- confidence: "high" if the text is clear and fields are unambiguous, "medium" if some parts are unclear, "low" if the text is messy or fields are hard to identify

Important rules:
- If a field is not found in the text, use an empty string ""
- For extraFields, use descriptive camelCase key names (e.g., "macAddress", "partNumber", "voltage")
- Be precise with serial numbers and model numbers — every character matters
- If you see multiple serial numbers or identifiers, include the primary one in serialNumber and others in extraFields

Return ONLY valid JSON, no markdown formatting, no explanation.`;

/**
 * Use GPT-4o-mini (text-only, ~50x cheaper than GPT-4o Vision) to structure
 * raw OCR text into labeled fields.
 */
export async function structureLabelText(
  rawText: string
): Promise<ExtractedLabel> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: STRUCTURING_PROMPT },
      {
        role: "user",
        content: `Here is the raw OCR text from an equipment label:\n\n${rawText}`,
      },
    ],
    max_tokens: 800,
    temperature: 0,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from AI model");
  }

  try {
    const parsed = JSON.parse(content);
    return {
      manufacturer: parsed.manufacturer || "",
      model: parsed.model || "",
      serialNumber: parsed.serialNumber || "",
      assetTag: parsed.assetTag || "",
      extraFields: parsed.extraFields || {},
      rawText: rawText,
      confidence: parsed.confidence || "medium",
    };
  } catch {
    throw new Error("Failed to parse AI response as structured data");
  }
}
