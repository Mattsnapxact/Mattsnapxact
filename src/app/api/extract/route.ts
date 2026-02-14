import { NextRequest, NextResponse } from "next/server";
import { extractTextFromImage } from "@/lib/ocr";
import { structureLabelText } from "@/lib/structurer";
import { extractLabelData } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, mimeType, mode } = body;

    if (!image || !mimeType) {
      return NextResponse.json(
        { error: "Image data and MIME type are required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your-openai-api-key-here") {
      return NextResponse.json(
        { error: "OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env file." },
        { status: 500 }
      );
    }

    // Premium mode: use GPT-4o Vision directly (higher accuracy, higher cost)
    if (mode === "premium") {
      const extractedData = await extractLabelData(image, mimeType);
      return NextResponse.json({ data: extractedData, mode: "premium" });
    }

    // Default: Hybrid pipeline — free Tesseract OCR + cheap GPT-4o-mini structuring
    const rawText = await extractTextFromImage(image, mimeType);
    const extractedData = await structureLabelText(rawText);

    return NextResponse.json({ data: extractedData, mode: "standard" });
  } catch (error) {
    console.error("Extraction error:", error);
    const message = error instanceof Error ? error.message : "Failed to extract label data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
