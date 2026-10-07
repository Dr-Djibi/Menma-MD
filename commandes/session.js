import{menmacmd as d}from"../lib/menmacmd.js";import E from"axios";import"../config.js";import s from"../lib/styleHelper.js";import{trd as o}from"../lib/i18n.js";import S from"../lib/sessionManager.js";import{connectSession as N,disconnectSession as g,deleteConnectedSession as I}from"../Database/connected_sessions.js";const p="https://menma-md-web.koyeb.app",_=m=>new Promise(r=>setTimeout(r,m));async function f(m,r,e){let a=0;for(;a<60;){await _(5e3);try{const{data:t}=await E.get(`${p}/api/pair/status/${m}`).catch(()=>E.get(`${p}/api/qr/status/${m}`));if(t.status==="success"&&t.session){let n=o("session.success_notice");n==="session.success_notice"&&(n=`\u2705 *Connexion R\xE9ussie !*

L'ID de session et les instructions d'utilisation ont \xE9t\xE9 envoy\xE9s directement en message priv\xE9 (DM) au num\xE9ro de t\xE9l\xE9phone qui a \xE9t\xE9 connect\xE9/jumel\xE9.

\u{1F512} *S\xE9curit\xE9* : Par mesure de confidentialit\xE9, la cl\xE9 de session n'est pas affich\xE9e ici pour emp\xEAcher toute usurpation si vous avez g\xE9n\xE9r\xE9 ce code pour un tiers.

\u{1F4A1} *Activation* : Utilisez la commande *connectsession ${t.session}* pour d\xE9marrer cette instance.`),await r.sendMessage(e,{text:n});return}else if(t.status==="error"){await r.sendMessage(e,{text:o("session.expired")});return}}catch{}a++}}d({name:o("session.qr_name"),desc:o("session.qr_desc"),classe:"Session",react:"\u{1F4F8}"},async(m,r,{repondre:e,auteur_Message:a})=>{try{await e(o("session.wait"));const t="QR_"+Math.random().toString(36).substring(2,10),n=await E.get(`${p}/api/qr?id=${t}`,{responseType:"arraybuffer"});let c=s.TOP(o("session.qr_title"))+`
`;c+=s.LINE(`${o("session.qr_step1")}
`),c+=s.LINE(`${o("session.qr_step2")}
`),c+=s.LINE(`${o("session.qr_step3")}
`),c+=s.BTM+s.FOOTER,await r.sendMessage(m,{image:Buffer.from(n.data,"binary"),caption:c}),f(t,r,a)}catch{await e(o("session.qr_error"))}}),d({name:o("session.pair_name"),desc:o("session.pair_desc"),classe:"Session",react:"\u{1F517}"},async(m,r,{repondre:e,arg:a,ms:t,auteur_Message:n})=>{if(!a[0])return e(o("session.pair_usage"));const c=a[0].replace(/[^0-9]/g,"");try{await e(o("session.wait"));const{data:i}=await E.get(`${p}/api/pair?number=${c}`,{timeout:2e4});if(!i.code||!i.id)return await e(o("session.server_error"));let u=s.TOP(o("session.pair_title"))+`
`;u+=s.LINE(`${o("session.pair_step1")}
`),u+=s.LINE(`${o("session.pair_step2")}
`),u+=s.BTM+s.FOOTER,await e(u),await r.sendMessage(m,{text:i.code},{quoted:t}),f(i.id,r,n)}catch{await e(o("session.conn_error"))}}),d({name:"connectsession",alias:["cs","linksession"],classe:"Session",react:"\u{1F517}",desc:"Connecter une session externe \xE0 votre bot via son Session ID"},async(m,r,{repondre:e,arg:a,auteur_Message:t,dev_id:n})=>{if(!n)return e("\u274C Cette commande est r\xE9serv\xE9e au propri\xE9taire du bot.");if(!a[0]){let i=s.TOP("\u{1F517} CONNECT SESSION")+`
`;return i+=s.LINE(`*Utilisation :*
`),i+=s.LINE(`\u2022 connectsession <session_id> \u2192 Connecter une session
`),i+=s.LINE(`\u2022 disconnectsession <session_id> \u2192 D\xE9connecter une session
`),i+=s.LINE(`\u2022 listsessions \u2192 Voir toutes les sessions
`),i+=s.BTM+s.GENERATED_BY,e(i)}const c=a[0].trim();try{const{session:i,created:u}=await N(c,t);await e(`\u23F3 *Initialisation de la session ${c}...*`),await S.startSession(c,!1);let l=s.TOP("\u{1F517} SESSION CONNECT\xC9E")+`
`;l+=s.LINE(`${u?"\u2705 Nouvelle session connect\xE9e !":"\u{1F504} Session reconnect\xE9e !"}
`),l+=s.LINE(`\u{1F194} ID : *${c}*
`),l+=s.LINE(`\u{1F4DB} Nom Bot : *${i.botName}*
`),l+=s.LINE(`\u{1F310} Mode : *${i.mode}*
`),l+=s.BTM+s.GENERATED_BY,await e(l)}catch{await e(o("misc.error"))}}),d({name:"disconnectsession",alias:["ds","unlinksession"],classe:"Session",react:"\u{1F50C}",desc:"D\xE9connecter une session externe"},async(m,r,{repondre:e,arg:a,dev_id:t})=>{if(!t)return e("\u274C R\xE9serv\xE9e au propri\xE9taire.");if(!a[0])return e("\u274C Usage : disconnectsession <session_id>");const n=a[0].trim();if(!await g(n))return e(`\u274C Session *${n}* introuvable.`);await S.stopSession(n);let i=s.TOP("\u{1F50C} SESSION D\xC9CONNECT\xC9E")+`
`;i+=s.LINE(`Session *${n}* d\xE9connect\xE9e avec succ\xE8s.
`),i+=s.BTM+s.GENERATED_BY,await e(i)}),d({name:"deletesession",alias:["delsession","rmsession"],classe:"Session",react:"\u{1F5D1}\uFE0F",desc:"Supprimer d\xE9finitivement une session connect\xE9e"},async(m,r,{repondre:e,arg:a,dev_id:t})=>{if(!t)return e("\u274C R\xE9serv\xE9e au propri\xE9taire.");if(!a[0])return e("\u274C Usage : deletesession <session_id>");const n=a[0].trim();if(await S.stopSession(n),!await I(n))return e(`\u274C Session *${n}* introuvable.`);await e(`\u{1F5D1}\uFE0F Session *${n}* supprim\xE9e d\xE9finitivement.`)}),d({name:"listsessions",alias:["ls","sessions"],classe:"Session",react:"\u{1F4CB}",desc:"Lister toutes les sessions connect\xE9es"},async(m,r,{repondre:e,dev_id:a})=>{if(!a)return e("\u274C R\xE9serv\xE9e au propri\xE9taire.");const t=S.getAllInstances();if(!t||t.length===0)return e("\u{1F4ED} Aucune session active actuellement (hormis le bot principal).");let n=s.TOP("\u{1F4CB} SESSIONS ACTIVES")+`
`;t.forEach((c,i)=>{n+=s.LINE(`${i+1}. \u{1F194} *${c.socket.sessionId||"Main"}*
`),n+=s.LINE(`   \u{1F4DB} ${c.config.NOM_BOT} | \u{1F310} ${c.config.MODE}
`)}),n+=s.INTER()+`
`,n+=s.LINE(`Total : *${t.length}* instance(s) en ligne
`),n+=s.BTM+s.GENERATED_BY,await e(n)});
