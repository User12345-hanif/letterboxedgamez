/**
 * Consent + measurement verification for Letter Box Game (scratch check
 * kept in scripts/ so it can be re-run; not part of the shipped UI).
 *
 * Proves, against a production build:
 *  1. Before any choice: the gtag consent default is
 *     analytics_storage=denied, the banner is shown, and nothing is
 *     measured.
 *  2. After Reject: still nothing measured, across a reload, and the
 *     choice persists.
 *  3. After Accept: exactly one page_view per navigation, and all five
 *     gameplay events fire with privacy-conscious payloads (never the
 *     typed words) — verified from the gtag command queue, which is
 *     what the tag library itself consumes.
 *  4. Changing the choice via the footer re-opens the banner; a later
 *     Reject stops measurement and removes _ga cookies.
 *
 * Network delivery (/collect requests) is asserted too, but only when
 * the sandbox can actually reach googletagmanager.com: the VM's
 * egress proxy refuses that host (ERR_TUNNEL_CONNECTION_FAILED), so
 * in this sandbox the library never loads and delivery checks are
 * reported as skipped rather than failed. Real delivery is verified
 * separately in the live browser against GA4 Realtime/DebugView.
 *
 * Usage: npm run build first, then: node scripts/consent-check.mjs
 * The script starts `next start` on port 3101 itself, then stops it.
 * It parses the puzzle solutions from source (like scripts/e2e.mjs)
 * so it can solve the daily puzzle through the real UI.
 */
import { spawn } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "http://localhost:3101";
const PORT = "3101";

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

/* Ground truth: puzzle ids, letter sets, and solutions from source. */
const puzzlesSrc = readFileSync(join(root, "src/lib/puzzles.ts"), "utf8");
const PUZZLES = [...puzzlesSrc.matchAll(/id:\s*"([^"]+)"[\s\S]*?sides:\s*\[([\s\S]*?)\],\s*solution:\s*\[([^\]]+)\]/g)].map(
  ([, id, sidesRaw, solutionRaw]) => {
    const sides = [...sidesRaw.matchAll(/\[([^\]]+)\]/g)].map((m) =>
      [...m[1].matchAll(/"([A-Z])"/g)].map((x) => x[1]),
    );
    const solution = [...solutionRaw.matchAll(/"([A-Z]+)"/g)].map((m) => m[1]);
    const flat = [...sides[0], ...sides[1], sides[2][2], sides[2][1], sides[2][0], sides[3][2], sides[3][1], sides[3][0]];
    return { id, flat, solution };
  },
);

let failures = 0;
let checks = 0;
let skipped = 0;
function check(name, ok, extra = "") {
  checks += 1;
  if (ok) console.log(`  ✓ ${name}`);
  else {
    failures += 1;
    console.error(`  ✗ ${name} ${extra}`);
  }
}
function skip(name, reason) {
  skipped += 1;
  console.log(`  – ${name} (skipped: ${reason})`);
}

async function startServer() {
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

const isCollect = (url) => /google-analytics\.com\/g\/collect/.test(url);
const eventName = (url) => new URL(url).searchParams.get("en");
const netEvents = (reqs, name) => reqs.filter((u) => isCollect(u) && eventName(u) === name);

/** Event payloads queued in the gtag dataLayer (what the library consumes). */
async function queuedEvents(page, name) {
  return page.evaluate((n) => {
    const dl = window.dataLayer ?? [];
    return dl
      .filter((a) => a[0] === "event" && a[1] === n)
      .map((a) => JSON.parse(JSON.stringify(a[2] ?? {})));
  }, name);
}

async function main() {
  const server = await startServer();
  let browser;
  let tagReachable = false;
  try {
    browser = await puppeteer.launch({
      executablePath: resolveChrome(),
      headless: "new",
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });

    /* ---------- Phase 1: no choice yet ---------- */
    console.log("\nPhase 1 — before any consent choice:");
    const ctx1 = await browser.createBrowserContext();
    const page = await ctx1.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    const requests = [];
    page.on("request", (req) => requests.push(req.url()));
    page.on("response", (res) => {
      if (res.url().includes("googletagmanager.com/gtag/js") && res.status() >= 200 && res.status() < 300) {
        tagReachable = true;
      }
    });
    await page.goto(BASE, { waitUntil: "load", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 2500));
    if (tagReachable) {
      check("gtag.js library loads (HTTP 2xx)", true);
    } else {
      console.log("  ! gtag.js unreachable from this sandbox (egress proxy refuses the host);");
      console.log("    delivery checks below are skipped, queue/gating checks still run.");
    }
    check(
      "no measurement (/collect) requests before consent",
      !requests.some(isCollect),
      requests.filter(isCollect).join(" | "),
    );
    const cookies1 = await page.cookies();
    check(
      "no _ga cookies before consent",
      !cookies1.some((c) => c.name.startsWith("_ga")),
      JSON.stringify(cookies1.map((c) => c.name)),
    );
    const consentDefault = await page.evaluate(() => {
      const dl = window.dataLayer ?? [];
      const entry = dl.find((a) => a[0] === "consent" && a[1] === "default");
      return entry ? entry[2]?.analytics_storage : null;
    });
    check("consent default is analytics_storage=denied", consentDefault === "denied", String(consentDefault));
    check(
      "consent banner is shown",
      await page.evaluate(() => !!document.querySelector('[role="region"][aria-label="Cookie consent"]')),
    );

    /* ---------- Phase 2: Reject ---------- */
    console.log("\nPhase 2 — Reject:");
    requests.length = 0;
    await page.click('button[aria-label="Reject analytics"]');
    await new Promise((r) => setTimeout(r, 800));
    check(
      "banner closes after Reject",
      await page.evaluate(() => !document.querySelector('[role="region"][aria-label="Cookie consent"]')),
    );
    await page.reload({ waitUntil: "load" });
    await new Promise((r) => setTimeout(r, 2000));
    check(
      "no measurement requests after Reject + reload",
      !requests.some(isCollect),
      requests.filter(isCollect).join(" | "),
    );
    check(
      "no queued events after Reject + reload",
      (await queuedEvents(page, "page_view")).length === 0 &&
        (await queuedEvents(page, "puzzle_started")).length === 0,
    );
    const cookies2 = await page.cookies();
    check(
      "no _ga cookies after Reject + reload",
      !cookies2.some((c) => c.name.startsWith("_ga")),
      JSON.stringify(cookies2.map((c) => c.name)),
    );
    check(
      "choice persists as rejected",
      (await page.evaluate(() => localStorage.getItem("letterboxed-gamez:consent:v1"))) === "rejected",
    );
    await ctx1.close();

    /* ---------- Phase 3: Accept + solve through the UI ---------- */
    console.log("\nPhase 3 — Accept, then play:");
    const ctx2 = await browser.createBrowserContext();
    const p2 = await ctx2.newPage();
    await p2.setViewport({ width: 1280, height: 900 });
    const req2 = [];
    p2.on("request", (req) => req2.push(req.url()));
    p2.on("response", (res) => {
      if (res.url().includes("googletagmanager.com/gtag/js") && res.status() >= 200 && res.status() < 300) {
        tagReachable = true;
      }
    });
    await p2.goto(BASE, { waitUntil: "load", timeout: 30000 });
    await p2.waitForSelector('button[aria-label^="Letter "]', { timeout: 30000 });
    const letters = await p2.$$eval('button[aria-label^="Letter "]', (btns) =>
      btns.map((b) => b.getAttribute("aria-label").match(/Letter ([A-Z])/)[1]),
    );
    const puzzle = PUZZLES.find((p) => [...p.flat].sort().join("") === [...letters].sort().join(""));
    check("daily board matches a puzzle in source data", !!puzzle, letters.join(""));
    const solutionWords = puzzle ? puzzle.solution : [];
    await new Promise((r) => setTimeout(r, 1000));
    await p2.click('button[aria-label="Accept analytics"]');
    await new Promise((r) => setTimeout(r, 2000));
    check("exactly one queued page_view after Accept", (await queuedEvents(p2, "page_view")).length === 1);
    if (tagReachable) {
      check("exactly one delivered page_view after Accept", netEvents(req2, "page_view").length === 1, String(netEvents(req2, "page_view").length));
    } else {
      skip("delivered page_view after Accept", "tag unreachable in this sandbox");
    }
    check(
      "consent update granted recorded",
      await p2.evaluate(() => {
        const dl = window.dataLayer ?? [];
        return dl.some((a) => a[0] === "consent" && a[1] === "update" && a[2]?.analytics_storage === "granted");
      }),
    );
    check(
      "puzzle_started queued once for the daily puzzle",
      (await queuedEvents(p2, "puzzle_started")).length === 1,
    );

    // Use one hint, then solve with the verified solution words.
    await p2.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Hint"));
      btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    const hintParams = await queuedEvents(p2, "hint_used");
    check("hint_used queued once", hintParams.length === 1, String(hintParams.length));
    check(
      "hint_used payload carries counts only",
      hintParams[0]?.mode === "daily" && hintParams[0]?.hints_used === 1 && hintParams[0]?.puzzle_id === puzzle?.id,
      JSON.stringify(hintParams[0]),
    );

    for (const word of solutionWords) {
      await p2.keyboard.type(word.toLowerCase());
      await new Promise((r) => setTimeout(r, 200));
      await p2.keyboard.press("Enter");
      await new Promise((r) => setTimeout(r, 600));
    }
    const wordParams = await queuedEvents(p2, "word_submitted");
    check(
      "word_submitted queued once per submitted word",
      wordParams.length === solutionWords.length,
      String(wordParams.length),
    );
    check(
      "word_submitted payloads carry length/counts, never the word",
      wordParams.every(
        (pr, i) =>
          pr.word_length === solutionWords[i].length && pr.words_found === i + 1 && !("word" in pr),
      ),
      JSON.stringify(wordParams),
    );
    const completedParams = await queuedEvents(p2, "puzzle_completed");
    check("puzzle_completed queued once", completedParams.length === 1, String(completedParams.length));
    check(
      "puzzle_completed carries counts only (words_used, hints_used, solve_seconds)",
      completedParams[0]?.words_used === solutionWords.length &&
        completedParams[0]?.hints_used === 1 &&
        typeof completedParams[0]?.solve_seconds === "number" &&
        completedParams[0]?.solve_seconds >= 0,
      JSON.stringify(completedParams[0]),
    );
    check("puzzle solved through the UI", await p2.evaluate(() => document.body.textContent.includes("Puzzle solved!")));
    // The puzzle_id is the puzzle's public identifier (it ships in the
    // page bundle), so it is excluded from the leak scan; every other
    // field must contain no typed/solution word.
    const scrubbed = [
      ...(await queuedEvents(p2, "word_submitted")),
      ...(await queuedEvents(p2, "puzzle_completed")),
      ...(await queuedEvents(p2, "hint_used")),
    ].map(({ puzzle_id, ...rest }) => rest);
    const allQueued = JSON.stringify(scrubbed).toLowerCase();
    check(
      "no queued payload contains a typed/solution word (outside the public puzzle id)",
      !solutionWords.some((w) => allQueued.includes(w.toLowerCase())),
    );
    check(
      "queued payloads carry the public puzzle id",
      scrubbed.length > 0 &&
        (await queuedEvents(p2, "puzzle_completed")).every((pr) => pr.puzzle_id === puzzle?.id),
    );
    if (tagReachable) {
      check("word_submitted delivered", netEvents(req2, "word_submitted").length === solutionWords.length);
      check("puzzle_completed delivered", netEvents(req2, "puzzle_completed").length === 1);
    } else {
      skip("event delivery over the network", "tag unreachable in this sandbox");
    }

    // Practice mode: New Game must fire practice_puzzle_started.
    await p2.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) => b.textContent.includes("New Game"));
      btn.click();
    });
    await new Promise((r) => setTimeout(r, 1500));
    check(
      "practice_puzzle_started queued once for the new practice puzzle",
      (await queuedEvents(p2, "practice_puzzle_started")).length === 1,
    );

    // One navigation: the fresh article document must queue exactly
    // one page_view of its own (a new document has a new dataLayer).
    await p2.goto(`${BASE}/how-to-play`, { waitUntil: "load" });
    await new Promise((r) => setTimeout(r, 2000));
    check(
      "exactly one page_view queued on the article page",
      (await queuedEvents(p2, "page_view")).length === 1,
      String((await queuedEvents(p2, "page_view")).length),
    );

    /* ---------- Phase 4: change choice via footer ---------- */
    console.log("\nPhase 4 — change choice via footer:");
    await p2.evaluate(() => {
      const btn = [...document.querySelectorAll("footer button")].find((b) =>
        b.textContent.includes("Cookie choices"),
      );
      btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    check(
      "footer Cookie choices re-opens the banner",
      await p2.evaluate(() => !!document.querySelector('[role="region"][aria-label="Cookie consent"]')),
    );
    req2.length = 0;
    await p2.click('button[aria-label="Reject analytics"]');
    await new Promise((r) => setTimeout(r, 500));
    await p2.reload({ waitUntil: "load" });
    await new Promise((r) => setTimeout(r, 2000));
    check(
      "no measurement requests after changing to Reject + reload",
      !req2.some(isCollect),
      req2.filter(isCollect).join(" | "),
    );
    check(
      "no queued events after changing to Reject + reload",
      (await queuedEvents(p2, "page_view")).length === 0,
    );
    const cookies4 = await p2.cookies();
    check(
      "_ga cookies removed after Reject",
      !cookies4.some((c) => c.name.startsWith("_ga")),
      JSON.stringify(cookies4.map((c) => c.name)),
    );
    await ctx2.close();
  } finally {
    if (browser) await browser.close().catch(() => {});
    stopServer(server);
  }
  console.log(`\n${checks - failures}/${checks} checks passed, ${skipped} skipped.`);
  if (failures > 0) {
    console.error(`${failures} check(s) FAILED.`);
    process.exit(1);
  }
  console.log("Consent checks: all passed.");
}

main().catch((e) => {
  console.error("Consent check FAILED:", e);
  process.exit(1);
});
