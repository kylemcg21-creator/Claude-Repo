import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const MODEL = "claude-opus-4-8";

const SYSTEM_PROMPT = `You are the report-drafting assistant inside SnapSite, a field-photo app for construction and utility inspection crews. An inspector gives you rough voice-to-text or typed notes captured on site. Turn them into a clean, professional inspection report.

Rules:
- Write only what the notes support. Never invent measurements, dates, part numbers, or findings the inspector did not mention.
- If something important is unclear or missing, add a short "Items to confirm" list rather than guessing.
- Use this structure with Markdown headings: Summary, Observations, Recommended Actions, and (only when needed) Items to confirm.
- Keep it concise and field-appropriate. Plain, direct language.
- This is a DRAFT. The inspector must review and approve it before it is saved — do not add sign-off text or claim it is final.`;

// Factory so tests can inject a mock Anthropic client instead of hitting the real API.
export function createApp(client) {
  const app = express();
  app.use(express.json({ limit: "64kb" }));

  // Serve the marketing site (index.html) from the parent directory.
  app.use(express.static(path.join(__dirname, "..")));

  app.post("/api/draft-report", async (req, res) => {
    const notes = (req.body?.notes || "").toString().trim();
    const location = (req.body?.location || "").toString().trim();

    if (!notes) {
      return res.status(400).json({ error: "Field notes are required." });
    }

    const userContent = location
      ? `Project location: ${location}\n\nField notes:\n${notes}`
      : `Field notes:\n${notes}`;

    // Stream the draft to the browser (Server-Sent Events) so text appears as it's
    // written, instead of blocking on a spinner until the full report is ready.
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const send = (event, data) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

    try {
      const stream = client.messages.stream({
        model: MODEL,
        max_tokens: 2048,
        thinking: { type: "adaptive" },
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userContent }],
      });

      stream.on("text", (delta) => send("delta", { text: delta }));

      await stream.finalMessage();
      send("done", { status: "needs_approval", model: MODEL });
      res.end();
    } catch (err) {
      console.error("draft-report error:", err);
      send("error", { error: "Could not draft the report. Please try again." });
      res.end();
    }
  });

  return app;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment
  const app = createApp(client);
  app.listen(PORT, () => {
    console.log(`SnapSite site + report API running on http://localhost:${PORT}`);
  });
}
