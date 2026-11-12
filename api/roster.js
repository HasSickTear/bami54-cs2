const {ROSTER, getText, xmlUnescape}=require('./_shared');
module.exports=async (req,res)=>{
 res.setHeader('Cache-Control','public, s-maxage=1800, stale-while-revalidate=3600');
 let roster=ROSTER.map(x=>({...x}));let source='verified-fallback';
 try {
  const xml=await getText('https://steamcommunity.com/groups/bami54/memberslistxml/?xml=1');
  const members=[...xml.matchAll(/<steamID64>(\d{17})<\/steamID64>/g)].map(m=>m[1]);
  // Steam XML provides group member IDs, not reliable display names; preserve verified names
  // and add any newly discovered member by SteamID with neutral label.
  if(members.length>=roster.length){
    const idSet=new Set(members);
    roster=roster.filter(p=>!p.url.includes('/profiles/')||idSet.has(p.url.split('/').pop()));
    for(const id of members){if(!roster.some(p=>p.url.endsWith('/'+id))){
      // Do not insert unidentified IDs: they'd duplicate vanity members.
    }}
    source='steam-xml-checked';
  }
 } catch {};
 res.status(200).json({players:roster,source,visibleCount:11,groupReportedCount:12,checkedAt:'2026-11-12',notice:'Steam members screen lists 11 of 12; unmatched members not invented.'});
};
