import{menmacmd as u}from"../lib/menmacmd.js";import{uploadToCatbox as d,dl_any_buffer_ms as f}from"../lib/fonctions.js";import g from"axios";import a from"../lib/styleHelper.js";import{trd as e}from"../lib/i18n.js";import{getSettings as p}from"../Database/settings.js";import{runtime as E}from"../lib/fonctions.js";u({name:"lifetime",alias:["age","lifetime"],classe:"outils",react:"\u{1F382}",desc:"Affiche le temps total depuis le premier d\xE9ploiement du bot."},async(m,o,{repondre:c})=>{const t=await p(),n=new Date(t.firstLaunch),l=Math.floor((new Date-n)/1e3),i=E(l);let r=a.TOP("\u{1F382} DUR\xC9E DE VIE")+`
`;r+=a.LINE(`*Depuis* : ${n.toLocaleDateString("fr-FR")} ${n.toLocaleTimeString("fr-FR")}
`),r+=a.LINE(`*\xC2ge Total* : ${i}
`),r+=a.BTM,c(r)}),u({name:e("url.name")||"url",alias:["catbox","tourl"],classe:"outils",react:"\u{1F517}",desc:e("url.desc")||"T\xE9l\xE9charge un m\xE9dia et renvoie son lien Catbox."},async(m,o,{ms:c,repondre:t,msg_Repondu:n})=>{if(!n)return t(e("url.usage")||"\u274C Veuillez r\xE9pondre \xE0 un m\xE9dia (image, vid\xE9o, audio, sticker).");try{await o.sendMessage(m,{react:{text:"\u23F3",key:c.key}});const s=await f(n);if(!s||!s.buffer)return t(e("url.invalid_media")||"\u274C M\xE9dia non reconnu ou non support\xE9.");const l=await d(s.buffer,s.fileName);await o.sendMessage(m,{text:l},{quoted:c}),await o.sendMessage(m,{react:{text:"\u2705",key:c.key}})}catch(s){console.error("[URL ERR]",s),t(e("misc.error"))}}),u({name:e("newsletter.name")||"newsletter",alias:["channel","chaine"],classe:"outils",react:"\u{1F4E1}",desc:e("newsletter.desc")},async(m,o,{arg:c,repondre:t,prefixe:n})=>{const s=c[0];if(!s||!s.includes("whatsapp.com/channel/"))return t(e("newsletter.usage",{prefixe:n}));try{const l=s.split("whatsapp.com/channel/")[1],i=await o.newsletterMetadata("invite",l);if(!i)return t(e("newsletter.error"));let r=a.TOP(e("newsletter.title"))+`
`;r+=a.LINE(e("newsletter.label_name",{name:i.name})+`
`),r+=a.LINE(e("newsletter.label_jid",{jid:i.id})+`
`),r+=a.LINE(e("newsletter.label_subs",{subs:i.subscribers||"Inconnu"})+`
`),r+=a.LINE(e("newsletter.label_desc",{desc:i.description||"Aucune"})+`
`),r+=a.INTER()+`
`,r+=a.LINE(e("newsletter.hint",{prefixe:n,jid:i.id}).split(`
`).join(`
`+a.LINE(""))+`
`),r+=a.BTM,await t(r)}catch{t(e("misc.error"))}}),u({name:e("ocr.name"),alias:["extrait","totexte"],classe:"outils",react:"\u{1F50D}",desc:e("ocr.desc")},async(m,o,{ms:c,repondre:t,msg_Repondu:n})=>{if(!n||!n.imageMessage)return t(e("ocr.usage"));t(e("ocr.analyzing"));try{const s=await f(n);if(!s||s.type!=="image")return t(e("ocr.usage"));const l=await d(s.buffer,"ocr_temp.jpg"),{data:i}=await g.get(`https://api.ocr.space/parse/imageurl?apikey=helloworld&url=${encodeURIComponent(l)}&language=fre`);if(!i.ParsedResults||!i.ParsedResults[0]||!i.ParsedResults[0].ParsedText)return t(e("ocr.no_result"));const r=i.ParsedResults[0].ParsedText.trim();if(!r)return t(e("ocr.no_text"));let w=a.TOP(e("ocr.success_title"))+`
`+a.LINE(`${e("ocr.extracted")}
`)+a.LINE(`> ${r.replace(/\n/g,`
\u2502 > `)}
`)+a.BTM+a.GENERATED_BY;t(w)}catch{t(e("misc.error"))}});
