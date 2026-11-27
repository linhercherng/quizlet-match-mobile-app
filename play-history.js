(function(global){
  "use strict";
  const KEY="matchgame.history.v1";
  const games=["match","spell","maze","whack"];
  const statuses=["running","completed","failed","timeup","quit","interrupted"];
  const text=value=>typeof value==="string"&&value.length>0;
  const count=value=>Number.isSafeInteger(value)&&value>=0;
  function validate(record){
    if(!record||!text(record.id)||!text(record.deck)||!text(record.settings)||
      !games.includes(record.game)||!["solo","vs"].includes(record.mode)||
      !statuses.includes(record.status)||!(count(record.total)||(record.total===null&&record.game==="spell"&&record.mode==="solo"))||
      !Number.isFinite(record.startedAt)||record.startedAt<=0||!Number.isFinite(new Date(record.startedAt).getTime())||
      !(record.endedAt===null||(Number.isFinite(record.endedAt)&&record.endedAt>=record.startedAt&&Number.isFinite(new Date(record.endedAt).getTime())))||
      !Array.isArray(record.players)||record.players.length!==(record.mode==="vs"?2:1)||
      !record.players.every(player=>player&&text(player.name)&&player.name.length<=40&&
        count(player.correct)&&count(player.mistakes)&&
        (player.score===null||count(player.score))&&
        Number.isFinite(player.seconds)&&player.seconds>=0&&
        ["","win","loss"].includes(player.result))) throw new Error("遊玩紀錄格式不正確；原有資料未被覆寫。");
    return record;
  }
  function read(storage){
    const raw=storage.getItem(KEY);
    if(raw===null)return [];
    let records;
    try{ records=JSON.parse(raw); }catch{ throw new Error("遊玩紀錄無法讀取；原有資料未被覆寫。"); }
    if(!Array.isArray(records))throw new Error("遊玩紀錄格式不正確；原有資料未被覆寫。");
    return records.map(validate);
  }
  function save(storage,record){
    validate(record);
    const records=read(storage);
    const index=records.findIndex(item=>item.id===record.id);
    if(index<0)records.push(record); else records[index]=record;
    storage.setItem(KEY,JSON.stringify(records));
  }
  function query(records,{player="",game=""}={}){
    const name=player.trim().toLocaleLowerCase();
    return records.filter(record=>!game||record.game===game)
      .flatMap(record=>record.players.map((entry,index)=>({...record,player:entry,seat:index+1})))
      .filter(row=>row.player.name.toLocaleLowerCase().includes(name))
      .sort((a,b)=>b.startedAt-a.startedAt||a.id.localeCompare(b.id)||a.seat-b.seat);
  }
  global.PLAY_HISTORY=Object.freeze({read,save,query});
})(window);
