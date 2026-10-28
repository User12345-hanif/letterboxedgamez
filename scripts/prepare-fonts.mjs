/**
 * Decode the self-hosted font files from their committed base64 sources.
 *
 * The latin variable files for Inter and Fraunces live in this directory as
 * `*.woff2.b64` (plain text) because the GitHub snapshot push used for this
 * project rejects non-UTF-8 files, so binary `.woff2` files cannot be
 * committed through it. This script writes the binary `.woff2` files next
 * to their sources before `dev`/`build` (via the `predev`/`prebuild`
 * scripts in package.json), so the build never fetches fonts from the
 * network. It is idempotent: it rewrites a file only when its decoded
 * bytes differ from what is already on disk.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const fontsDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "app",
  "fonts",
);

for (const entry of readdirSync(fontsDir)) {
  if (!entry.endsWith(".woff2.b64")) continue;
  const target = join(fontsDir, entry.slice(0, -".b64".length));
  const encoded = readFileSync(join(fontsDir, entry), "utf8").replace(/\s+/g, "");
  const decoded = Buffer.from(encoded, "base64");
  if (decoded.length < 4 || decoded.subarray(0, 4).toString("latin1") !== "wOF2") {
    throw new Error(`prepare-fonts: decoded ${entry} is not a valid woff2 file`);
  }
  const digest = createHash("sha256").update(decoded).digest("hex");
  const current = existsSync(target) ? readFileSync(target) : null;
  if (current && createHash("sha256").update(current).digest("hex") === digest) {
    continue;
  }
  writeFileSync(target, decoded);
  console.log(`prepare-fonts: wrote ${target} (${decoded.length} bytes)`);
}
