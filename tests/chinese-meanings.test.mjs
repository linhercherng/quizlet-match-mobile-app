import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
import test from "node:test";

const context=vm.createContext({window:{}});
for(const file of ["decks-v5.js","chinese-meanings.js"]){
  vm.runInContext(readFileSync(new URL("../"+file,import.meta.url),"utf8"),context);
}
const decks=context.window.BUILTIN_DECKS;
const {chineseMeaning,matchingPairs}=context.window.MATCH_CONTENT;
const copy=value=>JSON.parse(JSON.stringify(value));

test("all 709 built-in entries have Traditional Chinese meanings without changing the original pairs",()=>{
  const before=JSON.stringify(decks);
  let count=0;
  for(const deck of decks){
    for(const pair of deck.pairs){
      assert.match(chineseMeaning(pair),/\p{Script=Han}/u,`${deck.name}: ${pair[0]}`);
      count++;
    }
    const chinese=matchingPairs(deck.pairs,"zh");
    assert.ok(chinese.length>=2,deck.name);
    assert.equal(new Set(chinese.map(pair=>pair[1])).size,chinese.length);
  }
  assert.equal(count,709);
  assert.equal(JSON.stringify(decks),before);
});

test("meanings follow the original sense rather than matching only the English word",()=>{
  const find=(name,term)=>decks.find(deck=>deck.name===name).pairs.find(pair=>pair[0]===term);
  assert.equal(chineseMeaning(find("L4 Week 12","colony")),"殖民地");
  assert.equal(chineseMeaning(find("L6 Week 22","colony")),"生物群落");
  assert.equal(chineseMeaning(find("L6 Week 4","cracker")),"解碼者");
  assert.equal(chineseMeaning(find("L6 Week 4","bead")),"小水珠");
  for(const name of ["L3&L4 動詞三態","L6 動詞三態"]){
    assert.equal(chineseMeaning(find(name,"swim")),"游泳");
    assert.equal(chineseMeaning(find(name,"write")),"寫作");
    assert.equal(chineseMeaning(find(name,"light")),"點燃");
  }
});

test("saved two-column decks gain built-in meanings without migration; changed definitions require their own meaning",()=>{
  const original=copy(decks[0].pairs[0]);
  assert.equal(chineseMeaning(original),"海灘");
  assert.equal(chineseMeaning([original[0],"a new user-defined sense"]),"");
  assert.equal(chineseMeaning([original[0],original[1],"沙灘"]),"沙灘");
});

test("custom Chinese pairs work, missing translations are excluded and duplicate visible answers do not appear together",()=>{
  const pairs=[["apple","a fruit","蘋果"],["cat","貓"],["kitten","a baby cat","貓"],["unknown","unknown meaning"]];
  const before=JSON.stringify(pairs);
  assert.deepEqual(copy(matchingPairs(pairs,"zh")),[["apple","蘋果"],["cat","貓"]]);
  assert.deepEqual(copy(matchingPairs(pairs,"original")),pairs.map(pair=>pair.slice(0,2)));
  assert.equal(JSON.stringify(pairs),before);
});

test("fallback and custom Chinese decks still work when the built-in word bank cannot load",()=>{
  const fallback=vm.createContext({window:{}});
  vm.runInContext(readFileSync(new URL("../chinese-meanings.js",import.meta.url),"utf8"),fallback);
  assert.deepEqual(copy(fallback.window.MATCH_CONTENT.matchingPairs([["cat","貓"],["dog","狗"]],"zh")),[["cat","貓"],["dog","狗"]]);
});
