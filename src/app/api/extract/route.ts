import { NextRequest, NextResponse } from "next/server";
import { extractLabelData } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, mimeType } = body;

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

    const extractedData = await extractLabelData(image, mimeType);

    return NextResponse.json({ data: extractedData });
  } catch (error) {
    console.error("Extraction error:", error);
    const message = error instanceof Error ? error.message : "Failed to extract label data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
