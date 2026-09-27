import { NextResponse } from "next/server";
import { createLoginSession } from "../../../lib/browserbase";

export const maxDuration = 60;

export async function POST() {
  try {
    const session = await createLoginSession();
    return NextResponse.json(session);
  } catch (e) {
    return NextResponse.json({ error:e.message || "Could not create login session" }, { status:500 });
  }
}
