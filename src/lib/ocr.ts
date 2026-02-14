import Tesseract from "tesseract.js";

/**
 * Extract raw text from an image using Tesseract.js (free, no API cost).
 * Runs server-side via the Node.js worker.
 */
export async function extractTextFromImage(
  base64Image: string,
  mimeType: string
): Promise<string> {
  const imageBuffer = Buffer.from(base64Image, "base64");

  const result = await Tesseract.recognize(imageBuffer, "eng", {
    logger: () => {}, // silent
  });

  const text = result.data.text.trim();

  if (!text) {
    throw new Error(
      "No text detected in image. Please ensure the label is clearly visible."
    );
  }

  return text;
}
