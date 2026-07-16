// This project is markdown, not code (see ../../CLAUDE.md) — its real "test"
// is running prompts against a live model per prompt-library/README.md's
// criteria, which isn't something an automated suite can do. What IS checkable
// without a model are the structural conventions the project depends on to stay
// usable: every entry/session follows its template, and the indexes/links that
// tie files together don't drift out of sync with the files themselves.
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = __dirname;

function read(...parts) {
  return fs.readFileSync(path.join(root, ...parts), "utf8");
}

function headings(text) {
  return [...text.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim());
}

describe("curriculum modules", () => {
  const REQUIRED_MODULE_HEADINGS = [
    "Lesson Focus",
    "Example Prompts",
    "Key Takeaways",
    "Debugging Notes",
    "Mastery Checklist",
  ];
  const moduleFiles = fs
    .readdirSync(path.join(root, "curriculum"))
    .filter((f) => f.endsWith(".md"))
    .sort();

  test("modules are numbered 01 through 06 with no gaps", () => {
    assert.deepEqual(
      moduleFiles.map((f) => f.slice(0, 2)),
      ["01", "02", "03", "04", "05", "06"]
    );
  });

  moduleFiles.forEach((file) => {
    test(`${file} has all required section headings`, () => {
      const text = read("curriculum", file);
      const found = headings(text);
      REQUIRED_MODULE_HEADINGS.forEach((h) => assert.ok(found.includes(h), `missing "## ${h}" in ${file}`));
    });

    test(`${file} has a "Module NN — Title" heading matching its number`, () => {
      const text = read("curriculum", file);
      const number = file.slice(0, 2);
      const match = text.match(/^# Module (\d{2}) — (.+)$/m);
      assert.ok(match, `${file} is missing a "# Module NN — Title" heading`);
      assert.equal(match[1], number);
    });
  });

  test("README's curriculum sequence table lists every module file, in order", () => {
    const readme = read("README.md");
    const linkedFiles = [...readme.matchAll(/curriculum\/(\d{2}-[\w-]+\.md)/g)].map((m) => m[1]);
    assert.deepEqual(linkedFiles, moduleFiles);
  });
});

describe("prompt library entries", () => {
  const ALLOWED_STRENGTHS = ["battle-tested", "proven", "situational", "graveyard"];
  const ALLOWED_FORMATS = ["prose", "structured-md", "json", "list", "dialogue", "mixed"];
  const REQUIRED_ENTRY_HEADINGS = [
    "The prompt",
    "Placeholders",
    "Why it works",
    "Testing evidence",
    "Known limitations",
    "Changelog",
  ];
  const entryFiles = fs
    .readdirSync(path.join(root, "prompt-library"))
    .filter((f) => f.endsWith(".md") && f !== "README.md" && f !== "_TEMPLATE.md")
    .sort();

  function parseTags(text, file) {
    const match = text.match(/^\*\*Tags:\*\*\s*use-case:\s*(.+?)\s*·\s*format:\s*`([^`]+)`\s*·\s*strength:\s*`([^`]+)`\s*$/m);
    assert.ok(match, `${file} is missing a well-formed "**Tags:** use-case: ... · format: \`...\` · strength: \`...\`" line`);
    return { useCase: match[1], format: match[2], strength: match[3] };
  }

  entryFiles.forEach((file) => {
    test(`${file} has all required section headings`, () => {
      const found = headings(read("prompt-library", file));
      REQUIRED_ENTRY_HEADINGS.forEach((h) => assert.ok(found.includes(h), `missing "## ${h}" in ${file}`));
    });

    test(`${file} has a Models tested line`, () => {
      assert.match(read("prompt-library", file), /^\*\*Models tested:\*\*\s*\S+/m);
    });

    test(`${file} is tagged with an allowed format and strength`, () => {
      const text = read("prompt-library", file);
      const { format, strength } = parseTags(text, file);
      assert.ok(ALLOWED_FORMATS.includes(format), `${file} has unknown format "${format}"`);
      assert.ok(ALLOWED_STRENGTHS.includes(strength), `${file} has unknown strength "${strength}"`);
    });

    test(`${file} notes situational conditions if tagged situational`, () => {
      const text = read("prompt-library", file);
      const { strength } = parseTags(text, file);
      if (strength !== "situational") return;
      const conditions = text.match(/^\*\*Situational conditions:\*\*\s*(.+)$/m)?.[1].trim();
      assert.ok(conditions && conditions !== "—", `${file} is tagged situational but has no stated conditions`);
    });
  });

  test("README index lists exactly the entry files that exist, no more, no less", () => {
    const readmeText = read("prompt-library", "README.md");
    const indexedFiles = [...readmeText.matchAll(/\[[\w-]+\]\(([\w-]+\.md)\)/g)].map((m) => m[1]).sort();
    assert.deepEqual(indexedFiles, entryFiles);
  });

  test("README index strength column matches each entry's own strength tag", () => {
    const readmeText = read("prompt-library", "README.md");
    const rows = [...readmeText.matchAll(/\|\s*\[[\w-]+\]\(([\w-]+\.md)\)[^|]*\|[^|]*\|[^|]*\|\s*([\w-]+)\s*\|/g)];
    assert.ok(rows.length >= entryFiles.length, "could not parse the README index table rows");

    rows.forEach(([, file, indexedStrength]) => {
      const { strength } = parseTags(read("prompt-library", file), file);
      assert.equal(indexedStrength, strength, `${file} is "${strength}" but the README index says "${indexedStrength}"`);
    });
  });
});

describe("session logs", () => {
  const REQUIRED_SESSION_HEADINGS = [
    "What worked",
    "What didn't",
    "Principle learned",
    "Library actions",
    "Queued for next session",
    "Checklist deltas",
  ];
  const sessionFiles = fs
    .readdirSync(path.join(root, "sessions"))
    .filter((f) => f.endsWith(".md") && f !== "_TEMPLATE.md");

  sessionFiles.forEach((file) => {
    test(`${file} follows the YYYY-MM-DD-session-NN.md naming convention`, () => {
      assert.match(file, /^\d{4}-\d{2}-\d{2}-session-\d{2}\.md$/);
    });

    test(`${file} has all required section headings`, () => {
      const found = headings(read("sessions", file));
      REQUIRED_SESSION_HEADINGS.forEach((h) => assert.ok(found.includes(h), `missing "## ${h}" in ${file}`));
    });

    test(`${file} has Focus and Models used lines`, () => {
      const text = read("sessions", file);
      assert.match(text, /^\*\*Focus:\*\*\s*\S+/m);
      assert.match(text, /^\*\*Models used:\*\*\s*\S+/m);
    });

    test(`${file}'s Principle learned is a blockquote or an explicit "none"`, () => {
      const text = read("sessions", file);
      const section = text.split("## Principle learned")[1]?.split(/^## /m)[0] ?? "";
      assert.match(section.trim(), /^>\s*(none\b|\S)/i, `${file}'s Principle learned section should be a blockquote (or "none")`);
    });
  });
});
