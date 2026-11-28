import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const source = await readFile(new URL("../decks-v5.js", import.meta.url), "utf8");
const context = { window: {} };
vm.runInNewContext(source, context);
const decks = JSON.parse(JSON.stringify(context.window.BUILTIN_DECKS));
const prefixL4WeekDecks = context.window.prefixL4WeekDecks;
const mergeBuiltinDeckUpdates = context.window.mergeBuiltinDeckUpdates;

const expectedWeeks = [1, 2, 3, 4, 5, 7, 8, 9, 10, 12, 13, 14, 15, 22, 23, 24];
const l4WeekDecks = decks.slice(0, 16);
const l4VerbDeck = decks[16];
const l6WeekDecks = decks.slice(17, 33);
const l6VerbDeck = decks[33];

test("built-in library keeps L4 decks and adds L6-prefixed categories", () => {
  assert.equal(decks.length, 35);
  assert.deepEqual(
    l4WeekDecks.map((deck) => deck.name),
    expectedWeeks.map((week) => `L4 Week ${week}`)
  );
  assert.equal(l4VerbDeck.name, "L3&L4 動詞三態");
  assert.deepEqual(
    l6WeekDecks.map((deck) => deck.name),
    expectedWeeks.map((week) => `L6 Week ${week}`)
  );
  assert.equal(l6VerbDeck.name, "L6 動詞三態");
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

test("existing saved libraries receive missing L6 decks and the verb theme exactly once", () => {
  assert.equal(typeof mergeBuiltinDeckUpdates, "function");
  const savedDecks = [
    { id: "week-1", name: "L4 Week 1", pairs: [["one", "1"]] },
    { id: "custom", name: "自訂字庫", pairs: [["cat", "貓"]] }
  ];

  const merged = mergeBuiltinDeckUpdates(savedDecks, decks);
  const normalizedMerged = JSON.parse(JSON.stringify(merged));
  assert.equal(merged.length, 20);
  assert.deepEqual(normalizedMerged.slice(0, 2), savedDecks);
  assert.deepEqual(
    normalizedMerged.slice(2).map((deck) => deck.name),
    [...expectedWeeks.map((week) => `L6 Week ${week}`), "L6 動詞三態", "動詞三態主題"]
  );
  assert.strictEqual(mergeBuiltinDeckUpdates(merged, decks), merged);
});

test("L4 Week decks retain all 255 Definition Bank entries", () => {
  assert.equal(l4WeekDecks.reduce((sum, deck) => sum + deck.pairs.length, 0), 255);
  assert.equal(l4WeekDecks[0].pairs.length, 30);
  for (const deck of l4WeekDecks.slice(1)) assert.equal(deck.pairs.length, 15, deck.name);

  const week1Terms = new Set(l4WeekDecks[0].pairs.map(([term]) => term));
  assert.ok(week1Terms.has("cousins"));
  assert.ok(week1Terms.has("eleventh (11th)"));
  assert.ok(week1Terms.has("twelfth (12th)"));
  assert.ok(week1Terms.has("thirteenth (13th)"));
});

test("L4 verb forms deck retains all 84 entries", () => {
  assert.equal(l4VerbDeck.pairs.length, 84);
  assert.deepEqual(
    l4VerbDeck.pairs.find(([term]) => term === "be"),
    ["be", "過去式：was/were｜過去分詞：been"]
  );
  assert.deepEqual(
    l4VerbDeck.pairs.find(([term]) => term === "write"),
    ["write", "過去式：wrote｜過去分詞：written"]
  );
});

test("L6 Week decks reproduce all 255 Definition Bank entries", () => {
  assert.equal(l6WeekDecks.reduce((sum, deck) => sum + deck.pairs.length, 0), 255);
  assert.equal(l6WeekDecks[0].pairs.length, 30);
  for (const deck of l6WeekDecks.slice(1)) assert.equal(deck.pairs.length, 15, deck.name);

  assert.ok(l6WeekDecks[0].pairs.some(([term]) => term === "gym (gymnasium)"));
  assert.ok(l6WeekDecks[9].pairs.some(([term]) => term === "sell lemonade"));
  assert.ok(l6WeekDecks[9].pairs.some(([term]) => term === "musical instruments"));
  assert.ok(l6WeekDecks[12].pairs.some(([term]) => term === "request(s)"));
});

test("L6 verb forms deck contains all 115 attachment entries", () => {
  assert.equal(l6VerbDeck.pairs.length, 115);
  assert.deepEqual(
    l6VerbDeck.pairs.find(([term]) => term === "get"),
    ["get", "過去式：got｜過去分詞：got(ten)"]
  );
  assert.deepEqual(
    l6VerbDeck.pairs.find(([term]) => term === "write"),
    ["write", "過去式：wrote｜過去分詞：written"]
  );
});

test("every deck pair is complete and terms are unique inside its deck", () => {
  for (const deck of decks) {
    assert.ok(deck.emoji && deck.name);
    const terms = new Set();
    for (const pair of deck.pairs) {
      assert.ok(pair.length === 2 || pair.length === 3);
      assert.ok(pair.every((value) => typeof value === "string" && value.trim().length > 0));
      assert.equal(terms.has(pair[0].toLowerCase()), false, `${deck.name}: ${pair[0]}`);
      terms.add(pair[0].toLowerCase());
    }
  }
});

test("the supplied verb theme retains all 84 verbs, alternative forms and exact Chinese meanings",()=>{
  const theme=decks.find(deck=>deck.name==="動詞三態主題");
  assert.equal(theme.pairs.length,84);
  assert.deepEqual(theme.pairs.map(pair=>pair[0]).sort(),l4VerbDeck.pairs.map(pair=>pair[0]).sort());
  const expected={
    be:["was / were","been","是；在"],bear:["bore","borne / born","承受；生育"],
    burn:["burned / burnt","burned / burnt","燃燒；燒傷"],can:["could","—","能；會；可以"],
    dream:["dreamed / dreamt","dreamed / dreamt","做夢；夢想"],get:["got","got / gotten","得到；取得；變得"],
    learn:["learned / learnt","learned / learnt","學習"],light:["lit / lighted","lit / lighted","點燃；照亮"],
    quit:["quit / quitted","quit / quitted","停止；辭職"],shine:["shone / shined","shone / shined","發光；照耀"],
    spell:["spelled / spelt","spelled / spelt","拼寫"],write:["wrote","written","寫"]
  };
  for(const [base,[past,participle,chinese]] of Object.entries(expected)){
    assert.deepEqual(theme.pairs.find(pair=>pair[0]===base),[base,`過去式：${past}｜過去分詞：${participle}`,chinese]);
  }
});

test("an edited existing verb theme is preserved rather than replaced or duplicated",()=>{
  const edited={id:"my-theme",name:"動詞三態主題",pairs:[["be","自訂三態","自訂中文"]]};
  const merged=mergeBuiltinDeckUpdates([edited],decks);
  assert.strictEqual(merged[0],edited);
  assert.equal(merged.filter(deck=>deck.name===edited.name).length,1);
});
