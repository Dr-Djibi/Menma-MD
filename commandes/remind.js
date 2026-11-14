import{menmacmd as w}from"../lib/menmacmd.js";import{createReminder as P,getUserReminders as S,deleteReminder as A}from"../Database/reminder.js";import e from"../lib/styleHelper.js";import{trd as L}from"../lib/i18n.js";function M(d){if(!d||!d.trim())return null;const u=d.trim().match(/^(\d+)\s*([smhd])?$/i);if(!u)return null;const i=parseInt(u[1],10);if(isNaN(i)||i<=0)return null;const s=(u[2]||"m").toLowerCase();let n=0,m="";switch(s){case"s":n=i*1e3,m=`${i}s`;break;case"m":n=i*60*1e3,m=`${i} min`;break;case"h":n=i*60*60*1e3,m=`${i} h`;break;case"d":n=i*24*60*60*1e3,m=`${i} j`;break;default:return null}const t=720*60*60*1e3;return n>t?null:{ms:n,formatted:m,val:i,unit:s}}w({name:L("remind.name")||"remind",alias:["rappel","reminder","alarm"],classe:"outils",react:"\u23F0",desc:L("remind.desc")||"Cr\xE9er un rappel programm\xE9 avec alerte automatique."},async(d,u,i)=>{const{arg:s,repondre:n,auteur_Message:m,prefixe:t,ms:N}=i,f=(m||N.key?.participant||N.key?.remoteJid||"").split("@")[0].split(":")[0];try{const a=s[0]?s[0].toLowerCase():"";if(!a){let r=e.TOP("\u23F0 SYST\xC8ME DE RAPPELS")+`
`;return r+=e.LINE(`Ne ratez plus jamais un \xE9v\xE9nement ou une t\xE2che importante !
`)+e.INTER()+`
`,r+=e.LINE(`\u{1F539} *${t}remind <dur\xE9e> <message>* : Cr\xE9er un rappel
`),r+=e.LINE(`   _Ex: ${t}remind 15m Prendre les m\xE9dicaments_
`),r+=e.LINE(`   _Ex: ${t}remind 2h R\xE9union d'\xE9quipe_
`),r+=e.LINE(`   _Ex: ${t}remind 1d Rendre le projet_
`),r+=e.LINE(`\u{1F539} *${t}remind list* : Voir vos rappels actifs
`),r+=e.LINE(`\u{1F539} *${t}remind del <ID>* : Annuler un rappel
`),r+=e.BTM,n(r)}if(a==="list"||a==="liste"){const r=await S(f,d);if(!r||r.length===0)return n("\u{1F7E2} Vous n'avez aucun rappel actif dans ce chat.");let o=e.TOP("\u23F0 VOS RAPPELS ACTIFS")+`
`;const x=Date.now();return r.forEach((p,k)=>{const l=Math.max(0,Math.round((p.targetTime-x)/1e3));let g=`${l}s`;if(l>=3600){const h=Math.floor(l/3600),I=Math.floor(l%3600/60);g=`${h}h ${I}m`}else if(l>=60){const h=Math.floor(l/60),I=l%60;g=`${h}m ${I}s`}const v=new Date(p.targetTime).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});o+=e.LINE(`\u{1F539} *#${p.id}* : "${p.message}"
`),o+=e.LINE(`   \u23F3 Dans : *${g}* (~${v})
`)}),o+=e.INTER()+`
`,o+=e.LINE(`\u{1F4A1} Tapez \`${t}remind del <ID>\` pour annuler un rappel.
`),o+=e.BTM,n(o)}if(a==="del"||a==="delete"||a==="cancel"||a==="supp"){const r=parseInt(s[1],10);return isNaN(r)?n(`\u274C *Usage* : \`${t}remind del <ID>\` (Exemple : \`${t}remind del 3\`)`):await A(r,f)?n(`\u2705 Le rappel *#${r}* a \xE9t\xE9 annul\xE9 avec succ\xE8s.`):n(`\u274C Aucun rappel actif trouv\xE9 avec l'identifiant *#${r}* pour votre compte.`)}const $=M(a);if(!$)return n(`\u274C *Format de dur\xE9e invalide.*
Exemples : \`${t}remind 10m R\xE9union\`, \`${t}remind 2h Appel\`, \`${t}remind 1d Contr\xF4le\``);const E=s.slice(1).join(" ").trim();if(!E)return n(`\u274C Veuillez indiquer le sujet ou message du rappel.
Exemple : \`${t}remind ${a} Revoir mes le\xE7ons\``);const R=Date.now()+$.ms,T=await P({userId:f,chatId:d,message:E,targetTime:R}),D=new Date(R).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});let c=e.TOP("\u23F0 RAPPEL PROGRAMM\xC9")+`
`;return c+=e.LINE(`\u2705 Rappel *#${T.id}* enregistr\xE9 !
`),c+=e.LINE(`\u{1F4DD} *Message* : ${E}
`),c+=e.LINE(`\u23F3 *\xC9ch\xE9ance* : Dans *${$.formatted}* (~${D})
`),c+=e.BTM,n(c)}catch(a){return console.error("[REMIND CMD ERR]",a),n(L("misc.error"))}});export{M as parseReminderDuration};
