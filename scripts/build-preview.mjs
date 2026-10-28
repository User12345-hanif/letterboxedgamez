/**
 * Builds the playable in-chat preview (preview/letterboxed-preview.html)
 * from the SAME source data and rules as the Next.js site:
 *   - puzzles: parsed from src/lib/puzzles.ts (sides, solutions, hints)
 *   - dictionary: parsed from src/lib/dictionary.ts, order preserved,
 *     de-duplicated (same order the site's Set is built in)
 *   - rules: the preview's JavaScript mirrors src/lib/game.ts
 *     (min 3 letters, change sides, chaining, no repeated letter in a
 *     word, dictionary check, no repeated word, hint scoring
 *     newLetters*10 - length). If the rules change, regenerate this
 *     preview and re-test it — do not edit the HTML by hand.
 *
 * Usage: node scripts/build-preview.mjs
 * The generated file is a single self-contained page (<1 MB) with no
 * network calls. It is a preview for testing, not a deployment: stats
 * and progress live in the chat widget's state bridge (in-memory
 * fallback), and the stored solutions are never shown before a win.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

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
const puzzles = [...puzzlesSrc.matchAll(/id:\s*"([^"]+)",\s*label:\s*"([^"]+)",\s*sides:\s*\[([\s\S]*?)\],\s*solution:\s*\[([^\]]+)\],\s*hint:\s*"([^"]+)"/g)].map(
  ([, id, label, sidesRaw, solutionRaw, hint]) => ({
    id,
    label,
    sides: [...sidesRaw.matchAll(/\[([^\]]+)\]/g)].map((m) =>
      [...m[1].matchAll(/"([A-Z])"/g)].map((x) => x[1]),
    ),
    solution: [...solutionRaw.matchAll(/"([A-Z]+)"/g)].map((m) => m[1]),
    hint,
  }),
);
if (puzzles.length !== 7) throw new Error(`Expected 7 puzzles, got ${puzzles.length}`);

const dictSrc = readFileSync(join(root, "src/lib/dictionary.ts"), "utf8");
const dict = [];
const seen = new Set();
for (const name of ["DICTIONARY_WORDS", "DICTIONARY_WORDS_LONG"]) {
  const lit = extractArrayLiteral(dictSrc, name);
  for (const m of lit.matchAll(/"([a-z]+)"/g)) {
    const w = m[1].toUpperCase();
    if (!seen.has(w)) {
      seen.add(w);
      dict.push(w);
    }
  }
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Letterboxed Gamez — playable preview</title>
<style>
* { box-sizing: border-box; }
body { margin: 0; background: #f6eeda; background-image: radial-gradient(700px 380px at 88% -8%, rgba(227,185,62,.22), transparent 60%), radial-gradient(600px 340px at -10% -4%, rgba(26,92,52,.16), transparent 55%); color: #1d2b20; font-family: Georgia, "Times New Roman", serif; }
.wrap { max-width: 620px; margin: 0 auto; padding: 18px 16px 28px; }
.badge { display: inline-block; border: 1px solid rgba(193,154,46,.55); background: #f8ecc9; border-radius: 999px; padding: 4px 12px; font-family: system-ui, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #0f3d22; }
h1 { font-size: 30px; line-height: 1.1; margin: 12px 0 4px; }
.sub { font-family: system-ui, sans-serif; font-size: 14px; line-height: 1.5; color: #5c6b5f; margin: 0 0 14px; }
.try { background: #fffdf6; border: 1px solid #e3dcc8; border-radius: 16px; padding: 12px 14px; font-family: system-ui, sans-serif; font-size: 13px; line-height: 1.55; color: #3d4a40; }
.try b { color: #1e4d2b; }
select { font: inherit; font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; padding: 10px 12px; border-radius: 12px; border: 1px solid #c9c2a8; background: #fff; color: #1c2b21; width: 100%; margin: 12px 0 4px; }
.board { position: relative; width: 100%; max-width: 460px; aspect-ratio: 1; margin: 14px auto 6px; background: #0b2e1a; background-image: radial-gradient(rgba(248,236,201,.14) 1.1px, transparent 1.3px); background-size: 18px 18px; border: 3px solid #c19a2e; border-radius: 22px; box-shadow: 0 3px 0 rgba(156,122,29,.55), 0 24px 48px rgba(11,46,26,.35); }
.tile { position: absolute; transform: translate(-50%,-50%); width: clamp(48px, 15vw, 62px); height: clamp(48px, 15vw, 62px); border-radius: 16px; border: 2px solid #e8d9a8; background: linear-gradient(#ffffff, #fdf3d7); box-shadow: 0 4px 0 rgba(156,122,29,.28), 0 8px 16px rgba(11,46,26,.28); font-family: Georgia, serif; font-size: 26px; font-weight: 700; color: #1c2b21; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1; padding: 0; }
.tile small { font-family: system-ui, sans-serif; font-size: 9px; font-weight: 700; letter-spacing: .08em; color: #5c6b5f; margin-top: 3px; }
.tile.side-top { background-image: linear-gradient(#ffffff, #fdf3d7); }
.tile.side-right { background-image: repeating-linear-gradient(45deg, rgba(26,92,52,.08) 0 4px, transparent 4px 9px), linear-gradient(#ffffff, #fdf3d7); }
.tile.side-bottom { background-image: radial-gradient(rgba(26,92,52,.15) 1.5px, transparent 1.6px), linear-gradient(#ffffff, #fdf3d7); background-size: 9px 9px, auto; }
.tile.side-left { background-image: repeating-linear-gradient(45deg, rgba(26,92,52,.08) 0 3px, transparent 3px 7px), repeating-linear-gradient(-45deg, rgba(26,92,52,.08) 0 3px, transparent 3px 7px), linear-gradient(#ffffff, #fdf3d7); }
.tile:disabled { opacity: 1; background-color: #3d5c46; background-image: none; border-color: #8a9a86; color: #eef2e4; cursor: not-allowed; }
.tile:disabled small { color: #c8d4c2; }
.tile.picked { background-color: transparent; background-image: linear-gradient(#e3b93e, #c19a2e); color: #1d2b20; border-color: #9c7a1d; }
.tile.picked small { color: #0f3d22; }
.tile.hinted { outline: 4px solid #e3b93e; outline-offset: 2px; }
.tile .order { position: absolute; top: -8px; right: -8px; width: 22px; height: 22px; border-radius: 999px; background: #1a5c34; color: #fff; font-family: system-ui, sans-serif; font-size: 12px; font-weight: 800; display: grid; place-items: center; }
.legend { display: flex; flex-wrap: wrap; gap: 6px 14px; justify-content: center; font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; color: #5c6b5f; margin-bottom: 8px; }
.word { text-align: center; font-size: 38px; font-weight: 800; letter-spacing: .08em; min-height: 50px; color: #0f3d22; }
.word span.dim { color: #b8b49a; }
.msg { min-height: 42px; text-align: center; font-family: system-ui, sans-serif; font-size: 14px; line-height: 1.45; padding: 8px 10px; border-radius: 12px; margin: 6px 0; }
.msg.error { background: #fbe9e7; color: #7a2e1d; }
.msg.ok { background: #e7ecdf; color: #1e4d2b; }
.msg.info { background: #eef0ea; color: #3d4a40; }
.controls { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin: 8px 0; }
.controls button { min-height: 44px; border-radius: 999px; border: 1px solid #c9c2a8; background: #fff; font-family: system-ui, sans-serif; font-size: 13px; font-weight: 700; color: #1c2b21; cursor: pointer; padding: 0 4px; }
.controls button.primary { background: linear-gradient(#2f7d4e, #1a5c34); border-color: #0f3d22; color: #fff; }
.controls button:disabled { opacity: .45; cursor: not-allowed; }
.progress { height: 10px; border-radius: 999px; background: #e7e2cf; overflow: hidden; }
.progress > div { height: 100%; background: linear-gradient(90deg, #2f7d4e, #1a5c34, #c19a2e); border-radius: 999px; transition: width .2s; }
.stats-row { display: flex; justify-content: space-between; font-family: system-ui, sans-serif; font-size: 13px; color: #5c6b5f; margin: 8px 0 12px; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; margin: 6px 0; }
.chip { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 700; border: 1px solid #c9c2a8; background: #fff; border-radius: 999px; padding: 5px 10px; }
.chip.used { background: #e7ecdf; border-color: #1e4d2b; color: #1e4d2b; text-decoration: line-through; }
h2 { font-size: 19px; margin: 18px 0 6px; }
.words { font-family: system-ui, sans-serif; font-size: 14px; line-height: 1.6; }
.words li { margin-bottom: 4px; }
.win { background: linear-gradient(#f8ecc9, #e9f2e4); border: 2px solid #c19a2e; border-radius: 16px; padding: 14px; font-family: system-ui, sans-serif; }
.note { font-family: system-ui, sans-serif; font-size: 12px; line-height: 1.5; color: #5c6b5f; margin-top: 16px; }
kbd { background: #fff; border: 1px solid #c9c2a8; border-bottom-width: 2px; border-radius: 6px; padding: 1px 6px; font-size: 12px; }
</style>
</head>
<body>
<div class="wrap">
  <span class="badge">Playable preview &middot; not a deployment</span>
  <h1>Today&rsquo;s daily word puzzle</h1>
  <p class="sub">Use every letter at least once. Two letters in a row must come from different sides. This preview uses the same puzzles, dictionary and rules as the Next.js site.</p>
  <div class="try"><b>Try it in order:</b> 1. Tap letters to spell a word. 2. Tap <b>Submit</b>. 3. Start the next word with the last letter of the last one. 4. Tap <b>Hint</b> once for a nudge, again to reveal a word. 5. Tap <b>Undo</b> to remove one letter, <b>Clear</b> to start the word again. 6. Keep going until every letter is used. You can also type with your keyboard: letters, <kbd>Enter</kbd> to submit, <kbd>Backspace</kbd> to undo, <kbd>Esc</kbd> to clear.</div>
  <label class="sub" for="puzzleSelect" style="display:block;margin-top:12px;font-weight:700;color:#1e4d2b;">Choose a puzzle</label>
  <select id="puzzleSelect" aria-label="Choose a puzzle"></select>
  <div class="legend" aria-label="How to tell the sides apart">
    <span>Top &middot; solid</span><span>Right &#9670; diagonal</span><span>Bottom &#9650; dotted</span><span>Left &#9632; crosshatch</span>
  </div>
  <div class="board" id="board" role="group" aria-label="Puzzle board"></div>
  <div class="word" id="word" aria-live="polite"><span class="dim">&mdash;</span></div>
  <div class="msg info" id="msg" role="status">Pick letters in order. The first letter can be any letter on the board.</div>
  <div class="controls">
    <button type="button" id="submitBtn" class="primary">Submit</button>
    <button type="button" id="undoBtn">Undo</button>
    <button type="button" id="clearBtn">Clear</button>
    <button type="button" id="hintBtn">Hint</button>
    <button type="button" id="newBtn">New Game</button>
  </div>
  <div class="progress" role="progressbar" aria-label="Letters used" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="progressBar"><div id="progressFill" style="width:0%"></div></div>
  <div class="stats-row"><span id="usedCount">0 of 12 letters used</span><span id="hintsLeft">Hints: 3 left</span></div>
  <h2>Letters</h2>
  <div class="chips" id="chips"></div>
  <h2>Words found <span id="wordCount">(0)</span></h2>
  <ol class="words" id="words"></ol>
  <div id="winBox" hidden></div>
  <p class="note">Preview build generated from <code>src/lib/puzzles.ts</code>, <code>src/lib/dictionary.ts</code> and the rules in <code>src/lib/game.ts</code>. Solutions are never shown before you win. To play the actual Next.js site, run it locally — see the message with this preview for the exact commands. Nothing here is deployed.</p>
</div>
<script>
var PUZZLES = ${JSON.stringify(puzzles)};
var DICTIONARY = ${JSON.stringify(dict)};
var POS = [{x:22,y:10},{x:50,y:10},{x:78,y:10},{x:90,y:22},{x:90,y:50},{x:90,y:78},{x:78,y:90},{x:50,y:90},{x:22,y:90},{x:10,y:78},{x:10,y:50},{x:10,y:22}];
var SIDE_NAMES = ["Top","Right","Bottom","Left"];
var SIDE_CLASSES = ["side-top","side-right","side-bottom","side-left"];
function flatLetters(p){ var t=p.sides[0], r=p.sides[1], b=p.sides[2], l=p.sides[3]; return [t[0],t[1],t[2],r[0],r[1],r[2],b[2],b[1],b[0],l[2],l[1],l[0]]; }
function sideOf(p){ var m={}; p.sides.forEach(function(side,i){ side.forEach(function(l){ m[l]=i; }); }); return m; }
function dayIndex(){ var parts=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Karachi",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date()); var y,m,d; parts.forEach(function(p){ if(p.type==="year")y=+p.value; if(p.type==="month")m=+p.value; if(p.type==="day")d=+p.value; }); var day=Math.floor(Date.UTC(y,m-1,d)/86400000); return day % PUZZLES.length; }
function validate(p, word, submitted){
  var letters = word.split("");
  if (letters.length < 3) return {ok:false, message:"Words need at least 3 letters. Keep going."};
  var allowed = {}; flatLetters(p).forEach(function(l){ allowed[l]=1; });
  if (letters.some(function(l){ return !allowed[l]; })) return {ok:false, message:"That word uses a letter that is not on this board."};
  if (new Set(letters).size !== letters.length) return {ok:false, message:"Use each letter at most once in a word. Pick a different letter next."};
  var sides = sideOf(p);
  for (var i=1;i<letters.length;i++){ if (sides[letters[i]]===sides[letters[i-1]]) return {ok:false, message:"Two letters in a row cannot come from the same side. Pick a letter from a different side next."}; }
  if (submitted.length>0){ var req=submitted[submitted.length-1].slice(-1); if (letters[0]!==req) return {ok:false, message:"Your next word must start with \\u201c"+req+"\\u201d \\u2014 the last letter of \\u201c"+submitted[submitted.length-1]+"\\u201d."}; }
  if (submitted.indexOf(word)>=0) return {ok:false, message:"You have already used that word in this puzzle."};
  if (DICTIONARY.indexOf(word)<0) return {ok:false, message:"That word is not in our curated word list yet. Try a more common word \\u2014 the list is growing, and this is not a judgement on the word itself."};
  return {ok:true};
}
function findHint(p, submitted, current){
  var requiredStart = current.length>0 ? null : (submitted.length>0 ? submitted[submitted.length-1].slice(-1) : null);
  var used={}; submitted.forEach(function(w){ w.split("").forEach(function(l){ used[l]=1; }); });
  var unused={}; flatLetters(p).forEach(function(l){ if(!used[l]) unused[l]=1; });
  var sides=sideOf(p); var best=null, bestScore=-1;
  for (var k=0;k<DICTIONARY.length;k++){
    var word=DICTIONARY[k];
    if (word.length<3) continue;
    if (submitted.indexOf(word)>=0) continue;
    if (requiredStart && word[0]!==requiredStart) continue;
    if (current.length>0 && word.indexOf(current.join(""))!==0) continue;
    var letters=word.split("");
    if (new Set(letters).size!==letters.length) continue;
    if (letters.some(function(l){ return sides[l]===undefined; })) continue;
    var ok=true; for (var i=1;i<letters.length;i++){ if (sides[letters[i]]===sides[letters[i-1]]){ ok=false; break; } }
    if (!ok) continue;
    var newCount=0; letters.forEach(function(l){ if (unused[l]) newCount++; });
    if (newCount===0) continue;
    var score=newCount*10-word.length;
    if (score>bestScore){ bestScore=score; best=word; }
  }
  return best;
}
// --- persistent-ish state: widget bridge when present, memory otherwise ---
var bridgeState = { progress: {}, solved: [] };
var bridgeOK = false;
try {
  if (window.hatchWidget && window.hatchWidget.getState) {
    var s = window.hatchWidget.getState({ progress: {}, solved: [] });
    if (s && typeof s === "object") { bridgeState = s; bridgeOK = true; }
  }
} catch(e) {}
function saveBridge(){
  try { if (window.hatchWidget && window.hatchWidget.setState) window.hatchWidget.setState(bridgeState); } catch(e) {}
}
if (window.hatchWidget) {
  window.addEventListener("hatch-widget-state", function(e){ if (e.detail && e.detail.state) bridgeState = e.detail.state; render(); });
}
var puzzleIndex = dayIndex();
var current = [], currentIndices = [], submitted = [], hintsUsed = 0, hintTarget = null, hintStage = 0, hintIndex = null, solved = false, lastMsg = null;
var $ = function(id){ return document.getElementById(id); };
function puzzle(){ return PUZZLES[puzzleIndex]; }
function loadPuzzle(idx){
  puzzleIndex = idx; var p = puzzle();
  var saved = (bridgeState.progress && bridgeState.progress[p.id]) || { submitted: [], hints: 0 };
  submitted = saved.submitted.slice(); hintsUsed = saved.hints || 0;
  current = []; currentIndices = []; hintTarget = null; hintStage = 0; hintIndex = null;
  solved = submitted.length>0 && flatLetters(p).every(function(l){ return submitted.join("").indexOf(l)>=0; });
  lastMsg = solved ? {kind:"ok", text:"Solved! Well played."} : null;
  render();
}
function persist(){
  if (!bridgeState.progress) bridgeState.progress = {};
  bridgeState.progress[puzzle().id] = { submitted: submitted.slice(), hints: hintsUsed };
  if (solved && bridgeState.solved.indexOf(puzzle().id)<0) bridgeState.solved.push(puzzle().id);
  saveBridge();
}
function canPick(letter){
  var p=puzzle();
  if (current.indexOf(letter)>=0) return false;
  if (current.length===0 && submitted.length>0){ var req=submitted[submitted.length-1].slice(-1); if (letter!==req) return false; }
  if (current.length===0) return true;
  var sides=sideOf(p);
  return sides[letter]!==sides[current[current.length-1]];
}
function pick(idx){
  if (solved) return;
  var letter=flatLetters(puzzle())[idx];
  if (!canPick(letter)) return;
  current.push(letter); currentIndices.push(idx); hintStage=0; hintTarget=null; hintIndex=null;
  render();
}
function setMsg(kind, text){ lastMsg={kind:kind, text:text}; var el=$("msg"); el.className="msg "+kind; el.textContent=text; }
function submit(){
  if (solved) return;
  var word=current.join("");
  var v=validate(puzzle(), word, submitted);
  if (!v.ok){ setMsg("error", v.message); return; }
  submitted.push(word); current=[]; currentIndices=[]; hintTarget=null; hintStage=0; hintIndex=null;
  var remaining=flatLetters(puzzle()).filter(function(l){ return submitted.join("").indexOf(l)<0; });
  solved = remaining.length===0;
  if (solved){ setMsg("ok", "Solved in "+submitted.length+" word"+(submitted.length===1?"":"s")+" \\u2014 every letter used. Well played."); }
  else { setMsg("ok", "\\u201c"+word+"\\u201d accepted. "+remaining.length+" letter"+(remaining.length===1?"":"s")+" still to use."); }
  persist(); render();
}
function undo(){ if (solved) return; current.pop(); currentIndices.pop(); render(); }
function clearWord(){ if (solved) return; current=[]; currentIndices=[]; hintTarget=null; hintStage=0; hintIndex=null; render(); }
function useHint(){
  if (solved) return;
  if (hintsUsed>=3){ setMsg("info","You have used all 3 hints for this puzzle."); return; }
  if (hintTarget && hintStage===1){
    hintStage=2; hintsUsed++;
    setMsg("info","Hint revealed: \\u201c"+hintTarget+"\\u201d would work here. It is only one option \\u2014 your own word is just as good.");
    persist(); render(); return;
  }
  var target=findHint(puzzle(), submitted, current);
  if (!target){ setMsg("info","No hint word found for this position. Puzzle hint: "+puzzle().hint); return; }
  hintTarget=target; hintStage=1; hintsUsed++;
  var flat=flatLetters(puzzle());
  hintIndex=flat.indexOf(target[0]);
  var prefix=current.length>0 ? " Continue \\u201c"+current.join("")+"\\u201d" : "";
  setMsg("info","Hint: try a "+target.length+"-letter word starting with \\u201c"+target[0]+"\\u201d that uses a letter you still need."+prefix+" Tap Hint again to reveal it.");
  persist(); render();
}
function render(){
  var p=puzzle();
  var flat=flatLetters(p);
  var sides=sideOf(p);
  var sideForPos=[0,0,0,1,1,1,2,2,2,3,3,3];
  var board=$("board"); board.innerHTML="";
  flat.forEach(function(letter, idx){
    var btn=document.createElement("button");
    btn.type="button";
    btn.className="tile "+SIDE_CLASSES[sideForPos[idx]]+(currentIndices.indexOf(idx)>=0?" picked":"")+(hintIndex===idx?" hinted":"");
    btn.disabled = solved || !canPick(letter);
    btn.setAttribute("aria-label","Letter "+letter+", "+SIDE_NAMES[sideForPos[idx]]+" side");
    btn.innerHTML="<span>"+letter+"</span><small>"+SIDE_NAMES[sideForPos[idx]].toUpperCase()+"</small>";
    var order=currentIndices.indexOf(idx);
    if (order>=0){ var b=document.createElement("span"); b.className="order"; b.textContent=String(order+1); btn.appendChild(b); }
    btn.addEventListener("click", function(){ pick(idx); });
    btn.style.left=POS[idx].x+"%"; btn.style.top=POS[idx].y+"%";
    board.appendChild(btn);
  });
  var wordEl=$("word");
  wordEl.innerHTML = current.length ? current.join("") : '<span class="dim">&mdash;</span>';
  if (lastMsg) { var el=$("msg"); el.className="msg "+lastMsg.kind; el.textContent=lastMsg.text; }
  else if (current.length===0) setMsg("info", submitted.length>0 ? "Your next word must start with \\u201c"+submitted[submitted.length-1].slice(-1)+"\\u201d." : "Pick letters in order. The first letter can be any letter on the board.");
  var usedCount=flat.filter(function(l){ return submitted.join("").indexOf(l)>=0; }).length;
  $("progressFill").style.width=Math.round(usedCount/12*100)+"%";
  $("progressBar").setAttribute("aria-valuenow", String(Math.round(usedCount/12*100)));
  $("usedCount").textContent=usedCount+" of 12 letters used";
  $("hintsLeft").textContent="Hints: "+(3-hintsUsed)+" left";
  $("submitBtn").disabled = solved || current.length<3;
  $("undoBtn").disabled = solved || current.length===0;
  $("clearBtn").disabled = solved || current.length===0;
  $("hintBtn").textContent="Hint ("+(3-hintsUsed)+" left)";
  $("hintBtn").disabled = solved || hintsUsed>=3;
  var chips=$("chips"); chips.innerHTML="";
  flat.forEach(function(l){ var c=document.createElement("span"); var used=submitted.join("").indexOf(l)>=0; c.className="chip"+(used?" used":""); c.textContent=l; chips.appendChild(c); });
  var words=$("words"); words.innerHTML="";
  submitted.forEach(function(w, i){
    var li=document.createElement("li");
    var prev=i===0 ? "" : submitted.slice(0,i).join("");
    var fresh=w.split("").filter(function(l){ return prev.indexOf(l)<0; }).length;
    li.textContent=w+" \\u2014 "+fresh+" new letter"+(fresh===1?"":"s");
    words.appendChild(li);
  });
  $("wordCount").textContent="("+submitted.length+")";
  var win=$("winBox");
  if (solved){
    win.hidden=false; win.className="win";
    win.innerHTML="<strong>Puzzle solved!</strong> You used every letter in "+submitted.length+" word"+(submitted.length===1?"":"s")+": "+submitted.join(" \\u2192 ")+". Try another puzzle from the list above, or tap New Game for a practice puzzle.";
  } else { win.hidden=true; win.innerHTML=""; }
  var sel=$("puzzleSelect");
  if (sel.options.length===0){
    PUZZLES.forEach(function(pp, i){
      var o=document.createElement("option"); o.value=String(i);
      o.textContent = (i===dayIndex() ? "Daily puzzle \\u2014 " : "") + pp.label + " (" + pp.id + ")";
      sel.appendChild(o);
    });
    sel.addEventListener("change", function(){ loadPuzzle(Number(sel.value)); });
  }
  sel.value=String(puzzleIndex);
  var title=document.querySelector("h1");
  title.textContent = puzzleIndex===dayIndex() ? "Today\\u2019s daily word puzzle" : "Practice word puzzle \\u2014 "+p.label;
}
$("submitBtn").addEventListener("click", submit);
$("undoBtn").addEventListener("click", undo);
$("clearBtn").addEventListener("click", clearWord);
$("hintBtn").addEventListener("click", useHint);
$("newBtn").addEventListener("click", function(){
  var next=(puzzleIndex+1)%PUZZLES.length;
  loadPuzzle(next);
  setMsg("info","Practice puzzle loaded. Your other puzzles keep their progress in this preview.");
});
document.addEventListener("keydown", function(e){
  if (e.target && (e.target.tagName==="SELECT" || e.target.tagName==="INPUT")) return;
  if (/^[a-zA-Z]$/.test(e.key)){ var letter=e.key.toUpperCase(); var idx=flatLetters(puzzle()).indexOf(letter); if (idx>=0) pick(idx); }
  else if (e.key==="Enter"){ e.preventDefault(); submit(); }
  else if (e.key==="Backspace"){ e.preventDefault(); undo(); }
  else if (e.key==="Escape"){ clearWord(); }
});
loadPuzzle(dayIndex());
</script>
</body>
</html>
`;

const outDir = join(root, "preview");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "letterboxed-preview.html");
writeFileSync(outPath, html);
console.log(`Preview written: ${outPath} (${html.length} bytes, ${puzzles.length} puzzles, ${dict.length} dictionary words)`);
