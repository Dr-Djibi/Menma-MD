import{menmacmd as k}from"../lib/menmacmd.js";import{recup_msg as O,sleep as C,decodeJid as q}from"../lib/fonctions.js";import"../config.js";import s from"../lib/styleHelper.js";import J from"fs";import D from"path";import{fileURLToPath as te}from"url";import{dirname as ne}from"path";import{trd as e}from"../lib/i18n.js";const ae=te(import.meta.url),F=ne(ae),X=s.GENERATED_BY,b=new Set,se=()=>{try{const t=J.readFileSync(D.join(F,"../Database/words.json"),"utf8");return JSON.parse(t)}catch{return{facile:["BANANE","CHOCOLAT","MENMA","WHATSAPP","ROBOT"]}}},ie=t=>t.split("").sort(()=>Math.random()-.5).join(""),K=t=>t.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase();k({name:e("dmots.name"),alias:["guess","mot"],classe:"menma-game",react:"\u{1F9E9}",desc:e("dmots.desc")},async(t,a,{repondre:n,auteur_Message:p,pseudo:h,ms:l})=>{if(b.has(t))return n(e("dmots.already_active"));const o=se(),c=Object.keys(o);let r=[],w=!1;b.add(t);try{let M=s.TOP(e("dmots.title"))+`
`;M+=s.LINE(`${e("dmots.inscription",{pseudo:h})}
`),M+=s.INTER()+`
`+s.LINE(`${e("dmots.timer")}
`)+s.BTM,await a.sendMessage(t,{text:M,mentions:[p]},{quoted:l});const $=async({messages:u,type:E})=>{if(!(E!=="notify"||w))for(const T of u){if(q(T.key.remoteJid)!==t)continue;const L=(T.message?.conversation||T.message?.extendedTextMessage?.text||"").trim().toLowerCase(),y=q(T.key.participant||T.key.remoteJid);["moi","me","oui","ok"].includes(L)&&!r.find(m=>m.jid===y)&&(r.push({jid:y,name:T.pushName||"Inconnu",rankIndex:0,successCount:0}),await a.sendMessage(t,{react:{text:"\u2705",key:T.key}})),["start","go","oui"].includes(L)&&y===p&&r.length>0&&(w=!0)}};a.ev.on("messages.upsert",$);let I=0;for(;I<60&&!w;)await C(1e3),I++;if(w=!0,a.ev.off("messages.upsert",$),r.length===0)return b.delete(t),n(e("dmots.canceled"));for(await a.sendMessage(t,{text:e("dmots.start",{participants:r.map(u=>`*${u.name}*`).join(", ")}),mentions:r.map(u=>u.jid)},{quoted:l}),await C(2e3);r.length>0;){let u=[...r];for(let E=0;E<u.length;E++){const T=u[E],i=r.find(N=>N.jid===T.jid);if(!i)continue;const L=c[i.rankIndex]||c[c.length-1],y=o[L],m=y[Math.floor(Math.random()*y.length)],x=ie(m);let f=s.TOP(e("dmots.question_title"))+`
`;f+=s.LINE(`${e("dmots.player",{name:i.name})}
`),f+=s.LINE(`${e("dmots.rank",{rank:L.toUpperCase()})}
`)+s.INTER()+`
`,f+=s.LINE(`${e("dmots.word",{word:x.toUpperCase()})}
`),f+=s.LINE(`${e("dmots.time")}
`)+s.BTM,await a.sendMessage(t,{text:f,mentions:[i.jid]},{quoted:l});let g=!1;try{const N=await O(a,i.jid,t,2e4),d=(N.message?.conversation||N.message?.extendedTextMessage?.text||"").trim();K(d)===K(m)&&(g=!0)}catch{}if(g)i.successCount++,i.successCount>=3&&i.rankIndex<c.length-1?(i.rankIndex++,i.successCount=0,await a.sendMessage(t,{text:e("dmots.rank_up",{name:i.name,rank:c[i.rankIndex].toUpperCase()}),mentions:[i.jid]},{quoted:l})):await n(e("dmots.correct",{count:i.successCount}));else{await a.sendMessage(t,{text:e("dmots.eliminated",{name:i.name,word:m.toUpperCase()}),mentions:[i.jid]},{quoted:l});const N=r.findIndex(d=>d.jid===i.jid);N!==-1&&r.splice(N,1)}await C(1500)}if(r.length>1)await n(e("dmots.tour_end",{count:r.length})),await C(2e3);else if(r.length===1){const E=r[0];await a.sendMessage(t,{text:e("dmots.winner",{name:E.name}),mentions:[E.jid]},{quoted:l}),r=[];break}}}finally{b.delete(t)}n(e("dmots.end"))});const _=t=>{const a=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];for(const[n,p,h]of a)if(t[n]!==" "&&t[n]===t[p]&&t[n]===t[h])return t[n];return t.includes(" ")?null:"tie"},G=t=>{const a={X:"\u274C",O:"\u2B55"," ":"\u2B1C"};let n="";for(let p=0;p<9;p+=3)n+=`${a[t[p]]}${a[t[p+1]]}${a[t[p+2]]}
`;return n};k({name:e("tictactoe.name"),alias:["ttt","morpion"],classe:"menma-game",react:"\u{1F3AE}",desc:e("tictactoe.desc")},async(t,a,{repondre:n,mr:p,arg:h,auteur_Message:l,ms:o,msg_Repondu:c,auteur_Msg_Repondu:r,id_Bot:w,resolveName:M})=>{const $=q(l),I=M($).replace("@","");let u=null,E=null;if(h&&h[0]?.toLowerCase()==="bot"?(u="bot",E="\u{1F916} MENMA-BOT"):c&&r?(u=q(r),E=M(u)):p&&p.length>0&&(u=q(p[0]),E=M(u)),(u===q(w)||u===q(a.user.id))&&(u="bot",E="\u{1F916} MENMA-BOT"),!u)return n(e("tictactoe.usage"));if($===u)return n(e("tictactoe.self"));if(u!=="bot"){await a.sendMessage(t,{text:e("tictactoe.invitation",{player:E,initiator:I}),mentions:[u]},{quoted:o});try{const m=await O(a,u,q(t),6e4),x=(m.message?.conversation||m.message?.extendedTextMessage?.text||"").trim().toLowerCase();if(!["oui","yes","ok","y"].some(f=>x.includes(f)))return a.sendMessage(t,{text:e("tictactoe.rejected",{player:E}),mentions:[u]},{quoted:o})}catch{return a.sendMessage(t,{text:e("tictactoe.timeout",{player:E}),mentions:[u]},{quoted:o})}await n(e("tictactoe.accepted"))}const T=Array(9).fill(" ");let i="X",L=null;const y=m=>m===$?I:E;for(await a.sendMessage(t,{text:s.TOP(e("tictactoe.title"))+`
`+s.LINE(`\u274C : *${I}*
`)+s.LINE(`\u2B55 : *${E}*

`)+G(T).split(`
`).map(m=>m.trim()?s.LINE(m):"").join(`
`)+`
`+s.LINE(e("tictactoe.turn",{emoji:"\u274C",player:I})),mentions:u==="bot"?[$]:[$,u]},{quoted:o});!L;){let m=-1;const x=i==="X"?$:u;if(x==="bot"){await C(1500);const g=(d,v,A)=>{const S=_(d);if(S===i)return 10-v;if(S===(i==="X"?"O":"X"))return-10+v;if(S==="tie")return 0;if(A){let B=-1/0;for(let z=0;z<9;z++)d[z]===" "&&(d[z]=i,B=Math.max(B,g(d,v+1,!1)),d[z]=" ");return B}else{let B=1/0;for(let z=0;z<9;z++)d[z]===" "&&(d[z]=i==="X"?"O":"X",B=Math.min(B,g(d,v+1,!0)),d[z]=" ");return B}};let N=-1/0;for(let d=0;d<9;d++)if(T[d]===" "){T[d]=i;const v=g(T,0,!1);T[d]=" ",v>N&&(N=v,m=d)}if(m===-1){L="tie";break}}else try{const g=await O(a,x,q(t),6e4),N=(g.message?.conversation||g.message?.extendedTextMessage?.text||"").trim(),d=parseInt(N)-1;if(!isNaN(d)&&d>=0&&d<=8&&T[d]===" ")m=d;else{if(["surrender","abandonner"].includes(N.toLowerCase()))return a.sendMessage(t,{text:e("tictactoe.abandon",{player:y(x)}),mentions:[x]},{quoted:g});await a.sendMessage(t,{text:e("tictactoe.invalid",{player:y(x)}),mentions:[x]},{quoted:g});continue}}catch{return a.sendMessage(t,{text:e("tictactoe.timeout",{player:y(x)}),mentions:[x]},{quoted:o})}if(T[m]=i,L=_(T),L)break;i=i==="X"?"O":"X";const f=i==="X"?$:u;await a.sendMessage(t,{text:s.TOP(e("tictactoe.title"))+`
`+G(T).split(`
`).map(g=>g.trim()?s.LINE(g):"").join(`
`)+`
`+s.LINE(e("tictactoe.turn",{emoji:i==="X"?"\u274C":"\u2B55",player:y(f)})),mentions:f!=="bot"?[f]:[]},{quoted:o})}if(L==="tie")n(e("tictactoe.tie")+`

${G(T)}`);else{const m=L==="X"?$:u,x=e("tictactoe.win",{board:G(T),emoji:L==="X"?"\u274C":"\u2B55",player:y(m)});m==="bot"?n(x):a.sendMessage(t,{text:x,mentions:[m]},{quoted:o})}}),k({name:e("vof.name"),alias:["vraioufaux","trivia"],classe:"menma-game",react:"\u2753",desc:e("vof.desc")},async(t,a,{repondre:n,auteur_Message:p})=>{try{const h=JSON.parse(J.readFileSync(D.join(F,"../Database/games.json"),"utf8")),l=h.vof[Math.floor(Math.random()*h.vof.length)];n(`${e("vof.title")}

${e("vof.question",{question:l.q})}

${e("vof.instruction")}`+X);try{const o=await O(a,p,t,2e4),c=(o.message?.conversation||o.message?.extendedTextMessage?.text||"").trim().toLowerCase();c===l.a?n(e("vof.correct")):["vrai","faux"].includes(c)&&n(e("vof.wrong",{answer:l.a.toUpperCase()}))}catch{n(e("vof.timeout",{answer:l.a.toUpperCase()}))}}catch{n(e("verite.error"))}}),k({name:e("pendu.name"),alias:["hangman"],classe:"menma-game",react:"\u{1FAA2}",desc:e("pendu.desc")},async(t,a,{repondre:n,auteur_Message:p})=>{try{const h=JSON.parse(J.readFileSync(D.join(F,"../Database/words.json"),"utf8")),l=Object.keys(h),o=l[Math.floor(Math.random()*l.length)],c=h[o][Math.floor(Math.random()*h[o].length)].toUpperCase();let r=[],w=6,M="_ ".repeat(c.length).trim();for(await n(`${e("pendu.title")}

${e("pendu.level",{level:o.toUpperCase()})}
${e("pendu.word",{word:M})}
${e("pendu.attempts",{count:w})}

${e("pendu.instruction")}`+X);w>0&&M.includes("_");)try{const $=await O(a,p,t,6e4),I=($.message?.conversation||$.message?.extendedTextMessage?.text||"").trim().toUpperCase();if(I.length!==1||!/[A-ZÀ-Ÿ]/.test(I)){if(I==="ABANDON")break;n(e("pendu.invalid"));continue}if(r.includes(I)){n(e("pendu.already"));continue}if(r.push(I),c.includes(I)){if(M=c.split("").map(u=>r.includes(u)?u:"_").join(" "),!M.includes("_"))break;n(e("pendu.correct",{word:M,count:w,letters:r.join(", ")}))}else w--,n(e("pendu.wrong",{word:M,count:w,letters:r.join(", ")}))}catch{return n(e("vof.timeout",{answer:c}))}M.includes("_")?n(e("pendu.loss",{word:c})):n(e("pendu.win",{word:c}))}catch{n(e("verite.error"))}}),k({name:e("justeprix.name"),alias:["nombre"],classe:"menma-game",react:"\u{1F4B0}",desc:e("justeprix.desc")},async(t,a,{repondre:n,auteur_Message:p})=>{const h=Math.floor(Math.random()*100)+1;let l=0,o=!1;for(await n(`${e("justeprix.title")}

${e("justeprix.instruction")}`+X);!o&&l<10;)try{const c=await O(a,p,t,45e3),r=parseInt((c.message?.conversation||c.message?.extendedTextMessage?.text||"").trim());if(isNaN(r)){n(e("justeprix.invalid"));continue}l++,r===h?(o=!0,n(e("justeprix.win",{target:h,attempts:l}))):r<h?n(e("justeprix.plus",{count:l})):n(e("justeprix.moins",{count:l}))}catch{return n(e("vof.timeout",{answer:h}))}o||n(e("justeprix.loss",{target:h}))}),k({name:e("pileouface.name"),alias:["pof","coinflip"],classe:"menma-game",react:"\u{1FA99}",desc:e("pileouface.desc")},async(t,a,{repondre:n,arg:p})=>{const h=["pile","face"],l=h[Math.floor(Math.random()*2)],o=p[0]?.toLowerCase();await n(s.TOP(e("pileouface.title"))+`
`+s.LINE(`${e("pileouface.spinning")}
`)+s.BTM),await C(2e3);let c=s.TOP(e("pileouface.result"))+`
`+s.LINE(`${e("pileouface.outcome",{result:l.toUpperCase()})}
`);o&&h.includes(o)&&(c+=s.LINE(`${o===l?e("pileouface.win",{choice:o}):e("pileouface.loss",{choice:o})}
`)),n(c+s.BTM)}),k({name:e("casino.name"),alias:["slots"],classe:"menma-game",react:"\u{1F3B0}",desc:e("casino.desc")},async(t,a,{repondre:n})=>{const p=["\u{1F34E}","\u{1F34B}","\u{1F347}","\u{1F352}","\u{1F48E}","\u{1F514}","7\uFE0F\u20E3"],h=p[Math.floor(Math.random()*7)],l=p[Math.floor(Math.random()*7)],o=p[Math.floor(Math.random()*7)];let c=s.TOP(e("casino.title"))+`
`+s.LINE(`[ ${h} | ${l} | ${o} ]
`)+s.INTER()+`
`;h===l&&l===o?c+=s.LINE(`${e("casino.jackpot")}
`):h===l||l===o||h===o?c+=s.LINE(`${e("casino.almost")}
`):c+=s.LINE(`${e("casino.loss")}
`),n(c+s.BTM)}),k({name:e("math.name"),alias:["maths"],classe:"menma-game",react:"\u{1F9EE}",desc:e("math.desc")},async(t,a,{repondre:n,auteur_Message:p})=>{const h=["+","-","*"],l=h[Math.floor(Math.random()*3)];let o,c,r;l==="+"?(o=Math.floor(Math.random()*100),c=Math.floor(Math.random()*100),r=o+c):l==="-"?(o=Math.floor(Math.random()*100),c=Math.floor(Math.random()*o),r=o-c):(o=Math.floor(Math.random()*12),c=Math.floor(Math.random()*12),r=o*c),await n(`${e("math.title")}

${e("math.question",{n1:o,op:l,n2:c})}
${e("math.time")}`);try{const w=await O(a,p,t,15e3),M=parseInt((w.message?.conversation||w.message?.extendedTextMessage?.text||"").trim());n(M===r?e("math.correct"):e("math.wrong",{answer:r}))}catch{n(e("math.timeout",{answer:r}))}}),k({name:e("deduo.name"),alias:["dueldes"],classe:"menma-game",react:"\u{1F3B2}",desc:e("deduo.desc")},async(t,a,{repondre:n,mr:p,msg_Repondu:h,auteur_Msg_Repondu:l,resolveName:o,ms:c})=>{let r=p[0]||(h?l:"bot"),w=r==="bot"?"\u{1F916} MENMA-BOT":o(r);const M=Math.floor(Math.random()*6)+1,$=Math.floor(Math.random()*6)+1;let I=s.TOP(e("deduo.title"))+`
`+s.LINE(`${e("deduo.me",{val:M})}
`)+s.LINE(`${e("deduo.opponent",{emoji:r==="bot"?"\u{1F916}":"\u{1F464}",name:w,val:$})}
`)+s.INTER()+`
`;M>$?I+=s.LINE(`${e("deduo.win")}
`):M<$?I+=s.LINE(`${e("deduo.loss",{name:w})}
`):I+=s.LINE(`${e("deduo.tie")}
`),await a.sendMessage(t,{text:I+s.BTM,mentions:r!=="bot"?[r]:[]},{quoted:c})}),k({name:e("bombe.name"),alias:["bomb"],classe:"menma-game",react:"\u{1F4A3}",desc:e("bombe.desc")},async(t,a,{repondre:n,auteur_Message:p})=>{const h=["\u{1F534} Rouge","\u{1F535} Bleu","\u{1F7E2} Vert","\u{1F7E1} Jaune","\u26AA Blanc"],l=h[Math.floor(Math.random()*5)];let o=s.TOP(e("bombe.title"))+`
`+s.LINE(`${e("bombe.msg")}

`);h.forEach((c,r)=>o+=s.LINE(`${r+1}. ${c}
`)),await n(o+s.LINE(`
${e("bombe.instruction")}
`)+s.BTM);try{const c=await O(a,p,t,2e4),r=parseInt((c.message?.conversation||c.message?.extendedTextMessage?.text||"").trim())-1;if(isNaN(r)||r<0||r>=h.length)return n(e("bombe.boom"));h[r]===l?n(e("bombe.success",{color:h[r]})):n(e("bombe.wrong",{color:h[r],bomb:l}))}catch{n(e("bombe.timeout"))}}),k({name:e("ship.name"),classe:"menma-game",react:"\u2764\uFE0F",desc:e("ship.desc")},async(t,a,{repondre:n,mr:p,auteur_Message:h,ms:l,msg_Repondu:o,auteur_Msg_Repondu:c,resolveName:r})=>{let w,M;if(o)w=h,M=c;else if(p.length===1)w=h,M=p[0];else if(p.length>=2)w=p[0],M=p[1];else return n(e("ship.usage"));if(w===M)return n(e("ship.self"));const $=w.split("@")[0].replace(/\D/g,""),I=M.split("@")[0].replace(/\D/g,""),u=(parseInt($.slice(-3))+parseInt(I.slice(-3)))%101;let E="";u<25?E=e("ship.comment1"):u<50?E=e("ship.comment2"):u<75?E=e("ship.comment3"):u<90?E=e("ship.comment4"):E=e("ship.comment5");let T=s.TOP(e("ship.title"))+`
`+s.LINE(`${r(w).replace("@","")} & ${r(M)}
`)+s.INTER()+`
`+s.LINE(`${e("ship.compatibility",{percentage:u})}
`)+s.LINE(`${E}
`)+s.BTM;await a.sendMessage(t,{text:T,mentions:[w,M]},{quoted:l})});const oe=t=>{for(let a=0;a<6;a++)for(let n=0;n<4;n++)if(t[a][n]!=="\u26AA"&&t[a][n]===t[a][n+1]&&t[a][n]===t[a][n+2]&&t[a][n]===t[a][n+3])return t[a][n];for(let a=0;a<3;a++)for(let n=0;n<7;n++)if(t[a][n]!=="\u26AA"&&t[a][n]===t[a+1][n]&&t[a][n]===t[a+2][n]&&t[a][n]===t[a+3][n])return t[a][n];for(let a=0;a<3;a++)for(let n=0;n<4;n++)if(t[a][n]!=="\u26AA"&&t[a][n]===t[a+1][n+1]&&t[a][n]===t[a+2][n+2]&&t[a][n]===t[a+3][n+3])return t[a][n];for(let a=3;a<6;a++)for(let n=0;n<4;n++)if(t[a][n]!=="\u26AA"&&t[a][n]===t[a-1][n+1]&&t[a][n]===t[a-2][n+2]&&t[a][n]===t[a-3][n+3])return t[a][n];return t.every(a=>a.every(n=>n!=="\u26AA"))?"tie":null},ee=t=>{let a=`1\uFE0F\u20E32\uFE0F\u20E33\uFE0F\u20E34\uFE0F\u20E35\uFE0F\u20E36\uFE0F\u20E37\uFE0F\u20E3
`;for(let n=0;n<6;n++)a+=t[n].join("")+`
`;return a};k({name:e("p4.name"),alias:["puissance4","connect4"],classe:"menma-game",react:"\u{1F534}",desc:e("p4.desc")},async(t,a,{repondre:n,mr:p,auteur_Message:h,ms:l,msg_Repondu:o,auteur_Msg_Repondu:c,resolveName:r,arg:w})=>{if(b.has(t))return n(e("p4.already_active"));const M=q(h),$=r(M).replace("@","");let I=null,u=null;if(w&&w[0]?.toLowerCase()==="bot")I="bot",u="\u{1F916} MENMA-BOT";else{const x=p[0]||(o?c:null);if(!x)return n(e("p4.usage"));if(I=q(x),M===I)return n(e("p4.self"));u=r(I).replace("@","")}if(I!=="bot"){await a.sendMessage(t,{text:e("p4.invitation",{player:u,initiator:$}),mentions:[I]},{quoted:l});try{const x=await O(a,I,q(t),6e4);if(!["oui","yes","ok","y"].some(f=>x.message?.conversation?.toLowerCase().includes(f)))return}catch{return n(e("p4.timeout"))}await n(e("p4.accepted"))}b.add(t);const E=Array(6).fill().map(()=>Array(7).fill("\u26AA"));let T=0;const i=[M,I],L=[$,u],y=["\u{1F534}","\u{1F535}"];let m=null;try{for(;!m;){let f=s.TOP(e("p4.title"))+`
`+s.LINE(`${y[0]} : *${L[0]}*
`)+s.LINE(`${y[1]} : *${L[1]}*

`)+ee(E).split(`
`).map(d=>d.trim()?s.LINE(d):"").join(`
`)+`
`+s.LINE(e("p4.turn",{chip:y[T],name:L[T]}))+`
`+s.INTER()+`
`+s.LINE(`Tapez 'abandonner' pour quitter.
`)+s.BTM;await a.sendMessage(t,{text:f,mentions:i.filter(d=>d!=="bot")},{quoted:l});let g=-1;const N=i[T];if(N==="bot"){await C(1500);let d=[];for(let v=0;v<7;v++)E[0][v]==="\u26AA"&&d.push(v);g=d[Math.floor(Math.random()*d.length)]}else try{const d=await O(a,N,q(t),6e4),v=(d.message?.conversation||d.message?.extendedTextMessage?.text||"").trim();if(["abandonner","surrender"].includes(v.toLowerCase())){n(e("p4.abandon",{name:L[T]})),m=y[1-T];break}if(g=parseInt(v)-1,isNaN(g)||g<0||g>6||E[0][g]!=="\u26AA"){await n(e("p4.invalid"));continue}}catch{n(e("p4.timeout")),m=y[1-T];break}for(let d=5;d>=0;d--)if(E[d][g]==="\u26AA"){E[d][g]=y[T];break}m=oe(E),m||(T=1-T)}let x=s.TOP("FIN DE PARTIE")+`
`+ee(E).split(`
`).map(f=>f.trim()?s.LINE(f):"").join(`
`)+`
`+s.INTER()+`
`;if(m==="tie")x+=s.LINE(`${e("p4.tie")}
`);else{const f=y.indexOf(m);x+=s.LINE(`${e("p4.win",{chip:m,name:L[f]})}
`)}await a.sendMessage(t,{text:x+s.BTM+X,mentions:i.filter(f=>f!=="bot")})}finally{b.delete(t)}}),k({name:e("rps.name"),alias:["chifoumi","ppc"],classe:"menma-game",react:"\u270A",desc:e("rps.desc")},async(t,a,{repondre:n,mr:p,auteur_Message:h,ms:l,msg_Repondu:o,auteur_Msg_Repondu:c,resolveName:r})=>{const w=q(h),M=r(w).replace("@","");let $=p[0]||(o?c:"bot");if($==="bot"){const x=["pierre","papier","ciseaux"],f={pierre:"\u270A",papier:"\u270B",ciseaux:"\u270C\uFE0F"},g=x[Math.floor(Math.random()*3)];await n(e("rps.moves")),await C(1500);try{const d=(await O(a,w,q(t),2e4)).message?.conversation?.toLowerCase().trim();if(!x.includes(d))return n(e("rps.usage"));let v="";d===g?v=e("rps.tie"):d==="pierre"&&g==="ciseaux"||d==="papier"&&g==="pierre"||d==="ciseaux"&&g==="papier"?v=e("rps.win"):v=e("rps.loss_bot"),n(`${s.TOP("CHI-FOU-MI")}
${s.LINE(`\u{1F464} Toi : ${f[d]} (${d})
`)}${s.LINE(`\u{1F916} Bot : ${f[g]} (${g})
`)}${s.INTER()}
${s.LINE(`${v}
`)}${s.BTM}`)}catch{n(e("rps.timeout"))}return}$=q($);const I=r($).replace("@","");await a.sendMessage(t,{text:e("rps.duel",{p1:M,p2:I}),mentions:[w,$]});const u=["pierre","papier","ciseaux"],E={pierre:"\u270A",papier:"\u270B",ciseaux:"\u270C\uFE0F"},[T,i]=await Promise.all([O(a,w,w,3e4).catch(()=>null),O(a,$,$,3e4).catch(()=>null)]),L=T?.message?.conversation?.toLowerCase().trim(),y=i?.message?.conversation?.toLowerCase().trim();if(!u.includes(L)||!u.includes(y))return n(e("rps.cancel"));let m="";L===y?m=e("rps.tie_duel"):L==="pierre"&&y==="ciseaux"||L==="papier"&&y==="pierre"||L==="ciseaux"&&y==="papier"?m=e("rps.win_duel",{name:M}):m=e("rps.win_duel",{name:I}),await a.sendMessage(t,{text:`${s.TOP(e("rps.result_title"))}
${s.LINE(`\u{1F464} ${M} : ${E[L]} (${L})
`)}${s.LINE(`\u{1F464} ${I} : ${E[y]} (${y})
`)}${s.INTER()}
${s.LINE(`${m}
`)}${s.BTM}`,mentions:[w,$]})}),k({name:e("wordle.name"),alias:["motus"],classe:"menma-game",react:"\u{1F7E9}",desc:e("wordle.desc")},async(t,a,{repondre:n,auteur_Message:p})=>{try{const h=JSON.parse(J.readFileSync(D.join(F,"../Database/words.json"),"utf8")),l=[...h.tres_facile,...h.facile].filter(M=>M.length===5);if(l.length===0)return n("\u274C Erreur : Aucun mot trouv\xE9.");const o=l[Math.floor(Math.random()*l.length)].toUpperCase();let c=0,r=[],w=!1;for(await n(s.TOP(e("wordle.title"))+`
`+s.LINE(`${e("wordle.instruction")}
`)+s.BTM);c<6&&!w;)try{const M=await O(a,p,t,6e4),$=(M.message?.conversation||M.message?.extendedTextMessage?.text||"").trim().toUpperCase();if($.length!==5||!/[A-Z]/.test($)){await n(e("wordle.usage"));continue}c++;let I=o.split(""),u=$.split(""),E=Array(5).fill("\u2B1B");for(let i=0;i<5;i++)u[i]===I[i]&&(E[i]="\u{1F7E9}",I[i]=null,u[i]=null);for(let i=0;i<5;i++)u[i]&&I.includes(u[i])&&(E[i]="\u{1F7E8}",I[I.indexOf(u[i])]=null);if(r.push(`${E.join("")}  *${$}*`),$===o){w=!0;break}let T=s.TOP(`WORDLE (${c}/6)`)+`
`;T+=r.map(i=>s.LINE(i+`
`)).join(""),await n(T+s.BTM)}catch{return n(e("vof.timeout",{answer:o}))}n(w?e("wordle.win",{target:o,count:c}):e("wordle.loss",{target:o})+`

`+r.join(`
`))}catch{n(e("verite.error"))}}),k({name:e("quiz_cmd.name"),alias:["culture","quizz"],classe:"menma-game",react:"\u{1F393}",desc:e("quiz_cmd.desc")},async(t,a,{repondre:n,auteur_Message:p,pseudo:h,ms:l})=>{if(b.has(t))return n(e("quiz_cmd.already_active"));let o;try{o=JSON.parse(J.readFileSync(D.join(F,"../Database/games.json"),"utf8"))}catch{return n("\u274C Impossible de charger la base de donn\xE9es de jeux.")}if(!o.quiz||o.quiz.length===0)return n("\u274C Quiz vide.");b.add(t);let c=[],r=!1,w=10,M=!0;try{let $=s.TOP(e("quiz_cmd.title"))+`
`;$+=s.LINE(`${e("quiz_cmd.inscription",{pseudo:p.split("@")[0]})}
`),$+=s.INTER()+`
`,$+=s.LINE(`${e("quiz_cmd.how_join")}
`),$+=s.LINE(`${e("quiz_cmd.how_start")}
`),$+=s.LINE(`${e("quiz_cmd.timer_info")}
`),$+=s.BTM,await a.sendMessage(t,{text:$,mentions:[p]},{quoted:l});const I=async({messages:f,type:g})=>{if(!(g!=="notify"||r))for(const N of f){if(q(N.key.remoteJid)!==t)continue;const v=(N.message?.conversation||N.message?.extendedTextMessage?.text||"").trim().toLowerCase(),A=q(N.key.participant||N.key.remoteJid);["moi","me","join","ok","oui"].includes(v)&&!c.find(S=>S.jid===A)&&(c.push({jid:A,name:N.pushName||"Joueur",score:0,quit:!1}),await a.sendMessage(t,{react:{text:"\u2705",key:N.key}})),["start","go"].includes(v)&&A===p&&c.length>0&&(r=!0)}};a.ev.on("messages.upsert",I);let u=0;for(;u<60&&!r;)await C(1e3),u++;if(r=!0,a.ev.off("messages.upsert",I),c.length===0)return b.delete(t),n(e("quiz_cmd.canceled"));let E=s.TOP(e("quiz_cmd.title"))+`
`;E+=s.LINE(`${e("quiz_cmd.ask_rounds")}
`),E+=s.LINE(`${e("quiz_cmd.rounds_options")}
`),E+=s.BTM,await a.sendMessage(t,{text:E},{quoted:l});try{const f=await O(a,p,t,3e4);(f.message?.conversation||f.message?.extendedTextMessage?.text||"").trim()==="20"?w=20:w=10}catch{w=10}const T=c.map(f=>`*${f.name}*`).join(", ");let i=s.TOP(e("quiz_cmd.title"))+`
`;i+=s.LINE(`${e("quiz_cmd.game_start",{players:T,rounds:w})}
`),i+=s.INTER()+`
`,i+=s.LINE(`${e("quiz_cmd.cmd_quit")}
`),i+=s.LINE(`${e("quiz_cmd.cmd_end")}
`),i+=s.BTM,await a.sendMessage(t,{text:i,mentions:c.map(f=>f.jid)},{quoted:l}),await C(3e3);const L=[...o.quiz].sort(()=>Math.random()-.5),y=L.slice(0,Math.min(w,L.length));for(let f=0;f<y.length&&M;f++){const g=c.filter(j=>!j.quit);if(g.length===0)break;const N=y[f],d=f+1;let v=s.TOP(e("quiz_cmd.question_title",{num:d,total:w}))+`
`;v+=s.LINE(`\u2753 *${N.q}*

`),N.o.forEach((j,P)=>{v+=s.LINE(`${String.fromCharCode(65+P)}) ${j}
`)}),v+=s.INTER()+`
`,v+=s.LINE(`${e("quiz_cmd.instruction")}
`),v+=s.LINE(`${e("quiz_cmd.quit_hint")}
`),v+=s.BTM,await a.sendMessage(t,{text:v,mentions:g.map(j=>j.jid)},{quoted:l});const A=new Set,S=async({messages:j,type:P})=>{if(!(P!=="notify"||!M))for(const R of j){if(q(R.key.remoteJid)!==t)continue;const H=(R.message?.conversation||R.message?.extendedTextMessage?.text||"").trim(),U=q(R.key.participant||R.key.remoteJid),V=c.find(Z=>Z.jid===U&&!Z.quit);if(!V)continue;const Q=H.toUpperCase(),Y=H.toLowerCase();if(["quit","quitter","quitte","leave"].includes(Y)){V.quit=!0,A.add(U),await a.sendMessage(t,{text:e("quiz_cmd.player_quit",{name:V.name}),mentions:[U]});return}if(["fin","stop","end"].includes(Y)&&U===p){M=!1,A.add(U),await a.sendMessage(t,{text:e("quiz_cmd.game_ended")});return}["A","B","C","D"].includes(Q)&&!A.has(U)&&(A.add(U),Q===N.a?(V.score++,await a.sendMessage(t,{react:{text:"\u2705",key:R.key}})):await a.sendMessage(t,{react:{text:"\u274C",key:R.key}}))}};a.ev.on("messages.upsert",S);let B=0;for(;B<20&&M;){const j=c.filter(P=>!P.quit);if(j.length>0&&j.every(P=>A.has(P.jid)))break;await C(1e3),B++}if(a.ev.off("messages.upsert",S),!M)break;const z=N.o[N.a.charCodeAt(0)-65],ce=g.filter(j=>{});let W=s.TOP(e("quiz_cmd.result_title"))+`
`;W+=s.LINE(`${e("quiz_cmd.correct_answer",{letter:N.a,answer:z})}
`),W+=s.INTER()+`
`,[...c].filter(j=>!j.quit||j.score>0).sort((j,P)=>P.score-j.score).slice(0,5).forEach((j,P)=>{const R=P===0?"\u{1F947}":P===1?"\u{1F948}":P===2?"\u{1F949}":`${P+1}.`;W+=s.LINE(`${R} *${j.name}* \u2014 ${j.score} pt${j.score>1?"s":""}
`)}),W+=s.BTM,await a.sendMessage(t,{text:W},{quoted:l}),await C(3e3)}const m=[...c].sort((f,g)=>g.score-f.score);let x=s.TOP(e("quiz_cmd.podium_title"))+`
`;if(x+=s.LINE(`${e("quiz_cmd.total_rounds",{rounds:w})}
`),x+=s.INTER()+`
`,m.forEach((f,g)=>{const N=g===0?"\u{1F947}":g===1?"\u{1F948}":g===2?"\u{1F949}":`${g+1}.`;x+=s.LINE(`${N} *${f.name}* \u2014 ${f.score} pt${f.score>1?"s":""}
`)}),x+=s.INTER()+`
`,m.length>0){const f=m[0];x+=s.LINE(`${e("quiz_cmd.champion",{name:f.name,score:f.score})}
`)}x+=s.BTM+X,await a.sendMessage(t,{text:x,mentions:m.map(f=>f.jid)},{quoted:l})}finally{b.delete(t)}}),k({name:"aouv",alias:["actionverite","aouvd","aov"],classe:"menma-game",react:"\u{1F336}\uFE0F",desc:"Lancer une partie interactive d'Action ou V\xE9rit\xE9 avec choix de genre."},async(t,a,{repondre:n,auteur_Message:p,pseudo:h,ms:l})=>{if(b.has(t))return n("\u26A0\uFE0F Un jeu est d\xE9j\xE0 en cours dans cette discussion. Finis-le d'abord !");b.add(t);let o=[],c=!1;try{let r=s.TOP("\u{1F336}\uFE0F ACTION OU V\xC9RIT\xC9 \u{1F336}\uFE0F")+`
`;r+=s.LINE(`Inscrivez votre genre (g/f) et tapez start pour commencer.
`),r+=s.BTM,await a.sendMessage(t,{text:r,mentions:[p]},{quoted:l});const w=async({messages:i,type:L})=>{if(!(L!=="notify"||c))for(const y of i){if(q(y.key.remoteJid)!==t)continue;const x=(y.message?.conversation||y.message?.extendedTextMessage?.text||"").trim().toLowerCase(),f=q(y.key.participant||y.key.remoteJid);let g=null,N="";if(["garcon","g","boy","mec","gar\xE7on"].includes(x)?(g="garcon",N="\u{1F466}"):["fille","f","girl","meuf"].includes(x)&&(g="fille",N="\u{1F467}"),g){const d=o.find(v=>v.jid===f);d?(d.gender=g,d.emoji=N,await a.sendMessage(t,{react:{text:"\u{1F504}",key:y.key}})):(o.push({jid:f,name:y.pushName||"Participant",gender:g,emoji:N}),await a.sendMessage(t,{react:{text:"\u2705",key:y.key}}))}["start","go"].includes(x)&&f===p&&o.length>0&&(c=!0)}};a.ev.on("messages.upsert",w);let M=0;for(;M<60&&!c;)await C(1e3),M++;if(c=!0,a.ev.off("messages.upsert",w),o.length===0)return b.delete(t),n("\u274C Inscription annul\xE9e. Aucun participant ne s'est inscrit avec son genre.");const $=o.map(i=>`*${i.name}* (${i.emoji})`).join(", ");await a.sendMessage(t,{text:`\u{1F680} *LE JEU COMMENCE !*

\u{1F465} *Participants :* ${$}

\u{1F4A1} _Chaque joueur aura son tour. Tapez *quitter* pour partir individuellement, ou *stop* / *fini* pour arr\xEAter le jeu globalement._`,mentions:o.map(i=>i.jid)},{quoted:l}),await C(3e3);let I=1,u=!0;const E=t.endsWith("@g.us"),T=9e4;for(;u&&o.length>0;){const i=o[Math.floor(Math.random()*o.length)];let L=s.TOP(`\u{1F3B2} TOUR ${I} \u{1F3B2}`)+`
`;L+=s.LINE(`*${i.name}* (${i.emoji})`),L+=s.LINE("Choisissez *action* (a) ou *verite* (v)."),L+=s.BTM,await a.sendMessage(t,{text:L,mentions:[i.jid]},{quoted:l});let y=null;try{const m=await O(a,i.jid,t,T),x=(m.message?.conversation||m.message?.extendedTextMessage?.text||"").trim().toLowerCase();["action","a"].includes(x)?y="action":["verite","v","v\xE9rit\xE9","verit\xE9"].includes(x)?y="verite":["quitte","quitter","leave"].includes(x)?y="quitte":["stop","fini","fin"].includes(x)&&(y="stop")}catch{}if(y==="stop"){await a.sendMessage(t,{text:`\u{1F3C1} *${i.name}* a d\xE9cid\xE9 de mettre fin \xE0 la partie ! Merci d'avoir jou\xE9.`}),u=!1;break}if(y==="quitte"){const m=o.findIndex(x=>x.jid===i.jid);if(m!==-1&&o.splice(m,1),await a.sendMessage(t,{text:`\u{1F44B} *${i.name}* a quitt\xE9 la partie. Le jeu continue avec les autres participants !`}),o.length===0){await a.sendMessage(t,{text:"\u{1F3C1} Plus aucun joueur restant. Fin de la partie."}),u=!1;break}await C(2e3);continue}if(!y){await a.sendMessage(t,{text:`\u23F3 *${i.name}* n'a pas r\xE9pondu \xE0 temps, tour saut\xE9.`});continue}try{const m=JSON.parse(J.readFileSync(D.join(F,"../Database/games.json"),"utf8"));let x=[],f=i.gender==="garcon"?"garcon":"fille";y==="verite"?x=m[`verite_${f}`]||m.verite_garcon:x=m[`action_${f}`]||m.action_garcon;const g=x[Math.floor(Math.random()*x.length)];let N=s.TOP(y==="verite"?"\u{1F9D0} V\xC9RIT\xC9":"\u{1F525} ACTION")+`
`;N+=s.LINE(`Cible : *${i.name}* (${i.emoji})
`),N+=s.LINE(`Type : ${y==="verite"?"V\xE9rit\xE9":"Action"} (${i.gender==="garcon"?"Gar\xE7on \u{1F466}":"Fille \u{1F467}"})
`),N+=s.INTER()+`
`,N+=`> *${g}*

`,N+=s.INTER()+`
`,N+=s.LINE(`Fais ton d\xE9fi puis pr\xE9pare-toi pour le prochain tour ! (1 min 30)
`),N+=s.BTM+X,await a.sendMessage(t,{text:N,mentions:[i.jid]})}catch{await n("\u274C Une erreur est survenue lors de la r\xE9cup\xE9ration de la question.")}I++,await C(9e4)}}finally{b.delete(t)}});
