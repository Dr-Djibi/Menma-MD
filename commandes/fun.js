import{menmacmd as u}from"../lib/menmacmd.js";import{downloadContentFromMessage as N}from"@whiskeysockets/baileys";import y from"axios";import{runtime as b}from"../lib/fonctions.js";import t from"../lib/styleHelper.js";import{trd as e}from"../lib/i18n.js";import $ from"../config.js";import{decodeJid as L}from"../lib/utils/identity.js";const M=t.GENERATED_BY;async function w(r){try{const o=`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=fr&dt=t&q=${encodeURIComponent(r)}`,{data:s}=await y.get(o);return s[0][0][0]}catch{return r}}u({name:e("profile.name"),alias:["photo","profil","pp"],classe:"fun",react:"\u{1F4F8}",desc:e("profile.desc")},async(r,o,{repondre:s,mr:a,auteur_Msg_Repondu:n,auteur_Message:c,ms:i})=>{const l=a&&a[0]||n||c;try{const d=await o.profilePictureUrl(l,"image");await o.sendMessage(r,{image:{url:d},caption:t.TOP(e("profile.title"))+`
`+t.LINE(`${e("profile.member",{user:l.split("@")[0]})}
`)+t.BTM,mentions:[l]},{quoted:i})}catch{s(e("profile.error"))}}),u({name:e("bio.name"),classe:"fun",react:"\u{1F4D6}",desc:e("bio.desc")},async(r,o,{repondre:s,mr:a,auteur_Msg_Repondu:n,auteur_Message:c})=>{const i=a&&a[0]||n||c;try{const l=await o.fetchStatus(i);s(t.TOP(e("bio.title"))+`
`+t.LINE(`@${i.split("@")[0]}
`)+t.INTER()+`
`+t.LINE(`${l?.status||e("bio.no_status")}
`)+t.BTM)}catch{s(e("bio.error"))}}),u({name:e("uptime.name"),alias:["upt","runtime"],classe:"outils",react:"\u23F1\uFE0F",desc:e("uptime.desc")},async(r,o,{repondre:s})=>{const a=b(process.uptime());s(t.TOP(e("uptime.title"))+`
`+t.LINE(`${e("uptime.msg",{up:a})}
`)+t.BTM)}),u({name:e("del.name"),alias:["delete","supp","supprimer"],classe:"outils",react:"\u{1F5D1}\uFE0F",desc:e("del.desc")},async(r,o,{repondre:s,ms:a,premium_id:n})=>{if(!n)return s(e("del.no_owner"));const c=a.message?.extendedTextMessage?.contextInfo;if(!c?.stanzaId)return s(e("del.no_quoted"));try{await o.sendMessage(r,{delete:{remoteJid:r,id:c.stanzaId,participant:c.participant,fromMe:!1}})}catch{s(e("misc.error"))}}),global.afkData=global.afkData||{},u({name:e("afk.name"),classe:"fun",react:"\u{1F4A4}",desc:e("afk.desc")},async(r,o,{repondre:s,arg:a,pseudo:n,auteur_Message:c})=>{const i=a.join(" ")||"Pas de raison fournie";global.afkData[c]={reason:i,time:Date.now(),pseudo:n},s(t.TOP(e("afk.title"))+`
`+t.LINE(`${e("afk.msg",{pseudo:n})}
`)+t.LINE(`${e("afk.reason",{reason:i})}
`)+t.BTM)}),u({name:e("poll.name"),alias:["sondage"],classe:"groupe",react:"\u{1F4CA}",desc:e("poll.desc")},async(r,o,{repondre:s,arg:a,prefixe:n})=>{const c=a.join(" ");if(!c||!c.includes("|"))return s(t.TOP(e("poll.title"))+`
`+t.LINE(`${e("poll.usage",{prefixe:n})}
`)+t.BTM);const i=c.split("|").map(m=>m.trim()),l=i[0],d=i.slice(1);if(d.length<2)return s(t.TOP(e("poll.title"))+`
`+t.LINE(`${e("poll.min_options")}
`)+t.BTM);try{await o.sendMessage(r,{poll:{name:l,values:d,selectableCount:1}})}catch{s(e("misc.error"))}});async function E(r,o,{ms:s,repondre:a,auteur_Message:n,msg_Repondu:c},i=!1){if(!c)return a(e("vv.no_quoted"));let l=c;l.ephemeralMessage&&(l=l.ephemeralMessage.message),l.documentWithCaptionMessage&&(l=l.documentWithCaptionMessage.message);const d=Object.keys(l).find(g=>g.startsWith("viewOnce"));d&&(l=l[d].message||l[d]);const m=Object.keys(l).find(g=>["imageMessage","videoMessage","audioMessage"].includes(g));if(!m)return a(e("vv.invalid"));const h=l[m];if(!d&&h.viewOnce!==!0)return a(e("vv.not_vo"));try{const g=await N(h,m.replace("Message",""));let v=Buffer.alloc(0);for await(const I of g)v=Buffer.concat([v,I]);const T=i?n:r,p={caption:h.caption||""};return m==="imageMessage"?p.image=v:m==="videoMessage"?p.video=v:m==="audioMessage"&&(p.audio=v,p.mimetype="audio/ogg; codecs=opus",p.ptt=!1),await o.sendMessage(T,p,{quoted:s})}catch{a(e("misc.error"))}}u({name:"vv",classe:"fun",desc:e("vv.desc")},async(r,o,s)=>{await E(r,o,s,!1)}),u({name:e("vv2.name")||"vv2",classe:"fun",desc:e("vv2.desc")},async(r,o,s)=>{const a=($.OWNER||"").split(",")[0].replace(/\D/g,""),n=a?`${a}@s.whatsapp.net`:L(o.user.id);await E(n,o,s,!1)}),u({name:e("horoscope.name"),classe:"fun",react:"\u{1F52E}",desc:e("horoscope.desc")},async(r,o,s)=>{const{arg:a,repondre:n}=s;if(!a[0])return n(e("horoscope.invalid"));const c=a[0].toLowerCase().replace("b\xE9lier","belier").replace("g\xE9meaux","gemeaux");try{const{data:i}=await y.get("https://kayoo123.github.io/astroo-api/jour.json");if(!i[c])return n(e("horoscope.invalid"));let l=t.TOP(e("horoscope.title"))+`
`+t.LINE(`${e("horoscope.date",{date:i.date})}
`)+t.INTER()+`
`+t.LINE(`${e("horoscope.msg",{text:i[c]})}
`)+t.BTM;n(l)}catch{n(e("horoscope.error"))}}),u({name:e("citation.name"),classe:"fun",react:"\u{1F4DC}",desc:e("citation.desc")},async(r,o,s)=>{const{repondre:a}=s;try{const{data:n}=await y.get("https://api.quotable.io/random");let c=t.TOP(e("citation.title"))+`
`+t.LINE(`${e("citation.text",{content:n.content})}
`)+t.INTER()+`
`+t.LINE(`${e("citation.author",{author:n.author})}
`)+t.BTM;a(c)}catch{a(e("citation.error"))}}),u({name:e("top.name"),classe:"fun",react:"\u{1F3C6}",desc:e("top.desc")},async(r,o,s)=>{const{repondre:a,arg:n,mbre_membre:c,verif_Gp:i,ms:l}=s;if(!i)return a(e("top.error_gp"));const d=n.join(" ");if(!d)return a("Veuillez pr\xE9ciser un sujet.");let m=[...c];for(let f=m.length-1;f>0;f--){const p=Math.floor(Math.random()*(f+1));[m[f],m[p]]=[m[p],m[f]]}const h=Math.min(3,m.length);if(h===0)return a(e("top.empty"));let g=[],v=t.TOP(e("top.title",{sujet:d}))+`
`+t.INTER()+`
`;const T=["\u{1F947}","\u{1F948}","\u{1F949}"];for(let f=0;f<h;f++){const p=m[f].id;g.push(p),v+=t.LINE(`${T[f]} - @${p.split("@")[0]}
`)}await o.sendMessage(r,{text:v+t.BTM,mentions:g},{quoted:l})}),u({name:e("blague.name"),alias:["joke"],classe:"fun",react:"\u{1F92A}",desc:e("blague.desc")},async(r,o,{repondre:s})=>{try{const{data:a}=await y.get("https://v2.jokeapi.dev/joke/Any?type=single");let n=t.TOP(e("blague.title"))+`
`;a.type==="single"?n+=t.LINE(`${e("blague.single",{joke:a.joke})}
`):n+=t.LINE(`${e("blague.twopart",{setup:a.setup,delivery:a.delivery})}
`),s(n+t.BTM)}catch{s(e("misc.error"))}}),u({name:e("anicit.name"),alias:["animequote","aniquote"],classe:"fun",react:"\u{1F250}",desc:e("anicit.desc")},async(r,o,{repondre:s})=>{try{const{data:a}=await y.get("https://animechan.io/api/v1/quotes/random");let n=t.TOP(e("anicit.title"))+`
`+t.LINE(`${e("anicit.content",{content:a.data.content})}
`)+t.LINE(`${e("anicit.character",{character:a.data.character})}
`)+t.LINE(`${e("anicit.anime",{anime:a.data.anime})}
`)+t.BTM+M;s(n)}catch{s(e("anicit.error"))}}),u({name:e("fait.name"),alias:["fact"],classe:"fun",react:"\u{1F914}",desc:e("fait.desc")},async(r,o,{repondre:s})=>{try{const{data:a}=await y.get("https://uselessfacts.jsph.pl/random.json?language=en"),n=await w(a.text);s(t.TOP(e("fait.title"))+`
`+t.LINE(`${e("fait.msg",{text:n})}
`)+t.BTM+M)}catch{s(e("fait.error"))}}),u({name:e("avis.name"),classe:"fun",react:"\u{1F9E0}",desc:e("avis.desc")},async(r,o,{repondre:s,arg:a})=>{if(!a[0])return s(e("avis.usage"));const n=e("avis.responses"),c=n[Math.floor(Math.random()*n.length)];let i=t.TOP(e("avis.title"))+`
`+t.LINE(`${e("avis.question",{question:a.join(" ")})}
`)+t.INTER()+`
`+t.LINE(`${e("avis.answer",{answer:c})}
`)+t.BTM+M;s(i)}),u({name:e("humeur.name"),classe:"fun",react:"\u{1F3AD}",desc:e("humeur.desc")},async(r,o,{repondre:s})=>{const a=e("humeur.moods"),n=a[Math.floor(Math.random()*a.length)];s(t.TOP(e("humeur.title"))+`
`+t.LINE(`${e("humeur.msg",{mood:n})}
`)+t.BTM+M)}),u({name:e("conseil.name"),alias:["advice"],classe:"fun",react:"\u{1F4A1}",desc:e("conseil.desc")},async(r,o,{repondre:s})=>{try{const{data:a}=await y.get("https://api.adviceslip.com/advice"),n=await w(a.slip.advice);s(t.TOP(e("conseil.title"))+`
`+t.LINE(`${e("conseil.msg",{text:n})}
`)+t.BTM+M)}catch{s(e("conseil.error"))}}),u({name:e("insta.name"),alias:["ig","instagram"],classe:"fun",react:"\u{1F4F8}",desc:e("insta.desc")},async(r,o,{arg:s,repondre:a,ms:n})=>{if(!s[0])return a("Veuillez fournir un nom d'utilisateur Instagram.");try{const{data:c}=await y.get(`https://api.siputzx.my.id/api/s/instagram?query=${s[0]}`);if(!c.status||!c.result)return a(e("insta.not_found"));const i=c.result;let l=t.TOP(e("insta.title",{name:i.full_name||i.username}))+`
`+t.LINE(`${e("insta.username",{username:i.username})}
`)+t.LINE(`${e("insta.bio",{bio:i.biography||"N/A"})}
`)+t.LINE(`${e("insta.followers",{followers:i.followers})}
`)+t.LINE(`${e("insta.following",{following:i.following})}
`)+t.LINE(`${e("insta.posts",{posts_count:i.posts_count})}
`)+t.LINE(`${e("insta.link",{username:i.username})}
`)+t.BTM+M;await o.sendMessage(r,{image:{url:i.profile_pic_url_hd||i.profile_pic_url},caption:l},{quoted:n})}catch{a(e("insta.error"))}}),u({name:"fake",classe:"fun",react:"\u{1F3AD}",desc:"Envoie un message en citant une fausse r\xE9ponse de quelqu'un."},async(r,o,{repondre:s,mr:a,arg:n})=>{if(!a||a.length===0)return s("\u274C Veuillez mentionner un utilisateur en utilisant @.");const c=a[0],l=n.join(" ").split("/");if(l.length<2)return s("\u274C Utilisation correcte : .fake @cible message_cible / votre_reponse");const d=l[0].replace(/@\d+/g,"").trim(),m=l.slice(1).join("/").trim();if(!d||!m)return s("\u274C Le message de la cible et votre r\xE9ponse ne peuvent pas \xEAtre vides.");const h={key:{remoteJid:r,fromMe:!1,id:"FAKE"+Math.random().toString(36).substring(2,10).toUpperCase(),participant:c},message:{conversation:d}};await s({text:m,quoted:h})});
