import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json();
    
    let prompt = "";
    if (type === "bleed") {
      prompt = `Act as an expert financial advisor. Analyze this user's SaaS subscriptions: ${JSON.stringify(data)}.
Provide a very short, punchy, direct analysis of their SaaS spending habits. Max 3 sentences. No fluff. Focus on actionable insights.`;
    } else if (type === "salary") {
      prompt = `Act as an expert financial advisor. Analyze this user's salary and tax situation: ${JSON.stringify(data)}.
Provide a very short, punchy, direct analysis regarding their tax efficiency or purchasing power. Max 3 sentences. No fluff. Keep it simple.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });
    
    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ text: "Unable to generate AI analysis at this moment." }, { status: 500 });
  }
}
