import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import request from "supertest";
import { createApp } from "./index.js";

// Builds a fake Anthropic client whose messages.stream(...) call emits the given
// text chunks, then resolves (or rejects) finalMessage(). Every call's request
// options are recorded in `calls` so tests can assert on the prompt sent.
function createMockClient({ chunks = ["hello "], fail = false } = {}) {
  const calls = [];
  return {
    calls,
    messages: {
      stream(requestOptions) {
        calls.push(requestOptions);
        const emitter = new EventEmitter();
        queueMicrotask(() => {
          if (!fail) chunks.forEach((chunk) => emitter.emit("text", chunk));
        });
        emitter.finalMessage = () =>
          fail ? Promise.reject(new Error("upstream failure")) : Promise.resolve({});
        return emitter;
      },
    },
  };
}

describe("POST /api/draft-report", () => {
  test("rejects a request with no notes", async () => {
    const app = createApp(createMockClient());
    const res = await request(app).post("/api/draft-report").send({ location: "Substation 14" });

    assert.equal(res.status, 400);
    assert.deepEqual(res.body, { error: "Field notes are required." });
  });

  test("rejects a request with whitespace-only notes", async () => {
    const app = createApp(createMockClient());
    const res = await request(app).post("/api/draft-report").send({ notes: "   \n\t  " });

    assert.equal(res.status, 400);
    assert.deepEqual(res.body, { error: "Field notes are required." });
  });

  test("omits the location line when no location is given", async () => {
    const client = createMockClient();
    const app = createApp(client);

    await request(app).post("/api/draft-report").send({ notes: "rust on lower bracket" });

    assert.equal(client.calls.length, 1);
    const { messages } = client.calls[0];
    assert.equal(messages[0].content, "Field notes:\nrust on lower bracket");
  });

  test("prepends the location when one is given", async () => {
    const client = createMockClient();
    const app = createApp(client);

    await request(app)
      .post("/api/draft-report")
      .send({ notes: "rust on lower bracket", location: "Substation 14" });

    const { messages } = client.calls[0];
    assert.equal(
      messages[0].content,
      "Project location: Substation 14\n\nField notes:\nrust on lower bracket"
    );
  });

  test("streams delta events and a needs_approval done event over SSE", async () => {
    const client = createMockClient({ chunks: ["## Summary\n", "Bracket has surface rust."] });
    const app = createApp(client);

    const res = await request(app).post("/api/draft-report").send({ notes: "surface rust" });

    assert.equal(res.status, 200);
    assert.match(res.headers["content-type"], /^text\/event-stream/);

    const events = res.text
      .trim()
      .split("\n\n")
      .map((block) => {
        const [eventLine, dataLine] = block.split("\n");
        return { event: eventLine.replace("event: ", ""), data: JSON.parse(dataLine.replace("data: ", "")) };
      });

    assert.deepEqual(events[0], { event: "delta", data: { text: "## Summary\n" } });
    assert.deepEqual(events[1], { event: "delta", data: { text: "Bracket has surface rust." } });
    assert.deepEqual(events[2], {
      event: "done",
      data: { status: "needs_approval", model: "claude-opus-4-8" },
    });
  });

  test("always reports needs_approval even with an empty draft", async () => {
    const client = createMockClient({ chunks: [] });
    const app = createApp(client);

    const res = await request(app).post("/api/draft-report").send({ notes: "surface rust" });

    assert.match(res.text, /"status":"needs_approval"/);
  });

  test("sends an error SSE event when the model call fails, without a 500", async () => {
    const client = createMockClient({ fail: true });
    const app = createApp(client);

    const res = await request(app).post("/api/draft-report").send({ notes: "surface rust" });

    assert.equal(res.status, 200);
    assert.match(res.text, /event: error/);
    assert.match(res.text, /Could not draft the report\. Please try again\./);
    assert.doesNotMatch(res.text, /event: done/);
  });

  test("rejects request bodies over the 64kb limit", async () => {
    const client = createMockClient();
    const app = createApp(client);
    const oversizedNotes = "x".repeat(70 * 1024);

    const res = await request(app).post("/api/draft-report").send({ notes: oversizedNotes });

    assert.equal(res.status, 413);
    assert.equal(client.calls.length, 0);
  });

  test("returns a JSON error body for oversized requests instead of the default HTML error page", async () => {
    const client = createMockClient();
    const app = createApp(client);
    const oversizedNotes = "x".repeat(70 * 1024);

    const res = await request(app).post("/api/draft-report").send({ notes: oversizedNotes });

    assert.equal(res.status, 413);
    assert.match(res.headers["content-type"], /^application\/json/);
    assert.deepEqual(res.body, { error: "Field notes are too long. Please shorten them and try again." });
  });

  test("handles upstream API errors gracefully without throwing", async () => {
    const client = createMockClient({ fail: true });
    const app = createApp(client);

    const res = await request(app).post("/api/draft-report").send({ notes: "test" });

    assert.equal(res.status, 200);
    assert.match(res.text, /event: error/);
    assert.match(res.text, /Could not draft the report/);
  });

  test("sends done event even with empty text chunks", async () => {
    const client = createMockClient({ chunks: ["", "", "content"] });
    const app = createApp(client);

    const res = await request(app).post("/api/draft-report").send({ notes: "test" });

    assert.equal(res.status, 200);
    assert.match(res.text, /event: done/);
    assert.match(res.text, /"status":"needs_approval"/);
  });

  test("uses correct model in done event", async () => {
    const client = createMockClient({ chunks: ["draft"] });
    const app = createApp(client);

    const res = await request(app).post("/api/draft-report").send({ notes: "test" });

    assert.match(res.text, /"model":"claude-opus-4-8"/);
  });

  test("handles non-string note values by converting to string", async () => {
    const client = createMockClient();
    const app = createApp(client);

    const res = await request(app).post("/api/draft-report").send({ notes: 12345 });

    assert.equal(res.status, 200);
    assert.equal(client.calls[0].messages[0].content, "Field notes:\n12345");
  });

  test("handles non-string location values by converting to string", async () => {
    const client = createMockClient();
    const app = createApp(client);

    const res = await request(app).post("/api/draft-report").send({ notes: "test", location: 999 });

    assert.equal(res.status, 200);
    assert.match(res.text, /event: delta/);
  });

  test("streams all text chunks sequentially", async () => {
    const chunks = ["One ", "Two ", "Three"];
    const client = createMockClient({ chunks });
    const app = createApp(client);

    const res = await request(app).post("/api/draft-report").send({ notes: "test" });

    const text = res.text;
    assert.match(text, /One/);
    assert.match(text, /Two/);
    assert.match(text, /Three/);
    // Verify order by checking indices
    assert(text.indexOf("One") < text.indexOf("Two"));
    assert(text.indexOf("Two") < text.indexOf("Three"));
  });

  test("sends delta events with partial content", async () => {
    const client = createMockClient({ chunks: ["# ", "Header"] });
    const app = createApp(client);

    const res = await request(app).post("/api/draft-report").send({ notes: "test" });

    const events = res.text
      .trim()
      .split("\n\n")
      .filter((b) => b.trim());

    const deltas = events
      .map((block) => {
        const [eventLine] = block.split("\n");
        return eventLine.replace("event: ", "");
      })
      .filter((e) => e === "delta");

    assert.equal(deltas.length, 2);
  });

  test("does not send done event before stream completes", async () => {
    const client = createMockClient({ chunks: ["content"] });
    const app = createApp(client);

    const res = await request(app).post("/api/draft-report").send({ notes: "test" });

    const lines = res.text.trim().split("\n\n");
    const lastEvent = lines[lines.length - 1];

    assert.match(lastEvent, /event: done/);
  });

  test("uses system prompt in stream request", async () => {
    const client = createMockClient();
    const app = createApp(client);

    await request(app).post("/api/draft-report").send({ notes: "test" });

    const systemPrompt = client.calls[0].system;
    assert(systemPrompt.includes("SnapSite"));
    assert(systemPrompt.includes("report-drafting"));
    assert(systemPrompt.includes("DRAFT"));
  });

  test("sets thinking mode to adaptive", async () => {
    const client = createMockClient();
    const app = createApp(client);

    await request(app).post("/api/draft-report").send({ notes: "test" });

    assert.deepEqual(client.calls[0].thinking, { type: "adaptive" });
  });

  test("sets max tokens to 2048", async () => {
    const client = createMockClient();
    const app = createApp(client);

    await request(app).post("/api/draft-report").send({ notes: "test" });

    assert.equal(client.calls[0].max_tokens, 2048);
  });

  test("rejects requests with null notes", async () => {
    const client = createMockClient();
    const app = createApp(client);

    const res = await request(app).post("/api/draft-report").send({ notes: null });

    assert.equal(res.status, 400);
    assert.equal(client.calls.length, 0);
  });

  test("rejects requests with undefined notes", async () => {
    const client = createMockClient();
    const app = createApp(client);

    const res = await request(app).post("/api/draft-report").send({});

    assert.equal(res.status, 400);
    assert.equal(client.calls.length, 0);
  });

  test("allows location to be null or undefined", async () => {
    const client = createMockClient();
    const app = createApp(client);

    const res = await request(app)
      .post("/api/draft-report")
      .send({ notes: "test", location: null });

    assert.equal(res.status, 200);
    // Verify the request was made and check the user content doesn't have "Project location: "
    assert.equal(client.calls[0].messages[0].content, "Field notes:\ntest");
  });

  test("handles special characters in notes", async () => {
    const client = createMockClient();
    const app = createApp(client);

    const notes = 'Rust <img src=x> on "bracket" & other parts';
    await request(app).post("/api/draft-report").send({ notes });

    const userContent = client.calls[0].messages[0].content;
    assert(userContent.includes(notes));
  });
});
