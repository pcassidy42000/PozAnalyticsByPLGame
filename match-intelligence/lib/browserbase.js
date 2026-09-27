import Browserbase from "@browserbasehq/sdk";
import { chromium } from "playwright-core";

function client() {
  if (!process.env.BROWSERBASE_API_KEY) throw new Error("BROWSERBASE_API_KEY is not configured");
  return new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY });
}

export async function createLoginSession() {
  const bb = client();
  const projectId = process.env.BROWSERBASE_PROJECT_ID;
  if (!projectId) throw new Error("BROWSERBASE_PROJECT_ID is not configured");

  let contextId = process.env.BROWSERBASE_CONTEXT_ID;
  if (!contextId) {
    const ctx = await bb.contexts.create({ projectId });
    contextId = ctx.id;
  }

  const session = await bb.sessions.create({
    projectId,
    keepAlive: true,
    browserSettings: { context: { id: contextId, persist: true } }
  });

  const live = await bb.sessions.debug(session.id);
  return { sessionId: session.id, contextId, liveViewUrl: live.debuggerFullscreenUrl };
}

async function visibleMainText(page) {
  for (const selector of ["main", '[role="main"]', "body"]) {
    try {
      const locator = page.locator(selector).first();
      if (await locator.count()) {
        const txt = await locator.innerText({ timeout: 5000 });
        if (txt?.trim()) return txt.trim();
      }
    } catch {}
  }
  return "";
}

export async function runGrok(prompt) {
  const bb = client();
  const projectId = process.env.BROWSERBASE_PROJECT_ID;
  const contextId = process.env.BROWSERBASE_CONTEXT_ID;
  if (!projectId || !contextId) {
    throw new Error("Browserbase project/context is not configured. Complete the one-time X login first.");
  }

  const session = await bb.sessions.create({
    projectId,
    browserSettings: { context: { id: contextId, persist: true } }
  });

  const browser = await chromium.connectOverCDP(session.connectUrl);
  try {
    const context = browser.contexts()[0];
    const page = context.pages()[0] || await context.newPage();
    await page.goto("https://x.com/i/grok", { waitUntil: "domcontentloaded", timeout: 30000 });

    if (page.url().includes("/login") || page.url().includes("/i/flow/login")) {
      throw new Error("X login has expired. Re-open the login session.");
    }

    const before = await visibleMainText(page);
    const composer = page.getByRole("textbox").last();
    await composer.click({ timeout: 15000 });
    await composer.fill(prompt);
    await composer.press("Enter");

    let last = before;
    let stable = 0;
    const deadline = Date.now() + 120000;
    while (Date.now() < deadline) {
      await page.waitForTimeout(2500);
      const now = await visibleMainText(page);
      if (now !== before && now.length > before.length + 100) {
        stable = now === last ? stable + 1 : 0;
        last = now;
        if (stable >= 2) break;
      }
    }

    const after = await visibleMainText(page);
    return after.startsWith(before) ? after.slice(before.length).trim() : after;
  } finally {
    await browser.close();
    try { await bb.sessions.update(session.id, { status: "REQUEST_RELEASE" }); } catch {}
  }
}
