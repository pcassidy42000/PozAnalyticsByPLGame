import { NextResponse } from "next/server";
import { makePrompt } from "../../../lib/prompts";
import { runGrok } from "../../../lib/browserbase";

export const maxDuration = 300;

export async function POST(req) {
  try {
    const { workflow, opponent, minute } = await req.json();
    if (!workflow || !opponent) return NextResponse.json({ error:"workflow and opponent are required" }, { status:400 });
    const prompt = makePrompt(workflow, opponent, minute);
    const output = await runGrok(prompt);
    return NextResponse.json({ workflow, opponent, output, capturedAt:new Date().toISOString() });
  } catch (e) {
    return NextResponse.json({ error:e.message || "Run failed" }, { status:500 });
  }
}
