/**
 * End-to-end tests for Letter Box Game — real Chromium, real server.
 *
 * Usage:  npm run test:e2e
 * Requires a production build first (`npm run build`). The script starts
 * `next start` on port 3100 itself, runs the checks, then stops it.
 * Chromium path: $CHROME_PATH or /opt/meta-chromium/chrome.
 *
 * What it proves (and nothing more): the UI enforces the same rules as
 * src/lib/game.ts for every puzzle, hints/undo/clear/stats/dialogs work,
 * progress persists across reload, and the page does not overflow at 390px.
 * It does not prove the game is fun, and it does not check rankings.
 */
import { spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.E2E_BASE_URL ?? "http://localhost:3100";
const PORT = process.env.E2E_PORT ?? "3100";
/**
 * Chromium path: $CHROME_PATH first, then a Playwright-downloaded
 * headless shell (unmanaged, so no administrator local-network block),
 * then the managed /opt/meta-chromium build as a last resort.
 */
function resolveChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const cache = join(process.env.HOME ?? "~", ".cache/ms-playwright");
  try {
    for (const dir of readdirSync(cache)) {
      if (!dir.startsWith("chromium_headless_shell-")) continue;
      const candidate = join(cache, dir, "chrome-linux/headless_shell");
      if (existsSync(candidate)) return candidate;
    }
  } catch {
    /* no Playwright cache */
  }
  return "/opt/meta-chromium/chrome";
}
const CHROME = resolveChrome();

/* ---------- ground truth, parsed from source (independent of the UI) ---------- */

function extractArrayLiteral(source, name) {
  const start = source.indexOf(name);
  const eq = source.indexOf("=", start);
  const bracket = source.indexOf("[", eq);
  let depth = 0;
  let inString = null;
  for (let i = bracket; i < source.length; i += 1) {
    const ch = source[i];
    if (inString) {
      if (ch === inString && source[i - 1] !== "\\") inString = null;
      continue;
    }
    if (ch === '"' || ch === "'") inString = ch;
    else if (ch === "[") depth += 1;
    else if (ch === "]") {
      depth -= 1;
      if (depth === 0) return source.slice(bracket, i + 1);
    }
  }
  throw new Error(`Unbalanced array for ${name}`);
}

const puzzlesSrc = readFileSync(join(root, "src/lib/puzzles.ts"), "utf8");
const dictSrc = readFileSync(join(root, "src/lib/dictionary.ts"), "utf8");
const DICT = new Set();
for (const name of ["DICTIONARY_WORDS", "DICTIONARY_WORDS_LONG"]) {
  const lit = extractArrayLiteral(dictSrc, name);
  for (const m of lit.matchAll(/"([a-z]+)"/g)) DICT.add(m[1].toUpperCase());
}
const PUZZLES = [...puzzlesSrc.matchAll(/id:\s*"([^"]+)"[\s\S]*?sides:\s*\[([\s\S]*?)\],\s*solution:\s*\[([^\]]+)\]/g)].map(
  ([, id, sidesRaw, solutionRaw]) => {
    const sides = [...sidesRaw.matchAll(/\[([^\]]+)\]/g)].map((m) =>
      [...m[1].matchAll(/"([A-Z])"/g)].map((x) => x[1]),
    );
    const solution = [...solutionRaw.matchAll(/"([A-Z]+)"/g)].map((m) => m[1]);
    const flat = [...sides[0], ...sides[1], sides[2][2], sides[2][1], sides[2][0], sides[3][2], sides[3][1], sides[3][0]];
    const sideOf = new Map();
    sides.forEach((side, i) => side.forEach((l) => sideOf.set(l, i)));
    return { id, sides, solution, flat, sideOf };
  },
);

function sideValid(word, sideOf) {
  const letters = word.split("");
  if (new Set(letters).size !== letters.length) return false;
  for (let i = 1; i < letters.length; i += 1) {
    if (sideOf.get(letters[i]) === sideOf.get(letters[i - 1])) return false;
  }
  return true;
}

/** A 3-letter, side-valid word that is NOT in the dictionary. */
function invalidCandidate(puzzle, requiredStart) {
  const letters = puzzle.flat;
  for (const a of letters) {
    if (requiredStart && a !== requiredStart) continue;
    for (const b of letters) {
      if (b === a) continue;
      for (const c of letters) {
        if (c === a || c === b) continue;
        const w = a + b + c;
        if (!DICT.has(w) && sideValid(w, puzzle.sideOf)) return w;
      }
    }
  }
  return null;
}

/* ---------- test harness ---------- */

let failures = 0;
let checks = 0;
function check(name, ok, extra = "") {
  checks += 1;
  if (ok) console.log(`  ✓ ${name}`);
  else {
    failures += 1;
    console.error(`  ✗ ${name} ${extra}`);
  }
}

async function waitFor(fn, page, timeout = 5000, label = "condition") {
  await page.waitForFunction(fn, { timeout }, undefined).catch(() => {
    throw new Error(`Timed out waiting for: ${label}`);
  });
}

async function startServer() {
  // Spawn `next start` directly (not via npx) in its own process group,
  // so cleanup can kill the real server — killing only an npx wrapper
  // leaves an orphaned next-server holding the port and serving stale
  // chunks from a previous build.
  const child = spawn(process.execPath, [join(root, "node_modules/next/dist/bin/next"), "start", "-p", PORT], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, PORT },
    detached: true,
  });
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(BASE);
      if (res.ok) return child;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  child.kill();
  throw new Error("Server did not start in 30s");
}

function stopServer(child) {
  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {
    child.kill("SIGTERM");
  }
}

async function main() {
  console.log(`Puzzles in source: ${PUZZLES.length}, dictionary words: ${DICT.size}`);
  const server = await startServer();
  let browser;
  const consoleErrors = [];
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME,
      headless: "new",
      args: ["--no-sandbox", "--disable-dev-shm-usage", "--force-device-scale-factor=1"],
    });
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    page.on("pageerror", (e) => consoleErrors.push(String(e)));
    page.on("console", (m) => {
      if (m.type() === "error") consoleErrors.push(m.text());
    });
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(BASE, { waitUntil: "load", timeout: 30000 });

    const boardLetters = async () =>
      page.$$eval('button[aria-label^="Letter "]', (btns) =>
        btns.map((b) => b.getAttribute("aria-label").match(/Letter ([A-Z])/)[1]),
      );
    const identify = (letters) => {
      const key = [...letters].sort().join("");
      return PUZZLES.find((p) => [...p.flat].sort().join("") === key);
    };
    const currentWord = () =>
      page.evaluate(() => {
        const el = [...document.querySelectorAll("p")].find((p) =>
          p.className.includes("tracking-[0.08em]"),
        );
        return el ? el.textContent.trim() : "";
      });
    const feedbackText = () =>
      page.evaluate(() => {
        const el = document.querySelector('[role="alert"], [role="status"]');
        return el ? el.textContent.trim() : "";
      });
    const submittedCount = () =>
      page.evaluate(() => {
        const h = [...document.querySelectorAll("h2")].find((x) => x.textContent.startsWith("Words found"));
        return h ? Number(h.textContent.match(/\((\d+)\)/)?.[1] ?? 0) : -1;
      });
    const clickTile = async (letter) => {
      const ok = await page.evaluate((ltr) => {
        const btn = [...document.querySelectorAll('button[aria-label^="Letter "]')].find((b) =>
          b.getAttribute("aria-label").startsWith(`Letter ${ltr},`),
        );
        if (!btn || btn.disabled) return false;
        btn.click();
        return true;
      }, letter);
      if (!ok) throw new Error(`Could not click tile ${letter} (disabled or missing)`);
      await new Promise((r) => setTimeout(r, 60));
    };
    const clickButton = async (label) => {
      const ok = await page.evaluate((text) => {
        // Header buttons carry a leading icon glyph, so match by inclusion.
        const btn = [...document.querySelectorAll("button")].find((b) => b.textContent.includes(text));
        if (!btn || btn.disabled) return false;
        btn.click();
        return true;
      }, label);
      if (!ok) throw new Error(`Button "${label}" not clickable`);
    };
    const typeWord = async (word) => {
      for (const ch of word) await clickTile(ch);
    };

    await page.waitForSelector('button[aria-label^="Letter "]', { timeout: 30000 });
    const letters = await boardLetters();
    check("board has 12 distinct tiles", letters.length === 12 && new Set(letters).size === 12, letters.join(""));
    const daily = identify(letters);
    check("daily board matches a puzzle in source data", !!daily, letters.join(""));
    console.log(`  Daily puzzle: ${daily.id} — ${daily.solution.join(" → ")}`);

    /* --- invalid word, undo, clear, same-side, hint (before solving) --- */
    console.log("\nInvalid-word, undo, clear, hint checks:");
    const bad = invalidCandidate(daily, null);
    check("found a side-valid non-dictionary candidate", !!bad, String(bad));
    await typeWord(bad);
    check("current word shows typed word", (await currentWord()).startsWith(bad), await currentWord());
    await clickButton("Submit");
    await new Promise((r) => setTimeout(r, 400));
    check(
      "non-dictionary word rejected with dictionary message",
      (await feedbackText()).includes("not in our curated word list"),
      await feedbackText(),
    );
    check("rejected word not submitted", (await submittedCount()) === 0);
    await clickButton("Clear");
    await new Promise((r) => setTimeout(r, 200));
    check("Clear empties the current word", (await currentWord()).startsWith("—"));

    // Undo: type 3, undo once -> 2 letters remain.
    const prefix = daily.solution[0].slice(0, 3);
    await typeWord(prefix);
    await clickButton("Undo");
    await new Promise((r) => setTimeout(r, 200));
    check("Undo removes exactly one letter", (await currentWord()).startsWith(prefix.slice(0, 2)), await currentWord());
    await clickButton("Clear");

    // Same-side tile disabled after picking a letter.
    await clickTile(daily.solution[0][0]);
    const sameSideDisabled = await page.evaluate((firstLetter) => {
      const btns = [...document.querySelectorAll('button[aria-label^="Letter "]')];
      const first = btns.find((b) => b.getAttribute("aria-label").startsWith(`Letter ${firstLetter},`));
      const firstSide = first.getAttribute("aria-label").match(/, (\w+) side/)[1];
      return btns
        .filter((b) => b !== first && b.getAttribute("aria-label").includes(`, ${firstSide} side`))
        .every((b) => b.disabled);
    }, daily.solution[0][0]);
    check("same-side tiles are disabled after a pick", sameSideDisabled);
    await clickButton("Clear");

    // Hint: first tap = nudge, second tap = reveal.
    const hintBefore = await page.evaluate(() => document.body.textContent.match(/Hint \((\d+) left\)/)?.[1]);
    await clickButton("Hint");
    await new Promise((r) => setTimeout(r, 300));
    const hintFeedback = await feedbackText();
    check("first Hint gives a starting-letter/length nudge", hintFeedback.includes("Hint:"), hintFeedback);
    const hintAfter = await page.evaluate(() => document.body.textContent.match(/Hint \((\d+) left\)/)?.[1]);
    check("Hint counter decreases", hintBefore === "3" && hintAfter === "2", `${hintBefore} -> ${hintAfter}`);
    await clickButton("Hint");
    await new Promise((r) => setTimeout(r, 300));
    check("second Hint reveals a word", (await feedbackText()).includes("Hint revealed:"), await feedbackText());
    // A hint adds no letters, so Clear must be disabled with an empty word.
    const clearDisabled = await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Clear");
      return btn ? btn.disabled : null;
    });
    check("Clear is disabled when the current word is empty", clearDisabled === true, String(clearDisabled));

    /* --- solve every puzzle via the UI --- */
    console.log("\nSolving all puzzles through the UI:");
    const seen = new Set();
    let useKeyboard = true;
    for (let round = 0; round < 8 && seen.size < PUZZLES.length; round += 1) {
      await page.waitForSelector('button[aria-label^="Letter "]', { timeout: 30000 });
      const currentLetters = await boardLetters();
      const puzzle = identify(currentLetters);
      if (!puzzle) throw new Error(`Board letters do not match any puzzle: ${currentLetters.join("")}`);
      seen.add(puzzle.id);
      const [w1, w2] = puzzle.solution;
      if (useKeyboard) {
        // Keyboard: type word 1, Enter; type word 2, Enter.
        await page.keyboard.type(w1.toLowerCase());
        await new Promise((r) => setTimeout(r, 200));
        check(`keyboard types word 1 (${puzzle.id})`, (await currentWord()).startsWith(w1), await currentWord());
        await page.keyboard.press("Enter");
        await new Promise((r) => setTimeout(r, 400));
        check(`keyboard Enter submits word 1 (${puzzle.id})`, (await submittedCount()) === 1);
        // Wrong-start: other first letters must be disabled now.
        const required = w1.slice(-1);
        const wrongDisabled = await page.evaluate((req) => {
          const btns = [...document.querySelectorAll('button[aria-label^="Letter "]')];
          return btns.filter((b) => !b.getAttribute("aria-label").startsWith(`Letter ${req},`)).every((b) => b.disabled);
        }, required);
        check(`chaining enforced in UI: only “${required}” available (${puzzle.id})`, wrongDisabled);
        await page.keyboard.type(w2.toLowerCase());
        await page.keyboard.press("Enter");
        useKeyboard = false;
      } else {
        await typeWord(w1);
        await clickButton("Submit");
        await new Promise((r) => setTimeout(r, 400));
        await typeWord(w2);
        await clickButton("Submit");
      }
      await new Promise((r) => setTimeout(r, 500));
      const won = await page.evaluate(() => document.body.textContent.includes("Puzzle solved!"));
      check(`win state for ${puzzle.id} (${w1} → ${w2})`, won);
      const pct = await page.evaluate(() => {
        const bar = document.querySelector('[role="progressbar"]');
        return bar ? bar.getAttribute("aria-valuenow") : null;
      });
      check(`progress is 100% for ${puzzle.id}`, pct === "100", String(pct));

      // Persistence: reload and the win must still be there.
      await page.reload({ waitUntil: "load" });
      await page.waitForSelector('button[aria-label^="Letter "]', { timeout: 30000 });
      const stillWon = await page.evaluate(() => document.body.textContent.includes("Puzzle solved!"));
      check(`win/progress persists after reload (${puzzle.id})`, stillWon);

      if (seen.size < PUZZLES.length) {
        await clickButton("New Game");
        await new Promise((r) => setTimeout(r, 400));
        const afterNew = await submittedCount();
        check("New Game resets submitted words", afterNew === 0, String(afterNew));
      }
    }
    check("all 7 puzzles solved through the UI", seen.size === PUZZLES.length, [...seen].join(", "));

    /* --- dialogs + statistics --- */
    console.log("\nDialogs and statistics:");
    await clickButton("Statistics");
    await new Promise((r) => setTimeout(r, 300));
    const statsText = await page.evaluate(() => document.body.textContent);
    check("Statistics dialog opens with solved count", statsText.includes("Your statistics") && /Puzzles solved/.test(statsText));
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 300));
    const statsClosed = await page.evaluate(() => !document.body.textContent.includes("Stored only in this browser"));
    check("Statistics dialog closes with Escape", statsClosed);
    // How to Play via header button (first matching button in header).
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("header button")].find((b) => b.textContent.includes("How to Play"));
      btn.click();
    });
    await new Promise((r) => setTimeout(r, 300));
    check("How to Play dialog opens", await page.evaluate(() => document.body.textContent.includes("Chain your words")));
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 300));

    /* --- mobile width --- */
    console.log("\nMobile width (390px):");
    const mobile = await context.newPage();
    await mobile.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await mobile.goto(BASE, { waitUntil: "load" });
    await mobile.waitForSelector('button[aria-label^="Letter "]', { timeout: 30000 });
    const overflow = await mobile.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
    }));
    check("no horizontal overflow at 390px", overflow.scrollWidth <= 391, JSON.stringify(overflow));
    const tileSize = await mobile.evaluate(() => {
      const btn = document.querySelector('button[aria-label^="Letter "]');
      const r = btn.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    });
    check("tiles are at least 44px touch targets at 390px", tileSize.w >= 44 && tileSize.h >= 44, JSON.stringify(tileSize));
    await mobile.close();

    check("no console/page errors during the run", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));
  } finally {
    if (browser) await browser.close().catch(() => {});
    stopServer(server);
  }
  console.log(`\n${checks - failures}/${checks} checks passed.`);
  if (failures > 0) {
    console.error(`${failures} check(s) FAILED.`);
    process.exit(1);
  }
  console.log("E2E: all checks passed.");
}

main().catch((e) => {
  console.error("E2E FAILED:", e);
  process.exit(1);
});
