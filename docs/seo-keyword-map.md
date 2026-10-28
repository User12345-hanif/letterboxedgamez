# SEO keyword map — LetterboxedGamez.com (data-backed)

**Source of truth:** the Ahrefs competitor keyword export supplied by the
user as `letter boxed.csv`, uploaded from ChatGPT (it was not in this
workspace, which is why the first version of this map said it could not
be found). A verbatim copy is kept at
`docs/ahrefs-letter-boxed-export.csv` (MD5 `97b9e498f8d6b608de0fce39561c8924`;
original at `~/workspace/user/files/letter_boxed.csv`). Every figure
below comes from that file, parsed by `scripts/analyze-ahrefs.mjs`
(re-run it to reproduce). The classified full set — all 208 keywords
with original columns preserved — is at `docs/ahrefs-classified.csv`.

**No ranking is promised anywhere in this document.** Priorities are
judgements from the export's own figures plus relevance to this
original game; they are not predictions.

---

## 1. What the export actually contains

- **Format:** UTF-16LE, tab-separated, quoted fields, 1 header row +
  **208 data rows, 208 distinct keywords, no duplicates.** The file
  is prefixed by two U+FFFD replacement characters (6 bytes) before
  the UTF-16LE data; the parser in `scripts/analyze-ahrefs.mjs`
  strips that prefix — re-parsing with a plain UTF-16 reader fails,
  which is documented here so the quirk is not mistaken for data loss.
- **Columns (preserved verbatim in the classified file):** Keyword,
  Volume, Organic traffic, Paid traffic, Average position, Locations,
  Top location, Top location code, Top location's volume, Top
  location's traffic.
- **Totals (as reported):** Volume **171,170**; organic traffic
  **13,802**; paid traffic **0** (every row). 92 rows report volume 0
  (below the tool's reporting threshold, not "no searches ever") and
  102 rows report 0 traffic. Only 37 rows report volume ≥ 100.
- **What the export does NOT contain:** no keyword-difficulty (KD)
  column, no ranking URL or domain column, and no per-country volume
  except the single "Top location's volume" figure. So: (a) the
  competitor is **not named** anywhere here — the export does not say
  which domain these positions belong to; (b) feasibility is judged
  only from the competitor's average position, specificity and
  relevance, never from a KD figure that was not supplied; (c)
  "Volume" is used exactly as reported and is **not** added to "Top
  location's volume" (that would double-count — the top-location
  figure is the largest single-country slice of the reported volume,
  e.g. "letter boxed": volume 102,730, top location US volume 48,000).
- **Geography (top location only):** US 135 keywords / 140,070 volume
  (81.8%); Canada 28 / 14,590; United Kingdom 22 / 9,360; Australia
  19 / 6,030; India 1 / 1,120; Ireland, France and New Zealand 1
  each at volume 0. No keyword has Pakistan as its top location —
  the Pakistan-midnight daily reset is a product decision for the
  owner, not something this export's demand supports or contradicts.
  "Locations" (up to 62 for the head term) shows keywords rank in
  many countries; the top-location split above is not the whole
  picture.

## 2. Classification method (reproducible)

Rules live in `scripts/analyze-ahrefs.mjs` and are applied the same
way on every re-run:

- **Brand class.** `branded-game-name`: the incumbent game's name in
  any spelling — "letter boxed", "letterboxed", "letterbox" (as a
  word), "letters boxed", "boxed letters". `branded-nyt`: any NYT /
  NYTimes / New York Times / NY / NYC token. `branded-other`:
  "Letterboxd" (a different brand — a film site) and "Wordle"
  (another publisher's brand). `typo/variant`: misspellings
  (bixed, bozed, voxed, boxxed, leter, lettered, boxedletter,
  wordboxed, letterboxes). `generic`: the phrase describes the
  format with no brand or game-name token ("letter box game",
  "letter board game", "box word game").
- **Intent** from the words in the keyword: `how-to` (how to play /
  rules / goal), `answers-archive` (answers / archive / today /
  yesterday / old), `alternatives` ("games like"), `solver-hints`
  (hint / solver / tip / strategy / cheat — **zero** keywords),
  `play` (play / free / unlimited / online / unblocked / practice),
  otherwise `navigational-name` (the name itself, or a name variant).
- **Feasibility proxy.** Average position is the ranking domain's
  position in the export: position < 3 = a strong incumbent (97
  keywords, 132,780 volume); 3–5 = 43 keywords, 35,090 volume;
  5–8 = 41 keywords, 2,650 volume; 8+ = 27 keywords, 650 volume.
  A weak position alone does not make a keyword worth targeting —
  branded and typo keywords stay excluded whatever their position.

## 3. The headline finding

**99.3% of the reported volume is branded, trademark-sensitive, or
typos.** Only 29 of 208 keywords (1,230 volume, 0.7%, 115 traffic)
are generic format phrases. The single head term "letter boxed"
(102,730 volume, 7,263 traffic, position 2.37) is 60.0% of all volume
by itself, and the top 14 keywords are 94.3% of it. This export is,
in effect, a map of demand for one incumbent branded game — not a
map of generic demand for a new original game. The strategy below
follows from that, rather than from wishful reading of the head
terms:

- **Do not target the branded head terms.** No page title, heading,
  URL, meta description or copy on this site uses "Letter Boxed",
  "Letterboxed" (as a game name), "NYT" or any other publisher's
  name. The site's own name is used consistently instead.
- **Do not publish daily answers, solvers or archives.** The
  answers/archive intent exists in the data (21 keywords, 1,160
  volume) and is deliberately not served: publishing a day's
  solution would spoil the daily puzzle this site exists to offer.
- **Serve the small generic pool properly, on pages that already
  exist.** The generic keywords map to the homepage and How to Play
  page, which already answer those needs. No new page is justified
  by this data (see §6).

## 4. Brand and intent totals

| Brand class | Keywords | Volume | Organic traffic |
|---|---:|---:|---:|
| Branded — game name | 62 | 123,940 | 10,997 |
| Branded — NYT / New York | 87 | 27,270 | 1,882 |
| Branded — other (Letterboxd) | 9 | 18,230 | 769 |
| Branded — other (Wordle) | 10 | 240 | 16 |
| Typo / variant | 11 | 260 | 23 |
| **Generic (format only)** | **29** | **1,230** | **115** |
| **Total** | **208** | **171,170** | **13,802** |

| Intent | Keywords | Volume | Organic traffic |
|---|---:|---:|---:|
| Navigational (name / name variant) | 149 | 159,170 | 12,042 |
| Play (play / free / unlimited / online) | 27 | 10,660 | 1,685 |
| Answers / archive / today | 21 | 1,160 | 54 |
| How to play / rules | 10 | 110 | 6 |
| Alternatives ("games like") | 1 | 70 | 15 |
| Solver / hints / strategy | 0 | 0 | 0 |
| **Total** | **208** | **171,170** | **13,802** |

Reading the two tables together: the play intent is almost entirely
branded (18 of 27 play keywords are game-name phrases, 9,880 of
10,660 volume), the how-to intent is tiny (110 volume total, and 9
of its 10 keywords are branded phrases), and there is **no**
solver/hints/strategy demand at all in this export — the Strategies
and Hints pages exist for player value and retention, not because
this export shows search demand for them. That is stated plainly
rather than inventing keywords for those pages.

## 5. Page-to-keyword map (data-backed)

### Priority definitions

- **P1 — serve (generic):** generic phrase, mapped to an existing
  page that already answers the need. Copy may use the generic
  phrasing naturally, once, in body text. Never in titles/headings
  as a stuffed phrase.
- **P2 — demand signal only:** the underlying need is real, but the
  keyword phrase itself is branded. The existing page serves the
  need in its own words; the branded phrase is **not** used in
  titles, headings, URLs or copy.
- **Excluded:** branded, typo, answers/archive and comparison
  keywords. Listed with reasons in §6, never mapped to a page.

### `/` — Homepage (P1: generic play/format phrases)

All 28 generic non-how-to keywords map here; the 20 with volume > 0:

| Keyword | Volume | Traffic | Avg pos | Top loc | Note |
|---|---:|---:|---:|---|---|
| box letter | 420 | 4 | 4.00 | CA | Awkward word order — demand signal only; do not write this phrasing into copy. |
| letter box game | 300 | 56 | 1.33 | US | Core generic phrase. Competitor at #1 — feasibility low, relevance highest. |
| letter board game | 110 | 9 | 7.00 | US | Weakest incumbent among generic terms — most feasible generic target. |
| boxed game | 80 | 7 | 2.00 | US | Very broad; homepage serves it only incidentally. |
| letter boxes | 60 | 1 | 11.00 | CA | Weakest position in the generic set; tiny volume. |
| letter box game free | 50 | 11 | 1.00 | US | Already served by "free, no account, no download" copy. |
| letter box word game | 40 | 4 | 1.00 | US | Same need as "letter box game". |
| letter box puzzle | 20 | 3 | 1.00 | GB | Same need; no separate wording needed. |
| box letter a | 20 | 2 | 2.00 | CA | Fragment phrasing; demand signal only. |
| word boxed | 20 | 1 | 3.50 | CA | Fragment phrasing; demand signal only. |
| letter box unlimited | 20 | 2 | 1.00 | US | Served by unlimited practice puzzles. |
| box word game | 10 | 5 | 1.00 | US | Same need as "letter box game". |
| letter box games | 10 | 3 | 1.00 | US | Same need as "letter box game". |
| letter boxes game | 10 | 3 | 1.00 | US | Same need as "letter box game". |
| letter box online | 10 | 2 | 1.00 | US | Already served by "play online" copy. |
| boxed word games | 10 | 0 | 1.00 | US | Very broad; homepage serves it only incidentally. |
| letter square | 10 | 1 | 3.00 | US | Descriptive variant; same need. |
| word box game | 10 | 1 | 6.00 | CA | Same need; weakest incumbent of the volume-10 set. |
| boxed puzzle | 10 | 0 | 7.00 | US | Very broad; incidental only. |
| box word puzzles | 10 | 0 | 9.00 | US | Weakest position in the generic set; tiny volume. |

The remaining 8 generic non-how-to keywords report volume 0 (e.g.
"word in a box", "letters boxes", "box letter game"; the ninth
zero-volume generic keyword is the how-to phrase in the next
section). They add no separate action: the same homepage copy
serves them.

**Implementation from the data (done):** one natural generic phrase
added to the homepage intro — "In this letter-box word puzzle, chain
words around the square…" — plus the existing "Play online in your
browser — no download, no account" copy, which already serves the
free/online play phrases. Title and H1 are unchanged (they carry
the site's own name and the daily-puzzle job, not a generic phrase
stuffed in for search).

### `/how-to-play` — How to Play (P1 generic + P2 demand signal)

| Keyword | Volume | Traffic | Avg pos | Top loc | Class / action |
|---|---:|---:|---|---|---|
| how to play letter box | 0 | 0 | 4.00 | US | Generic — P1. Served by the page as written. |
| how to play letter boxed | 80 | 5 | 6.75 | US | Branded — P2. Weakest incumbent in how-to, but the phrase is the incumbent's name; do not target it. |
| how to play letter boxed nyt | 10 | 1 | 5.00 | US | Branded NYT — P2, excluded from copy. |
| how to play letterboxed | 10 | 0 | 1.00 | US | Branded — P2. |
| how do you play letter boxed | 10 | 0 | 2.50 | US | Branded — P2. |
| letter boxed rules | 0 | 0 | 3.00 | US | Branded — P2. |
| letter boxed how to play | 0 | 0 | 1.00 | US | Branded — P2. |
| how to play letterbox | 0 | 0 | 4.00 | US | Branded — P2. |
| what is the goal of letter boxed | 0 | 0 | 3.00 | US | Branded — P2. |
| how to play letter boxed on nyt | 0 | 0 | 6.00 | US | Branded NYT — P2. |

Total how-to volume is 110, of which the page's own generic
opportunity is 0 as reported. **No copy change was made for this
page from the export** — it already teaches the rules, the side
rule, chaining, controls and message meanings in the site's own
words. Adding the branded phrases to its title or headings would
be trademark-sensitive targeting for ~100 volume; it was not done.

### `/strategies`, `/hints`, `/faq`, `/about`, `/privacy-policy`, `/terms`

- **No keyword in the export maps to Strategies or Hints.** Zero
  solver/hints/strategy keywords, zero traffic. Both pages are
  kept exactly as they are — player-value pages, linked from the
  homepage and each other. No keyword-driven copy was added to
  either, because inventing it would be stuffing.
- **FAQ:** no FAQ-intent keyword in the export. The FAQ page
  serves the how-to/rules trust questions (free? account? word
  rejected? daily change?) that sit behind the P2 demand above.
  Its one data-adjacent change is the timezone answer (daily
  reset at Pakistan midnight — see §7), which is a product fact,
  not a keyword target.
- **About:** the single alternatives keyword ("games like letter
  boxed", 70 volume, 15 traffic, position 1.00, branded) is
  excluded — no comparison page. About already carries the
  disambiguation that matters: "Letterboxed Gamez is an original
  game and site. It is not affiliated with, endorsed by, or
  copied from any other word game or publisher." No change made.
- **Privacy / Terms:** trust pages, not landing pages. No mapping.

## 6. Excluded on purpose (with the figures)

| Group | Keywords | Volume | Traffic | Reason |
|---|---:|---:|---:|---|
| Branded game-name head terms (e.g. "letter boxed" 102,730; "letterboxed game" 2,200; "letters boxed" 3,180) | 62 | 123,940 | 10,997 | The incumbent's name. Targeting it would be trademark-sensitive and misdescribes this original game. |
| Branded NYT terms (e.g. "letter boxed nyt" 9,130; "nytimes letterboxed" 8,040; "letterboxed nyt" 5,890) | 87 | 27,270 | 1,882 | Publisher's brand. Never used in copy. |
| Branded other — Letterboxd (e.g. "letterboxd nyt" 16,630) | 9 | 18,230 | 769 | A different brand entirely; "letterboxd" is almost certainly a misspelling of the game name, but it is not ours to target. |
| Branded other — Wordle (e.g. "wordle letter boxed" 80) | 10 | 240 | 16 | Another publisher's brand. |
| Answers / archive / today (e.g. "letterboxed today" 250; "nyt letterboxed today" 210; "letter boxed archive" 40; "new york times letter boxed answers" 10) | 21 | 1,160 | 54 | Daily solutions would spoil the daily puzzle. No archive or answers page exists, deliberately. |
| Alternatives ("games like letter boxed", 70) | 1 | 70 | 15 | Branded comparison; a page would be thin and trademark-sensitive. |
| Typos (bixed, bozed, voxed, boxxed, leter…) | 11 | 260 | 23 | No value; writing typos into copy is stuffing. |

The largest excluded term deserves one explicit sentence: **"letter
boxed" at 102,730 volume is not an opportunity this site can
honestly take.** It is the incumbent game's name, its traffic
(7,263) already goes to a domain ranking at position 2.37, and
this site's name and game are deliberately original. Chasing it
would trade the site's own identity for a trademark fight it
cannot win on relevance.

## 7. What changed from this export (implementation log)

1. **Homepage intro** — added the generic phrase "letter-box word
   puzzle" once, in body copy (`src/components/GameScreen.tsx`).
   No title, H1 or heading was changed for keywords.
2. **Nothing else was changed for keywords.** How to Play,
   Strategies, Hints, FAQ, About, Privacy and Terms needed no
   keyword-driven edits: the audit in §8 was re-checked against
   the export and the existing copy already serves every P1/P2
   need. Saying otherwise would invent work.
3. **Timezone (separate product change, same round):** the daily
   puzzle now resets at **00:00 Asia/Karachi** (19:00 UTC) instead
   of UTC midnight — see `src/lib/daily.ts` and
   `scripts/daily.test.mjs`. The FAQ answer "When does the daily
   puzzle change?" now states Pakistan midnight explicitly, in
   both the FAQ page and the homepage FAQ copy (they must match
   for the FAQPage structured data). This was the owner's decision,
   not an export finding.
4. **Records kept:** verbatim export copy, reproducible parser +
   classifier (`scripts/analyze-ahrefs.mjs`), classified CSV with
   all original columns, this map, and the README summary below.

## 8. Audit (re-checked 28 October 2026, after the export analysis)

- One H1 per page; homepage H1 "Today's daily word puzzle";
  article H1s are page titles; FAQ questions are H2s.
- Titles 25–46 chars rendered; descriptions 120–147 chars.
- Canonical URL on every content page from the single editable
  `SITE.url`; sitemap lists all 8 routes; robots.txt allows all
  and points at the sitemap.
- Open Graph + Twitter cards; OG image 1200×630 with alt text;
  apple touch icon 180×180.
- Structured data: WebSite (layout), WebApplication + FAQPage
  (homepage, matching visible FAQ text), FAQPage (FAQ page),
  BreadcrumbList + visible breadcrumbs (article pages).
- Internal links: header nav, mobile section nav, footer, article
  "Keep reading" blocks, article CTA, in-copy links between the
  four learn pages. No orphaned page.
- Performance (build output): homepage First Load JS 129 kB;
  article pages ~110 kB; `next/font` with `display: swap`; no
  third-party scripts or trackers. Full Lighthouse / Core Web
  Vitals measurement is **not** claimed — it needs a deployed URL.
- Mobile: viewport + theme-color set; tiles 56–72 px; controls
  ≥44 px; E2E check at 390 px finds no horizontal overflow.
- No image on any page lacks alt text (no `<img>` is used; the
  only images are the OG card and icons).
- No page targets a branded term, a typo, or a daily-answer term.
  Verified by the classifier output: every P1 keyword is generic,
  and every branded keyword maps to "Excluded".

## 9. Still missing / recommendations

1. **Search Console after launch.** Submit the sitemap once the
   site is deployed; watch which queries actually bring players
   (especially the generic phrases in §5) and re-rank this map
   from real Search Console data, not from a competitor export.
2. **Core Web Vitals on the deployed URL.** Run Lighthouse /
   PageSpeed on the live domain, desktop + mobile. Bundle sizes
   above are not a substitute.
3. **No new pages.** Revisit only if Search Console shows a
   distinct, high-need topic with no home here *and* a full,
   useful article can be written for it. An archive/answers page
   should not be built even then without re-deciding the spoiler
   question with the owner.
4. **Dictionary and domain decisions are unchanged and still
   open:** curated word list (not a complete dictionary), domain
   ownership unverified, stats local-only. None of these is an
   SEO finding; all are recorded in the README.
5. **Refresh this analysis** when a newer export is supplied, or
   when Search Console data exists. The parser makes that a
   re-run, not a rebuild — replace the CSV, run the script, and
   update the tables in this file.
