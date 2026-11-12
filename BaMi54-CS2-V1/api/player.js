const {ROSTER,resolveSteamId}=require('./_shared');
function num(v){return Number.isFinite(Number(v))&&v!==null&&v!==undefined?Number(v):null;}
function flattenMatch(m,steamId){const stats=Array.isArray(m.stats)?m.stats:[];const own=stats.find(s=>String(s.steam64_id||s.steam_id||s.steamId||s.steam_id64||'')===String(steamId))|| (stats.length===1?stats[0]:null);
 const kills=num(own?.total_kills??own?.kills);const deaths=num(own?.total_deaths??own?.deaths);const assists=num(own?.total_assists??own?.assists);
 const teams=Array.isArray(m.team_scores)?m.team_scores:[];const team=own?.team_number;
 let result=null,score=null;
 if(team!=null&&teams.length===2){const us=teams.find(x=>String(x.team_number)===String(team));const them=teams.find(x=>String(x.team_number)!==String(team));if(us&&them){score=`${us.score} : ${them.score}`;result=us.score>them.score?'win':us.score<them.score?'loss':'draw';}}
 return {id:String(m.id||m.game_id||m.gameId||''),map:String(m.map_name||m.map||'Unknown'),date:m.finished_at||m.created_at||m.game_finished_at||null,kills,deaths,assists,kd:kills!=null&&deaths!=null?Number((kills/Math.max(deaths,1)).toFixed(2)):null,rating:num(own?.leetify_rating??own?.rating),score,result};}
module.exports=async (req,res)=>{
 if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
 const idx=Number(req.query.i);
 if(!Number.isInteger(idx)||idx<0||idx>=ROSTER.length)return res.status(400).json({error:'Unknown roster index'});
 const player=ROSTER[idx];res.setHeader('Cache-Control','public, s-maxage=900, stale-while-revalidate=1800');
 try{
  const steamId=await resolveSteamId(player.url);
  const headers={'Accept':'application/json'};if(process.env.LEETIFY_API_KEY)headers.Authorization='Bearer '+process.env.LEETIFY_API_KEY;
  const endpoint='https://api-public.cs-prod.leetify.com/v3/profile/matches?steam64_id='+encodeURIComponent(steamId);
  const r=await fetch(endpoint,{headers,signal:AbortSignal.timeout(7500)});
  if(!r.ok)return res.status(200).json({player,steamId,matches:[],status:'unavailable',reason:r.status===404?'not-indexed':r.status===429?'rate-limited':r.status===403?'private-or-forbidden':'provider-error',httpStatus:r.status});
  const json=await r.json();const arr=Array.isArray(json)?json:Array.isArray(json.matches)?json.matches:Array.isArray(json.data)?json.data:[];
  const matches=arr.map(m=>flattenMatch(m,steamId)).filter(m=>m.date).sort((a,b)=>Date.parse(b.date)-Date.parse(a.date)).slice(0,5);
  return res.status(200).json({player,steamId,matches,status:matches.length?'ok':'no-matches',source:'Leetify public API',checkedAt:new Date().toISOString()});
 }catch(e){return res.status(200).json({player,matches:[],status:'unavailable',reason:'connection-failed'});}
};
module.exports.flattenMatch=flattenMatch;
