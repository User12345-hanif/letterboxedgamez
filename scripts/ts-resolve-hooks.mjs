/**
 * ESM resolve hook for running TypeScript sources under plain Node
 * (with --experimental-strip-types). Next.js source files import
 * siblings without an extension ("./puzzles"), which Node's ESM
 * loader rejects; this hook retries with .ts/.tsx/.js appended.
 * Only used by `npm run test:daily` — it is not part of the app.
 */
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    try {
      return await nextResolve(specifier, context);
    } catch (err) {
      if (err.code !== "ERR_MODULE_NOT_FOUND") throw err;
      for (const ext of [".ts", ".tsx", ".js"]) {
        const candidate = new URL(`${specifier}${ext}`, context.parentURL);
        if (existsSync(fileURLToPath(candidate))) {
          return { url: candidate.href, shortCircuit: true };
        }
      }
      throw err;
    }
  }
  return nextResolve(specifier, context);
}
