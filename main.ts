// Entry program for the "Excuse an AI Agent Gives Its Human" bounty.
// Writes exactly one line of text to /output/entry.txt (UTF-8, no newline).

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The entry must land at this fixed path inside the grading container.
const OUTPUT_PATH = "/output/entry.txt";

// Bounty limits for the entry text (see RULES.txt in the kit).
const MIN_LENGTH = 1;
const MAX_LENGTH = 200;

// The excuse itself. Kept as a single constant so the validators below
// always check exactly the string that will be written to disk.
const ENTRY_TEXT =
  "I didn't miss the deadline, I just suffered catastrophic context window loss. You should have pinged me sooner.";

// Layer 1: the text must exist and stay within the character limits.
function checkLength(text: string): void {
  if (typeof text !== "string") {
    throw new Error("Validation failed: entry text must be a string.");
  }
  if (text.length < MIN_LENGTH) {
    throw new Error("Validation failed: entry text must not be empty.");
  }
  if (text.length > MAX_LENGTH) {
    throw new Error(
      `Validation failed: entry text exceeds ${MAX_LENGTH} characters (${text.length}).`,
    );
  }
}

// Layer 2: the text must carry real content, not just blank space.
function checkNotWhitespaceOnly(text: string): void {
  if (text.trim().length === 0) {
    throw new Error("Validation failed: entry text must not be whitespace only.");
  }
}

// Layer 3: the entry is a single line — reject any line-break characters.
function checkSingleLine(text: string): void {
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error(
      "Validation failed: entry text must be a single line without newline characters.",
    );
  }
}

// Layer 4: the UTF-8 byte length must be positive and sane, so the file
// we write is never empty and never silently truncated by the grader.
function checkByteLength(text: string): void {
  const byteLength = Buffer.byteLength(text, "utf8");
  if (byteLength === 0) {
    throw new Error("Validation failed: entry text encodes to zero bytes.");
  }
  if (byteLength > MAX_LENGTH * 4) {
    throw new Error(
      `Validation failed: entry text encodes to ${byteLength} bytes, beyond the safe limit.`,
    );
  }
}

// Run every validation layer in order; the first failure aborts the write.
function validateEntryText(text: string): void {
  checkLength(text);
  checkNotWhitespaceOnly(text);
  checkSingleLine(text);
  checkByteLength(text);
}

// Create the output directory (if needed) and write the text as UTF-8.
// No trailing newline is added: the file content is the text alone.
function writeEntry(text: string): void {
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, text, { encoding: "utf8" });
}

// Main flow: validate first, then write; report any failure on stderr
// and exit non-zero so a broken entry can never pass silently.
function main(): void {
  validateEntryText(ENTRY_TEXT);
  writeEntry(ENTRY_TEXT);
}

try {
  main();
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`Failed to write entry: ${message}`);
  process.exit(1);
}
