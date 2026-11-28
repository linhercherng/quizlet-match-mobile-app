import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import test from "node:test";

function app(){
  const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
  const gameButtons=[...html.match(/id="segType">([\s\S]*?)<\/div>/)[1].matchAll(/data-g="([^"]+)"[^>]*>([^<]+)<\/button>/g)]
    .map(([,game,label])=>({dataset:{g:game},textContent:label}));
  const values=new Map();
  const nodes=new Map();
  const node=selector=>{
    if(!nodes.has(selector))nodes.set(selector,{value:"",dataset:{game:""},hidden:true,textContent:"",children:[],addEventListener(){},replaceChildren(){},append(child){this.children.push(child);}});
    return nodes.get(selector);
  };
  node("#playerName1").value="Alice";node("#playerName2").value="小明";
  const context=vm.createContext({
    window:{addEventListener(){}},document:{addEventListener(){},createElement:()=>({dataset:{},addEventListener(){},setAttribute(){}})},
    localStorage:{getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)},
    crypto:{randomUUID:()=>`session-${values.get("matchgame.history.v1")?.length??0}`},
    performance:{now:()=>5000},$ :node,$$:selector=>selector==="#segType button"?gameButtons:[],Date,Intl,
    cfg:{dir:"both"},spellCfg:{diff:"hard",rule:"practice",clue:"text"}
  });
  vm.runInContext(readFileSync(new URL("../play-history.js",import.meta.url),"utf8"),context);
  context.PLAY_HISTORY=context.window.PLAY_HISTORY;
  vm.runInContext(html.slice(html.indexOf("const LOG_GAMES="),html.indexOf("/* 分頁切換 */")),context);
  context.deck={name:"L4 Week 1"};
  return {context,node,run:code=>vm.runInContext(code,context),logs:()=>JSON.parse(values.get("matchgame.history.v1"))};
}

test("history exposes all four game categories in the same order and names as the game menu",()=>{
  const {node}=app();
  const categories=node("#historyGame").children.map(button=>[button.dataset.game,button.textContent]);
  assert.deepEqual(categories,[["","全部遊戲"],["match","🃏 配對"],["spell","🔤 拼字"],["maze","🧭 迷宮追逐"],["whack","🔨 打地鼠"]]);
});

test("duels keep each player's result and gameplay time, then replay creates a new session",()=>{
  const {context,run,logs}=app();
  context.states=[{total:4,remain:0,miss:1,startAt:1000,finalT:3.5},{total:4,remain:2,miss:2,startAt:1000}];
  run('startPlayLog(deck,"match","vs",4,states);closePlayLog("completed",1);closePlayLog("quit");');
  assert.equal(logs().length,1);
  assert.deepEqual(logs()[0].players.map(p=>[p.name,p.correct,p.mistakes,p.seconds,p.result]),
    [["Alice",4,1,3.5,"win"],["小明",2,2,4,"loss"]]);
  run('startPlayLog(deck,"match","vs",4,states);closePlayLog("quit");');
  assert.equal(logs().length,2);
  assert.equal(logs()[1].status,"quit");
});

test("spelling and arcade outcomes save their actual progress, score and mistakes",()=>{
  for(const [game,mode,state,status,expected] of [
    ["spell","solo",{solved:3,miss:2,score:44,startAt:1000},"timeup",[3,2,44]],
    ["spell","vs",{idx:2,miss:1,startAt:0},"quit",[2,1,null]],
    ["maze","solo",{idx:1,hearts:3,score:120,startAt:1000,difficulty:{label:"普通"}},"quit",[1,2,120]],
    ["whack","solo",{idx:0,hearts:0,score:0,startAt:1000,difficulty:{label:"困難"}},"failed",[0,5,0]]
  ]){
    const {context,run,logs}=app();
    context.states=mode==="vs"?[state,{...state}]:[state];
    run(`startPlayLog(deck,"${game}","${mode}",6,states);closePlayLog("${status}");`);
    const record=logs()[0];
    assert.equal(record.status,status);
    assert.deepEqual([record.players[0].correct,record.players[0].mistakes,record.players[0].score],expected);
    if(!state.startAt)assert.equal(record.players[0].seconds,0);
  }
});

test("checkpoint preserves an unfinished play and storage failure is visible",()=>{
  const {context,node,run,logs}=app();
  context.states=[{total:4,remain:2,miss:1,startAt:1000}];
  run('startPlayLog(deck,"match","solo",4,states);checkpointPlayLog();');
  assert.equal(logs()[0].status,"running");
  assert.equal(logs()[0].players[0].correct,2);
  context.localStorage.setItem=()=>{throw new Error("quota");};
  run('closePlayLog("quit");');
  assert.equal(node("#logWarning").hidden,false);
  assert.match(node("#logWarning").textContent,/quota/);
  assert.equal(logs().length,1);
});

test("Chinese matching sessions identify the chosen content in play history",()=>{
  const {context,run,logs}=app();
  context.cfg.matchLanguage="zh";
  context.states=[{total:4,remain:0,miss:0,startAt:1000,finalT:4}];
  run('startPlayLog(deck,"match","solo",4,states);closePlayLog("completed");');
  assert.match(logs()[0].settings,/英文 ↔ 中文意思/);
});

test("past and participle sessions retain distinct matching names in play history",()=>{
  for(const [language,label] of [["past","原形 ↔ 過去式"],["participle","原形 ↔ 過去分詞"]]){
    const {context,run,logs}=app();
    context.cfg.matchLanguage=language;
    context.states=[{total:4,remain:0,miss:0,startAt:1000,finalT:4}];
    run('startPlayLog(deck,"match","solo",4,states);closePlayLog("completed");');
    assert.equal(logs()[0].game,"match");
    assert.equal(logs()[0].settings,`${label}／雙向`);
  }
});
