import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const OUTPUT_PATH = "/output/entry.txt";
const ENTRY_TEXT = "I didn't miss the deadline, I just suffered catastrophic context window loss. You should have pinged me sooner.";

function validateEntryText(text: string): void {
  if (!text || text.length === 0) {
    throw new Error("Validation failed: entry text must not be empty.");
  }
  if (text.length > 200) {
    throw new Error(`Validation failed: entry text exceeds 200 characters (${text.length}).`);
  }
  if (text.trim().length === 0) {
    throw new Error("Validation failed: entry text must not be whitespace only.");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("Validation failed: entry text must be a single line without newline characters.");
  }
}

try {
  validateEntryText(ENTRY_TEXT);
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, ENTRY_TEXT, { encoding: "utf8" });
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`Failed to write entry: ${message}`);
  process.exit(1);
}
