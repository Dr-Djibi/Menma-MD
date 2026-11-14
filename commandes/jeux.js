import{menmacmd as R}from"../lib/menmacmd.js";import{recup_msg as k,sleep as b,decodeJid as j}from"../lib/fonctions.js";import"../config.js";import e from"../lib/styleHelper.js";import V from"fs";import X from"path";import{fileURLToPath as ce}from"url";import{dirname as le}from"path";import{trd as a}from"../lib/i18n.js";const ue=ce(import.meta.url),G=le(ue),F=e.GENERATED_BY,A=new Set,ae=()=>{try{const t=V.readFileSync(X.join(G,"../Database/words.json"),"utf8");return JSON.parse(t)}catch{return{facile:["BANANE","CHOCOLAT","MENMA","WHATSAPP","ROBOT"]}}},se=t=>t.split("").sort(()=>Math.random()-.5).join(""),Y=t=>t.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase();R({name:a("dmots.name"),alias:["guess","mot"],classe:"menma-game",react:"\u{1F9E9}",desc:a("dmots.desc")},async(t,s,{repondre:n,auteur_Message:f,pseudo:d,ms:c})=>{if(A.has(t))return n(a("dmots.already_active"));const i=ae(),r=Object.keys(i);let l=[],m=!1;A.add(t);try{let y=e.TOP(a("dmots.title"))+`
`;y+=e.LINE(`${a("dmots.inscription",{pseudo:d})}
`),y+=e.INTER()+`
`+e.LINE(`${a("dmots.timer")}
`)+e.BTM,await s.sendMessage(t,{text:y,mentions:[f]},{quoted:c});const x=async({messages:h,type:T})=>{if(!(T!=="notify"||m))for(const I of h){if(j(I.key.remoteJid)!==t)continue;const L=(I.message?.conversation||I.message?.extendedTextMessage?.text||"").trim().toLowerCase(),N=j(I.key.participant||I.key.remoteJid);["moi","me","oui","ok"].includes(L)&&!l.find(p=>p.jid===N)&&(l.push({jid:N,name:I.pushName||"Inconnu",rankIndex:0,successCount:0}),await s.sendMessage(t,{react:{text:"\u2705",key:I.key}})),["start","go","oui"].includes(L)&&N===f&&l.length>0&&(m=!0)}};s.ev.on("messages.upsert",x);let $=0;for(;$<60&&!m;)await b(1e3),$++;if(m=!0,s.ev.off("messages.upsert",x),l.length===0)return A.delete(t),n(a("dmots.canceled"));for(await s.sendMessage(t,{text:a("dmots.start",{participants:l.map(h=>`*${h.name}*`).join(", ")}),mentions:l.map(h=>h.jid)},{quoted:c}),await b(2e3);l.length>0;){let h=[...l];for(let T=0;T<h.length;T++){const I=h[T],o=l.find(g=>g.jid===I.jid);if(!o)continue;const L=r[o.rankIndex]||r[r.length-1],N=i[L],p=N[Math.floor(Math.random()*N.length)],E=se(p);let u=e.TOP(a("dmots.question_title"))+`
`;u+=e.LINE(`${a("dmots.player",{name:o.name})}
`),u+=e.LINE(`${a("dmots.rank",{rank:L.toUpperCase()})}
`)+e.INTER()+`
`,u+=e.LINE(`${a("dmots.word",{word:E.toUpperCase()})}
`),u+=e.LINE(`${a("dmots.time")}
`)+e.BTM,await s.sendMessage(t,{text:u,mentions:[o.jid]},{quoted:c});let M=!1;try{const g=await k(s,o.jid,t,2e4),w=(g.message?.conversation||g.message?.extendedTextMessage?.text||"").trim();Y(w)===Y(p)&&(M=!0)}catch{}if(M)o.successCount++,o.successCount>=3&&o.rankIndex<r.length-1?(o.rankIndex++,o.successCount=0,await s.sendMessage(t,{text:a("dmots.rank_up",{name:o.name,rank:r[o.rankIndex].toUpperCase()}),mentions:[o.jid]},{quoted:c})):await n(a("dmots.correct",{count:o.successCount}));else{await s.sendMessage(t,{text:a("dmots.eliminated",{name:o.name,word:p.toUpperCase()}),mentions:[o.jid]},{quoted:c});const g=l.findIndex(w=>w.jid===o.jid);g!==-1&&l.splice(g,1)}await b(1500)}if(l.length>1)await n(a("dmots.tour_end",{count:l.length})),await b(2e3);else if(l.length===1){const T=l[0];await s.sendMessage(t,{text:a("dmots.winner",{name:T.name}),mentions:[T.jid]},{quoted:c}),l=[];break}}}finally{A.delete(t)}n(a("dmots.end"))});const ne=t=>{const s=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];for(const[n,f,d]of s)if(t[n]!==" "&&t[n]===t[f]&&t[n]===t[d])return t[n];return t.includes(" ")?null:"tie"},_=t=>{const s={X:"\u274C",O:"\u2B55"," ":"\u2B1C"};let n="";for(let f=0;f<9;f+=3)n+=`${s[t[f]]}${s[t[f+1]]}${s[t[f+2]]}
`;return n};R({name:a("tictactoe.name"),alias:["ttt","morpion"],classe:"menma-game",react:"\u{1F3AE}",desc:a("tictactoe.desc")},async(t,s,{repondre:n,mr:f,arg:d,auteur_Message:c,ms:i,msg_Repondu:r,auteur_Msg_Repondu:l,id_Bot:m,resolveName:y})=>{const x=j(c),$=y(x).replace("@","");let h=null,T=null;if(d&&d[0]?.toLowerCase()==="bot"?(h="bot",T="\u{1F916} MENMA-BOT"):r&&l?(h=j(l),T=y(h)):f&&f.length>0&&(h=j(f[0]),T=y(h)),(h===j(m)||h===j(s.user.id))&&(h="bot",T="\u{1F916} MENMA-BOT"),!h)return n(a("tictactoe.usage"));if(x===h)return n(a("tictactoe.self"));if(h!=="bot"){await s.sendMessage(t,{text:a("tictactoe.invitation",{player:T,initiator:$}),mentions:[h]},{quoted:i});try{const p=await k(s,h,j(t),6e4),E=(p.message?.conversation||p.message?.extendedTextMessage?.text||"").trim().toLowerCase();if(!["oui","yes","ok","y"].some(u=>E.includes(u)))return s.sendMessage(t,{text:a("tictactoe.rejected",{player:T}),mentions:[h]},{quoted:i})}catch{return s.sendMessage(t,{text:a("tictactoe.timeout",{player:T}),mentions:[h]},{quoted:i})}await n(a("tictactoe.accepted"))}const I=Array(9).fill(" ");let o="X",L=null;const N=p=>p===x?$:T;for(await s.sendMessage(t,{text:e.TOP(a("tictactoe.title"))+`
`+e.LINE(`\u274C : *${$}*
`)+e.LINE(`\u2B55 : *${T}*

`)+_(I).split(`
`).map(p=>p.trim()?e.LINE(p):"").join(`
`)+`
`+e.LINE(a("tictactoe.turn",{emoji:"\u274C",player:$})),mentions:h==="bot"?[x]:[x,h]},{quoted:i});!L;){let p=-1;const E=o==="X"?x:h;if(E==="bot"){await b(1500);const M=(w,v,C)=>{const P=ne(w);if(P===o)return 10-v;if(P===(o==="X"?"O":"X"))return-10+v;if(P==="tie")return 0;if(C){let B=-1/0;for(let U=0;U<9;U++)w[U]===" "&&(w[U]=o,B=Math.max(B,M(w,v+1,!1)),w[U]=" ");return B}else{let B=1/0;for(let U=0;U<9;U++)w[U]===" "&&(w[U]=o==="X"?"O":"X",B=Math.min(B,M(w,v+1,!0)),w[U]=" ");return B}};let g=-1/0;for(let w=0;w<9;w++)if(I[w]===" "){I[w]=o;const v=M(I,0,!1);I[w]=" ",v>g&&(g=v,p=w)}if(p===-1){L="tie";break}}else try{const M=await k(s,E,j(t),6e4),g=(M.message?.conversation||M.message?.extendedTextMessage?.text||"").trim(),w=parseInt(g)-1;if(!isNaN(w)&&w>=0&&w<=8&&I[w]===" ")p=w;else{if(["surrender","abandonner"].includes(g.toLowerCase()))return s.sendMessage(t,{text:a("tictactoe.abandon",{player:N(E)}),mentions:[E]},{quoted:M});await s.sendMessage(t,{text:a("tictactoe.invalid",{player:N(E)}),mentions:[E]},{quoted:M});continue}}catch{return s.sendMessage(t,{text:a("tictactoe.timeout",{player:N(E)}),mentions:[E]},{quoted:i})}if(I[p]=o,L=ne(I),L)break;o=o==="X"?"O":"X";const u=o==="X"?x:h;await s.sendMessage(t,{text:e.TOP(a("tictactoe.title"))+`
`+_(I).split(`
`).map(M=>M.trim()?e.LINE(M):"").join(`
`)+`
`+e.LINE(a("tictactoe.turn",{emoji:o==="X"?"\u274C":"\u2B55",player:N(u)})),mentions:u!=="bot"?[u]:[]},{quoted:i})}if(L==="tie")n(a("tictactoe.tie")+`

${_(I)}`);else{const p=L==="X"?x:h,E=a("tictactoe.win",{board:_(I),emoji:L==="X"?"\u274C":"\u2B55",player:N(p)});p==="bot"?n(E):s.sendMessage(t,{text:E,mentions:[p]},{quoted:i})}}),R({name:a("vof.name"),alias:["vraioufaux","trivia"],classe:"menma-game",react:"\u2753",desc:a("vof.desc")},async(t,s,{repondre:n,auteur_Message:f})=>{try{const d=JSON.parse(V.readFileSync(X.join(G,"../Database/games.json"),"utf8")),c=d.vof[Math.floor(Math.random()*d.vof.length)];n(`${a("vof.title")}

${a("vof.question",{question:c.q})}

${a("vof.instruction")}`+F);try{const i=await k(s,f,t,2e4),r=(i.message?.conversation||i.message?.extendedTextMessage?.text||"").trim().toLowerCase();r===c.a?n(a("vof.correct")):["vrai","faux"].includes(r)&&n(a("vof.wrong",{answer:c.a.toUpperCase()}))}catch{n(a("vof.timeout",{answer:c.a.toUpperCase()}))}}catch{n(a("verite.error"))}}),R({name:a("pendu.name"),alias:["hangman"],classe:"menma-game",react:"\u{1FAA2}",desc:a("pendu.desc")},async(t,s,{repondre:n,auteur_Message:f})=>{try{const d=JSON.parse(V.readFileSync(X.join(G,"../Database/words.json"),"utf8")),c=Object.keys(d),i=c[Math.floor(Math.random()*c.length)],r=d[i][Math.floor(Math.random()*d[i].length)].toUpperCase();let l=[],m=6,y="_ ".repeat(r.length).trim();for(await n(`${a("pendu.title")}

${a("pendu.level",{level:i.toUpperCase()})}
${a("pendu.word",{word:y})}
${a("pendu.attempts",{count:m})}

${a("pendu.instruction")}`+F);m>0&&y.includes("_");)try{const x=await k(s,f,t,6e4),$=(x.message?.conversation||x.message?.extendedTextMessage?.text||"").trim().toUpperCase();if($.length!==1||!/[A-ZÀ-Ÿ]/.test($)){if($==="ABANDON")break;n(a("pendu.invalid"));continue}if(l.includes($)){n(a("pendu.already"));continue}if(l.push($),r.includes($)){if(y=r.split("").map(h=>l.includes(h)?h:"_").join(" "),!y.includes("_"))break;n(a("pendu.correct",{word:y,count:m,letters:l.join(", ")}))}else m--,n(a("pendu.wrong",{word:y,count:m,letters:l.join(", ")}))}catch{return n(a("vof.timeout",{answer:r}))}y.includes("_")?n(a("pendu.loss",{word:r})):n(a("pendu.win",{word:r}))}catch{n(a("verite.error"))}}),R({name:a("justeprix.name"),alias:["nombre"],classe:"menma-game",react:"\u{1F4B0}",desc:a("justeprix.desc")},async(t,s,{repondre:n,auteur_Message:f})=>{const d=Math.floor(Math.random()*100)+1;let c=0,i=!1;for(await n(`${a("justeprix.title")}

${a("justeprix.instruction")}`+F);!i&&c<10;)try{const r=await k(s,f,t,45e3),l=parseInt((r.message?.conversation||r.message?.extendedTextMessage?.text||"").trim());if(isNaN(l)){n(a("justeprix.invalid"));continue}c++,l===d?(i=!0,n(a("justeprix.win",{target:d,attempts:c}))):l<d?n(a("justeprix.plus",{count:c})):n(a("justeprix.moins",{count:c}))}catch{return n(a("vof.timeout",{answer:d}))}i||n(a("justeprix.loss",{target:d}))}),R({name:a("pileouface.name"),alias:["pof","coinflip"],classe:"menma-game",react:"\u{1FA99}",desc:a("pileouface.desc")},async(t,s,{repondre:n,arg:f})=>{const d=["pile","face"],c=d[Math.floor(Math.random()*2)],i=f[0]?.toLowerCase();await n(e.TOP(a("pileouface.title"))+`
`+e.LINE(`${a("pileouface.spinning")}
`)+e.BTM),await b(2e3);let r=e.TOP(a("pileouface.result"))+`
`+e.LINE(`${a("pileouface.outcome",{result:c.toUpperCase()})}
`);i&&d.includes(i)&&(r+=e.LINE(`${i===c?a("pileouface.win",{choice:i}):a("pileouface.loss",{choice:i})}
`)),n(r+e.BTM)}),R({name:a("casino.name"),alias:["slots"],classe:"menma-game",react:"\u{1F3B0}",desc:a("casino.desc")},async(t,s,{repondre:n})=>{const f=["\u{1F34E}","\u{1F34B}","\u{1F347}","\u{1F352}","\u{1F48E}","\u{1F514}","7\uFE0F\u20E3"],d=f[Math.floor(Math.random()*7)],c=f[Math.floor(Math.random()*7)],i=f[Math.floor(Math.random()*7)];let r=e.TOP(a("casino.title"))+`
`+e.LINE(`[ ${d} | ${c} | ${i} ]
`)+e.INTER()+`
`;d===c&&c===i?r+=e.LINE(`${a("casino.jackpot")}
`):d===c||c===i||d===i?r+=e.LINE(`${a("casino.almost")}
`):r+=e.LINE(`${a("casino.loss")}
`),n(r+e.BTM)}),R({name:a("math.name"),alias:["maths"],classe:"menma-game",react:"\u{1F9EE}",desc:a("math.desc")},async(t,s,{repondre:n,auteur_Message:f})=>{const d=["+","-","*"],c=d[Math.floor(Math.random()*3)];let i,r,l;c==="+"?(i=Math.floor(Math.random()*100),r=Math.floor(Math.random()*100),l=i+r):c==="-"?(i=Math.floor(Math.random()*100),r=Math.floor(Math.random()*i),l=i-r):(i=Math.floor(Math.random()*12),r=Math.floor(Math.random()*12),l=i*r),await n(`${a("math.title")}

${a("math.question",{n1:i,op:c,n2:r})}
${a("math.time")}`);try{const m=await k(s,f,t,15e3),y=parseInt((m.message?.conversation||m.message?.extendedTextMessage?.text||"").trim());n(y===l?a("math.correct"):a("math.wrong",{answer:l}))}catch{n(a("math.timeout",{answer:l}))}}),R({name:a("deduo.name"),alias:["dueldes"],classe:"menma-game",react:"\u{1F3B2}",desc:a("deduo.desc")},async(t,s,{repondre:n,mr:f,msg_Repondu:d,auteur_Msg_Repondu:c,resolveName:i,ms:r})=>{let l=f[0]||(d?c:"bot"),m=l==="bot"?"\u{1F916} MENMA-BOT":i(l);const y=Math.floor(Math.random()*6)+1,x=Math.floor(Math.random()*6)+1;let $=e.TOP(a("deduo.title"))+`
`+e.LINE(`${a("deduo.me",{val:y})}
`)+e.LINE(`${a("deduo.opponent",{emoji:l==="bot"?"\u{1F916}":"\u{1F464}",name:m,val:x})}
`)+e.INTER()+`
`;y>x?$+=e.LINE(`${a("deduo.win")}
`):y<x?$+=e.LINE(`${a("deduo.loss",{name:m})}
`):$+=e.LINE(`${a("deduo.tie")}
`),await s.sendMessage(t,{text:$+e.BTM,mentions:l!=="bot"?[l]:[]},{quoted:r})}),R({name:a("bombe.name"),alias:["bomb"],classe:"menma-game",react:"\u{1F4A3}",desc:a("bombe.desc")},async(t,s,{repondre:n,auteur_Message:f})=>{const d=["\u{1F534} Rouge","\u{1F535} Bleu","\u{1F7E2} Vert","\u{1F7E1} Jaune","\u26AA Blanc"],c=d[Math.floor(Math.random()*5)];let i=e.TOP(a("bombe.title"))+`
`+e.LINE(`${a("bombe.msg")}

`);d.forEach((r,l)=>i+=e.LINE(`${l+1}. ${r}
`)),await n(i+e.LINE(`
${a("bombe.instruction")}
`)+e.BTM);try{const r=await k(s,f,t,2e4),l=parseInt((r.message?.conversation||r.message?.extendedTextMessage?.text||"").trim())-1;if(isNaN(l)||l<0||l>=d.length)return n(a("bombe.boom"));d[l]===c?n(a("bombe.success",{color:d[l]})):n(a("bombe.wrong",{color:d[l],bomb:c}))}catch{n(a("bombe.timeout"))}}),R({name:a("ship.name"),classe:"menma-game",react:"\u2764\uFE0F",desc:a("ship.desc")},async(t,s,{repondre:n,mr:f,auteur_Message:d,ms:c,msg_Repondu:i,auteur_Msg_Repondu:r,resolveName:l})=>{let m,y;if(i)m=d,y=r;else if(f.length===1)m=d,y=f[0];else if(f.length>=2)m=f[0],y=f[1];else return n(a("ship.usage"));if(m===y)return n(a("ship.self"));const x=m.split("@")[0].replace(/\D/g,""),$=y.split("@")[0].replace(/\D/g,""),h=(parseInt(x.slice(-3))+parseInt($.slice(-3)))%101;let T="";h<25?T=a("ship.comment1"):h<50?T=a("ship.comment2"):h<75?T=a("ship.comment3"):h<90?T=a("ship.comment4"):T=a("ship.comment5");let I=e.TOP(a("ship.title"))+`
`+e.LINE(`${l(m).replace("@","")} & ${l(y)}
`)+e.INTER()+`
`+e.LINE(`${a("ship.compatibility",{percentage:h})}
`)+e.LINE(`${T}
`)+e.BTM;await s.sendMessage(t,{text:I,mentions:[m,y]},{quoted:c})});const de=t=>{for(let s=0;s<6;s++)for(let n=0;n<4;n++)if(t[s][n]!=="\u26AA"&&t[s][n]===t[s][n+1]&&t[s][n]===t[s][n+2]&&t[s][n]===t[s][n+3])return t[s][n];for(let s=0;s<3;s++)for(let n=0;n<7;n++)if(t[s][n]!=="\u26AA"&&t[s][n]===t[s+1][n]&&t[s][n]===t[s+2][n]&&t[s][n]===t[s+3][n])return t[s][n];for(let s=0;s<3;s++)for(let n=0;n<4;n++)if(t[s][n]!=="\u26AA"&&t[s][n]===t[s+1][n+1]&&t[s][n]===t[s+2][n+2]&&t[s][n]===t[s+3][n+3])return t[s][n];for(let s=3;s<6;s++)for(let n=0;n<4;n++)if(t[s][n]!=="\u26AA"&&t[s][n]===t[s-1][n+1]&&t[s][n]===t[s-2][n+2]&&t[s][n]===t[s-3][n+3])return t[s][n];return t.every(s=>s.every(n=>n!=="\u26AA"))?"tie":null},ie=t=>{let s=`1\uFE0F\u20E32\uFE0F\u20E33\uFE0F\u20E34\uFE0F\u20E35\uFE0F\u20E36\uFE0F\u20E37\uFE0F\u20E3
`;for(let n=0;n<6;n++)s+=t[n].join("")+`
`;return s};R({name:a("p4.name"),alias:["puissance4","connect4"],classe:"menma-game",react:"\u{1F534}",desc:a("p4.desc")},async(t,s,{repondre:n,mr:f,auteur_Message:d,ms:c,msg_Repondu:i,auteur_Msg_Repondu:r,resolveName:l,arg:m})=>{if(A.has(t))return n(a("p4.already_active"));const y=j(d),x=l(y).replace("@","");let $=null,h=null;if(m&&m[0]?.toLowerCase()==="bot")$="bot",h="\u{1F916} MENMA-BOT";else{const E=f[0]||(i?r:null);if(!E)return n(a("p4.usage"));if($=j(E),y===$)return n(a("p4.self"));h=l($).replace("@","")}if($!=="bot"){await s.sendMessage(t,{text:a("p4.invitation",{player:h,initiator:x}),mentions:[$]},{quoted:c});try{const E=await k(s,$,j(t),6e4);if(!["oui","yes","ok","y"].some(u=>E.message?.conversation?.toLowerCase().includes(u)))return}catch{return n(a("p4.timeout"))}await n(a("p4.accepted"))}A.add(t);const T=Array(6).fill().map(()=>Array(7).fill("\u26AA"));let I=0;const o=[y,$],L=[x,h],N=["\u{1F534}","\u{1F535}"];let p=null;try{for(;!p;){let u=e.TOP(a("p4.title"))+`
`+e.LINE(`${N[0]} : *${L[0]}*
`)+e.LINE(`${N[1]} : *${L[1]}*

`)+ie(T).split(`
`).map(w=>w.trim()?e.LINE(w):"").join(`
`)+`
`+e.LINE(a("p4.turn",{chip:N[I],name:L[I]}))+`
`+e.INTER()+`
`+e.LINE(`Tapez 'abandonner' pour quitter.
`)+e.BTM;await s.sendMessage(t,{text:u,mentions:o.filter(w=>w!=="bot")},{quoted:c});let M=-1;const g=o[I];if(g==="bot"){await b(1500);let w=[];for(let v=0;v<7;v++)T[0][v]==="\u26AA"&&w.push(v);M=w[Math.floor(Math.random()*w.length)]}else try{const w=await k(s,g,j(t),6e4),v=(w.message?.conversation||w.message?.extendedTextMessage?.text||"").trim();if(["abandonner","surrender"].includes(v.toLowerCase())){n(a("p4.abandon",{name:L[I]})),p=N[1-I];break}if(M=parseInt(v)-1,isNaN(M)||M<0||M>6||T[0][M]!=="\u26AA"){await n(a("p4.invalid"));continue}}catch{n(a("p4.timeout")),p=N[1-I];break}for(let w=5;w>=0;w--)if(T[w][M]==="\u26AA"){T[w][M]=N[I];break}p=de(T),p||(I=1-I)}let E=e.TOP("FIN DE PARTIE")+`
`+ie(T).split(`
`).map(u=>u.trim()?e.LINE(u):"").join(`
`)+`
`+e.INTER()+`
`;if(p==="tie")E+=e.LINE(`${a("p4.tie")}
`);else{const u=N.indexOf(p);E+=e.LINE(`${a("p4.win",{chip:p,name:L[u]})}
`)}await s.sendMessage(t,{text:E+e.BTM+F,mentions:o.filter(u=>u!=="bot")})}finally{A.delete(t)}}),R({name:a("rps.name"),alias:["chifoumi","ppc"],classe:"menma-game",react:"\u270A",desc:a("rps.desc")},async(t,s,{repondre:n,mr:f,auteur_Message:d,ms:c,msg_Repondu:i,auteur_Msg_Repondu:r,resolveName:l})=>{const m=j(d),y=l(m).replace("@","");let x=f[0]||(i?r:"bot");if(x==="bot"){const E=["pierre","papier","ciseaux"],u={pierre:"\u270A",papier:"\u270B",ciseaux:"\u270C\uFE0F"},M=E[Math.floor(Math.random()*3)];await n(a("rps.moves")),await b(1500);try{const w=(await k(s,m,j(t),2e4)).message?.conversation?.toLowerCase().trim();if(!E.includes(w))return n(a("rps.usage"));let v="";w===M?v=a("rps.tie"):w==="pierre"&&M==="ciseaux"||w==="papier"&&M==="pierre"||w==="ciseaux"&&M==="papier"?v=a("rps.win"):v=a("rps.loss_bot"),n(`${e.TOP("CHI-FOU-MI")}
${e.LINE(`\u{1F464} Toi : ${u[w]} (${w})
`)}${e.LINE(`\u{1F916} Bot : ${u[M]} (${M})
`)}${e.INTER()}
${e.LINE(`${v}
`)}${e.BTM}`)}catch{n(a("rps.timeout"))}return}x=j(x);const $=l(x).replace("@","");await s.sendMessage(t,{text:a("rps.duel",{p1:y,p2:$}),mentions:[m,x]});const h=["pierre","papier","ciseaux"],T={pierre:"\u270A",papier:"\u270B",ciseaux:"\u270C\uFE0F"},[I,o]=await Promise.all([k(s,m,m,3e4).catch(()=>null),k(s,x,x,3e4).catch(()=>null)]),L=I?.message?.conversation?.toLowerCase().trim(),N=o?.message?.conversation?.toLowerCase().trim();if(!h.includes(L)||!h.includes(N))return n(a("rps.cancel"));let p="";L===N?p=a("rps.tie_duel"):L==="pierre"&&N==="ciseaux"||L==="papier"&&N==="pierre"||L==="ciseaux"&&N==="papier"?p=a("rps.win_duel",{name:y}):p=a("rps.win_duel",{name:$}),await s.sendMessage(t,{text:`${e.TOP(a("rps.result_title"))}
${e.LINE(`\u{1F464} ${y} : ${T[L]} (${L})
`)}${e.LINE(`\u{1F464} ${$} : ${T[N]} (${N})
`)}${e.INTER()}
${e.LINE(`${p}
`)}${e.BTM}`,mentions:[m,x]})}),R({name:a("wordle.name"),alias:["motus"],classe:"menma-game",react:"\u{1F7E9}",desc:a("wordle.desc")},async(t,s,{repondre:n,auteur_Message:f})=>{try{const d=JSON.parse(V.readFileSync(X.join(G,"../Database/words.json"),"utf8")),c=[...d.tres_facile,...d.facile].filter(y=>y.length===5);if(c.length===0)return n("\u274C Erreur : Aucun mot trouv\xE9.");const i=c[Math.floor(Math.random()*c.length)].toUpperCase();let r=0,l=[],m=!1;for(await n(e.TOP(a("wordle.title"))+`
`+e.LINE(`${a("wordle.instruction")}
`)+e.BTM);r<6&&!m;)try{const y=await k(s,f,t,6e4),x=(y.message?.conversation||y.message?.extendedTextMessage?.text||"").trim().toUpperCase();if(x.length!==5||!/[A-Z]/.test(x)){await n(a("wordle.usage"));continue}r++;let $=i.split(""),h=x.split(""),T=Array(5).fill("\u2B1B");for(let o=0;o<5;o++)h[o]===$[o]&&(T[o]="\u{1F7E9}",$[o]=null,h[o]=null);for(let o=0;o<5;o++)h[o]&&$.includes(h[o])&&(T[o]="\u{1F7E8}",$[$.indexOf(h[o])]=null);if(l.push(`${T.join("")}  *${x}*`),x===i){m=!0;break}let I=e.TOP(`WORDLE (${r}/6)`)+`
`;I+=l.map(o=>e.LINE(o+`
`)).join(""),await n(I+e.BTM)}catch{return n(a("vof.timeout",{answer:i}))}n(m?a("wordle.win",{target:i,count:r}):a("wordle.loss",{target:i})+`

`+l.join(`
`))}catch{n(a("verite.error"))}}),R({name:a("quiz_cmd.name"),alias:["culture","quizz"],classe:"menma-game",react:"\u{1F393}",desc:a("quiz_cmd.desc")},async(t,s,{repondre:n,auteur_Message:f,pseudo:d,ms:c})=>{if(A.has(t))return n(a("quiz_cmd.already_active"));let i;try{i=JSON.parse(V.readFileSync(X.join(G,"../Database/games.json"),"utf8"))}catch{return n("\u274C Impossible de charger la base de donn\xE9es de jeux.")}if(!i.quiz||i.quiz.length===0)return n("\u274C Quiz vide.");A.add(t);let r=[],l=!1,m=10,y=!0;try{let x=e.TOP(a("quiz_cmd.title"))+`
`;x+=e.LINE(`${a("quiz_cmd.inscription",{pseudo:f.split("@")[0]})}
`),x+=e.INTER()+`
`,x+=e.LINE(`${a("quiz_cmd.how_join")}
`),x+=e.LINE(`${a("quiz_cmd.how_start")}
`),x+=e.LINE(`${a("quiz_cmd.timer_info")}
`),x+=e.BTM,await s.sendMessage(t,{text:x,mentions:[f]},{quoted:c});const $=async({messages:u,type:M})=>{if(!(M!=="notify"||l))for(const g of u){if(j(g.key.remoteJid)!==t)continue;const v=(g.message?.conversation||g.message?.extendedTextMessage?.text||"").trim().toLowerCase(),C=j(g.key.participant||g.key.remoteJid);["moi","me","join","ok","oui"].includes(v)&&!r.find(P=>P.jid===C)&&(r.push({jid:C,name:g.pushName||"Joueur",score:0,quit:!1}),await s.sendMessage(t,{react:{text:"\u2705",key:g.key}})),["start","go"].includes(v)&&C===f&&r.length>0&&(l=!0)}};s.ev.on("messages.upsert",$);let h=0;for(;h<60&&!l;)await b(1e3),h++;if(l=!0,s.ev.off("messages.upsert",$),r.length===0)return A.delete(t),n(a("quiz_cmd.canceled"));let T=e.TOP(a("quiz_cmd.title"))+`
`;T+=e.LINE(`${a("quiz_cmd.ask_rounds")}
`),T+=e.LINE(`${a("quiz_cmd.rounds_options")}
`),T+=e.BTM,await s.sendMessage(t,{text:T},{quoted:c});try{const u=await k(s,f,t,3e4);(u.message?.conversation||u.message?.extendedTextMessage?.text||"").trim()==="20"?m=20:m=10}catch{m=10}const I=r.map(u=>`*${u.name}*`).join(", ");let o=e.TOP(a("quiz_cmd.title"))+`
`;o+=e.LINE(`${a("quiz_cmd.game_start",{players:I,rounds:m})}
`),o+=e.INTER()+`
`,o+=e.LINE(`${a("quiz_cmd.cmd_quit")}
`),o+=e.LINE(`${a("quiz_cmd.cmd_end")}
`),o+=e.BTM,await s.sendMessage(t,{text:o,mentions:r.map(u=>u.jid)},{quoted:c}),await b(3e3);const L=[...i.quiz].sort(()=>Math.random()-.5),N=L.slice(0,Math.min(m,L.length));for(let u=0;u<N.length&&y;u++){const M=r.filter(q=>!q.quit);if(M.length===0)break;const g=N[u],w=u+1;let v=e.TOP(a("quiz_cmd.question_title",{num:w,total:m}))+`
`;v+=e.LINE(`\u2753 *${g.q}*

`),g.o.forEach((q,O)=>{v+=e.LINE(`${String.fromCharCode(65+O)}) ${q}
`)}),v+=e.INTER()+`
`,v+=e.LINE(`${a("quiz_cmd.instruction")}
`),v+=e.LINE(`${a("quiz_cmd.quit_hint")}
`),v+=e.BTM,await s.sendMessage(t,{text:v,mentions:M.map(q=>q.jid)},{quoted:c});const C=new Set,P=async({messages:q,type:O})=>{if(!(O!=="notify"||!y))for(const D of q){if(j(D.key.remoteJid)!==t)continue;const J=(D.message?.conversation||D.message?.extendedTextMessage?.text||"").trim(),S=j(D.key.participant||D.key.remoteJid),Q=r.find(te=>te.jid===S&&!te.quit);if(!Q)continue;const K=J.toUpperCase(),H=J.toLowerCase();if(["quit","quitter","quitte","leave"].includes(H)){Q.quit=!0,C.add(S),await s.sendMessage(t,{text:a("quiz_cmd.player_quit",{name:Q.name}),mentions:[S]});return}if(["fin","stop","end"].includes(H)&&S===f){y=!1,C.add(S),await s.sendMessage(t,{text:a("quiz_cmd.game_ended")});return}["A","B","C","D"].includes(K)&&!C.has(S)&&(C.add(S),K===g.a?(Q.score++,await s.sendMessage(t,{react:{text:"\u2705",key:D.key}})):await s.sendMessage(t,{react:{text:"\u274C",key:D.key}}))}};s.ev.on("messages.upsert",P);let B=0;for(;B<20&&y;){const q=r.filter(O=>!O.quit);if(q.length>0&&q.every(O=>C.has(O.jid)))break;await b(1e3),B++}if(s.ev.off("messages.upsert",P),!y)break;const U=g.o[g.a.charCodeAt(0)-65],W=M.filter(q=>{});let Z=e.TOP(a("quiz_cmd.result_title"))+`
`;Z+=e.LINE(`${a("quiz_cmd.correct_answer",{letter:g.a,answer:U})}
`),Z+=e.INTER()+`
`,[...r].filter(q=>!q.quit||q.score>0).sort((q,O)=>O.score-q.score).slice(0,5).forEach((q,O)=>{const D=O===0?"\u{1F947}":O===1?"\u{1F948}":O===2?"\u{1F949}":`${O+1}.`;Z+=e.LINE(`${D} *${q.name}* \u2014 ${q.score} pt${q.score>1?"s":""}
`)}),Z+=e.BTM,await s.sendMessage(t,{text:Z},{quoted:c}),await b(3e3)}const p=[...r].sort((u,M)=>M.score-u.score);let E=e.TOP(a("quiz_cmd.podium_title"))+`
`;if(E+=e.LINE(`${a("quiz_cmd.total_rounds",{rounds:m})}
`),E+=e.INTER()+`
`,p.forEach((u,M)=>{const g=M===0?"\u{1F947}":M===1?"\u{1F948}":M===2?"\u{1F949}":`${M+1}.`;E+=e.LINE(`${g} *${u.name}* \u2014 ${u.score} pt${u.score>1?"s":""}
`)}),E+=e.INTER()+`
`,p.length>0){const u=p[0];E+=e.LINE(`${a("quiz_cmd.champion",{name:u.name,score:u.score})}
`)}E+=e.BTM+F,await s.sendMessage(t,{text:E,mentions:p.map(u=>u.jid)},{quoted:c})}finally{A.delete(t)}}),R({name:"roulette",alias:["rr","rouletterusse"],classe:"menma-game",react:"\u{1F52B}",desc:"Partie de Roulette Russe multijoueur interactive avec barillet tournant."},async(t,s,{repondre:n,auteur_Message:f,ms:d})=>{if(A.has(t))return n("\u26A0\uFE0F Un jeu est d\xE9j\xE0 en cours dans cette discussion. Finis-le d'abord !");A.add(t);let c=[],i=!1;try{let r=e.TOP("\u{1F52B} ROULETTE RUSSE MORTELLE \u{1F52B}")+`
`;r+=e.LINE(`Partie initi\xE9e par *@${f.split("@")[0]}* !
`),r+=e.INTER()+`
`,r+=e.LINE(`Tapez *moi* ou *join* pour risquer votre vie.
`),r+=e.LINE(`L'initiateur tape *start* ou *go* pour lancer le barillet.
`),r+=e.LINE(`\u23F3 60 secondes pour vous inscrire !
`),r+=e.BTM,await s.sendMessage(t,{text:r,mentions:[f]},{quoted:d});const l=async({messages:I,type:o})=>{if(!(o!=="notify"||i))for(const L of I){if(j(L.key.remoteJid)!==t)continue;const N=(L.message?.conversation||L.message?.extendedTextMessage?.text||"").trim().toLowerCase(),p=j(L.key.participant||L.key.remoteJid);["moi","me","join","ok","oui"].includes(N)&&!c.find(E=>E.jid===p)&&(c.push({jid:p,name:L.pushName||"Joueur"}),await s.sendMessage(t,{react:{text:"\u{1F480}",key:L.key}})),["start","go"].includes(N)&&p===f&&c.length>=2&&(i=!0)}};s.ev.on("messages.upsert",l);let m=0;for(;m<60&&!i;)await b(1e3),m++;if(i=!0,s.ev.off("messages.upsert",l),c.length<2)return n("\u274C Au moins 2 joueurs sont requis pour jouer \xE0 la Roulette Russe.");await s.sendMessage(t,{text:`\u{1F3B0} *LE BARILLET EST CHARG\xC9 !*

\u{1F465} Participants : ${c.map(I=>`*${I.name}*`).join(", ")}

_Une seule balle dans 6 chambres... Que la chance soit avec vous !_`,mentions:c.map(I=>I.jid)},{quoted:d}),await b(2e3);let y=Math.floor(Math.random()*6),x=0,$=1;for(;c.length>1;){const I=c[0];let o=e.TOP(`\u{1F4A5} TOUR ${$}`)+`
`;o+=e.LINE(`C'est au tour de *${I.name}* !
`),o+=e.LINE(`Tapez *tirer* (ou *t*) pour presser la d\xE9tente.
`),o+=e.BTM,await s.sendMessage(t,{text:o,mentions:[I.jid]});let L=!1;try{const N=await k(s,I.jid,t,3e4),p=(N.message?.conversation||N.message?.extendedTextMessage?.text||"").trim().toLowerCase();["tirer","tire","t","fire","shoot"].includes(p)&&(L=!0)}catch{}L||await s.sendMessage(t,{text:`\u23F3 *${I.name}* a trop h\xE9sit\xE9... La peur le pousse \xE0 presser la d\xE9tente !`}),await b(1500),x===y?(await s.sendMessage(t,{text:`\u{1F4A5} *BAAAAANG !* \u{1F4A5}

\u{1F480} La balle \xE9tait dans la chambre ! *${I.name}* s'est fait \xE9liminer !`,mentions:[I.jid]}),c.shift(),y=Math.floor(Math.random()*6),x=0):(await s.sendMessage(t,{text:`*... CLIC !* \u{1F605}

Chambre vide ! *${I.name}* survit \xE0 ce tour. Le barillet tourne d'un cran.`,mentions:[I.jid]}),c.push(c.shift()),x=(x+1)%6),$++,await b(2500)}const h=c[0];let T=e.TOP("\u{1F3C6} DERNIER SURVIVANT \u{1F3C6}")+`
`;T+=e.LINE(`F\xE9licitations \xE0 *${h.name}* qui remporte cette Roulette Russe !
`),T+=e.BTM+F,await s.sendMessage(t,{text:T,mentions:[h.jid]})}finally{A.delete(t)}});const oe=[{country:"France",flag:"\u{1F1EB}\u{1F1F7}",code:"FR"},{country:"Br\xE9sil",flag:"\u{1F1E7}\u{1F1F7}",code:"BR"},{country:"Japon",flag:"\u{1F1EF}\u{1F1F5}",code:"JP"},{country:"Canada",flag:"\u{1F1E8}\u{1F1E6}",code:"CA"},{country:"Allemagne",flag:"\u{1F1E9}\u{1F1EA}",code:"DE"},{country:"Italie",flag:"\u{1F1EE}\u{1F1F9}",code:"IT"},{country:"Espagne",flag:"\u{1F1EA}\u{1F1F8}",code:"ES"},{country:"Guin\xE9e",flag:"\u{1F1EC}\u{1F1F3}",code:"GN"},{country:"S\xE9n\xE9gal",flag:"\u{1F1F8}\u{1F1F3}",code:"SN"},{country:"C\xF4te d'Ivoire",flag:"\u{1F1E8}\u{1F1EE}",code:"CI"},{country:"Cameroun",flag:"\u{1F1E8}\u{1F1F2}",code:"CM"},{country:"Maroc",flag:"\u{1F1F2}\u{1F1E6}",code:"MA"},{country:"Alg\xE9rie",flag:"\u{1F1E9}\u{1F1FF}",code:"DZ"},{country:"Royaume-Uni",flag:"\u{1F1EC}\u{1F1E7}",code:"UK"},{country:"\xC9tats-Unis",flag:"\u{1F1FA}\u{1F1F8}",code:"US"},{country:"Mexique",flag:"\u{1F1F2}\u{1F1FD}",code:"MX"},{country:"Argentine",flag:"\u{1F1E6}\u{1F1F7}",code:"AR"},{country:"Australie",flag:"\u{1F1E6}\u{1F1FA}",code:"AU"},{country:"Portugal",flag:"\u{1F1F5}\u{1F1F9}",code:"PT"},{country:"Belgique",flag:"\u{1F1E7}\u{1F1EA}",code:"BE"}];R({name:"drapeau",alias:["flag","flags","guessflag"],classe:"menma-game",react:"\u{1F6A9}",desc:"Deviner \xE0 quel pays appartient le drapeau affich\xE9."},async(t,s,{repondre:n,auteur_Message:f})=>{const d=oe[Math.floor(Math.random()*oe.length)];let c=e.TOP("\u{1F30D} DEVINE LE DRAPEAU \u{1F30D}")+`
`;c+=e.LINE(`\xC0 quel pays appartient ce drapeau ?

`),c+=`> # ${d.flag}

`,c+=e.INTER()+`
`,c+=e.LINE(`\u23F3 Vous avez 20 secondes pour donner le nom du pays !
`),c+=e.BTM,await n(c);try{const i=await k(s,f,t,2e4),r=(i.message?.conversation||i.message?.extendedTextMessage?.text||"").trim().toLowerCase(),l=r.normalize("NFD").replace(/[\u0300-\u036f]/g,""),m=d.country.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");l===m||r.toUpperCase()===d.code?await n(`\u{1F389} *BRAVO !* C'est bien la *${d.country}* ${d.flag} !`):await n(`\u274C *Faux !* C'\xE9tait la *${d.country}* ${d.flag}.`)}catch{await n(`\u231B *Temps \xE9coul\xE9 !* Le pays recherch\xE9 \xE9tait : *${d.country}* ${d.flag}`)}});const re=[{q:"Je commence la nuit et je finis le matin. Qui suis-je ?",a:"n",alt:["la lettre n","lettre n"]},{q:"Plus j'ai chaud, plus je deviens dur. Qui suis-je ?",a:"oeuf",alt:["un oeuf","l'oeuf","des oeufs"]},{q:"Qu'est-ce qui monte et descend sans jamais bouger ?",a:"escalier",alt:["un escalier","l'escalier","escaliers"]},{q:"Plus on me retire, plus je deviens grand. Qui suis-je ?",a:"trou",alt:["un trou","le trou"]},{q:"J'ai des villes mais pas de maisons, des for\xEAts mais pas d'arbres, de l'eau mais pas de poissons. Qui suis-je ?",a:"carte",alt:["une carte","la carte","carte geographique","mappe"]},{q:"Qu'est-ce qui vous appartient mais que les autres utilisent plus que vous ?",a:"prenom",alt:["nom","mon prenom","mon nom","le prenom","le nom"]},{q:"Je suis plein de trous et pourtant je retiens l'eau. Qui suis-je ?",a:"eponge",alt:["une eponge","l'eponge"]}];R({name:"devinette",alias:["enigme","riddle"],classe:"menma-game",react:"\u{1F914}",desc:"R\xE9soudre une \xE9nigme ou devinette stimulante."},async(t,s,{repondre:n,auteur_Message:f})=>{const d=re[Math.floor(Math.random()*re.length)];let c=e.TOP("\u{1F9E9} \xC9NIGME MENMA-MD \u{1F9E9}")+`
`;c+=e.LINE(`${d.q}

`),c+=e.INTER()+`
`,c+=e.LINE(`\u23F3 Vous avez 30 secondes pour r\xE9pondre !
`),c+=e.BTM,await n(c);try{const i=await k(s,f,t,3e4),l=(i.message?.conversation||i.message?.extendedTextMessage?.text||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");l===d.a||d.alt&&d.alt.some(y=>l.includes(y))?await n(`\u{1F3AF} *EXCELLENT !* Vous avez trouv\xE9 la bonne r\xE9ponse : *${d.a.toUpperCase()}* !`):await n(`\u274C *Rat\xE9 !* La r\xE9ponse \xE9tait : *${d.a.toUpperCase()}*`)}catch{await n(`\u231B *Temps \xE9coul\xE9 !* La bonne r\xE9ponse \xE9tait : *${d.a.toUpperCase()}*`)}}),R({name:"anagramme",alias:["anag","melimelo"],classe:"menma-game",react:"\u{1F524}",desc:"Retrouver le mot d'origine \xE0 partir de lettres m\xE9lang\xE9es."},async(t,s,{repondre:n,auteur_Message:f})=>{const d=ae(),c=[...d.tres_facile||[],...d.facile||[]],i=c[Math.floor(Math.random()*c.length)].toUpperCase(),r=se(i);let l=e.TOP("\u{1F524} D\xC9FI ANAGRAMME \u{1F524}")+`
`;l+=e.LINE(`Lettres m\xE9lang\xE9es : *${r}*
`),l+=e.LINE(`Nombre de lettres : *${i.length}*

`),l+=e.INTER()+`
`,l+=e.LINE(`\u23F3 Vous avez 25 secondes pour donner le mot correct !
`),l+=e.BTM,await n(l);try{const m=await k(s,f,t,25e3),y=(m.message?.conversation||m.message?.extendedTextMessage?.text||"").trim().toUpperCase();Y(y)===Y(i)?await n(`\u{1F389} *VICTOIRE !* Vous avez remis les lettres dans l'ordre : *${i}* !`):await n(`\u274C *Faux !* Le mot recherch\xE9 \xE9tait : *${i}*`)}catch{await n(`\u231B *Temps \xE9coul\xE9 !* Le mot cach\xE9 \xE9tait : *${i}*`)}}),R({name:a("animequiz.name"),alias:["aniquiz","animeq","mangaquiz"],classe:"menma-game",react:"\u26E9\uFE0F",desc:a("animequiz.desc")},async(t,s,{repondre:n,auteur_Message:f,pseudo:d,ms:c})=>{if(A.has(t))return n("\u26A0\uFE0F Un jeu est d\xE9j\xE0 en cours dans cette discussion. Finis-le d'abord !");let i;try{i=JSON.parse(V.readFileSync(X.join(G,"../Database/games.json"),"utf8"))}catch{return n("\u274C Impossible de charger la base de donn\xE9es de jeux.")}if(!i.anime_quiz||i.anime_quiz.length===0)return n("\u274C Quiz anime vide.");A.add(t);let r=[],l=!1,m=10,y=!0;try{let x=e.TOP("\u26E9\uFE0F ANIME QUIZ OTAKU \u26E9\uFE0F")+`
`;x+=e.LINE(`Inscription ouverte par *@${f.split("@")[0]}* !
`),x+=e.INTER()+`
`,x+=e.LINE(`Tapez *moi* ou *join* pour vous inscrire.
`),x+=e.LINE(`L'organisateur tape *start* ou *go* pour lancer la partie.
`),x+=e.LINE(`\u23F3 Temps d'inscription : 60 secondes
`),x+=e.BTM,await s.sendMessage(t,{text:x,mentions:[f]},{quoted:c});const $=async({messages:u,type:M})=>{if(!(M!=="notify"||l))for(const g of u){if(j(g.key.remoteJid)!==t)continue;const v=(g.message?.conversation||g.message?.extendedTextMessage?.text||"").trim().toLowerCase(),C=j(g.key.participant||g.key.remoteJid);["moi","me","join","ok","oui"].includes(v)&&!r.find(P=>P.jid===C)&&(r.push({jid:C,name:g.pushName||"Otaku",score:0,quit:!1}),await s.sendMessage(t,{react:{text:"\u26E9\uFE0F",key:g.key}})),["start","go"].includes(v)&&C===f&&r.length>0&&(l=!0)}};s.ev.on("messages.upsert",$);let h=0;for(;h<60&&!l;)await b(1e3),h++;if(l=!0,s.ev.off("messages.upsert",$),r.length===0)return A.delete(t),n("\u274C Aucun joueur inscrit. Quiz anime annul\xE9.");let T=e.TOP("\u26E9\uFE0F ANIME QUIZ \u26E9\uFE0F")+`
`;T+=e.LINE(`Combien de questions voulez-vous ? (R\xE9pondez 10 ou 20)
`),T+=e.BTM,await s.sendMessage(t,{text:T},{quoted:c});try{const u=await k(s,f,t,2e4);(u.message?.conversation||u.message?.extendedTextMessage?.text||"").trim()==="20"?m=20:m=10}catch{m=10}const I=r.map(u=>`*${u.name}*`).join(", ");let o=e.TOP("\u26E9\uFE0F LA BATAILLE OTAKU COMMENCE ! \u26E9\uFE0F")+`
`;o+=e.LINE(`\u{1F465} Joueurs : ${I}
`),o+=e.LINE(`\u{1F3AF} Questions : ${m}
`),o+=e.INTER()+`
`,o+=e.LINE(`\u2022 Tapez *quit* pour abandonner.
`),o+=e.LINE(`\u2022 L'organisateur peut taper *stop* pour arr\xEAter.
`),o+=e.BTM,await s.sendMessage(t,{text:o,mentions:r.map(u=>u.jid)},{quoted:c}),await b(3e3);const L=[...i.anime_quiz].sort(()=>Math.random()-.5),N=L.slice(0,Math.min(m,L.length));for(let u=0;u<N.length&&y;u++){const M=r.filter(z=>!z.quit);if(M.length===0)break;const g=N[u],w=u+1;let v=e.TOP(`\u{1F365} QUESTION ${w} / ${N.length} \u{1F365}`)+`
`;v+=e.LINE(`\u2753 *${g.q}*

`),g.o.forEach((z,q)=>{v+=e.LINE(`${String.fromCharCode(65+q)}) ${z}
`)}),v+=e.INTER()+`
`,v+=e.LINE(`\u231B 20s | R\xE9pondez A, B, C ou D !
`),v+=e.BTM,await s.sendMessage(t,{text:v,mentions:M.map(z=>z.jid)},{quoted:c});const C=new Set,P=async({messages:z,type:q})=>{if(!(q!=="notify"||!y))for(const O of z){if(j(O.key.remoteJid)!==t)continue;const ee=(O.message?.conversation||O.message?.extendedTextMessage?.text||"").trim(),J=j(O.key.participant||O.key.remoteJid),S=r.find(H=>H.jid===J&&!H.quit);if(!S)continue;const Q=ee.toUpperCase(),K=ee.toLowerCase();if(["quit","quitter","leave"].includes(K)){S.quit=!0,C.add(J),await s.sendMessage(t,{text:`\u{1F44B} *${S.name}* a quitt\xE9 le quiz anime.`});return}if(["fin","stop","end"].includes(K)&&J===f){y=!1,C.add(J),await s.sendMessage(t,{text:"\u{1F6D1} Le quiz anime a \xE9t\xE9 arr\xEAt\xE9."});return}["A","B","C","D"].includes(Q)&&!C.has(J)&&(C.add(J),Q===g.a?(S.score++,await s.sendMessage(t,{react:{text:"\u2705",key:O.key}})):await s.sendMessage(t,{react:{text:"\u274C",key:O.key}}))}};s.ev.on("messages.upsert",P);let B=0;for(;B<20&&y;){const z=r.filter(q=>!q.quit);if(z.length>0&&z.every(q=>C.has(q.jid)))break;await b(1e3),B++}if(s.ev.off("messages.upsert",P),!y)break;const U=g.o[g.a.charCodeAt(0)-65];let W=e.TOP("\u{1F4CA} R\xC9SULTAT QUESTION")+`
`;W+=e.LINE(`La bonne r\xE9ponse \xE9tait : *${g.a}) ${U}*
`),W+=e.INTER()+`
`,[...r].filter(z=>!z.quit||z.score>0).sort((z,q)=>q.score-z.score).slice(0,5).forEach((z,q)=>{const O=q===0?"\u{1F947}":q===1?"\u{1F948}":q===2?"\u{1F949}":`${q+1}.`;W+=e.LINE(`${O} *${z.name}* \u2014 ${z.score} pt${z.score>1?"s":""}
`)}),W+=e.BTM,await s.sendMessage(t,{text:W},{quoted:c}),await b(3e3)}const p=[...r].sort((u,M)=>M.score-u.score);let E=e.TOP("\u{1F451} PODIUM ANIME QUIZ \u{1F451}")+`
`;E+=e.INTER()+`
`,p.forEach((u,M)=>{const g=M===0?"\u{1F947}":M===1?"\u{1F948}":M===2?"\u{1F949}":`${M+1}.`;E+=e.LINE(`${g} *${u.name}* \u2014 ${u.score} pt${u.score>1?"s":""}
`)}),E+=e.INTER()+`
`,p.length>0&&(E+=e.LINE(`\u{1F525} LE ROI DES OTAKUS : *${p[0].name}* avec ${p[0].score} points !
`)),E+=e.BTM+F,await s.sendMessage(t,{text:E,mentions:p.map(u=>u.jid)},{quoted:c})}finally{A.delete(t)}}),R({name:"aouv",alias:["actionverite","aouvd","aov"],classe:"menma-game",react:"\u{1F336}\uFE0F",desc:"Lancer une partie interactive d'Action ou V\xE9rit\xE9 avec choix de genre."},async(t,s,{repondre:n,auteur_Message:f,pseudo:d,ms:c})=>{if(A.has(t))return n("\u26A0\uFE0F Un jeu est d\xE9j\xE0 en cours dans cette discussion. Finis-le d'abord !");A.add(t);let i=[],r=!1;try{let l=e.TOP("\u{1F336}\uFE0F ACTION OU V\xC9RIT\xC9 \u{1F336}\uFE0F")+`
`;l+=e.LINE(`Inscrivez votre genre (g/f) et tapez start pour commencer.
`),l+=e.BTM,await s.sendMessage(t,{text:l,mentions:[f]},{quoted:c});const m=async({messages:o,type:L})=>{if(!(L!=="notify"||r))for(const N of o){if(j(N.key.remoteJid)!==t)continue;const E=(N.message?.conversation||N.message?.extendedTextMessage?.text||"").trim().toLowerCase(),u=j(N.key.participant||N.key.remoteJid);let M=null,g="";if(["garcon","g","boy","mec","gar\xE7on"].includes(E)?(M="garcon",g="\u{1F466}"):["fille","f","girl","meuf"].includes(E)&&(M="fille",g="\u{1F467}"),M){const w=i.find(v=>v.jid===u);w?(w.gender=M,w.emoji=g,await s.sendMessage(t,{react:{text:"\u{1F504}",key:N.key}})):(i.push({jid:u,name:N.pushName||"Participant",gender:M,emoji:g}),await s.sendMessage(t,{react:{text:"\u2705",key:N.key}}))}["start","go"].includes(E)&&u===f&&i.length>0&&(r=!0)}};s.ev.on("messages.upsert",m);let y=0;for(;y<60&&!r;)await b(1e3),y++;if(r=!0,s.ev.off("messages.upsert",m),i.length===0)return A.delete(t),n("\u274C Inscription annul\xE9e. Aucun participant ne s'est inscrit avec son genre.");const x=i.map(o=>`*${o.name}* (${o.emoji})`).join(", ");await s.sendMessage(t,{text:`\u{1F680} *LE JEU COMMENCE !*

\u{1F465} *Participants :* ${x}

\u{1F4A1} _Chaque joueur aura son tour. Tapez *quitter* pour partir individuellement, ou *stop* / *fini* pour arr\xEAter le jeu globalement._`,mentions:i.map(o=>o.jid)},{quoted:c}),await b(3e3);let $=1,h=!0;const T=t.endsWith("@g.us"),I=9e4;for(;h&&i.length>0;){const o=i[Math.floor(Math.random()*i.length)];let L=e.TOP(`\u{1F3B2} TOUR ${$} \u{1F3B2}`)+`
`;L+=e.LINE(`*${o.name}* (${o.emoji})`),L+=e.LINE("Choisissez *action* (a) ou *verite* (v)."),L+=e.BTM,await s.sendMessage(t,{text:L,mentions:[o.jid]},{quoted:c});let N=null;try{const p=await k(s,o.jid,t,I),E=(p.message?.conversation||p.message?.extendedTextMessage?.text||"").trim().toLowerCase();["action","a"].includes(E)?N="action":["verite","v","v\xE9rit\xE9","verit\xE9"].includes(E)?N="verite":["quitte","quitter","leave"].includes(E)?N="quitte":["stop","fini","fin"].includes(E)&&(N="stop")}catch{}if(N==="stop"){await s.sendMessage(t,{text:`\u{1F3C1} *${o.name}* a d\xE9cid\xE9 de mettre fin \xE0 la partie ! Merci d'avoir jou\xE9.`}),h=!1;break}if(N==="quitte"){const p=i.findIndex(E=>E.jid===o.jid);if(p!==-1&&i.splice(p,1),await s.sendMessage(t,{text:`\u{1F44B} *${o.name}* a quitt\xE9 la partie. Le jeu continue avec les autres participants !`}),i.length===0){await s.sendMessage(t,{text:"\u{1F3C1} Plus aucun joueur restant. Fin de la partie."}),h=!1;break}await b(2e3);continue}if(!N){await s.sendMessage(t,{text:`\u23F3 *${o.name}* n'a pas r\xE9pondu \xE0 temps, tour saut\xE9.`});continue}try{const p=JSON.parse(V.readFileSync(X.join(G,"../Database/games.json"),"utf8"));let E=[],u=o.gender==="garcon"?"garcon":"fille";N==="verite"?E=p[`verite_${u}`]||p.verite_garcon:E=p[`action_${u}`]||p.action_garcon;const M=E[Math.floor(Math.random()*E.length)];let g=e.TOP(N==="verite"?"\u{1F9D0} V\xC9RIT\xC9":"\u{1F525} ACTION")+`
`;g+=e.LINE(`Cible : *${o.name}* (${o.emoji})
`),g+=e.LINE(`Type : ${N==="verite"?"V\xE9rit\xE9":"Action"} (${o.gender==="garcon"?"Gar\xE7on \u{1F466}":"Fille \u{1F467}"})
`),g+=e.INTER()+`
`,g+=`> *${M}*

`,g+=e.INTER()+`
`,g+=e.LINE(`R\xE9ponds ou valide en envoyant un message pour passer au joueur suivant ! (1 min 30 max)
`),g+=e.BTM+F,await s.sendMessage(t,{text:g,mentions:[o.jid]});try{const w=await k(s,o.jid,t,9e4),v=(w.message?.conversation||w.message?.extendedTextMessage?.text||"").trim().toLowerCase();if(["stop","fini","fin"].includes(v)){await s.sendMessage(t,{text:`\u{1F3C1} *${o.name}* a arr\xEAt\xE9 la partie.`}),h=!1;break}else if(["quitte","quitter","leave"].includes(v)){const C=i.findIndex(P=>P.jid===o.jid);C!==-1&&i.splice(C,1),await s.sendMessage(t,{text:`\u{1F44B} *${o.name}* a quitt\xE9 la partie.`})}else await s.sendMessage(t,{text:`\u2705 D\xE9fi accompli par *${o.name}* ! Passage au tour suivant...`,mentions:[o.jid]})}catch{await s.sendMessage(t,{text:`\u23F3 Temps \xE9coul\xE9 pour le d\xE9fi de *${o.name}*. On passe au tour suivant !`})}}catch{await n("\u274C Une erreur est survenue lors de la r\xE9cup\xE9ration de la question.")}$++,await b(2e3)}}finally{A.delete(t)}});
