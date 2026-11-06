import{menmacmd as W}from"../lib/menmacmd.js";import{sleep as U,decodeJid as j}from"../lib/fonctions.js";import F from"fs";import Q from"path";import t from"../lib/styleHelper.js";import c from"../config.js";import{fileURLToPath as z}from"url";import{dirname as G}from"path";import{trd as s}from"../lib/i18n.js";const Y=z(import.meta.url),H=G(Y);let J=!1,V=c.OWNER||"";if(Array.isArray(c.NUMERO_DEV)?J=c.NUMERO_DEV.includes(V):J=c.NUMERO_DEV===V,J){let T=new Set;W({name:s("qmed.name"),devOnly:!0,alias:["quizmed","medecine"],classe:"owner",react:"\u{1FA7A}",desc:s("qmed.desc")},async(i,n,{repondre:m,auteur_Message:B,ms:S,prefixe:I,dev_id:_,arg:L})=>{if(!_)return m(s("qmed.restricted"));let p;try{p=JSON.parse(F.readFileSync(Q.join(H,"../Database/medecine.json"),"utf8"))}catch{return m(s("qmed.error_db"))}if(Array.isArray(p)||(p=p.matiere?[p]:[]),!L||L.length===0){let h=p.map(g=>g.matiere).join(`
- `),w=t.TOP(s("qmed.list_title"))+`
`+t.LINE(s("qmed.list_desc"))+t.LINE(`- ${(h||"Aucune").toUpperCase()}
`)+t.INTER()+`
`+t.LINE(s("qmed.usage",{prefixe:I}))+t.BTM;return m(w)}const b=L.join(" ").toLowerCase();let E=p.find(h=>h.matiere.toLowerCase()===b);if(!E)return m(s("qmed.not_found",{prefixe:I}));if(T.has(i))return m(s("qmed.already_active"));const R=B;T.add(i);let a=[],q=!1,y=!1;try{let h=t.TOP(`\u{1FA7A} ${E.matiere.toUpperCase()}`)+`
`+t.BTM+`

`+s("qmed.recruitment")+t.TOP(s("qmed.timer_title"))+`
`+t.BTM;await n.sendMessage(i,{text:h},{quoted:S});const w=async({messages:e,type:r})=>{if(r==="notify")for(const o of e){if(j(o.key.remoteJid)!==i)continue;const l=(o.message?.conversation||o.message?.extendedTextMessage?.text||"").trim().toLowerCase(),u=j(o.key.participant||o.key.remoteJid),M=f=>{const N=f.split("@")[0];return N===c.OWNER||Array.isArray(c.NUMERO_DEV)&&c.NUMERO_DEV.includes(N)||f===R};q?l==="stop"&&M(u)&&(y=!0):(["moi","oui","join"].includes(l)&&!a.find(f=>f.jid===u)&&(a.push({jid:u,name:o.pushName||"Joueur",points:0}),await n.sendMessage(i,{react:{text:"\u2705",key:o.key}})),l==="start"&&M(u)&&(a.find(f=>f.jid===u)||a.push({jid:u,name:o.pushName||"Joueur",points:0}),q=!0),l==="stop"&&M(u)&&(y=!0,q=!0))}};n.ev.on("messages.upsert",w);let g=60;for(;g>0&&!q;)await U(1e3),g--;if(q=!0,y)return n.ev.off("messages.upsert",w),T.delete(i),m(s("qmed.canceled"));a.length===0&&a.push({jid:R,name:"Initiateur",points:0}),await n.sendMessage(i,{text:s("qmed.start",{matiere:E.matiere.toUpperCase(),participants:a.map(e=>`*${e.name}*`).join(", ")}),mentions:a.map(e=>e.jid)},{quoted:S}),await U(2e3);let $=[...E.questions].sort(()=>Math.random()-.5);for(let e=0;e<$.length&&!y;e++){const r=$[e],o=r.options[r.answerIndex];let x="",l=t.TOP(`\u{1FA7A} Q${e+1}/${$.length}`)+`
`+t.BTM+`

*${r.question}*

`;[...r.options].sort(()=>Math.random()-.5).forEach((k,C)=>{const d=String.fromCharCode(65+C);l+=`${d}) ${k}
`,k===o&&(x=d)}),l+=`
`+t.TOP("\u23F3 45S  ")+`
`+t.LINE("(A, B, C, D)")+`
`+t.BTM,await n.sendMessage(i,{text:l});let M=new Set,f=0;const N=async({messages:k,type:C})=>{if(C==="notify")for(const d of k){if(j(d.key.remoteJid)!==i)continue;const D=(d.message?.conversation||d.message?.extendedTextMessage?.text||"").trim().toUpperCase(),A=j(d.key.participant||d.key.remoteJid);if(D==="STOP"&&(O=>{const v=O.split("@")[0];return v===c.OWNER||Array.isArray(c.NUMERO_DEV)&&c.NUMERO_DEV.includes(v)||O===R})(A)){y=!0;return}if(/^[A-E]$/.test(D)&&!M.has(A)){let O=a.find(v=>v.jid===A);O&&(M.add(A),D===x?(O.points+=10,await n.sendMessage(i,{react:{text:"\u2705",key:d.key}})):await n.sendMessage(i,{react:{text:"\u274C",key:d.key}}))}}};for(n.ev.on("messages.upsert",N);f<45&&!y;)await U(1e3),f++;if(n.ev.off("messages.upsert",N),y)break;await m(s("qmed.timeout",{letter:x,value:o})),await U(3e3)}n.ev.off("messages.upsert",w),a.sort((e,r)=>r.points-e.points);let P=t.TOP(s("qmed.results_title",{matiere:E.matiere.toUpperCase()}))+`

`;a.forEach((e,r)=>{P+=`${r===0?"\u{1F947}":r===1?"\u{1F948}":r===2?"\u{1F949}":"\u{1F464}"} *${e.name}* : ${e.points} pts
`}),await n.sendMessage(i,{text:P+`
`+t.BTM,mentions:a.map(e=>e.jid)})}catch{m(s("misc.error"))}finally{T.delete(i)}})}
