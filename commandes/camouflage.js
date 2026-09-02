import{menmacmd as A}from"../lib/menmacmd.js";import{addCamouflage as I,delCamouflage as w,getAllCamouflage as N}from"../Database/camouflage.js";import*as S from"../lib/menmacmd.js";import a from"../lib/styleHelper.js";import{trd as g}from"../lib/i18n.js";A({name:g("camouflage.name")||"camouflage",alias:["camo","disguise"],classe:"owner",react:"\u{1F576}\uFE0F",desc:g("camouflage.desc")||"Cr\xE9e un alias secret pour une commande, utilisable sans pr\xE9fixe."},async(d,U,{repondre:s,is_Owner:C,arg:m,verif_Gp:L,prefixe:t})=>{if(!C)return s("\u274C R\xE9serv\xE9 au propri\xE9taire du bot.");const u=m[0]?.toLowerCase();if(!u||u==="list"){const l=await N();if(!l||l.length===0){let e=a.TOP("\u{1F576}\uFE0F CAMOUFLAGE")+`
`;return e+=a.LINE(`Aucun alias configur\xE9.
`),e+=a.INTER()+`
`,e+=a.LINE(`*Usage :*
`),e+=a.LINE(`\u2022 ${t}camouflage <mot> <cmd> (Global)
`),e+=a.LINE(`\u2022 ${t}camouflage -g <mot> <cmd> (Groupe local)
`),e+=a.LINE(`\u2022 ${t}camouflage del <mot>
`),e+=a.BTM,s(e)}let c=a.TOP("\u{1F576}\uFE0F ALIAS CAMOUFL\xC9S")+`
`;return l.forEach((e,E)=>{const T=e.groupJid?"\u{1F4CD}":"\u{1F310}";c+=a.LINE(`${E+1}. ${T} *${e.alias}* \u2192 ${t}${e.realCommand}
`)}),c+=a.BTM+a.GENERATED_BY,s(c)}if(["del","suppr","delete","rm"].includes(u)){const l=m[1]?.toLowerCase();return l?(await w(l),s(a.STATUS(`Camouflage (${l})`,"\u{1F977}",!1))):s(`\u274C Usage : ${t}camouflage del <mot>`)}let n=!1,r=0,f=1;if(m[0]==="-g"){if(!L)return s("\u274C L'option *-g* n\xE9cessite d'\xEAtre dans un groupe.");n=!0,r=1,f=2}const i=m[r]?.toLowerCase(),o=m[f]?.toLowerCase();if(!i||!o)return s(`\u274C Usage : ${t}camouflage [-g] <mot_secret> <commande_r\xE9elle>`);if(!S.commands.find(l=>l.name===o||l.alias&&l.alias.includes(o)))return s(`\u274C La commande \xAB ${o} \xBB n'existe pas.`);await I(i,o,n?d:null);let $=a.STATUS(`Camouflage (${i})`,"\u{1F977}",!0)+`
> _Cible: ${t}${o} (${n?"Ce groupe":"Global"})_`;return s($)});
