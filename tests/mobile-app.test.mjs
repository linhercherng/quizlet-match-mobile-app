import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (name) => readFile(new URL(name, root), "utf8");

test("web app manifest is installable on a phone", async () => {
  const manifest = JSON.parse(await read("manifest.webmanifest"));

  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.start_url, "./");
  assert.equal(manifest.scope, "./");
  assert.equal(manifest.orientation, "any");
  assert.ok(manifest.icons.some((icon) => icon.sizes === "192x192"));
  assert.ok(manifest.icons.some((icon) => icon.sizes === "512x512"));
  assert.ok(manifest.icons.some((icon) => icon.purpose?.includes("maskable")));
});

test("app shell includes phone installation and safe-area support", async () => {
  const html = await read("index.html");

  assert.match(html, /viewport-fit=cover/);
  assert.match(html, /rel="manifest" href="manifest\.webmanifest"/);
  assert.match(html, /rel="apple-touch-icon"/);
  assert.match(html, /id="btnInstall"/);
  assert.match(html, /navigator\.serviceWorker\.register\("\.\/service-worker\.js"\)/);
  assert.match(html, /safe-area-inset-bottom/);
  assert.match(html, /grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(html, /matchgame\.decks\.v4/);
  assert.match(html, /matchgame\.builtin\.v5/);
});

test("app shell offers Maze Chase and Whack-a-Mole mobile templates", async () => {
  const html = await read("index.html");

  assert.match(html, /data-type="maze"/);
  assert.match(html, /Maze Chase/);
  assert.match(html, /id="screen-maze"/);
  assert.match(html, /data-maze-move="up"/);
  assert.match(html, /data-maze-move="left"/);
  assert.match(html, /data-maze-move="right"/);
  assert.match(html, /data-maze-move="down"/);
  assert.match(html, /data-type="whack"/);
  assert.match(html, /Whack-a-Mole/);
  assert.match(html, /id="screen-whack"/);
  assert.match(html, /id="whackGrid"/);
  assert.match(html, /id="arcadeOpts"/);
  assert.match(html, /id="segArcadeDiff"/);
  assert.match(html, /data-arcade-diff="easy"/);
  assert.match(html, /data-arcade-diff="normal"/);
  assert.match(html, /data-arcade-diff="hard"/);
});

test("arcade templates update smoothly and make correct answers unmistakable", async () => {
  const html = await read("index.html");

  assert.match(html, /function buildMazeBoard\(/);
  assert.match(html, /function updateMazeActors\(/);
  assert.match(html, /function buildWhackGrid\(/);
  assert.match(html, /id="mazeFeedback"[^>]*aria-live="assertive"/);
  assert.match(html, /id="whackFeedback"[^>]*aria-live="assertive"/);
  assert.match(html, /function showCorrectFeedback\(/);
  assert.match(html, /navigator\.vibrate/);
  assert.match(html, /AudioContext/);
  assert.match(html, /correctAudioContext\.resume\(\)\.catch/);

  const mazeMove = html.match(/function mazeMove\(direction\)\{[\s\S]*?\n\}/)?.[0] || "";
  const enemyMove = html.match(/function moveMazeEnemies\(\)\{[\s\S]*?\n\}/)?.[0] || "";
  assert.match(mazeMove, /updateMazeActors\(\)/);
  assert.match(enemyMove, /updateMazeActors\(\)/);
  assert.doesNotMatch(mazeMove, /renderMaze\(/);
  assert.doesNotMatch(enemyMove, /renderMaze\(/);
  assert.match(html, /createRandomMazeWalls/);
  assert.match(html, /怪物會找最短路徑追你/);
  assert.match(html, /--maze-size/);
  assert.match(html, /difficulty\.enemyMoveMs/);
  assert.match(html, /whackS\.difficulty\.whackStayMs/);
});

test("service worker caches every offline-critical asset", async () => {
  const worker = await read("service-worker.js");

  assert.match(worker, /const CACHE_NAME = "match-master-v9"/);
  for (const asset of [
    "./",
    "./index.html",
    "./decks-v5.js",
    "./game-templates-v1.js",
    "./manifest.webmanifest",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
  ]) {
    assert.ok(worker.includes(JSON.stringify(asset)), `${asset} is not cached`);
  }
  assert.match(worker, /self\.skipWaiting\(\)/);
  assert.match(worker, /clients\.claim\(\)/);
});
