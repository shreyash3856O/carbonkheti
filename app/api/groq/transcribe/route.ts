import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const DEFAULT_GROQ_API_KEY = process.env.GROQ_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const apiKey = (formData.get("apiKey") as string) || DEFAULT_GROQ_API_KEY;

    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    try {
      const groq = new Groq({ apiKey });

      // Groq Whisper expects a file-like object
      const transcription = await groq.audio.transcriptions.create({
        file: file,
        model: "whisper-large-v3",
        response_format: "json",
      });

      return NextResponse.json({
        text: transcription.text,
        success: true,
        source: "groq-whisper",
      });
    } catch (groqErr: any) {
      console.warn("Groq Whisper error, advising client fallback:", groqErr?.message);
      return NextResponse.json(
        {
          text: "",
          success: false,
          fallbackRequired: true,
          error: groqErr?.message || "Groq Whisper transcription unavailable",
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("Transcribe API error:", error);
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 });
  }
}
