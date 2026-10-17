import{menmacmd as P}from"../lib/menmacmd.js";import{recup_msg as A,sleep as C,decodeJid as j}from"../lib/fonctions.js";import"../config.js";import n from"../lib/styleHelper.js";import X from"fs";import Q from"path";import{fileURLToPath as ae}from"url";import{dirname as ie}from"path";import{trd as e}from"../lib/i18n.js";const oe=ae(import.meta.url),W=ie(oe),V=n.GENERATED_BY,z=new Set,re=()=>{try{const t=X.readFileSync(Q.join(W,"../Database/words.json"),"utf8");return JSON.parse(t)}catch{return{facile:["BANANE","CHOCOLAT","MENMA","WHATSAPP","ROBOT"]}}},ce=t=>t.split("").sort(()=>Math.random()-.5).join(""),te=t=>t.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase();P({name:e("dmots.name"),alias:["guess","mot"],classe:"menma-game",react:"\u{1F9E9}",desc:e("dmots.desc")},async(t,s,{repondre:a,auteur_Message:g,pseudo:$,ms:u})=>{if(z.has(t))return a(e("dmots.already_active"));const r=re(),o=Object.keys(r);let l=[],x=!1;z.add(t);try{let y=n.TOP(e("dmots.title"))+`
`;y+=n.LINE(`${e("dmots.inscription",{pseudo:$})}
`),y+=n.INTER()+`
`+n.LINE(`${e("dmots.timer")}
`)+n.BTM,await s.sendMessage(t,{text:y,mentions:[g]},{quoted:u});const w=async({messages:m,type:I})=>{if(!(I!=="notify"||x))for(const L of m){if(j(L.key.remoteJid)!==t)continue;const q=(L.message?.conversation||L.message?.extendedTextMessage?.text||"").trim().toLowerCase(),N=j(L.key.participant||L.key.remoteJid);["moi","me","oui","ok"].includes(q)&&!l.find(h=>h.jid===N)&&(l.push({jid:N,name:L.pushName||"Inconnu",rankIndex:0,successCount:0}),await s.sendMessage(t,{react:{text:"\u2705",key:L.key}})),["start","go","oui"].includes(q)&&N===g&&l.length>0&&(x=!0)}};s.ev.on("messages.upsert",w);let E=0;for(;E<60&&!x;)await C(1e3),E++;if(x=!0,s.ev.off("messages.upsert",w),l.length===0)return z.delete(t),a(e("dmots.canceled"));for(await s.sendMessage(t,{text:e("dmots.start",{participants:l.map(m=>`*${m.name}*`).join(", ")}),mentions:l.map(m=>m.jid)},{quoted:u}),await C(2e3);l.length>0;){let m=[...l];for(let I=0;I<m.length;I++){const L=m[I],i=l.find(d=>d.jid===L.jid);if(!i)continue;const q=o[i.rankIndex]||o[o.length-1],N=r[q],h=N[Math.floor(Math.random()*N.length)],M=ce(h);let c=n.TOP(e("dmots.question_title"))+`
`;c+=n.LINE(`${e("dmots.player",{name:i.name})}
`),c+=n.LINE(`${e("dmots.rank",{rank:q.toUpperCase()})}
`)+n.INTER()+`
`,c+=n.LINE(`${e("dmots.word",{word:M.toUpperCase()})}
`),c+=n.LINE(`${e("dmots.time")}
`)+n.BTM,await s.sendMessage(t,{text:c,mentions:[i.jid]},{quoted:u});let f=!1;try{const d=await A(s,i.jid,t,2e4),p=(d.message?.conversation||d.message?.extendedTextMessage?.text||"").trim();te(p)===te(h)&&(f=!0)}catch{}if(f)i.successCount++,i.successCount>=3&&i.rankIndex<o.length-1?(i.rankIndex++,i.successCount=0,await s.sendMessage(t,{text:e("dmots.rank_up",{name:i.name,rank:o[i.rankIndex].toUpperCase()}),mentions:[i.jid]},{quoted:u})):await a(e("dmots.correct",{count:i.successCount}));else{await s.sendMessage(t,{text:e("dmots.eliminated",{name:i.name,word:h.toUpperCase()}),mentions:[i.jid]},{quoted:u});const d=l.findIndex(p=>p.jid===i.jid);d!==-1&&l.splice(d,1)}await C(1500)}if(l.length>1)await a(e("dmots.tour_end",{count:l.length})),await C(2e3);else if(l.length===1){const I=l[0];await s.sendMessage(t,{text:e("dmots.winner",{name:I.name}),mentions:[I.jid]},{quoted:u}),l=[];break}}}finally{z.delete(t)}a(e("dmots.end"))});const ne=t=>{const s=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];for(const[a,g,$]of s)if(t[a]!==" "&&t[a]===t[g]&&t[a]===t[$])return t[a];return t.includes(" ")?null:"tie"},Y=t=>{const s={X:"\u274C",O:"\u2B55"," ":"\u2B1C"};let a="";for(let g=0;g<9;g+=3)a+=`${s[t[g]]}${s[t[g+1]]}${s[t[g+2]]}
`;return a};P({name:e("tictactoe.name"),alias:["ttt","morpion"],classe:"menma-game",react:"\u{1F3AE}",desc:e("tictactoe.desc")},async(t,s,{repondre:a,mr:g,arg:$,auteur_Message:u,ms:r,msg_Repondu:o,auteur_Msg_Repondu:l,id_Bot:x,resolveName:y})=>{const w=j(u),E=y(w).replace("@","");let m=null,I=null;if($&&$[0]?.toLowerCase()==="bot"?(m="bot",I="\u{1F916} MENMA-BOT"):o&&l?(m=j(l),I=y(m)):g&&g.length>0&&(m=j(g[0]),I=y(m)),(m===j(x)||m===j(s.user.id))&&(m="bot",I="\u{1F916} MENMA-BOT"),!m)return a(e("tictactoe.usage"));if(w===m)return a(e("tictactoe.self"));if(m!=="bot"){await s.sendMessage(t,{text:e("tictactoe.invitation",{player:I,initiator:E}),mentions:[m]},{quoted:r});try{const h=await A(s,m,j(t),6e4),M=(h.message?.conversation||h.message?.extendedTextMessage?.text||"").trim().toLowerCase();if(!["oui","yes","ok","y"].some(c=>M.includes(c)))return s.sendMessage(t,{text:e("tictactoe.rejected",{player:I}),mentions:[m]},{quoted:r})}catch{return s.sendMessage(t,{text:e("tictactoe.timeout",{player:I}),mentions:[m]},{quoted:r})}await a(e("tictactoe.accepted"))}const L=Array(9).fill(" ");let i="X",q=null;const N=h=>h===w?E:I;for(await s.sendMessage(t,{text:n.TOP(e("tictactoe.title"))+`
`+n.LINE(`\u274C : *${E}*
`)+n.LINE(`\u2B55 : *${I}*

`)+Y(L).split(`
`).map(h=>h.trim()?n.LINE(h):"").join(`
`)+`
`+n.LINE(e("tictactoe.turn",{emoji:"\u274C",player:E})),mentions:m==="bot"?[w]:[w,m]},{quoted:r});!q;){let h=-1;const M=i==="X"?w:m;if(M==="bot"){await C(1500);const f=(p,T,k)=>{const R=ne(p);if(R===i)return 10-T;if(R===(i==="X"?"O":"X"))return-10+T;if(R==="tie")return 0;if(k){let U=-1/0;for(let B=0;B<9;B++)p[B]===" "&&(p[B]=i,U=Math.max(U,f(p,T+1,!1)),p[B]=" ");return U}else{let U=1/0;for(let B=0;B<9;B++)p[B]===" "&&(p[B]=i==="X"?"O":"X",U=Math.min(U,f(p,T+1,!0)),p[B]=" ");return U}};let d=-1/0;for(let p=0;p<9;p++)if(L[p]===" "){L[p]=i;const T=f(L,0,!1);L[p]=" ",T>d&&(d=T,h=p)}if(h===-1){q="tie";break}}else try{const f=await A(s,M,j(t),6e4),d=(f.message?.conversation||f.message?.extendedTextMessage?.text||"").trim(),p=parseInt(d)-1;if(!isNaN(p)&&p>=0&&p<=8&&L[p]===" ")h=p;else{if(["surrender","abandonner"].includes(d.toLowerCase()))return s.sendMessage(t,{text:e("tictactoe.abandon",{player:N(M)}),mentions:[M]},{quoted:f});await s.sendMessage(t,{text:e("tictactoe.invalid",{player:N(M)}),mentions:[M]},{quoted:f});continue}}catch{return s.sendMessage(t,{text:e("tictactoe.timeout",{player:N(M)}),mentions:[M]},{quoted:r})}if(L[h]=i,q=ne(L),q)break;i=i==="X"?"O":"X";const c=i==="X"?w:m;await s.sendMessage(t,{text:n.TOP(e("tictactoe.title"))+`
`+Y(L).split(`
`).map(f=>f.trim()?n.LINE(f):"").join(`
`)+`
`+n.LINE(e("tictactoe.turn",{emoji:i==="X"?"\u274C":"\u2B55",player:N(c)})),mentions:c!=="bot"?[c]:[]},{quoted:r})}if(q==="tie")a(e("tictactoe.tie")+`

${Y(L)}`);else{const h=q==="X"?w:m,M=e("tictactoe.win",{board:Y(L),emoji:q==="X"?"\u274C":"\u2B55",player:N(h)});h==="bot"?a(M):s.sendMessage(t,{text:M,mentions:[h]},{quoted:r})}}),P({name:e("vof.name"),alias:["vraioufaux","trivia"],classe:"menma-game",react:"\u2753",desc:e("vof.desc")},async(t,s,{repondre:a,auteur_Message:g})=>{try{const $=JSON.parse(X.readFileSync(Q.join(W,"../Database/games.json"),"utf8")),u=$.vof[Math.floor(Math.random()*$.vof.length)];a(`${e("vof.title")}

${e("vof.question",{question:u.q})}

${e("vof.instruction")}`+V);try{const r=await A(s,g,t,2e4),o=(r.message?.conversation||r.message?.extendedTextMessage?.text||"").trim().toLowerCase();o===u.a?a(e("vof.correct")):["vrai","faux"].includes(o)&&a(e("vof.wrong",{answer:u.a.toUpperCase()}))}catch{a(e("vof.timeout",{answer:u.a.toUpperCase()}))}}catch{a(e("verite.error"))}}),P({name:e("pendu.name"),alias:["hangman"],classe:"menma-game",react:"\u{1FAA2}",desc:e("pendu.desc")},async(t,s,{repondre:a,auteur_Message:g})=>{try{const $=JSON.parse(X.readFileSync(Q.join(W,"../Database/words.json"),"utf8")),u=Object.keys($),r=u[Math.floor(Math.random()*u.length)],o=$[r][Math.floor(Math.random()*$[r].length)].toUpperCase();let l=[],x=6,y="_ ".repeat(o.length).trim();for(await a(`${e("pendu.title")}

${e("pendu.level",{level:r.toUpperCase()})}
${e("pendu.word",{word:y})}
${e("pendu.attempts",{count:x})}

${e("pendu.instruction")}`+V);x>0&&y.includes("_");)try{const w=await A(s,g,t,6e4),E=(w.message?.conversation||w.message?.extendedTextMessage?.text||"").trim().toUpperCase();if(E.length!==1||!/[A-ZÀ-Ÿ]/.test(E)){if(E==="ABANDON")break;a(e("pendu.invalid"));continue}if(l.includes(E)){a(e("pendu.already"));continue}if(l.push(E),o.includes(E)){if(y=o.split("").map(m=>l.includes(m)?m:"_").join(" "),!y.includes("_"))break;a(e("pendu.correct",{word:y,count:x,letters:l.join(", ")}))}else x--,a(e("pendu.wrong",{word:y,count:x,letters:l.join(", ")}))}catch{return a(e("vof.timeout",{answer:o}))}y.includes("_")?a(e("pendu.loss",{word:o})):a(e("pendu.win",{word:o}))}catch{a(e("verite.error"))}}),P({name:e("justeprix.name"),alias:["nombre"],classe:"menma-game",react:"\u{1F4B0}",desc:e("justeprix.desc")},async(t,s,{repondre:a,auteur_Message:g})=>{const $=Math.floor(Math.random()*100)+1;let u=0,r=!1;for(await a(`${e("justeprix.title")}

${e("justeprix.instruction")}`+V);!r&&u<10;)try{const o=await A(s,g,t,45e3),l=parseInt((o.message?.conversation||o.message?.extendedTextMessage?.text||"").trim());if(isNaN(l)){a(e("justeprix.invalid"));continue}u++,l===$?(r=!0,a(e("justeprix.win",{target:$,attempts:u}))):l<$?a(e("justeprix.plus",{count:u})):a(e("justeprix.moins",{count:u}))}catch{return a(e("vof.timeout",{answer:$}))}r||a(e("justeprix.loss",{target:$}))}),P({name:e("pileouface.name"),alias:["pof","coinflip"],classe:"menma-game",react:"\u{1FA99}",desc:e("pileouface.desc")},async(t,s,{repondre:a,arg:g})=>{const $=["pile","face"],u=$[Math.floor(Math.random()*2)],r=g[0]?.toLowerCase();await a(n.TOP(e("pileouface.title"))+`
`+n.LINE(`${e("pileouface.spinning")}
`)+n.BTM),await C(2e3);let o=n.TOP(e("pileouface.result"))+`
`+n.LINE(`${e("pileouface.outcome",{result:u.toUpperCase()})}
`);r&&$.includes(r)&&(o+=n.LINE(`${r===u?e("pileouface.win",{choice:r}):e("pileouface.loss",{choice:r})}
`)),a(o+n.BTM)}),P({name:e("casino.name"),alias:["slots"],classe:"menma-game",react:"\u{1F3B0}",desc:e("casino.desc")},async(t,s,{repondre:a})=>{const g=["\u{1F34E}","\u{1F34B}","\u{1F347}","\u{1F352}","\u{1F48E}","\u{1F514}","7\uFE0F\u20E3"],$=g[Math.floor(Math.random()*7)],u=g[Math.floor(Math.random()*7)],r=g[Math.floor(Math.random()*7)];let o=n.TOP(e("casino.title"))+`
`+n.LINE(`[ ${$} | ${u} | ${r} ]
`)+n.INTER()+`
`;$===u&&u===r?o+=n.LINE(`${e("casino.jackpot")}
`):$===u||u===r||$===r?o+=n.LINE(`${e("casino.almost")}
`):o+=n.LINE(`${e("casino.loss")}
`),a(o+n.BTM)}),P({name:e("math.name"),alias:["maths"],classe:"menma-game",react:"\u{1F9EE}",desc:e("math.desc")},async(t,s,{repondre:a,auteur_Message:g})=>{const $=["+","-","*"],u=$[Math.floor(Math.random()*3)];let r,o,l;u==="+"?(r=Math.floor(Math.random()*100),o=Math.floor(Math.random()*100),l=r+o):u==="-"?(r=Math.floor(Math.random()*100),o=Math.floor(Math.random()*r),l=r-o):(r=Math.floor(Math.random()*12),o=Math.floor(Math.random()*12),l=r*o),await a(`${e("math.title")}

${e("math.question",{n1:r,op:u,n2:o})}
${e("math.time")}`);try{const x=await A(s,g,t,15e3),y=parseInt((x.message?.conversation||x.message?.extendedTextMessage?.text||"").trim());a(y===l?e("math.correct"):e("math.wrong",{answer:l}))}catch{a(e("math.timeout",{answer:l}))}}),P({name:e("deduo.name"),alias:["dueldes"],classe:"menma-game",react:"\u{1F3B2}",desc:e("deduo.desc")},async(t,s,{repondre:a,mr:g,msg_Repondu:$,auteur_Msg_Repondu:u,resolveName:r,ms:o})=>{let l=g[0]||($?u:"bot"),x=l==="bot"?"\u{1F916} MENMA-BOT":r(l);const y=Math.floor(Math.random()*6)+1,w=Math.floor(Math.random()*6)+1;let E=n.TOP(e("deduo.title"))+`
`+n.LINE(`${e("deduo.me",{val:y})}
`)+n.LINE(`${e("deduo.opponent",{emoji:l==="bot"?"\u{1F916}":"\u{1F464}",name:x,val:w})}
`)+n.INTER()+`
`;y>w?E+=n.LINE(`${e("deduo.win")}
`):y<w?E+=n.LINE(`${e("deduo.loss",{name:x})}
`):E+=n.LINE(`${e("deduo.tie")}
`),await s.sendMessage(t,{text:E+n.BTM,mentions:l!=="bot"?[l]:[]},{quoted:o})}),P({name:e("bombe.name"),alias:["bomb"],classe:"menma-game",react:"\u{1F4A3}",desc:e("bombe.desc")},async(t,s,{repondre:a,auteur_Message:g})=>{const $=["\u{1F534} Rouge","\u{1F535} Bleu","\u{1F7E2} Vert","\u{1F7E1} Jaune","\u26AA Blanc"],u=$[Math.floor(Math.random()*5)];let r=n.TOP(e("bombe.title"))+`
`+n.LINE(`${e("bombe.msg")}

`);$.forEach((o,l)=>r+=n.LINE(`${l+1}. ${o}
`)),await a(r+n.LINE(`
${e("bombe.instruction")}
`)+n.BTM);try{const o=await A(s,g,t,2e4),l=parseInt((o.message?.conversation||o.message?.extendedTextMessage?.text||"").trim())-1;if(isNaN(l)||l<0||l>=$.length)return a(e("bombe.boom"));$[l]===u?a(e("bombe.success",{color:$[l]})):a(e("bombe.wrong",{color:$[l],bomb:u}))}catch{a(e("bombe.timeout"))}}),P({name:e("ship.name"),classe:"menma-game",react:"\u2764\uFE0F",desc:e("ship.desc")},async(t,s,{repondre:a,mr:g,auteur_Message:$,ms:u,msg_Repondu:r,auteur_Msg_Repondu:o,resolveName:l})=>{let x,y;if(r)x=$,y=o;else if(g.length===1)x=$,y=g[0];else if(g.length>=2)x=g[0],y=g[1];else return a(e("ship.usage"));if(x===y)return a(e("ship.self"));const w=x.split("@")[0].replace(/\D/g,""),E=y.split("@")[0].replace(/\D/g,""),m=(parseInt(w.slice(-3))+parseInt(E.slice(-3)))%101;let I="";m<25?I=e("ship.comment1"):m<50?I=e("ship.comment2"):m<75?I=e("ship.comment3"):m<90?I=e("ship.comment4"):I=e("ship.comment5");let L=n.TOP(e("ship.title"))+`
`+n.LINE(`${l(x).replace("@","")} & ${l(y)}
`)+n.INTER()+`
`+n.LINE(`${e("ship.compatibility",{percentage:m})}
`)+n.LINE(`${I}
`)+n.BTM;await s.sendMessage(t,{text:L,mentions:[x,y]},{quoted:u})});const le=t=>{for(let s=0;s<6;s++)for(let a=0;a<4;a++)if(t[s][a]!=="\u26AA"&&t[s][a]===t[s][a+1]&&t[s][a]===t[s][a+2]&&t[s][a]===t[s][a+3])return t[s][a];for(let s=0;s<3;s++)for(let a=0;a<7;a++)if(t[s][a]!=="\u26AA"&&t[s][a]===t[s+1][a]&&t[s][a]===t[s+2][a]&&t[s][a]===t[s+3][a])return t[s][a];for(let s=0;s<3;s++)for(let a=0;a<4;a++)if(t[s][a]!=="\u26AA"&&t[s][a]===t[s+1][a+1]&&t[s][a]===t[s+2][a+2]&&t[s][a]===t[s+3][a+3])return t[s][a];for(let s=3;s<6;s++)for(let a=0;a<4;a++)if(t[s][a]!=="\u26AA"&&t[s][a]===t[s-1][a+1]&&t[s][a]===t[s-2][a+2]&&t[s][a]===t[s-3][a+3])return t[s][a];return t.every(s=>s.every(a=>a!=="\u26AA"))?"tie":null},se=t=>{let s=`1\uFE0F\u20E32\uFE0F\u20E33\uFE0F\u20E34\uFE0F\u20E35\uFE0F\u20E36\uFE0F\u20E37\uFE0F\u20E3
`;for(let a=0;a<6;a++)s+=t[a].join("")+`
`;return s};P({name:e("p4.name"),alias:["puissance4","connect4"],classe:"menma-game",react:"\u{1F534}",desc:e("p4.desc")},async(t,s,{repondre:a,mr:g,auteur_Message:$,ms:u,msg_Repondu:r,auteur_Msg_Repondu:o,resolveName:l,arg:x})=>{if(z.has(t))return a(e("p4.already_active"));const y=j($),w=l(y).replace("@","");let E=null,m=null;if(x&&x[0]?.toLowerCase()==="bot")E="bot",m="\u{1F916} MENMA-BOT";else{const M=g[0]||(r?o:null);if(!M)return a(e("p4.usage"));if(E=j(M),y===E)return a(e("p4.self"));m=l(E).replace("@","")}if(E!=="bot"){await s.sendMessage(t,{text:e("p4.invitation",{player:m,initiator:w}),mentions:[E]},{quoted:u});try{const M=await A(s,E,j(t),6e4);if(!["oui","yes","ok","y"].some(c=>M.message?.conversation?.toLowerCase().includes(c)))return}catch{return a(e("p4.timeout"))}await a(e("p4.accepted"))}z.add(t);const I=Array(6).fill().map(()=>Array(7).fill("\u26AA"));let L=0;const i=[y,E],q=[w,m],N=["\u{1F534}","\u{1F535}"];let h=null;try{for(;!h;){let c=n.TOP(e("p4.title"))+`
`+n.LINE(`${N[0]} : *${q[0]}*
`)+n.LINE(`${N[1]} : *${q[1]}*

`)+se(I).split(`
`).map(p=>p.trim()?n.LINE(p):"").join(`
`)+`
`+n.LINE(e("p4.turn",{chip:N[L],name:q[L]}))+`
`+n.INTER()+`
`+n.LINE(`Tapez 'abandonner' pour quitter.
`)+n.BTM;await s.sendMessage(t,{text:c,mentions:i.filter(p=>p!=="bot")},{quoted:u});let f=-1;const d=i[L];if(d==="bot"){await C(1500);let p=[];for(let T=0;T<7;T++)I[0][T]==="\u26AA"&&p.push(T);f=p[Math.floor(Math.random()*p.length)]}else try{const p=await A(s,d,j(t),6e4),T=(p.message?.conversation||p.message?.extendedTextMessage?.text||"").trim();if(["abandonner","surrender"].includes(T.toLowerCase())){a(e("p4.abandon",{name:q[L]})),h=N[1-L];break}if(f=parseInt(T)-1,isNaN(f)||f<0||f>6||I[0][f]!=="\u26AA"){await a(e("p4.invalid"));continue}}catch{a(e("p4.timeout")),h=N[1-L];break}for(let p=5;p>=0;p--)if(I[p][f]==="\u26AA"){I[p][f]=N[L];break}h=le(I),h||(L=1-L)}let M=n.TOP("FIN DE PARTIE")+`
`+se(I).split(`
`).map(c=>c.trim()?n.LINE(c):"").join(`
`)+`
`+n.INTER()+`
`;if(h==="tie")M+=n.LINE(`${e("p4.tie")}
`);else{const c=N.indexOf(h);M+=n.LINE(`${e("p4.win",{chip:h,name:q[c]})}
`)}await s.sendMessage(t,{text:M+n.BTM+V,mentions:i.filter(c=>c!=="bot")})}finally{z.delete(t)}}),P({name:e("rps.name"),alias:["chifoumi","ppc"],classe:"menma-game",react:"\u270A",desc:e("rps.desc")},async(t,s,{repondre:a,mr:g,auteur_Message:$,ms:u,msg_Repondu:r,auteur_Msg_Repondu:o,resolveName:l})=>{const x=j($),y=l(x).replace("@","");let w=g[0]||(r?o:"bot");if(w==="bot"){const M=["pierre","papier","ciseaux"],c={pierre:"\u270A",papier:"\u270B",ciseaux:"\u270C\uFE0F"},f=M[Math.floor(Math.random()*3)];await a(e("rps.moves")),await C(1500);try{const p=(await A(s,x,j(t),2e4)).message?.conversation?.toLowerCase().trim();if(!M.includes(p))return a(e("rps.usage"));let T="";p===f?T=e("rps.tie"):p==="pierre"&&f==="ciseaux"||p==="papier"&&f==="pierre"||p==="ciseaux"&&f==="papier"?T=e("rps.win"):T=e("rps.loss_bot"),a(`${n.TOP("CHI-FOU-MI")}
${n.LINE(`\u{1F464} Toi : ${c[p]} (${p})
`)}${n.LINE(`\u{1F916} Bot : ${c[f]} (${f})
`)}${n.INTER()}
${n.LINE(`${T}
`)}${n.BTM}`)}catch{a(e("rps.timeout"))}return}w=j(w);const E=l(w).replace("@","");await s.sendMessage(t,{text:e("rps.duel",{p1:y,p2:E}),mentions:[x,w]});const m=["pierre","papier","ciseaux"],I={pierre:"\u270A",papier:"\u270B",ciseaux:"\u270C\uFE0F"},[L,i]=await Promise.all([A(s,x,x,3e4).catch(()=>null),A(s,w,w,3e4).catch(()=>null)]),q=L?.message?.conversation?.toLowerCase().trim(),N=i?.message?.conversation?.toLowerCase().trim();if(!m.includes(q)||!m.includes(N))return a(e("rps.cancel"));let h="";q===N?h=e("rps.tie_duel"):q==="pierre"&&N==="ciseaux"||q==="papier"&&N==="pierre"||q==="ciseaux"&&N==="papier"?h=e("rps.win_duel",{name:y}):h=e("rps.win_duel",{name:E}),await s.sendMessage(t,{text:`${n.TOP(e("rps.result_title"))}
${n.LINE(`\u{1F464} ${y} : ${I[q]} (${q})
`)}${n.LINE(`\u{1F464} ${E} : ${I[N]} (${N})
`)}${n.INTER()}
${n.LINE(`${h}
`)}${n.BTM}`,mentions:[x,w]})}),P({name:e("wordle.name"),alias:["motus"],classe:"menma-game",react:"\u{1F7E9}",desc:e("wordle.desc")},async(t,s,{repondre:a,auteur_Message:g})=>{try{const $=JSON.parse(X.readFileSync(Q.join(W,"../Database/words.json"),"utf8")),u=[...$.tres_facile,...$.facile].filter(y=>y.length===5);if(u.length===0)return a("\u274C Erreur : Aucun mot trouv\xE9.");const r=u[Math.floor(Math.random()*u.length)].toUpperCase();let o=0,l=[],x=!1;for(await a(n.TOP(e("wordle.title"))+`
`+n.LINE(`${e("wordle.instruction")}
`)+n.BTM);o<6&&!x;)try{const y=await A(s,g,t,6e4),w=(y.message?.conversation||y.message?.extendedTextMessage?.text||"").trim().toUpperCase();if(w.length!==5||!/[A-Z]/.test(w)){await a(e("wordle.usage"));continue}o++;let E=r.split(""),m=w.split(""),I=Array(5).fill("\u2B1B");for(let i=0;i<5;i++)m[i]===E[i]&&(I[i]="\u{1F7E9}",E[i]=null,m[i]=null);for(let i=0;i<5;i++)m[i]&&E.includes(m[i])&&(I[i]="\u{1F7E8}",E[E.indexOf(m[i])]=null);if(l.push(`${I.join("")}  *${w}*`),w===r){x=!0;break}let L=n.TOP(`WORDLE (${o}/6)`)+`
`;L+=l.map(i=>n.LINE(i+`
`)).join(""),await a(L+n.BTM)}catch{return a(e("vof.timeout",{answer:r}))}a(x?e("wordle.win",{target:r,count:o}):e("wordle.loss",{target:r})+`

`+l.join(`
`))}catch{a(e("verite.error"))}}),P({name:e("quiz_cmd.name"),alias:["culture","quizz"],classe:"menma-game",react:"\u{1F393}",desc:e("quiz_cmd.desc")},async(t,s,{repondre:a,auteur_Message:g,pseudo:$,ms:u})=>{if(z.has(t))return a(e("quiz_cmd.already_active"));let r;try{r=JSON.parse(X.readFileSync(Q.join(W,"../Database/games.json"),"utf8"))}catch{return a("\u274C Impossible de charger la base de donn\xE9es de jeux.")}if(!r.quiz||r.quiz.length===0)return a("\u274C Quiz vide.");z.add(t);let o=[],l=!1,x=10,y=!0;try{let w=n.TOP(e("quiz_cmd.title"))+`
`;w+=n.LINE(`${e("quiz_cmd.inscription",{pseudo:g.split("@")[0]})}
`),w+=n.INTER()+`
`,w+=n.LINE(`${e("quiz_cmd.how_join")}
`),w+=n.LINE(`${e("quiz_cmd.how_start")}
`),w+=n.LINE(`${e("quiz_cmd.timer_info")}
`),w+=n.BTM,await s.sendMessage(t,{text:w,mentions:[g]},{quoted:u});const E=async({messages:c,type:f})=>{if(!(f!=="notify"||l))for(const d of c){if(j(d.key.remoteJid)!==t)continue;const T=(d.message?.conversation||d.message?.extendedTextMessage?.text||"").trim().toLowerCase(),k=j(d.key.participant||d.key.remoteJid);["moi","me","join","ok","oui"].includes(T)&&!o.find(R=>R.jid===k)&&(o.push({jid:k,name:d.pushName||"Joueur",score:0,quit:!1}),await s.sendMessage(t,{react:{text:"\u2705",key:d.key}})),["start","go"].includes(T)&&k===g&&o.length>0&&(l=!0)}};s.ev.on("messages.upsert",E);let m=0;for(;m<60&&!l;)await C(1e3),m++;if(l=!0,s.ev.off("messages.upsert",E),o.length===0)return z.delete(t),a(e("quiz_cmd.canceled"));let I=n.TOP(e("quiz_cmd.title"))+`
`;I+=n.LINE(`${e("quiz_cmd.ask_rounds")}
`),I+=n.LINE(`${e("quiz_cmd.rounds_options")}
`),I+=n.BTM,await s.sendMessage(t,{text:I},{quoted:u});try{const c=await A(s,g,t,3e4);(c.message?.conversation||c.message?.extendedTextMessage?.text||"").trim()==="20"?x=20:x=10}catch{x=10}const L=o.map(c=>`*${c.name}*`).join(", ");let i=n.TOP(e("quiz_cmd.title"))+`
`;i+=n.LINE(`${e("quiz_cmd.game_start",{players:L,rounds:x})}
`),i+=n.INTER()+`
`,i+=n.LINE(`${e("quiz_cmd.cmd_quit")}
`),i+=n.LINE(`${e("quiz_cmd.cmd_end")}
`),i+=n.BTM,await s.sendMessage(t,{text:i,mentions:o.map(c=>c.jid)},{quoted:u}),await C(3e3);const q=[...r.quiz].sort(()=>Math.random()-.5),N=q.slice(0,Math.min(x,q.length));for(let c=0;c<N.length&&y;c++){const f=o.filter(v=>!v.quit);if(f.length===0)break;const d=N[c],p=c+1;let T=n.TOP(e("quiz_cmd.question_title",{num:p,total:x}))+`
`;T+=n.LINE(`\u2753 *${d.q}*

`),d.o.forEach((v,O)=>{T+=n.LINE(`${String.fromCharCode(65+O)}) ${v}
`)}),T+=n.INTER()+`
`,T+=n.LINE(`${e("quiz_cmd.instruction")}
`),T+=n.LINE(`${e("quiz_cmd.quit_hint")}
`),T+=n.BTM,await s.sendMessage(t,{text:T,mentions:f.map(v=>v.jid)},{quoted:u});const k=new Set,R=async({messages:v,type:O})=>{if(!(O!=="notify"||!y))for(const D of v){if(j(D.key.remoteJid)!==t)continue;const J=(D.message?.conversation||D.message?.extendedTextMessage?.text||"").trim(),S=j(D.key.participant||D.key.remoteJid),F=o.find(ee=>ee.jid===S&&!ee.quit);if(!F)continue;const K=J.toUpperCase(),H=J.toLowerCase();if(["quit","quitter","quitte","leave"].includes(H)){F.quit=!0,k.add(S),await s.sendMessage(t,{text:e("quiz_cmd.player_quit",{name:F.name}),mentions:[S]});return}if(["fin","stop","end"].includes(H)&&S===g){y=!1,k.add(S),await s.sendMessage(t,{text:e("quiz_cmd.game_ended")});return}["A","B","C","D"].includes(K)&&!k.has(S)&&(k.add(S),K===d.a?(F.score++,await s.sendMessage(t,{react:{text:"\u2705",key:D.key}})):await s.sendMessage(t,{react:{text:"\u274C",key:D.key}}))}};s.ev.on("messages.upsert",R);let U=0;for(;U<20&&y;){const v=o.filter(O=>!O.quit);if(v.length>0&&v.every(O=>k.has(O.jid)))break;await C(1e3),U++}if(s.ev.off("messages.upsert",R),!y)break;const B=d.o[d.a.charCodeAt(0)-65],Z=f.filter(v=>{});let G=n.TOP(e("quiz_cmd.result_title"))+`
`;G+=n.LINE(`${e("quiz_cmd.correct_answer",{letter:d.a,answer:B})}
`),G+=n.INTER()+`
`,[...o].filter(v=>!v.quit||v.score>0).sort((v,O)=>O.score-v.score).slice(0,5).forEach((v,O)=>{const D=O===0?"\u{1F947}":O===1?"\u{1F948}":O===2?"\u{1F949}":`${O+1}.`;G+=n.LINE(`${D} *${v.name}* \u2014 ${v.score} pt${v.score>1?"s":""}
`)}),G+=n.BTM,await s.sendMessage(t,{text:G},{quoted:u}),await C(3e3)}const h=[...o].sort((c,f)=>f.score-c.score);let M=n.TOP(e("quiz_cmd.podium_title"))+`
`;if(M+=n.LINE(`${e("quiz_cmd.total_rounds",{rounds:x})}
`),M+=n.INTER()+`
`,h.forEach((c,f)=>{const d=f===0?"\u{1F947}":f===1?"\u{1F948}":f===2?"\u{1F949}":`${f+1}.`;M+=n.LINE(`${d} *${c.name}* \u2014 ${c.score} pt${c.score>1?"s":""}
`)}),M+=n.INTER()+`
`,h.length>0){const c=h[0];M+=n.LINE(`${e("quiz_cmd.champion",{name:c.name,score:c.score})}
`)}M+=n.BTM+V,await s.sendMessage(t,{text:M,mentions:h.map(c=>c.jid)},{quoted:u})}finally{z.delete(t)}}),P({name:e("animequiz.name"),alias:["aniquiz","animeq","mangaquiz"],classe:"menma-game",react:"\u26E9\uFE0F",desc:e("animequiz.desc")},async(t,s,{repondre:a,auteur_Message:g,pseudo:$,ms:u})=>{if(z.has(t))return a("\u26A0\uFE0F Un jeu est d\xE9j\xE0 en cours dans cette discussion. Finis-le d'abord !");let r;try{r=JSON.parse(X.readFileSync(Q.join(W,"../Database/games.json"),"utf8"))}catch{return a("\u274C Impossible de charger la base de donn\xE9es de jeux.")}if(!r.anime_quiz||r.anime_quiz.length===0)return a("\u274C Quiz anime vide.");z.add(t);let o=[],l=!1,x=10,y=!0;try{let w=n.TOP("\u26E9\uFE0F ANIME QUIZ OTAKU \u26E9\uFE0F")+`
`;w+=n.LINE(`Inscription ouverte par *@${g.split("@")[0]}* !
`),w+=n.INTER()+`
`,w+=n.LINE(`Tapez *moi* ou *join* pour vous inscrire.
`),w+=n.LINE(`L'organisateur tape *start* ou *go* pour lancer la partie.
`),w+=n.LINE(`\u23F3 Temps d'inscription : 60 secondes
`),w+=n.BTM,await s.sendMessage(t,{text:w,mentions:[g]},{quoted:u});const E=async({messages:c,type:f})=>{if(!(f!=="notify"||l))for(const d of c){if(j(d.key.remoteJid)!==t)continue;const T=(d.message?.conversation||d.message?.extendedTextMessage?.text||"").trim().toLowerCase(),k=j(d.key.participant||d.key.remoteJid);["moi","me","join","ok","oui"].includes(T)&&!o.find(R=>R.jid===k)&&(o.push({jid:k,name:d.pushName||"Otaku",score:0,quit:!1}),await s.sendMessage(t,{react:{text:"\u26E9\uFE0F",key:d.key}})),["start","go"].includes(T)&&k===g&&o.length>0&&(l=!0)}};s.ev.on("messages.upsert",E);let m=0;for(;m<60&&!l;)await C(1e3),m++;if(l=!0,s.ev.off("messages.upsert",E),o.length===0)return z.delete(t),a("\u274C Aucun joueur inscrit. Quiz anime annul\xE9.");let I=n.TOP("\u26E9\uFE0F ANIME QUIZ \u26E9\uFE0F")+`
`;I+=n.LINE(`Combien de questions voulez-vous ? (R\xE9pondez 10 ou 20)
`),I+=n.BTM,await s.sendMessage(t,{text:I},{quoted:u});try{const c=await A(s,g,t,2e4);(c.message?.conversation||c.message?.extendedTextMessage?.text||"").trim()==="20"?x=20:x=10}catch{x=10}const L=o.map(c=>`*${c.name}*`).join(", ");let i=n.TOP("\u26E9\uFE0F LA BATAILLE OTAKU COMMENCE ! \u26E9\uFE0F")+`
`;i+=n.LINE(`\u{1F465} Joueurs : ${L}
`),i+=n.LINE(`\u{1F3AF} Questions : ${x}
`),i+=n.INTER()+`
`,i+=n.LINE(`\u2022 Tapez *quit* pour abandonner.
`),i+=n.LINE(`\u2022 L'organisateur peut taper *stop* pour arr\xEAter.
`),i+=n.BTM,await s.sendMessage(t,{text:i,mentions:o.map(c=>c.jid)},{quoted:u}),await C(3e3);const q=[...r.anime_quiz].sort(()=>Math.random()-.5),N=q.slice(0,Math.min(x,q.length));for(let c=0;c<N.length&&y;c++){const f=o.filter(b=>!b.quit);if(f.length===0)break;const d=N[c],p=c+1;let T=n.TOP(`\u{1F365} QUESTION ${p} / ${N.length} \u{1F365}`)+`
`;T+=n.LINE(`\u2753 *${d.q}*

`),d.o.forEach((b,v)=>{T+=n.LINE(`${String.fromCharCode(65+v)}) ${b}
`)}),T+=n.INTER()+`
`,T+=n.LINE(`\u231B 20s | R\xE9pondez A, B, C ou D !
`),T+=n.BTM,await s.sendMessage(t,{text:T,mentions:f.map(b=>b.jid)},{quoted:u});const k=new Set,R=async({messages:b,type:v})=>{if(!(v!=="notify"||!y))for(const O of b){if(j(O.key.remoteJid)!==t)continue;const _=(O.message?.conversation||O.message?.extendedTextMessage?.text||"").trim(),J=j(O.key.participant||O.key.remoteJid),S=o.find(H=>H.jid===J&&!H.quit);if(!S)continue;const F=_.toUpperCase(),K=_.toLowerCase();if(["quit","quitter","leave"].includes(K)){S.quit=!0,k.add(J),await s.sendMessage(t,{text:`\u{1F44B} *${S.name}* a quitt\xE9 le quiz anime.`});return}if(["fin","stop","end"].includes(K)&&J===g){y=!1,k.add(J),await s.sendMessage(t,{text:"\u{1F6D1} Le quiz anime a \xE9t\xE9 arr\xEAt\xE9."});return}["A","B","C","D"].includes(F)&&!k.has(J)&&(k.add(J),F===d.a?(S.score++,await s.sendMessage(t,{react:{text:"\u2705",key:O.key}})):await s.sendMessage(t,{react:{text:"\u274C",key:O.key}}))}};s.ev.on("messages.upsert",R);let U=0;for(;U<20&&y;){const b=o.filter(v=>!v.quit);if(b.length>0&&b.every(v=>k.has(v.jid)))break;await C(1e3),U++}if(s.ev.off("messages.upsert",R),!y)break;const B=d.o[d.a.charCodeAt(0)-65];let Z=n.TOP("\u{1F4CA} R\xC9SULTAT QUESTION")+`
`;Z+=n.LINE(`La bonne r\xE9ponse \xE9tait : *${d.a}) ${B}*
`),Z+=n.INTER()+`
`,[...o].filter(b=>!b.quit||b.score>0).sort((b,v)=>v.score-b.score).slice(0,5).forEach((b,v)=>{const O=v===0?"\u{1F947}":v===1?"\u{1F948}":v===2?"\u{1F949}":`${v+1}.`;Z+=n.LINE(`${O} *${b.name}* \u2014 ${b.score} pt${b.score>1?"s":""}
`)}),Z+=n.BTM,await s.sendMessage(t,{text:Z},{quoted:u}),await C(3e3)}const h=[...o].sort((c,f)=>f.score-c.score);let M=n.TOP("\u{1F451} PODIUM ANIME QUIZ \u{1F451}")+`
`;M+=n.INTER()+`
`,h.forEach((c,f)=>{const d=f===0?"\u{1F947}":f===1?"\u{1F948}":f===2?"\u{1F949}":`${f+1}.`;M+=n.LINE(`${d} *${c.name}* \u2014 ${c.score} pt${c.score>1?"s":""}
`)}),M+=n.INTER()+`
`,h.length>0&&(M+=n.LINE(`\u{1F525} LE ROI DES OTAKUS : *${h[0].name}* avec ${h[0].score} points !
`)),M+=n.BTM+V,await s.sendMessage(t,{text:M,mentions:h.map(c=>c.jid)},{quoted:u})}finally{z.delete(t)}}),P({name:"aouv",alias:["actionverite","aouvd","aov"],classe:"menma-game",react:"\u{1F336}\uFE0F",desc:"Lancer une partie interactive d'Action ou V\xE9rit\xE9 avec choix de genre."},async(t,s,{repondre:a,auteur_Message:g,pseudo:$,ms:u})=>{if(z.has(t))return a("\u26A0\uFE0F Un jeu est d\xE9j\xE0 en cours dans cette discussion. Finis-le d'abord !");z.add(t);let r=[],o=!1;try{let l=n.TOP("\u{1F336}\uFE0F ACTION OU V\xC9RIT\xC9 \u{1F336}\uFE0F")+`
`;l+=n.LINE(`Inscrivez votre genre (g/f) et tapez start pour commencer.
`),l+=n.BTM,await s.sendMessage(t,{text:l,mentions:[g]},{quoted:u});const x=async({messages:i,type:q})=>{if(!(q!=="notify"||o))for(const N of i){if(j(N.key.remoteJid)!==t)continue;const M=(N.message?.conversation||N.message?.extendedTextMessage?.text||"").trim().toLowerCase(),c=j(N.key.participant||N.key.remoteJid);let f=null,d="";if(["garcon","g","boy","mec","gar\xE7on"].includes(M)?(f="garcon",d="\u{1F466}"):["fille","f","girl","meuf"].includes(M)&&(f="fille",d="\u{1F467}"),f){const p=r.find(T=>T.jid===c);p?(p.gender=f,p.emoji=d,await s.sendMessage(t,{react:{text:"\u{1F504}",key:N.key}})):(r.push({jid:c,name:N.pushName||"Participant",gender:f,emoji:d}),await s.sendMessage(t,{react:{text:"\u2705",key:N.key}}))}["start","go"].includes(M)&&c===g&&r.length>0&&(o=!0)}};s.ev.on("messages.upsert",x);let y=0;for(;y<60&&!o;)await C(1e3),y++;if(o=!0,s.ev.off("messages.upsert",x),r.length===0)return z.delete(t),a("\u274C Inscription annul\xE9e. Aucun participant ne s'est inscrit avec son genre.");const w=r.map(i=>`*${i.name}* (${i.emoji})`).join(", ");await s.sendMessage(t,{text:`\u{1F680} *LE JEU COMMENCE !*

\u{1F465} *Participants :* ${w}

\u{1F4A1} _Chaque joueur aura son tour. Tapez *quitter* pour partir individuellement, ou *stop* / *fini* pour arr\xEAter le jeu globalement._`,mentions:r.map(i=>i.jid)},{quoted:u}),await C(3e3);let E=1,m=!0;const I=t.endsWith("@g.us"),L=9e4;for(;m&&r.length>0;){const i=r[Math.floor(Math.random()*r.length)];let q=n.TOP(`\u{1F3B2} TOUR ${E} \u{1F3B2}`)+`
`;q+=n.LINE(`*${i.name}* (${i.emoji})`),q+=n.LINE("Choisissez *action* (a) ou *verite* (v)."),q+=n.BTM,await s.sendMessage(t,{text:q,mentions:[i.jid]},{quoted:u});let N=null;try{const h=await A(s,i.jid,t,L),M=(h.message?.conversation||h.message?.extendedTextMessage?.text||"").trim().toLowerCase();["action","a"].includes(M)?N="action":["verite","v","v\xE9rit\xE9","verit\xE9"].includes(M)?N="verite":["quitte","quitter","leave"].includes(M)?N="quitte":["stop","fini","fin"].includes(M)&&(N="stop")}catch{}if(N==="stop"){await s.sendMessage(t,{text:`\u{1F3C1} *${i.name}* a d\xE9cid\xE9 de mettre fin \xE0 la partie ! Merci d'avoir jou\xE9.`}),m=!1;break}if(N==="quitte"){const h=r.findIndex(M=>M.jid===i.jid);if(h!==-1&&r.splice(h,1),await s.sendMessage(t,{text:`\u{1F44B} *${i.name}* a quitt\xE9 la partie. Le jeu continue avec les autres participants !`}),r.length===0){await s.sendMessage(t,{text:"\u{1F3C1} Plus aucun joueur restant. Fin de la partie."}),m=!1;break}await C(2e3);continue}if(!N){await s.sendMessage(t,{text:`\u23F3 *${i.name}* n'a pas r\xE9pondu \xE0 temps, tour saut\xE9.`});continue}try{const h=JSON.parse(X.readFileSync(Q.join(W,"../Database/games.json"),"utf8"));let M=[],c=i.gender==="garcon"?"garcon":"fille";N==="verite"?M=h[`verite_${c}`]||h.verite_garcon:M=h[`action_${c}`]||h.action_garcon;const f=M[Math.floor(Math.random()*M.length)];let d=n.TOP(N==="verite"?"\u{1F9D0} V\xC9RIT\xC9":"\u{1F525} ACTION")+`
`;d+=n.LINE(`Cible : *${i.name}* (${i.emoji})
`),d+=n.LINE(`Type : ${N==="verite"?"V\xE9rit\xE9":"Action"} (${i.gender==="garcon"?"Gar\xE7on \u{1F466}":"Fille \u{1F467}"})
`),d+=n.INTER()+`
`,d+=`> *${f}*

`,d+=n.INTER()+`
`,d+=n.LINE(`R\xE9ponds ou valide en envoyant un message pour passer au joueur suivant ! (1 min 30 max)
`),d+=n.BTM+V,await s.sendMessage(t,{text:d,mentions:[i.jid]});try{const p=await A(s,i.jid,t,9e4),T=(p.message?.conversation||p.message?.extendedTextMessage?.text||"").trim().toLowerCase();if(["stop","fini","fin"].includes(T)){await s.sendMessage(t,{text:`\u{1F3C1} *${i.name}* a arr\xEAt\xE9 la partie.`}),m=!1;break}else if(["quitte","quitter","leave"].includes(T)){const k=r.findIndex(R=>R.jid===i.jid);k!==-1&&r.splice(k,1),await s.sendMessage(t,{text:`\u{1F44B} *${i.name}* a quitt\xE9 la partie.`})}else await s.sendMessage(t,{text:`\u2705 D\xE9fi accompli par *${i.name}* ! Passage au tour suivant...`,mentions:[i.jid]})}catch{await s.sendMessage(t,{text:`\u23F3 Temps \xE9coul\xE9 pour le d\xE9fi de *${i.name}*. On passe au tour suivant !`})}}catch{await a("\u274C Une erreur est survenue lors de la r\xE9cup\xE9ration de la question.")}E++,await C(2e3)}}finally{z.delete(t)}});
