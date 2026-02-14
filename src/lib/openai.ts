import OpenAI from "openai";
import { ExtractedLabel } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const EXTRACTION_PROMPT = `You are an expert at reading equipment labels and nameplates. Analyze this image of an IT equipment label and extract all visible information.

Return a JSON object with these fields:
- manufacturer: The brand or manufacturer name (e.g., "Dell", "HP", "Cisco", "Lenovo")
- model: The model number or name
- serialNumber: The serial number (S/N, Service Tag, etc.)
- assetTag: Any asset tag or inventory number
- extraFields: An object containing any OTHER fields visible on the label (e.g., MAC address, part number, voltage, wattage, manufacturing date, firmware version, etc.)
- rawText: ALL text visible on the label, exactly as written
- confidence: "high" if the label is clear and readable, "medium" if some parts are unclear, "low" if the image is blurry or partially obscured

Important rules:
- If a field is not visible or not applicable, use an empty string ""
- For extraFields, use descriptive key names (e.g., "macAddress", "partNumber", "voltage")
- Be precise with serial numbers and model numbers — every character matters
- If you see multiple serial numbers or identifiers, include the primary one in serialNumber and others in extraFields

Return ONLY valid JSON, no markdown formatting, no explanation.`;

export async function extractLabelData(
  base64Image: string,
  mimeType: string
): Promise<ExtractedLabel> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: EXTRACTION_PROMPT },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
              detail: "high",
            },
          },
        ],
      },
    ],
    max_tokens: 1000,
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
      rawText: parsed.rawText || "",
      confidence: parsed.confidence || "medium",
    };
  } catch {
    throw new Error("Failed to parse AI response as structured data");
  }
}
