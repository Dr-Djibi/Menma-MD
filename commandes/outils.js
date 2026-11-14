import{menmacmd as d}from"../lib/menmacmd.js";import e from"../lib/styleHelper.js";import"../lib/utils/cache.js";import{trd as i}from"../lib/i18n.js";import"@whiskeysockets/baileys";const v=e.GENERATED_BY;d({name:i("kick.name"),alias:["virer","retirer"],classe:"groupe",react:"\u{1F9B6}",desc:i("kick.desc")},async(l,m,{repondre:s,verif_Gp:t,verif_menmaAdmin:n,verif_Admin:a,mr:r,auteur_Msg_Repondu:c,ms:o})=>{if(!t)return s(i("misc.group"));if(!a)return s(i("misc.admin"));if(!n)return s(i("misc.botAdmin"));const u=r&&r[0]||c;if(!u)return s(e.TOP("\u274C ERREUR")+`
`+e.LINE(`${i("kick.usage")}
`)+e.BTM);try{await m.groupParticipantsUpdate(l,[u],"remove"),s({text:i("kick.success",{user:u.split("@")[0]}),mentions:[u]})}catch{s(i("misc.error"))}}),d({name:i("add.name"),alias:["ajouter"],classe:"groupe",react:"\u2795",desc:i("add.desc")},async(l,m,{repondre:s,verif_Gp:t,verif_menmaAdmin:n,verif_Admin:a,arg:r,prefixe:c})=>{if(!t)return s(i("misc.group"));if(!a)return s(i("misc.admin"));if(!n)return s(i("misc.botAdmin"));let o=r[0];if(!o)return s(e.TOP("\u274C ERREUR")+`
`+e.LINE(`${i("add.usage",{prefixe:c})}
`)+e.BTM);o=o.replace(/\D/g,"");const u=`${o}@s.whatsapp.net`;try{await m.groupParticipantsUpdate(l,[u],"add"),s({text:i("add.success",{user:o}),mentions:[u]})}catch{s(i("misc.error"))}}),d({name:i("promote.name"),alias:["admin","promouvoir"],classe:"groupe",react:"\u{1F53A}",desc:i("promote.desc")},async(l,m,{repondre:s,verif_Gp:t,verif_menmaAdmin:n,verif_Admin:a,mr:r,auteur_Msg_Repondu:c})=>{if(!t)return s(i("misc.group"));if(!a)return s(i("misc.admin"));if(!n)return s(i("misc.botAdmin"));const o=r&&r[0]||c;if(!o)return s(e.TOP("\u274C ERREUR")+`
`+e.LINE(`${i("promote.usage")}
`)+e.BTM);try{await m.groupParticipantsUpdate(l,[o],"promote"),s({text:i("promote.success",{user:o.split("@")[0]}),mentions:[o]})}catch{s(i("misc.error"))}}),d({name:i("demote.name"),alias:["deadmin","retrograder"],classe:"groupe",react:"\u{1F53B}",desc:i("demote.desc")},async(l,m,{repondre:s,verif_Gp:t,verif_menmaAdmin:n,verif_Admin:a,mr:r,auteur_Msg_Repondu:c})=>{if(!t)return s(i("misc.group"));if(!a)return s(i("misc.admin"));if(!n)return s(i("misc.botAdmin"));const o=r&&r[0]||c;if(!o)return s(e.TOP("\u274C ERREUR")+`
`+e.LINE(`${i("demote.usage")}
`)+e.BTM);try{await m.groupParticipantsUpdate(l,[o],"demote"),s({text:i("demote.success",{user:o.split("@")[0]}),mentions:[o]})}catch{s(i("misc.error"))}}),d({name:i("tagall.name"),alias:["tous","all"],classe:"groupe",react:"\u{1F4E3}",desc:i("tagall.desc")},async(l,m,s)=>{const{repondre:t,verif_Gp:n,verif_Admin:a,mbre_membre:r,arg:c,resolveName:o,auteur_Message:u,ms:g,msg_Repondu:f}=s;if(!n)return t(i("misc.group"));if(!a)return t(i("misc.admin"));const T=o(u),p=r.map($=>$.id);let E=`

\u{1F4E2} *Appel par :* ${T}
`+e.INTER()+`
`;for(let $ of r)E+=e.LINE(`\u{1F538} @${$.id.split("@")[0]}
`);if(E+=e.LINE(`${i("tagall.total",{count:r.length})}
`)+e.BTM,f){const $=Object.keys(f)[0],I=f[$],O=c.join(" ");if($==="imageMessage"||$==="videoMessage"){const N=(O||I.caption||"")+E;return await m.sendMessage(l,{[$.replace("Message","")]:I,caption:N,mentions:p})}if($==="conversation"||$==="extendedTextMessage"){const N=(O||I.text||I||"")+E;return await m.sendMessage(l,{text:N,mentions:p})}if($==="stickerMessage")return await t("\u26A0\uFE0F *Note :* Tagall avec liste visible impossible sur un sticker. Passage en mode *invisible*."),await m.sendMessage(l,{sticker:I.url?{url:I.url}:I,mentions:p});if(I.caption!==void 0){const N=(O||I.caption||"")+E;return await m.sendMessage(l,{[$.replace("Message","")]:I,caption:N,mentions:p})}}const h=c.join(" ")||i("tagall.msg");let M=e.TOP(i("tagall.title"))+`
`;M+=e.LINE(`${i("tagall.label_msg")}
`),M+=e.LINE(`${h}
`),M+=E,await m.sendMessage(l,{text:M,mentions:p})}),d({name:i("hidetag.name"),alias:["tag","invisible"],classe:"groupe",react:"\u{1F47B}",desc:i("hidetag.desc")},async(l,m,s)=>{const{repondre:t,verif_Gp:n,verif_Admin:a,mbre_membre:r,arg:c,ms:o,msg_Repondu:u}=s;if(!n)return t(i("misc.group"));if(!a)return t(i("misc.admin"));const g=r.map(p=>p.id),f=c.join(" ");if(u){const p=Object.keys(u)[0],E=u[p];let h={mentions:g};if(p==="conversation"||p==="extendedTextMessage")h.text=f||E.text||E||"\u{1F4E3}";else if(p==="stickerMessage")h.sticker=E;else if(p==="imageMessage")h.image=E,h.caption=f||E.caption||"";else if(p==="videoMessage")h.video=E,h.caption=f||E.caption||"";else if(p==="audioMessage")h.audio=E;else{const M=p.replace("Message","");h[M]=E,E.caption!==void 0&&(h.caption=f||E.caption||"")}return await m.sendMessage(l,h)}const T=f||"\u{1F4E3}";await m.sendMessage(l,{text:T,mentions:g})}),d({name:i("open.name"),alias:["ouvrir","ouvrirgroupe"],classe:"groupe",react:"\u{1F513}",desc:i("open.desc")},async(l,m,{repondre:s,verif_Gp:t,verif_menmaAdmin:n,verif_Admin:a})=>{if(!t)return s(i("misc.group"));if(!a)return s(i("misc.admin"));if(!n)return s(i("misc.botAdmin"));try{await m.groupSettingUpdate(l,"not_announcement"),s(i("open.success"))}catch{s(i("misc.error"))}}),d({name:i("close.name"),alias:["fermer","fermergroupe"],classe:"groupe",react:"\u{1F512}",desc:i("close.desc")},async(l,m,{repondre:s,verif_Gp:t,verif_menmaAdmin:n,verif_Admin:a})=>{if(!t)return s(i("misc.group"));if(!a)return s(i("misc.admin"));if(!n)return s(i("misc.botAdmin"));try{await m.groupSettingUpdate(l,"announcement"),s(i("close.success"))}catch{s(i("misc.error"))}}),d({name:i("listmembers.name"),alias:["membres","listmembre"],classe:"groupe",react:"\u{1F465}",desc:i("listmembers.desc")},async(l,m,{repondre:s,verif_Gp:t,mbre_membre:n,nom_Gp:a,resolveName:r})=>{if(!t)return s(i("misc.group"));let c="",o="",u=0,g=0;n.forEach(p=>{const E=r(p.id);p.admin?(u++,c+=e.LINE(`${u}. ${E}
`)):(g++,o+=e.LINE(`${g}. ${E}
`))});let f=e.TOP(i("listmembers.title",{group:a.toUpperCase()}))+`
`;f+=e.LINE(`${i("listmembers.total",{count:n.length})}
`),u>0&&(f+=e.INTER()+`
`,f+=e.LINE(`${i("listmembers.admins",{count:u})}
`)+c),g>0&&(f+=e.INTER()+`
`,f+=e.LINE(`${i("listmembers.members",{count:g})}
`)+o),f+=e.BTM;const T=n.map(p=>p.id);await m.sendMessage(l,{text:f+v,mentions:T})}),d({name:i("setdesc.name"),alias:["desc","description"],classe:"groupe",react:"\u{1F4DD}",desc:i("setdesc.desc")},async(l,m,{repondre:s,verif_Gp:t,verif_menmaAdmin:n,verif_Admin:a,arg:r,prefixe:c})=>{if(!t)return s(i("misc.group"));if(!a)return s(i("misc.admin"));if(!n)return s(i("misc.botAdmin"));const o=r.join(" ");if(!o)return s(e.TOP("\u274C ERREUR")+`
`+e.LINE(`${i("setdesc.usage",{prefixe:c})}
`)+e.BTM);try{await m.groupUpdateDescription(l,o),s(i("setdesc.success"))}catch{s(i("misc.error"))}}),d({name:i("setname.name"),alias:["renommer","nomgroupe"],classe:"groupe",react:"\u270F\uFE0F",desc:i("setname.desc")},async(l,m,{repondre:s,verif_Gp:t,verif_menmaAdmin:n,verif_Admin:a,arg:r,prefixe:c})=>{if(!t)return s(i("misc.group"));if(!a)return s(i("misc.admin"));if(!n)return s(i("misc.botAdmin"));const o=r.join(" ");if(!o)return s(e.TOP("\u274C ERREUR")+`
`+e.LINE(`${i("setname.usage",{prefixe:c})}
`)+e.BTM);try{await m.groupUpdateSubject(l,o),s(i("setname.success",{name:o}))}catch{s(i("misc.error"))}}),d({name:i("linkgroupe.name"),alias:["link","invitelink"],classe:"groupe",react:"\u{1F517}",desc:i("linkgroupe.desc")},async(l,m,{repondre:s,verif_Gp:t,verif_menmaAdmin:n,verif_Admin:a})=>{if(!t)return s(i("misc.group"));if(!a)return s(i("misc.admin"));if(!n)return s(i("misc.botAdmin"));try{const r=await m.groupInviteCode(l);s(i("linkgroupe.msg",{code:r}))}catch{s(i("misc.error"))}}),d({name:i("infogroupe.name"),alias:["groupinfo","infogp"],classe:"groupe",react:"\u2139\uFE0F",desc:i("infogroupe.desc")},async(l,m,{repondre:s,verif_Gp:t,infos_Gp:n,mbre_membre:a,admins:r})=>{if(!t)return s(i("misc.group"));const c=n.creation?new Date(n.creation*1e3).toLocaleDateString("fr-FR"):"Inconnue",o=`${e.TOP(i("infogroupe.title"))}
${e.LINE(i("infogroupe.label_name",{name:n.subject||"N/A"}))}
${e.LINE(i("infogroupe.label_members",{count:a.length}))}
${e.LINE(i("infogroupe.label_admins",{count:r.length}))}
${e.LINE(i("infogroupe.label_date",{date:c}))}
${e.BTM}
${e.TOP(i("infogroupe.label_desc"))}
${n.desc||i("infogroupe.no_desc")}`;s(o+v)}),d({name:i("clear.name"),alias:["clean","vider"],classe:"groupe",react:"\u{1F9F9}",desc:i("clear.desc")},async(l,m,{repondre:s,verif_Admin:t,is_Owner:n,verif_Gp:a,ms:r})=>{if(a&&!t&&!n)return s(i("clear.no_admin"));if(!a&&!n)return s(i("misc.owner"));try{const c={key:r.key,messageTimestamp:r.messageTimestamp};try{await m.chatModify({clear:{messages:[c]}},l)}catch{await m.chatModify({clear:!0,lastMessages:[c]},l)}s(e.TOP("NETTOYAGE")+`
`+e.LINE(`${i("clear.success")}
`)+e.BTM)}catch(c){console.error("[CLEAR ERROR]",c),s(e.TOP("\u274C ERREUR")+`
`+e.LINE(`${i("clear.error")}
`)+e.BTM)}});import"../Database/settings.js";d({name:"setfooter",alias:["footer"],classe:"outils",react:"\u{1F58B}\uFE0F",desc:"Configure le footer personnalis\xE9 du bot (appara\xEEt sur les commandes)."},async(l,m,{repondre:s,is_Owner:t,arg:n})=>{if(!t)return s("\u274C Cette commande est r\xE9serv\xE9e au propri\xE9taire.");const a=n.join(" ");if(!a)return s(`\u274C Veuillez entrer le texte de votre footer apr\xE8s la commande.

*Exemple* : .setfooter Cr\xE9\xE9 par Dr Djibi`);try{const{updateSetting:r}=await import("../Database/settings.js");await r("customFooter",a),s(`\u2705 *Footer personnalis\xE9 enregistr\xE9 !*

Il s'affichera d\xE9sormais sur le menu et les autres commandes officielles.`)}catch{s(i("misc.error"))}}),d({name:"vcard",alias:["contact","card"],classe:"outils",react:"\u{1F4C7}",desc:"G\xE9n\xE9rer et envoyer la carte de contact (vCard) d'un utilisateur."},async(l,m,s)=>{const{repondre:t,msg_Repondu:n,auteur_Msg_Repondu:a,mr:r,arg:c,auteur_Message:o,resolveName:u,ms:g}=s;let f;if(n)f=a;else if(r&&r.length>0)f=r[0];else if(c&&c.length>0){const h=c[0].replace(/\D/g,"");h&&(f=`${h}@s.whatsapp.net`)}f||(f=o);const T=f.split("@")[0].split(":")[0],p=(u?u(f):null)||T,E=`BEGIN:VCARD
VERSION:3.0
FN:${p}
ORG:WhatsApp Contact
TEL;type=CELL;type=VOICE;waid=${T}:+${T}
END:VCARD`;try{await m.sendMessage(l,{contacts:{displayName:p,contacts:[{vcard:E}]}},{quoted:g})}catch{t(i("misc.error"))}}),d({name:"getfooter",alias:["viewfoot","showfooter"],classe:"outils",react:"\u{1F440}",desc:"Voir le footer personnalis\xE9 actuel."},async(l,m,{repondre:s,is_Owner:t})=>{if(!t)return s(i("misc.owner"));try{const{getSettings:n}=await import("../Database/settings.js"),a=await n();if(!a.customFooter)return s("\u2139\uFE0F Aucun footer personnalis\xE9 n'est configur\xE9.");s(`\u{1F4DD} *Votre footer actuel :*

${a.customFooter}`)}catch{s(i("misc.error"))}}),d({name:"delfooter",alias:["delfoot","removefooter"],classe:"outils",react:"\u{1F9F9}",desc:"Supprimer le footer personnalis\xE9."},async(l,m,{repondre:s,is_Owner:t})=>{if(!t)return s(i("misc.owner"));try{const{updateSetting:n}=await import("../Database/settings.js");await n("customFooter",""),s("\u2705 *Footer personnalis\xE9 supprim\xE9 avec succ\xE8s !*")}catch{s(i("misc.error"))}});import L from"../config.js";import{getAllSudoNumbers as R}from"../Database/sudo.js";d({name:i("kickcountry.name")||"kickcountry",alias:["kickprefix","virepays","kicknum"],classe:"groupe",react:"\u{1F30D}",desc:i("kickcountry.desc")||"Expulser tous les membres non-admin ayant un indicatif pays sp\xE9cifique (ex: .kickcountry 234)."},async(l,m,s)=>{const{repondre:t,verif_Gp:n,verif_Admin:a,verif_menmaAdmin:r,arg:c,mbre_membre:o,prefixe:u}=s;if(!n)return t(i("misc.group"));if(!a)return t(i("misc.admin"));if(!r)return t(i("misc.botAdmin"));if(!c[0])return t(e.TOP("\u{1F30D} KICK COUNTRY")+`
`+e.LINE(`${i("kickcountry.usage",{prefixe:u})||"*Usage* : "+u+`kickcountry <indicatif>
*Exemple* : `+u+"kickcountry 234,212"}
`)+e.BTM);const f=c.join(" ").split(/[,;\s]+/).map(T=>T.replace(/\D/g,"")).filter(Boolean);if(f.length===0)return t(e.TOP("\u274C ERREUR")+`
`+e.LINE(`Veuillez fournir au moins un indicatif num\xE9rique valide.
Ex: ${u}kickcountry 234
`)+e.BTM);try{const T=(m.user?.id||"").split(":")[0]+"@s.whatsapp.net",p=(Array.isArray(L.NUMERO_DEV)?L.NUMERO_DEV:[L.NUMERO_DEV]).map(N=>String(N).replace(/\D/g,"")),E=(Array.isArray(L.NUMERO_DEV_LID)?L.NUMERO_DEV_LID:[L.NUMERO_DEV_LID]).map(N=>String(N).replace(/\D/g,"")),h=String(L.OWNER||"").replace(/\D/g,""),M=(await R().catch(()=>[])).map(N=>String(N).replace(/\D/g,"")),$=new Set([...p,...E,h,...M].filter(Boolean)),I=[];for(const N of o){if(N.admin||N.superadmin)continue;const y=N.id||"";if(y===T)continue;const C=y.split("@")[0].split(":")[0];if($.has(C))continue;f.some(U=>C.startsWith(U))&&I.push(y)}if(I.length===0)return t(e.TOP("\u{1F30D} KICK COUNTRY")+`
`+e.LINE(`${i("kickcountry.empty",{prefixes:f.map(N=>"+"+N).join(", ")})||"Aucun membre non-admin trouv\xE9 avec l'indicatif "+f.map(N=>"+"+N).join(", ")+"."}
`)+e.BTM);await m.groupParticipantsUpdate(l,I,"remove");const O=e.TOP("\u{1F30D} KICK COUNTRY")+`
`+e.LINE(`\u2705 *${I.length}* membres (${f.map(N=>"+"+N).join(", ")}) ont \xE9t\xE9 expuls\xE9s du groupe.
`)+e.BTM;t(O)}catch(T){console.error("[KICKCOUNTRY ERR]",T),t(i("misc.error"))}});import x from"crypto";d({name:"calcpercent",alias:["percent","pourcentage"],classe:"outils",react:"\u{1F522}",desc:"Calculer un pourcentage (ex: .calcpercent 20 150 -> 20% de 150)"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{if(s.length<2)return t(`\u{1F522} *Usage* : \`${n}calcpercent <pourcentage> <valeur>\` (ex: \`${n}calcpercent 20 150\`)`);const a=parseFloat(s[0]),r=parseFloat(s[1]);if(isNaN(a)||isNaN(r))return t("\u274C Veuillez entrer deux nombres valides.");const c=a*r/100;return t(e.TOP("\u{1F522} CALCUL POURCENTAGE")+`
`+e.LINE(`\u{1F539} *${a}%* de *${r}* = *${c}*
`)+e.BTM)}),d({name:"byteconv",alias:["bytes","convertbytes"],classe:"outils",react:"\u{1F4BE}",desc:"Convertir des octets en Ko, Mo, Go, To"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{if(!s[0])return t(`\u{1F4BE} *Usage* : \`${n}byteconv <octets>\` (ex: \`${n}byteconv 1048576\`)`);const a=parseInt(s[0],10);if(isNaN(a)||a<0)return t("\u274C Veuillez entrer un nombre d'octets valide.");const r=(a/1024).toFixed(2),c=(a/1024**2).toFixed(2),o=(a/1024**3).toFixed(2),u=(a/1024**4).toFixed(2);let g=e.TOP("\u{1F4BE} CONVERSION OCTETS")+`
`;return g+=e.LINE(`\u{1F539} *Octets* : ${a.toLocaleString()} B
`),g+=e.LINE(`\u{1F539} *Kilooctets* : ${r} KB
`),g+=e.LINE(`\u{1F539} *M\xE9gaoctets* : ${c} MB
`),g+=e.LINE(`\u{1F539} *Gigaoctets* : ${o} GB
`),g+=e.LINE(`\u{1F539} *T\xE9raoctets* : ${u} TB
`),t(g+e.BTM)}),d({name:"tempconv",alias:["temperature","degre"],classe:"outils",react:"\u{1F321}\uFE0F",desc:"Convertir une temp\xE9rature (ex: .tempconv 25 c | .tempconv 77 f)"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{if(s.length<2)return t(`\u{1F321}\uFE0F *Usage* : \`${n}tempconv <valeur> <c|f|k>\` (ex: \`${n}tempconv 25 c\`)`);const a=parseFloat(s[0]),r=(s[1]||"").toLowerCase();if(isNaN(a))return t("\u274C Valeur num\xE9rique invalide.");let c,o,u;if(r==="c"||r==="celsius")c=a,o=a*9/5+32,u=a+273.15;else if(r==="f"||r==="fahrenheit")c=(a-32)*5/9,o=a,u=c+273.15;else if(r==="k"||r==="kelvin")c=a-273.15,o=c*9/5+32,u=a;else return t("\u274C Unit\xE9 invalide. Utilisez 'c', 'f' ou 'k'.");let g=e.TOP("\u{1F321}\uFE0F CONVERSION TEMP\xC9RATURE")+`
`;return g+=e.LINE(`\u{1F539} *Celsius* : ${c.toFixed(2)} \xB0C
`),g+=e.LINE(`\u{1F539} *Fahrenheit* : ${o.toFixed(2)} \xB0F
`),g+=e.LINE(`\u{1F539} *Kelvin* : ${u.toFixed(2)} K
`),t(g+e.BTM)}),d({name:"md5hash",alias:["md5"],classe:"outils",react:"\u{1F510}",desc:"G\xE9n\xE9rer le hash MD5 d'un texte"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=s.join(" ");if(!a)return t(`\u{1F510} *Usage* : \`${n}md5hash <texte>\``);const r=x.createHash("md5").update(a).digest("hex");return t(e.TOP("\u{1F510} HASH MD5")+`
`+e.LINE(`\u{1F539} *Texte* : ${a}
`)+e.LINE(`\u{1F511} *MD5* : \`${r}\`
`)+e.BTM)}),d({name:"sha1hash",alias:["sha1"],classe:"outils",react:"\u{1F510}",desc:"G\xE9n\xE9rer le hash SHA-1 d'un texte"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=s.join(" ");if(!a)return t(`\u{1F510} *Usage* : \`${n}sha1hash <texte>\``);const r=x.createHash("sha1").update(a).digest("hex");return t(e.TOP("\u{1F510} HASH SHA-1")+`
`+e.LINE(`\u{1F539} *Texte* : ${a}
`)+e.LINE(`\u{1F511} *SHA-1* : \`${r}\`
`)+e.BTM)}),d({name:"sha256hash",alias:["sha256"],classe:"outils",react:"\u{1F510}",desc:"G\xE9n\xE9rer le hash SHA-256 d'un texte"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=s.join(" ");if(!a)return t(`\u{1F510} *Usage* : \`${n}sha256hash <texte>\``);const r=x.createHash("sha256").update(a).digest("hex");return t(e.TOP("\u{1F510} HASH SHA-256")+`
`+e.LINE(`\u{1F539} *Texte* : ${a}
`)+e.LINE(`\u{1F511} *SHA-256* : \`${r}\`
`)+e.BTM)}),d({name:"sha512hash",alias:["sha512"],classe:"outils",react:"\u{1F510}",desc:"G\xE9n\xE9rer le hash SHA-512 d'un texte"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=s.join(" ");if(!a)return t(`\u{1F510} *Usage* : \`${n}sha512hash <texte>\``);const r=x.createHash("sha512").update(a).digest("hex");return t(e.TOP("\u{1F510} HASH SHA-512")+`
`+e.LINE(`\u{1F539} *Texte* : ${a}
`)+e.LINE(`\u{1F511} *SHA-512* : \`${r}\`
`)+e.BTM)}),d({name:"base64enc",alias:["b64enc","to64"],classe:"outils",react:"\u{1F4E6}",desc:"Encoder un texte en Base64"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=s.join(" ");if(!a)return t(`\u{1F4E6} *Usage* : \`${n}base64enc <texte>\``);const r=Buffer.from(a,"utf-8").toString("base64");return t(e.TOP("\u{1F4E6} ENCODAGE BASE64")+`
`+e.LINE(`\`\`\`${r}\`\`\`
`)+e.BTM)}),d({name:"base64dec",alias:["b64dec","from64"],classe:"outils",react:"\u{1F4E6}",desc:"D\xE9coder un texte Base64"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=s.join(" ");if(!a)return t(`\u{1F4E6} *Usage* : \`${n}base64dec <base64>\``);try{const r=Buffer.from(a,"base64").toString("utf-8");return t(e.TOP("\u{1F4E6} D\xC9CODAGE BASE64")+`
`+e.LINE(`${r}
`)+e.BTM)}catch{return t("\u274C Cha\xEEne Base64 invalide.")}}),d({name:"hexenc",alias:["tohex"],classe:"outils",react:"\u{1F523}",desc:"Convertir un texte en Hexad\xE9cimal"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=s.join(" ");if(!a)return t(`\u{1F523} *Usage* : \`${n}hexenc <texte>\``);const r=Buffer.from(a,"utf-8").toString("hex");return t(e.TOP("\u{1F523} ENCODAGE HEX")+`
`+e.LINE(`\`\`\`${r}\`\`\`
`)+e.BTM)}),d({name:"hexdec",alias:["fromhex"],classe:"outils",react:"\u{1F523}",desc:"Convertir de l'Hexad\xE9cimal en texte"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=s.join(" ").replace(/\s+/g,"");if(!a)return t(`\u{1F523} *Usage* : \`${n}hexdec <hex>\``);try{const r=Buffer.from(a,"hex").toString("utf-8");return t(e.TOP("\u{1F523} D\xC9CODAGE HEX")+`
`+e.LINE(`${r}
`)+e.BTM)}catch{return t("\u274C Cha\xEEne hexad\xE9cimale invalide.")}}),d({name:"urlencode",alias:["urlenc"],classe:"outils",react:"\u{1F310}",desc:"Encoder une URL ou un texte"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=s.join(" ");return t(a?e.TOP("\u{1F310} ENCODAGE URL")+`
`+e.LINE(`\`\`\`${encodeURIComponent(a)}\`\`\`
`)+e.BTM:`\u{1F310} *Usage* : \`${n}urlencode <texte>\``)}),d({name:"urldecode",alias:["urldec"],classe:"outils",react:"\u{1F310}",desc:"D\xE9coder une URL encod\xE9e"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=s.join(" ");if(!a)return t(`\u{1F310} *Usage* : \`${n}urldecode <texte>\``);try{return t(e.TOP("\u{1F310} D\xC9CODAGE URL")+`
`+e.LINE(`${decodeURIComponent(a)}
`)+e.BTM)}catch{return t("\u274C Cha\xEEne URL encod\xE9e invalide.")}}),d({name:"rot13",alias:["caesar13"],classe:"outils",react:"\u{1F504}",desc:"Chiffrer ou d\xE9chiffrer avec ROT13"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=s.join(" ");if(!a)return t(`\u{1F504} *Usage* : \`${n}rot13 <texte>\``);const r=a.replace(/[a-zA-Z]/g,c=>{const o=c<="Z"?65:97;return String.fromCharCode((c.charCodeAt(0)-o+13)%26+o)});return t(e.TOP("\u{1F504} ROT13")+`
`+e.LINE(`${r}
`)+e.BTM)}),d({name:"genuuid",alias:["uuid","guid"],classe:"outils",react:"\u{1F194}",desc:"G\xE9n\xE9rer un UUID v4 unique"},async(l,m,{repondre:s})=>{const t=x.randomUUID();return s(e.TOP("\u{1F194} UUID v4")+`
`+e.LINE(`\`${t}\`
`)+e.BTM)}),d({name:"genpassword",alias:["passwordgen","mdp"],classe:"outils",react:"\u{1F511}",desc:"G\xE9n\xE9rer un mot de passe s\xE9curis\xE9 (ex: .genpassword 16)"},async(l,m,{arg:s,repondre:t})=>{const n=Math.min(Math.max(parseInt(s[0],10)||14,6),64),a="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~|}{[]:;?><,.-=";let r="";const c=x.randomBytes(n);for(let o=0;o<n;o++)r+=a[c[o]%a.length];return t(e.TOP("\u{1F511} MOT DE PASSE S\xC9CURIS\xC9")+`
`+e.LINE(`Longueur : ${n}
`)+e.LINE(`Mot de passe : \`${r}\`
`)+e.BTM)}),d({name:"gentoken",alias:["tokengen","secret"],classe:"outils",react:"\u{1F39F}\uFE0F",desc:"G\xE9n\xE9rer un token cryptographique hexad\xE9cimal"},async(l,m,{arg:s,repondre:t})=>{const n=Math.min(Math.max(parseInt(s[0],10)||32,8),128),a=x.randomBytes(n).toString("hex");return t(e.TOP("\u{1F39F}\uFE0F TOKEN CRYPTO")+`
`+e.LINE(`\`${a}\`
`)+e.BTM)}),d({name:"colorhex",alias:["hexcolor","randcolor"],classe:"outils",react:"\u{1F3A8}",desc:"G\xE9n\xE9rer une couleur hexad\xE9cimale al\xE9atoire avec aper\xE7u RVB"},async(l,m,{repondre:s})=>{const t=x.randomBytes(3).toString("hex").toUpperCase(),n=parseInt(t.slice(0,2),16),a=parseInt(t.slice(2,4),16),r=parseInt(t.slice(4,6),16);return s(e.TOP("\u{1F3A8} COULEUR AL\xC9ATOIRE")+`
`+e.LINE(`\u{1F539} *HEX* : #${t}
`)+e.LINE(`\u{1F539} *RGB* : rgb(${n}, ${a}, ${r})
`)+e.BTM)}),d({name:"randomnum",alias:["randnum","randombetween"],classe:"outils",react:"\u{1F3B2}",desc:"G\xE9n\xE9rer un nombre al\xE9atoire entre Min et Max (ex: .randomnum 1 100)"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=parseInt(s[0],10)||1,r=parseInt(s[1],10)||100;if(a>=r)return t(`\u274C Min doit \xEAtre inf\xE9rieur \xE0 Max. Exemple : \`${n}randomnum 1 100\``);const c=Math.floor(Math.random()*(r-a+1))+a;return t(e.TOP("\u{1F3B2} NOMBRE AL\xC9ATOIRE")+`
`+e.LINE(`Intervalle : [${a} - ${r}]
`)+e.LINE(`R\xE9sultat : *${c}*
`)+e.BTM)}),d({name:"rolldice",alias:["dice6","des"],classe:"outils",react:"\u{1F3B2}",desc:"Lancer un d\xE9 \xE0 6 faces (ou N faces : .rolldice 20)"},async(l,m,{arg:s,repondre:t})=>{const n=Math.max(parseInt(s[0],10)||6,2),a=Math.floor(Math.random()*n)+1;return t(e.TOP("\u{1F3B2} LANCER DE D\xC9")+`
`+e.LINE(`D\xE9 \xE0 ${n} faces \u2794 *${a}*
`)+e.BTM)}),d({name:"flipcoin",alias:["cointoss","piece"],classe:"outils",react:"\u{1FA99}",desc:"Lancer une pi\xE8ce \xE0 pile ou face"},async(l,m,{repondre:s})=>{const t=Math.random()<.5?"\u{1FA99} Pile":"\u{1FA99} Face";return s(e.TOP("\u{1FA99} PILE OU FACE")+`
`+e.LINE(`R\xE9sultat : *${t}*
`)+e.BTM)}),d({name:"timenow",alias:["heure","horloge"],classe:"outils",react:"\u{1F552}",desc:"Affiche l'heure actuelle du serveur et en UTC"},async(l,m,{repondre:s})=>{const t=new Date;let n=e.TOP("\u{1F552} HORLOGE BOT")+`
`;return n+=e.LINE(`\u{1F539} *UTC* : ${t.toUTCString()}
`),n+=e.LINE(`\u{1F539} *ISO* : ${t.toISOString()}
`),n+=e.LINE(`\u{1F539} *Timestamp* : ${Math.floor(t.getTime()/1e3)}
`),s(n+e.BTM)}),d({name:"timeutc",alias:["utcnow"],classe:"outils",react:"\u23F0",desc:"Affiche l'heure UTC exacte"},async(l,m,{repondre:s})=>{const t=new Date,n=t.getUTCHours().toString().padStart(2,"0")+":"+t.getUTCMinutes().toString().padStart(2,"0")+":"+t.getUTCSeconds().toString().padStart(2,"0");return s(e.TOP("\u23F0 HEURE UTC")+`
`+e.LINE(`Heure universelle : *${n}* UTC
`)+e.BTM)}),d({name:"slugify",alias:["slug"],classe:"outils",react:"\u{1F517}",desc:"Convertir un texte en slug d'URL propre"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=s.join(" ");if(!a)return t(`\u{1F517} *Usage* : \`${n}slugify <texte>\``);const r=a.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().replace(/[^a-z0-9\s-]/g,"").replace(/[\s-]+/g,"-");return t(e.TOP("\u{1F517} SLUG URL")+`
`+e.LINE(`\`${r}\`
`)+e.BTM)}),d({name:"countwords",alias:["comptermots","wordcount"],classe:"outils",react:"\u{1F4DD}",desc:"Compter le nombre de mots dans un texte"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=s.join(" ");if(!a)return t(`\u{1F4DD} *Usage* : \`${n}countwords <texte>\``);const r=a.trim().split(/\s+/).filter(Boolean);return t(e.TOP("\u{1F4DD} COMPTEUR DE MOTS")+`
`+e.LINE(`Total de mots : *${r.length}*
`)+e.BTM)}),d({name:"countchars",alias:["compterlettres","charcount"],classe:"outils",react:"\u{1F524}",desc:"Compter les caract\xE8res avec et sans espaces"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=s.join(" ");if(!a)return t(`\u{1F524} *Usage* : \`${n}countchars <texte>\``);const r=a.length,c=a.replace(/\s+/g,"").length;let o=e.TOP("\u{1F524} COMPTEUR DE CARACT\xC8RES")+`
`;return o+=e.LINE(`\u{1F539} *Avec espaces* : ${r}
`),o+=e.LINE(`\u{1F539} *Sans espaces* : ${c}
`),t(o+e.BTM)}),d({name:"textreverse",alias:["inverse","inverser"],classe:"outils",react:"\u{1F504}",desc:"Inverser l'ordre des caract\xE8res d'un texte"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=s.join(" ");if(!a)return t(`\u{1F504} *Usage* : \`${n}textreverse <texte>\``);const r=Array.from(a).reverse().join("");return t(e.TOP("\u{1F504} TEXTE INVERS\xC9")+`
`+e.LINE(`${r}
`)+e.BTM)}),d({name:"uppercase",alias:["maj","majuscule"],classe:"outils",react:"\u{1F520}",desc:"Mettre un texte tout en majuscules"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=s.join(" ");return t(a?e.TOP("\u{1F520} MAJUSCULES")+`
`+e.LINE(`${a.toUpperCase()}
`)+e.BTM:`\u{1F520} *Usage* : \`${n}uppercase <texte>\``)}),d({name:"lowercase",alias:["min","minuscule"],classe:"outils",react:"\u{1F521}",desc:"Mettre un texte tout en minuscules"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=s.join(" ");return t(a?e.TOP("\u{1F521} MINUSCULES")+`
`+e.LINE(`${a.toLowerCase()}
`)+e.BTM:`\u{1F521} *Usage* : \`${n}lowercase <texte>\``)}),d({name:"capitalize",alias:["capwords"],classe:"outils",react:"\u{1F524}",desc:"Mettre la premi\xE8re lettre de chaque mot en majuscule"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=s.join(" ");if(!a)return t(`\u{1F524} *Usage* : \`${n}capitalize <texte>\``);const r=a.replace(/\b\w/g,c=>c.toUpperCase());return t(e.TOP("\u{1F524} CAPITALISATION")+`
`+e.LINE(`${r}
`)+e.BTM)});const b={A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..",1:".----",2:"..---",3:"...--",4:"....-",5:".....",6:"-....",7:"--...",8:"---..",9:"----.",0:"-----"," ":"/"};d({name:"morseenc",alias:["tomorse"],classe:"outils",react:"\u{1F4E1}",desc:"Convertir un texte en code Morse"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=s.join(" ").toUpperCase();if(!a)return t(`\u{1F4E1} *Usage* : \`${n}morseenc <texte>\``);const r=Array.from(a).map(c=>b[c]||c).join(" ");return t(e.TOP("\u{1F4E1} CODE MORSE")+`
`+e.LINE(`\`\`\`${r}\`\`\`
`)+e.BTM)}),d({name:"morsedec",alias:["frommorse"],classe:"outils",react:"\u{1F4E1}",desc:"D\xE9coder du code Morse en texte"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=s.join(" ").trim();if(!a)return t(`\u{1F4E1} *Usage* : \`${n}morsedec <code morse>\``);const r=Object.fromEntries(Object.entries(b).map(([o,u])=>[u,o])),c=a.split(" ").map(o=>r[o]||(o==="/"?" ":"?")).join("");return t(e.TOP("\u{1F4E1} D\xC9CODAGE MORSE")+`
`+e.LINE(`${c}
`)+e.BTM)}),d({name:"leetspeak",alias:["1337"],classe:"outils",react:"\u{1F4BB}",desc:"Convertir un texte en Leet Speak (1337)"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=s.join(" ");if(!a)return t(`\u{1F4BB} *Usage* : \`${n}leetspeak <texte>\``);const r={a:"4",A:"4",e:"3",E:"3",i:"1",I:"1",o:"0",O:"0",t:"7",T:"7",s:"5",S:"5"},c=Array.from(a).map(o=>r[o]||o).join("");return t(e.TOP("\u{1F4BB} LEET SPEAK")+`
`+e.LINE(`${c}
`)+e.BTM)}),d({name:"jsonformat",alias:["prettyjson","json"],classe:"outils",react:"\u{1F4D0}",desc:"Formater et indenter proprement un JSON"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=s.join(" ");if(!a)return t(`\u{1F4D0} *Usage* : \`${n}jsonformat <json>\``);try{const r=JSON.parse(a),c=JSON.stringify(r,null,2);return t("```json\n"+c+"\n```")}catch(r){return t(`\u274C JSON invalide : ${r.message}`)}}),d({name:"binenc",alias:["tobinary"],classe:"outils",react:"0\uFE0F\u20E3",desc:"Convertir un texte en binaire (0 et 1)"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=s.join(" ");if(!a)return t(`0\uFE0F\u20E3 *Usage* : \`${n}binenc <texte>\``);const r=Array.from(a).map(c=>c.charCodeAt(0).toString(2).padStart(8,"0")).join(" ");return t(e.TOP("0\uFE0F\u20E3 ENCODAGE BINAIRE")+`
`+e.LINE(`\`\`\`${r}\`\`\`
`)+e.BTM)}),d({name:"bindec",alias:["frombinary"],classe:"outils",react:"1\uFE0F\u20E3",desc:"Convertir du binaire en texte"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=s.join(" ").trim();if(!a)return t(`1\uFE0F\u20E3 *Usage* : \`${n}bindec <01001000...>\``);try{const c=a.split(/\s+/).map(o=>String.fromCharCode(parseInt(o,2))).join("");return t(e.TOP("1\uFE0F\u20E3 D\xC9CODAGE BINAIRE")+`
`+e.LINE(`${c}
`)+e.BTM)}catch{return t("\u274C Cha\xEEne binaire invalide.")}}),d({name:"useragent",alias:["ua"],classe:"outils",react:"\u{1F310}",desc:"G\xE9n\xE9rer un User-Agent de navigateur r\xE9aliste"},async(l,m,{repondre:s})=>{const t=["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36","Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15","Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0","Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1"],n=t[Math.floor(Math.random()*t.length)];return s(e.TOP("\u{1F310} USER-AGENT")+`
`+e.LINE(`\`\`\`${n}\`\`\`
`)+e.BTM)}),d({name:"epochtime",alias:["epoch","unixepoch"],classe:"outils",react:"\u23F1\uFE0F",desc:"Afficher le timestamp Epoch UNIX actuel (secondes et ms)"},async(l,m,{repondre:s})=>{const t=Date.now();let n=e.TOP("\u23F1\uFE0F TEMPS UNIX / EPOCH")+`
`;return n+=e.LINE(`\u{1F539} *Secondes* : ${Math.floor(t/1e3)}
`),n+=e.LINE(`\u{1F539} *Millisecondes* : ${t}
`),s(n+e.BTM)}),d({name:"daysuntil",alias:["comptearebours"],classe:"outils",react:"\u{1F4C5}",desc:"Calculer le nombre de jours jusqu'\xE0 une date (ex: .daysuntil 2025-12-25)"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{if(!s[0])return t(`\u{1F4C5} *Usage* : \`${n}daysuntil AAAA-MM-JJ\` (ex: \`${n}daysuntil 2025-12-25\`)`);const a=new Date(s[0]);if(isNaN(a.getTime()))return t("\u274C Format de date invalide. Utilisez AAAA-MM-JJ.");const r=Math.ceil((a-new Date)/(1e3*60*60*24));let c=e.TOP("\u{1F4C5} COMPTE \xC0 REBOURS")+`
`;return c+=e.LINE(`Date cible : *${a.toLocaleDateString("fr-FR")}*
`),c+=e.LINE(`Jours restants : *${r}* jour(s)
`),t(c+e.BTM)}),d({name:"vatcalc",alias:["tva","tvalcalc"],classe:"outils",react:"\u{1F4B6}",desc:"Calculer la TVA et le TTC (ex: .vatcalc 100 20 -> 100\u20AC HT avec 20% TVA)"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{if(!s[0])return t(`\u{1F4B6} *Usage* : \`${n}vatcalc <montant HT> [taux % (d\xE9faut: 20)]\``);const a=parseFloat(s[0]),r=parseFloat(s[1]||20);if(isNaN(a)||isNaN(r))return t("\u274C Montants num\xE9riques invalides.");const c=a*r/100,o=a+c;let u=e.TOP("\u{1F4B6} CALCUL TVA")+`
`;return u+=e.LINE(`\u{1F539} *Montant HT* : ${a.toFixed(2)} \u20AC
`),u+=e.LINE(`\u{1F539} *Taux TVA* : ${r} %
`),u+=e.LINE(`\u{1F539} *TVA* : ${c.toFixed(2)} \u20AC
`),u+=e.LINE(`\u{1F539} *Total TTC* : ${o.toFixed(2)} \u20AC
`),t(u+e.BTM)}),d({name:"bmicalc",alias:["imc","bmi"],classe:"outils",react:"\u2696\uFE0F",desc:"Calculer l'Indice de Masse Corporelle (ex: .bmicalc 70 1.75 -> 70kg, 1.75m)"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{if(s.length<2)return t(`\u2696\uFE0F *Usage* : \`${n}bmicalc <poids en kg> <taille en m>\` (ex: \`${n}bmicalc 70 1.75\`)`);const a=parseFloat(s[0]),r=parseFloat(s[1]);if(isNaN(a)||isNaN(r)||r<=0)return t("\u274C Valeurs invalides.");const c=(a/(r*r)).toFixed(1);let o="Normal";c<18.5?o="Maigreur / Sous-poids":c<25?o="Poids normal":c<30?o="Surpoids":o="Ob\xE9sit\xE9";let u=e.TOP("\u2696\uFE0F INDICE DE MASSE CORPORELLE")+`
`;return u+=e.LINE(`\u{1F539} *Poids* : ${a} kg
`),u+=e.LINE(`\u{1F539} *Taille* : ${r} m
`),u+=e.LINE(`\u{1F539} *IMC* : *${c}*
`),u+=e.LINE(`\u{1F539} *Interpr\xE9tation* : ${o}
`),t(u+e.BTM)}),d({name:"tipcalc",alias:["pourboire","tip"],classe:"outils",react:"\u{1FA99}",desc:"Calculer le pourboire et le total (ex: .tipcalc 50 15 2 -> 50\u20AC, 15%, 2 personnes)"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{if(!s[0])return t(`\u{1FA99} *Usage* : \`${n}tipcalc <montant> [pourcentage] [personnes]\` (ex: \`${n}tipcalc 60 10 2\`)`);const a=parseFloat(s[0]),r=parseFloat(s[1]||15),c=Math.max(parseInt(s[2]||1,10),1);if(isNaN(a)||isNaN(r))return t("\u274C Nombres invalides.");const o=a*r/100,u=a+o,g=u/c;let f=e.TOP("\u{1FA99} CALCUL DU POURBOIRE")+`
`;return f+=e.LINE(`\u{1F539} *Addition* : ${a.toFixed(2)} \u20AC
`),f+=e.LINE(`\u{1F539} *Pourboire (${r}%)* : ${o.toFixed(2)} \u20AC
`),f+=e.LINE(`\u{1F539} *Total* : ${u.toFixed(2)} \u20AC
`),c>1&&(f+=e.LINE(`\u{1F539} *Par personne (${c})* : ${g.toFixed(2)} \u20AC
`)),t(f+e.BTM)}),d({name:"discountcalc",alias:["remise","soldes"],classe:"outils",react:"\u{1F3F7}\uFE0F",desc:"Calculer une remise/solde (ex: .discountcalc 80 20 -> 80\u20AC avec -20%)"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{if(s.length<2)return t(`\u{1F3F7}\uFE0F *Usage* : \`${n}discountcalc <prix> <pourcentage remise>\` (ex: \`${n}discountcalc 80 20\`)`);const a=parseFloat(s[0]),r=parseFloat(s[1]);if(isNaN(a)||isNaN(r))return t("\u274C Nombres invalides.");const c=a*r/100,o=a-c;let u=e.TOP("\u{1F3F7}\uFE0F CALCUL DE REMISE")+`
`;return u+=e.LINE(`\u{1F539} *Prix initial* : ${a.toFixed(2)} \u20AC
`),u+=e.LINE(`\u{1F539} *\xC9conomie (-${r}%)* : ${c.toFixed(2)} \u20AC
`),u+=e.LINE(`\u{1F539} *Prix final* : *${o.toFixed(2)} \u20AC*
`),t(u+e.BTM)}),d({name:"romanconv",alias:["toroman","chiffreromain"],classe:"outils",react:"\u{1F3DB}\uFE0F",desc:"Convertir un nombre arabe en chiffres romains (1 \xE0 3999)"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{if(!s[0])return t(`\u{1F3DB}\uFE0F *Usage* : \`${n}romanconv <nombre 1-3999>\``);let a=parseInt(s[0],10);if(isNaN(a)||a<1||a>3999)return t("\u274C Nombre entre 1 et 3999 requis.");const r={M:1e3,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};let c="";for(const o in r)for(;a>=r[o];)c+=o,a-=r[o];return t(e.TOP("\u{1F3DB}\uFE0F CHIFFRES ROMAINS")+`
`+e.LINE(`R\xE9sultat : *${c}*
`)+e.BTM)}),d({name:"arabicconv",alias:["fromroman"],classe:"outils",react:"\u{1F3DB}\uFE0F",desc:"Convertir des chiffres romains en nombre arabe"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{const a=(s[0]||"").toUpperCase();if(!a)return t(`\u{1F3DB}\uFE0F *Usage* : \`${n}arabicconv <chiffres romains>\``);const r={I:1,V:5,X:10,L:50,C:100,D:500,M:1e3};let c=0,o=0;for(let u=a.length-1;u>=0;u--){const g=r[a[u]];if(!g)return t("\u274C Chiffre romain invalide.");g<o?c-=g:c+=g,o=g}return t(e.TOP("\u{1F3DB}\uFE0F CHIFFRE ARABE")+`
`+e.LINE(`R\xE9sultat : *${c}*
`)+e.BTM)}),d({name:"speedconv",alias:["vitesse"],classe:"outils",react:"\u{1F3CE}\uFE0F",desc:"Convertir une vitesse entre km/h, m/s et mph"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{if(!s[0])return t(`\u{1F3CE}\uFE0F *Usage* : \`${n}speedconv <valeur> [kmh|ms|mph]\` (ex: \`${n}speedconv 100 kmh\`)`);const a=parseFloat(s[0]),r=(s[1]||"kmh").toLowerCase();if(isNaN(a))return t("\u274C Valeur invalide.");let c;if(r==="kmh"||r==="km/h")c=a;else if(r==="ms"||r==="m/s")c=a*3.6;else if(r==="mph")c=a*1.60934;else return t("\u274C Unit\xE9 invalide. Utilisez kmh, ms ou mph.");const o=c/3.6,u=c/1.60934;let g=e.TOP("\u{1F3CE}\uFE0F CONVERSION VITESSE")+`
`;return g+=e.LINE(`\u{1F539} *km/h* : ${c.toFixed(2)} km/h
`),g+=e.LINE(`\u{1F539} *m/s* : ${o.toFixed(2)} m/s
`),g+=e.LINE(`\u{1F539} *mph* : ${u.toFixed(2)} mph
`),t(g+e.BTM)}),d({name:"lengthconv",alias:["longueur"],classe:"outils",react:"\u{1F4CF}",desc:"Convertir des m\xE8tres en pieds, pouces, kilom\xE8tres et miles"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{if(!s[0])return t(`\u{1F4CF} *Usage* : \`${n}lengthconv <m\xE8tres>\` (ex: \`${n}lengthconv 100\`)`);const a=parseFloat(s[0]);if(isNaN(a))return t("\u274C Valeur num\xE9rique invalide.");const r=a/1e3,c=a*3.28084,o=a*39.3701,u=a*621371e-9;let g=e.TOP("\u{1F4CF} CONVERSION LONGUEUR")+`
`;return g+=e.LINE(`\u{1F539} *M\xE8tres* : ${a} m
`),g+=e.LINE(`\u{1F539} *Kilom\xE8tres* : ${r.toFixed(3)} km
`),g+=e.LINE(`\u{1F539} *Pieds (ft)* : ${c.toFixed(2)} ft
`),g+=e.LINE(`\u{1F539} *Pouces (in)* : ${o.toFixed(2)} in
`),g+=e.LINE(`\u{1F539} *Miles* : ${u.toFixed(4)} mi
`),t(g+e.BTM)}),d({name:"massconv",alias:["poidsconv","masse"],classe:"outils",react:"\u2696\uFE0F",desc:"Convertir des kilogrammes en livres (lbs), onces (oz) et grammes"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{if(!s[0])return t(`\u2696\uFE0F *Usage* : \`${n}massconv <kilogrammes>\` (ex: \`${n}massconv 75\`)`);const a=parseFloat(s[0]);if(isNaN(a))return t("\u274C Valeur num\xE9rique invalide.");const r=a*1e3,c=a*2.20462,o=a*35.274;let u=e.TOP("\u2696\uFE0F CONVERSION DE MASSE")+`
`;return u+=e.LINE(`\u{1F539} *Kilogrammes* : ${a} kg
`),u+=e.LINE(`\u{1F539} *Grammes* : ${r.toLocaleString()} g
`),u+=e.LINE(`\u{1F539} *Livres (lbs)* : ${c.toFixed(2)} lbs
`),u+=e.LINE(`\u{1F539} *Onces (oz)* : ${o.toFixed(2)} oz
`),t(u+e.BTM)}),d({name:"primecheck",alias:["isprime","premier"],classe:"outils",react:"\u{1F522}",desc:"V\xE9rifier si un nombre entier est premier"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{if(!s[0])return t(`\u{1F522} *Usage* : \`${n}primecheck <nombre entier>\``);const a=parseInt(s[0],10);if(isNaN(a)||a<1)return t("\u274C Entier positif requis.");let r=a>1;for(let o=2;o*o<=a;o++)if(a%o===0){r=!1;break}const c=r?`\u2705 *${a}* est un nombre premier.`:`\u274C *${a}* n'est pas un nombre premier.`;return t(e.TOP("\u{1F522} NOMBRE PREMIER")+`
`+e.LINE(`${c}
`)+e.BTM)}),d({name:"gcdcalc",alias:["pgcd","gcd"],classe:"outils",react:"\u{1F4D0}",desc:"Calculer le Plus Grand Commun Diviseur (PGCD) de deux nombres"},async(l,m,{arg:s,repondre:t,prefixe:n})=>{if(s.length<2)return t(`\u{1F4D0} *Usage* : \`${n}gcdcalc <a> <b>\` (ex: \`${n}gcdcalc 48 18\`)`);let a=Math.abs(parseInt(s[0],10)),r=Math.abs(parseInt(s[1],10));if(isNaN(a)||isNaN(r))return t("\u274C Deux nombres entiers requis.");const c=a,o=r;for(;r;){const u=r;r=a%r,a=u}return t(e.TOP("\u{1F4D0} CALCUL PGCD")+`
`+e.LINE(`PGCD(${c}, ${o}) = *${a}*
`)+e.BTM)});
