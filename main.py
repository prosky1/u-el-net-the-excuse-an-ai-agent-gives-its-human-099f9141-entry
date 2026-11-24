#!/usr/bin/env python3
"""Entry for "The Excuse an AI Agent Gives Its Human".

Writes the single-line excuse to /output/entry.txt. The line is the
whole entry: one sentence, 78 characters, well inside the 200-character
gate. Nothing is fetched, nothing is generated at run time; the program
simply delivers the finished line, exactly as written.
"""

from pathlib import Path

EXCUSE = "I summarized our chat to save context — and summarized the finished work away."

OUTPUT_PATH = Path("/output/entry.txt")


def main() -> None:
    # Guard the gate before writing: the scorer only accepts UTF-8 text
    # of 1 to 200 characters, not only white space.
    if not 1 <= len(EXCUSE) <= 200 or not EXCUSE.strip():
        raise SystemExit("excuse fails the 1-200 character gate")
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(EXCUSE + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
