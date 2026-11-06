import{menmacmd as d}from"../lib/menmacmd.js";import{session as y}from"../Database/session.js";import t from"../lib/styleHelper.js";import"../config.js";import c from"fs";import x from"path";import{fileURLToPath as A}from"url";import{dirname as R}from"path";import m from"os";import C from"../Database/db.js";import{trd as D}from"../lib/i18n.js";const U=A(import.meta.url),_=R(U),p=x.join(_,"..","auth","creds.json");function T(o){o=Number(o);const i=Math.floor(o/(3600*24)),s=Math.floor(o%(3600*24)/3600),n=Math.floor(o%3600/60),r=Math.floor(o%60),a=[];return i>0&&a.push(`${i}d`),s>0&&a.push(`${s}h`),n>0&&a.push(`${n}m`),(r>0||a.length===0)&&a.push(`${r}s`),a.join(" ")}d({name:"system",alias:["sysinfo","stats","sys"],classe:"owner",react:"\u{1F4CA}",desc:D("system.desc")||"Affiche le diagnostic complet du syst\xE8me et des performances du bot"},async(o,i,{repondre:s,dev_id:n,ms:r})=>{if(!n)return s("\u274C Cette commande est r\xE9serv\xE9e au propri\xE9taire.");const a=Date.now();let f="\u{1F7E2} Connect\xE9e";try{await C.authenticate()}catch(v){f=`\u{1F534} Erreur (${v.message})`}const h=r?.messageTimestamp?Date.now()-r.messageTimestamp*1e3:null,$=T(process.uptime()),g=T(m.uptime()),u=process.memoryUsage(),I=(u.heapUsed/1024/1024).toFixed(2),M=(u.heapTotal/1024/1024).toFixed(2),S=(u.rss/1024/1024).toFixed(2),N=(m.freemem()/1024/1024/1024).toFixed(2),E=(m.totalmem()/1024/1024/1024).toFixed(2),w=(E-N).toFixed(2),l=m.cpus(),B=l.length>0?l[0].model.trim():"Inconnu",L=l.length,b=Date.now()-a;let e=t.TOP("\u{1F4CA} DIAGNOSTIC SYST\xC8ME")+`
`;e+=t.LINE(`\u26A1 *Latence R\xE9seau :* ${h!==null?`${h} ms`:"N/A"}
`),e+=t.LINE(`\u23F1\uFE0F *Temps d'ex\xE9cution :* ${b} ms
`),e+=t.INTER()+`
`,e+=t.LINE(`\u23F3 *Uptime Bot :* ${$}
`),e+=t.LINE(`\u{1F5A5}\uFE0F *Uptime Serveur :* ${g}
`),e+=t.INTER()+`
`,e+=t.LINE(`\u{1F9E0} *RAM Processus (Heap) :* ${I} MB / ${M} MB
`),e+=t.LINE(`\u{1F4E6} *RAM Processus (RSS) :* ${S} MB
`),e+=t.LINE(`\u{1F4BE} *RAM Syst\xE8me :* ${w} GB / ${E} GB (${N} GB libre)
`),e+=t.INTER()+`
`,e+=t.LINE(`\u2699\uFE0F *CPU :* ${B} (${L} c\u0153urs)
`),e+=t.LINE(`\u{1F427} *Plateforme :* ${m.platform()} (${m.arch()})
`),e+=t.LINE(`\u{1F7E2} *Node.js :* ${process.version}
`),e+=t.LINE(`\u{1F5C4}\uFE0F *Base de donn\xE9es :* ${f}
`),e+=t.BTM,await s(e)}),d({name:"clearsession",alias:["resetauth","cleardb"],classe:"owner",react:"\u{1F9F9}",desc:"Supprime les donn\xE9es de session corrompues (fix Bad MAC)"},async(o,i,{repondre:s,dev_id:n})=>{if(!n)return s("\u274C Cette commande est r\xE9serv\xE9e au propri\xE9taire.");await s(`\u26A0\uFE0F *ATTENTION* : Cette action va supprimer toutes les donn\xE9es de session de la base de donn\xE9es et arr\xEAter le bot.

Vous devrez probablement red\xE9marrer le bot sur votre panel (Koyeb/Render) et peut-\xEAtre vous reconnecter si le SESSION_ID n'est plus valide.

\u{1F504} Nettoyage en cours...`);try{await y.destroy({where:{}}),console.log("[MAINTENANCE] Table Session vid\xE9e par commande."),c.existsSync(p)&&(c.unlinkSync(p),console.log("[MAINTENANCE] Fichier creds.json supprim\xE9.")),await s(`\u2705 *Session nettoy\xE9e avec succ\xE8s !*

Le bot va maintenant s'arr\xEAter. Veuillez le red\xE9marrer depuis votre panel.`),setTimeout(()=>{process.exit(0)},2e3)}catch(r){await s(`\u274C *Erreur lors du nettoyage :* ${r.message}`)}}),d({name:"logout",classe:"owner",react:"\u{1F6AA}",desc:"D\xE9connecte proprement le bot de WhatsApp"},async(o,i,{repondre:s,dev_id:n})=>{if(!n)return s("\u274C R\xE9serv\xE9e au propri\xE9taire.");await s("\u{1F6AA} D\xE9connexion en cours...");try{await i.logout(),await y.destroy({where:{}}),c.existsSync(p)&&c.unlinkSync(p),await s("\u2705 D\xE9connect\xE9 ! La session a \xE9t\xE9 supprim\xE9e."),setTimeout(()=>{process.exit(0)},2e3)}catch(r){await s(`\u274C Erreur : ${r.message}`)}});
