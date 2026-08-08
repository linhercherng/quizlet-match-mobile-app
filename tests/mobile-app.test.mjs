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

test("service worker caches every offline-critical asset", async () => {
  const worker = await read("service-worker.js");

  assert.match(worker, /const CACHE_NAME = "match-master-v5"/);
  for (const asset of [
    "./",
    "./index.html",
    "./decks-v5.js",
    "./manifest.webmanifest",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
  ]) {
    assert.ok(worker.includes(JSON.stringify(asset)), `${asset} is not cached`);
  }
  assert.match(worker, /self\.skipWaiting\(\)/);
  assert.match(worker, /clients\.claim\(\)/);
});
