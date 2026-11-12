const GROUP='https://steamcommunity.com/groups/bami54';
const ROSTER=[
 {name:'bnBerkay7',url:'https://steamcommunity.com/id/bnBerkay7'},
 {name:'HasSickTear',url:'https://steamcommunity.com/id/HasSickTear54'},
 {name:'DizciMete',url:'https://steamcommunity.com/id/dizcimete'},
 {name:'derz.dolgu.ustası',url:'https://steamcommunity.com/profiles/76561198612629249'},
 {name:'fayansdöşeyen',url:'https://steamcommunity.com/profiles/76561198610767241'},
 {name:'Fnightt',url:'https://steamcommunity.com/profiles/76561199132668044'},
 {name:'KanalıSilinenDizci',url:'https://steamcommunity.com/profiles/76561199415782286'},
 {name:'Shepherd',url:'https://steamcommunity.com/profiles/76561199118437850'},
 {name:'YHWACH',url:'https://steamcommunity.com/profiles/76561199114229886'},
 {name:'yiiteren',url:'https://steamcommunity.com/profiles/76561199169636095'},
 {name:'YildizTilbe01',url:'https://steamcommunity.com/profiles/76561198745914125'}
];
async function getText(url){const r=await fetch(url,{headers:{'User-Agent':'BaMi54TeamSite/1.0 (public Steam pages)'} ,signal:AbortSignal.timeout(7500)});if(!r.ok) throw Error('HTTP '+r.status);return r.text();}
function xmlUnescape(s){return s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");}
async function resolveSteamId(profile){ const parsed=new URL(profile);if(parsed.hostname!=='steamcommunity.com')throw Error('Invalid host');const match=parsed.pathname.match(/^\/profiles\/(7656119\d{10})\/?$/);if(match)return match[1];if(!/^\/id\/[a-z0-9_.-]+\/?$/i.test(parsed.pathname))throw Error('Invalid profile');const xml=await getText(`https://steamcommunity.com${parsed.pathname.replace(/\/$/,'')}/?xml=1`);const id=xml.match(/<steamID64>(\d{17})<\/steamID64>/);if(!id)throw Error('SteamID not found');return id[1];}
module.exports={GROUP,ROSTER,getText,resolveSteamId,xmlUnescape};
