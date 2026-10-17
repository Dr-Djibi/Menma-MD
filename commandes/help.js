import{menmacmd as g,commands as h}from"../lib/menmacmd.js";import n from"../lib/styleHelper.js";import{trd as t}from"../lib/i18n.js";import u from"../config.js";const C=u.NOM_BOT;g({name:t("help.name"),alias:["h","aide"],classe:"outils",react:"\u2753",desc:t("help.desc")},async(L,E,$)=>{const{arg:l,repondre:i,prefixe:f}=$;if(l[0]&&!l[0].startsWith("cat=")){const s=l[0].toLowerCase(),e=h.find(a=>a.name.toLowerCase()===s||a.alias&&a.alias.map(o=>o.toLowerCase()).includes(s));if(e){let a=n.TOP(t("help.detail_title",{cmd:e.name.toUpperCase()}))+`
`;return a+=n.LINE(`${t("help.label_cmd")} : ${n.FANCY(e.name)}
`),a+=n.LINE(`${t("help.label_cat")} : ${t(`categories.${e.classe}`)||e.classe}
`),a+=n.LINE(`${t("help.label_desc")} : ${e.desc}
`),a+=n.LINE(`${t("help.label_alias")} : ${e.alias&&e.alias.length>0?e.alias.join(", "):"aucun"}
`),a+=n.LINE(`${t("help.label_react")} : ${e.react||"aucune"}
`),a+=n.INTER()+`
`,a+=n.LINE(`${t("help.usage",{prefixe:f,cmd:e.name,usage:e.usage||""})}
`),a+=n.BTM+n.FOOTER,i(a)}}const r={};h.forEach(s=>{r[s.classe]||(r[s.classe]=[]),r[s.classe].push(s)});const d=Object.keys(r).sort();let c=`\u2728 *${C.toUpperCase()} HELP* \u2728

`;c+=`\u{1F4DD} *${t("help.total",{count:h.length})}*

`;let m=d;if(l[0]&&l[0].startsWith("cat=")){const s=l[0].slice(4).toLowerCase();if(m=d.filter(e=>e.toLowerCase()===s),m.length===0)return i(t("help.cat_not_found",{cat:s}))}for(const s of m){const e=t(`categories.${s}`)||s;c+=`\u2501\u2501\u2501\u2501\u2501\u3014 *${e.toUpperCase()}* \u3015\u2501\u2501\u2501\u2501\u2501
`;const a=r[s].sort((o,p)=>o.name.localeCompare(p.name));for(const o of a){const p=o.alias&&o.alias.length>0?o.alias.join(", "):"none";c+=`\u22C4 *${o.name}* : _(${p})_ : ${o.desc||"..."}
`}c+=`
`}c+=`
${n.FOOTER}`,i(c)});
