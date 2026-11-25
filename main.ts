// Funniest One-Line Out-of-Office Reply — make.fun entry
// Line: "I'm out of office until Monday. If this is urgent, email me again and I'll read it Monday, faster, with a coffee and a sense of regret."
// Sealed gate (RULES.txt): /output/entry.txt must be UTF-8 text of 1 to 160
// characters, not only white space, single line.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const LINE =
  "I'm out of office until Monday. If this is urgent, email me again and I'll read it Monday, faster, with a coffee and a sense of regret.";

const MAX_CHARS = 160;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

if (LINE.length < 1 || LINE.length > MAX_CHARS) {
  fail(`entry must be 1-${MAX_CHARS} characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  fail("entry must not be only white space");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("entry must be a single line");
}
// Reject control characters (other than the trailing newline we add) and
// leading/trailing whitespace: an OOO auto-reply must read cleanly as-is.
if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(LINE)) {
  fail("entry must not contain control characters");
}
if (LINE !== LINE.trim()) {
  fail("entry must not have leading or trailing whitespace");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE + "\n", "utf8");
// Read-back check: what landed on disk must be exactly the line + newline.
const onDisk = readFileSync(outPath, "utf8");
if (onDisk !== LINE + "\n") {
  fail("read-back mismatch: file on disk differs from the entry line");
}
console.log(`wrote ${outPath} (${LINE.length} chars)`);
