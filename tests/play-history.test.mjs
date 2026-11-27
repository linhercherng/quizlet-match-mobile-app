import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import test from "node:test";

const context=vm.createContext({window:{}});
vm.runInContext(readFileSync(new URL("../play-history.js",import.meta.url),"utf8"),context);
const history=context.window.PLAY_HISTORY;
const copy=value=>JSON.parse(JSON.stringify(value));
const player=name=>({name,correct:0,mistakes:0,score:0,seconds:0,result:""});
const record=(id="one")=>({id,deck:"L4 Week 1",game:"whack",mode:"solo",settings:"普通",total:6,
  startedAt:1000,endedAt:null,status:"running",players:[player("小明")]});
function storage(){
  const values=new Map();
  return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};
}

test("each play survives reload and updates without duplicating the session",()=>{
  const store=storage();
  history.save(store,record());
  const ended={...record(),status:"completed",endedAt:6200,players:[{...player("小明"),correct:6,seconds:5.2}]};
  history.save(store,record("two"));
  history.save(store,ended);
  const logs=copy(history.read(store));
  assert.equal(logs.length,2);
  assert.equal(logs.find(row=>row.id==="one").players[0].correct,6);
  assert.equal(logs.find(row=>row.id==="one").status,"completed");
});

test("queries every player in a duel independently, newest first, with game filtering",()=>{
  const duel={...record("duel"),mode:"vs",game:"match",startedAt:3000,players:[player("Alice"),player("小明")]};
  const rows=copy(history.query([record(),duel],{player:" 小明 "}));
  assert.deepEqual(rows.map(row=>[row.id,row.seat]),[["duel",2],["one",1]]);
  assert.equal(history.query([duel],{player:"alice",game:"match"}).length,1);
  assert.equal(history.query([duel],{game:"spell"}).length,0);
});

test("corrupt history is rejected without overwriting existing bytes",()=>{
  for(const raw of ["{broken","{}",'[{}]']){
    const store={getItem:()=>raw,setItem:()=>assert.fail("must not overwrite damaged history")};
    assert.throws(()=>history.save(store,record()));
  }
  assert.throws(()=>history.save(storage(),{...record(),players:[{...player("小明"),seconds:NaN}]}));
  assert.throws(()=>history.save(storage(),{...record(),startedAt:1e20}));
});

test("storage-full errors are reported and an existing session remains readable",()=>{
  const store=storage();
  history.save(store,record());
  store.setItem=()=>{throw new Error("quota");};
  assert.throws(()=>history.save(store,record("two")),/quota/);
  assert.equal(history.read(store).length,1);
});
