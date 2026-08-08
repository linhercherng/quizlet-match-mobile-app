import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const source = await readFile(new URL("../decks-v4.js", import.meta.url), "utf8");
const context = { window: {} };
vm.runInNewContext(source, context);
const decks = JSON.parse(JSON.stringify(context.window.BUILTIN_DECKS));
const prefixL4WeekDecks = context.window.prefixL4WeekDecks;

const expectedWeeks = [1, 2, 3, 4, 5, 7, 8, 9, 10, 12, 13, 14, 15, 22, 23, 24];

test("built-in library prefixes every Week deck with L4", () => {
  assert.equal(decks.length, 17);
  assert.deepEqual(
    decks.slice(0, -1).map((deck) => deck.name),
    expectedWeeks.map((week) => `L4 Week ${week}`)
  );
  assert.equal(decks.at(-1).name, "L3&L4 動詞三態");
  assert.equal(decks.slice(0, -1).some((deck) => /^Week /.test(deck.name)), false);
});

test("existing saved Week deck names are migrated without changing other decks", () => {
  assert.equal(typeof prefixL4WeekDecks, "function");
  const savedDecks = [
    { id: "week-1", name: "Week 1", pairs: [["one", "1"]] },
    { id: "verbs", name: "L3&L4 動詞三態", pairs: [["be", "been"]] },
    { id: "custom", name: "自訂字庫", pairs: [["cat", "貓"]] }
  ];

  assert.deepEqual(
    JSON.parse(JSON.stringify(prefixL4WeekDecks(savedDecks))),
    [
      { id: "week-1", name: "L4 Week 1", pairs: [["one", "1"]] },
      savedDecks[1],
      savedDecks[2]
    ]
  );
});

test("Week decks reproduce all 255 Definition Bank entries", () => {
  const weekDecks = decks.slice(0, -1);
  assert.equal(weekDecks.reduce((sum, deck) => sum + deck.pairs.length, 0), 255);
  assert.equal(weekDecks[0].pairs.length, 30);
  for (const deck of weekDecks.slice(1)) assert.equal(deck.pairs.length, 15, deck.name);

  const week1Terms = new Set(weekDecks[0].pairs.map(([term]) => term));
  assert.ok(week1Terms.has("cousins"));
  assert.ok(week1Terms.has("eleventh (11th)"));
  assert.ok(week1Terms.has("twelfth (12th)"));
  assert.ok(week1Terms.has("thirteenth (13th)"));
});

test("verb forms deck contains all 84 base, past, and participle entries", () => {
  const verbDeck = decks.at(-1);
  assert.equal(verbDeck.pairs.length, 84);
  assert.deepEqual(
    verbDeck.pairs.find(([term]) => term === "be"),
    ["be", "過去式：was/were｜過去分詞：been"]
  );
  assert.deepEqual(
    verbDeck.pairs.find(([term]) => term === "write"),
    ["write", "過去式：wrote｜過去分詞：written"]
  );
});

test("every deck pair is complete and terms are unique inside its deck", () => {
  for (const deck of decks) {
    assert.ok(deck.emoji && deck.name);
    const terms = new Set();
    for (const pair of deck.pairs) {
      assert.equal(pair.length, 2);
      assert.ok(pair.every((value) => typeof value === "string" && value.trim().length > 0));
      assert.equal(terms.has(pair[0].toLowerCase()), false, `${deck.name}: ${pair[0]}`);
      terms.add(pair[0].toLowerCase());
    }
  }
});
