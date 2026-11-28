import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
import test from "node:test";

const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
function setup(failWrite=false){
  const context=vm.createContext({window:{}});
  vm.runInContext(readFileSync(new URL("../decks-v5.js",import.meta.url),"utf8"),context);
  const builtin=context.window.BUILTIN_DECKS.map((deck,index)=>({...deck,id:`builtin-${index}`}));
  const saved=JSON.parse(JSON.stringify(builtin.slice(0,34)));
  saved.push({id:"custom",name:"我的字庫",pairs:[["cat","a cat","貓咪"]]});
  const original=JSON.stringify(saved);
  const values=new Map([["matchgame.decks.v4",original],["matchgame.builtin.v5","ready"]]);
  let writes=0;
  const warning={hidden:true,textContent:""};
  Object.assign(context,{
    SAMPLE_DECKS:builtin,LS_KEY:"matchgame.decks.v4",LS_BUILTIN:"matchgame.builtin.v6",
    document:{getElementById:()=>warning},
    localStorage:{getItem:key=>values.get(key)??null,setItem:(key,value)=>{writes++;if(failWrite)throw new Error("quota");values.set(key,value);}}
  });
  vm.runInContext(html.slice(html.indexOf("function loadDecks(){"),html.indexOf("function saveDecks(){")),context);
  return {context,values,original,saved,warning,writes:()=>writes,load:()=>vm.runInContext("loadDecks()",context)};
}

test("v21 saved libraries gain one verb theme while all old decks and custom Chinese data remain intact",()=>{
  const app=setup();
  const migrated=JSON.parse(JSON.stringify(app.load()));
  assert.equal(migrated.length,36);
  assert.deepEqual(migrated.slice(0,35),app.saved);
  assert.equal(migrated.at(-1).name,"動詞三態主題");
  assert.equal(migrated.at(-1).pairs.length,84);
  assert.equal(app.values.get("matchgame.builtin.v6"),"ready");
  assert.equal(app.load().filter(deck=>deck.name==="動詞三態主題").length,1);
});

test("a failed migration write retains the complete prior library instead of falling back to defaults",()=>{
  const app=setup(true);
  assert.equal(app.load().length,36);
  assert.equal(app.values.get("matchgame.decks.v4"),app.original);
  assert.equal(app.writes(),1);
  assert.equal(app.warning.hidden,false);
  assert.match(app.warning.textContent,/既有字庫仍保留/);
  assert.equal(app.values.has("matchgame.builtin.v6"),false);
});

test("adding the verb theme does not restore L6 decks deleted after the previous update",()=>{
  const app=setup();
  const saved=app.saved.filter(deck=>!deck.name.startsWith("L6 "));
  app.values.set("matchgame.decks.v4",JSON.stringify(saved));
  const migrated=JSON.parse(JSON.stringify(app.load()));
  assert.equal(migrated.length,saved.length+1);
  assert.deepEqual(migrated.slice(0,-1),saved);
  assert.equal(migrated.at(-1).name,"動詞三態主題");
  assert.equal(migrated.some(deck=>deck.name.startsWith("L6 ")),false);
});

test("older libraries that have never received the L6 update still receive L6 and the new theme",()=>{
  const app=setup();
  app.values.delete("matchgame.builtin.v5");
  app.values.set("matchgame.decks.v4",JSON.stringify(app.saved.filter(deck=>!deck.name.startsWith("L6 "))));
  const migrated=app.load();
  assert.equal(migrated.filter(deck=>deck.name.startsWith("L6 ")).length,17);
  assert.equal(migrated.filter(deck=>deck.name==="動詞三態主題").length,1);
  assert.deepEqual(JSON.parse(JSON.stringify(migrated.find(deck=>deck.id==="custom"))),app.saved.at(-1));
});
