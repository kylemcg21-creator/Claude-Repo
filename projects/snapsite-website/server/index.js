import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const MODEL = "claude-opus-4-8";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

const app = express();
app.use(express.json({ limit: "64kb" }));

// Serve the marketing site (index.html) from the parent directory.
app.use(express.static(path.join(__dirname, "..")));

const SYSTEM_PROMPT = `You are the report-drafting assistant inside SnapSite, a field-photo app for construction and utility inspection crews. An inspector gives you rough voice-to-text or typed notes captured on site. Turn them into a clean, professional inspection report.

Rules:
- Write only what the notes support. Never invent measurements, dates, part numbers, or findings the inspector did not mention.
- If something important is unclear or missing, add a short "Items to confirm" list rather than guessing.
- Use this structure with Markdown headings: Summary, Observations, Recommended Actions, and (only when needed) Items to confirm.
- Keep it concise and field-appropriate. Plain, direct language.
- This is a DRAFT. The inspector must review and approve it before it is saved — do not add sign-off text or claim it is final.`;

app.post("/api/draft-report", async (req, res) => {
  const notes = (req.body?.notes || "").toString().trim();
  const location = (req.body?.location || "").toString().trim();

  if (!notes) {
    return res.status(400).json({ error: "Field notes are required." });
  }

  const userContent = location
    ? `Project location: ${location}\n\nField notes:\n${notes}`
    : `Field notes:\n${notes}`;

  try {
    // Stream to avoid request timeouts on longer drafts; collect the final message.
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 2048,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });

    const message = await stream.finalMessage();
    const draft = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    res.json({ draft, status: "needs_approval", model: MODEL });
  } catch (err) {
    console.error("draft-report error:", err);
    res.status(502).json({ error: "Could not draft the report. Please try again." });
  }
});

app.listen(PORT, () => {
  console.log(`SnapSite site + report API running on http://localhost:${PORT}`);
});
