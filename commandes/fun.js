import{menmacmd as u}from"../lib/menmacmd.js";import{downloadContentFromMessage as b}from"@whiskeysockets/baileys";import h from"axios";import{runtime as $}from"../lib/fonctions.js";import t from"../lib/styleHelper.js";import{trd as e}from"../lib/i18n.js";import L from"../config.js";import{decodeJid as _}from"../lib/utils/identity.js";const M=t.GENERATED_BY;async function E(r){try{const i=`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=fr&dt=t&q=${encodeURIComponent(r)}`,{data:s}=await h.get(i);return s[0][0][0]}catch{return r}}u({name:e("profile.name"),alias:["photo","profil","pp"],classe:"fun",react:"\u{1F4F8}",desc:e("profile.desc")},async(r,i,{repondre:s,mr:a,auteur_Msg_Repondu:n,auteur_Message:l,ms:o})=>{const c=a&&a[0]||n||l;try{const d=await i.profilePictureUrl(c,"image");await i.sendMessage(r,{image:{url:d},caption:t.TOP(e("profile.title"))+`
`+t.LINE(`${e("profile.member",{user:c.split("@")[0]})}
`)+t.BTM,mentions:[c]},{quoted:o})}catch{s(e("profile.error"))}}),u({name:e("bio.name"),classe:"fun",react:"\u{1F4D6}",desc:e("bio.desc")},async(r,i,{repondre:s,mr:a,auteur_Msg_Repondu:n,auteur_Message:l})=>{const o=a&&a[0]||n||l;try{const c=await i.fetchStatus(o);s(t.TOP(e("bio.title"))+`
`+t.LINE(`@${o.split("@")[0]}
`)+t.INTER()+`
`+t.LINE(`${c?.status||e("bio.no_status")}
`)+t.BTM)}catch{s(e("bio.error"))}}),u({name:e("uptime.name"),alias:["upt","runtime"],classe:"outils",react:"\u23F1\uFE0F",desc:e("uptime.desc")},async(r,i,{repondre:s})=>{const a=$(process.uptime());s(t.TOP(e("uptime.title"))+`
`+t.LINE(`${e("uptime.msg",{up:a})}
`)+t.BTM)}),u({name:e("del.name"),alias:["delete","supp","supprimer"],classe:"outils",react:"\u{1F5D1}\uFE0F",desc:e("del.desc")},async(r,i,{repondre:s,ms:a,premium_id:n})=>{if(!n)return s(e("del.no_owner"));const l=a.message?.extendedTextMessage?.contextInfo;if(!l?.stanzaId)return s(e("del.no_quoted"));try{await i.sendMessage(r,{delete:{remoteJid:r,id:l.stanzaId,participant:l.participant,fromMe:!1}})}catch{s(e("misc.error"))}}),u({name:e("poll.name"),alias:["sondage"],classe:"groupe",react:"\u{1F4CA}",desc:e("poll.desc")},async(r,i,{repondre:s,arg:a,prefixe:n})=>{const l=a.join(" ");if(!l||!l.includes("|"))return s(t.TOP(e("poll.title"))+`
`+t.LINE(`${e("poll.usage",{prefixe:n})}
`)+t.BTM);const o=l.split("|").map(m=>m.trim()),c=o[0],d=o.slice(1);if(d.length<2)return s(t.TOP(e("poll.title"))+`
`+t.LINE(`${e("poll.min_options")}
`)+t.BTM);try{await i.sendMessage(r,{poll:{name:c,values:d,selectableCount:1}})}catch{s(e("misc.error"))}});async function I(r,i,{ms:s,repondre:a,auteur_Message:n,msg_Repondu:l},o=!1){if(!l)return a(e("vv.no_quoted"));let c=l;c.ephemeralMessage&&(c=c.ephemeralMessage.message),c.documentWithCaptionMessage&&(c=c.documentWithCaptionMessage.message);const d=Object.keys(c).find(g=>g.startsWith("viewOnce"));d&&(c=c[d].message||c[d]);const m=Object.keys(c).find(g=>["imageMessage","videoMessage","audioMessage"].includes(g));if(!m)return a(e("vv.invalid"));const f=c[m];if(!d&&f.viewOnce!==!0)return a(e("vv.not_vo"));try{const g=await b(f,m.replace("Message","")),T=[];for await(const N of g)T.push(N);const w=Buffer.concat(T),p=o?n:r,y={caption:f.caption||""};return m==="imageMessage"?y.image=w:m==="videoMessage"?y.video=w:m==="audioMessage"&&(y.audio=w,y.mimetype="audio/ogg; codecs=opus",y.ptt=!1),await i.sendMessage(p,y,{quoted:s})}catch{a(e("misc.error"))}}u({name:"vv",classe:"fun",desc:e("vv.desc")},async(r,i,s)=>{await I(r,i,s,!1)}),u({name:e("vv2.name")||"vv2",classe:"fun",desc:e("vv2.desc")},async(r,i,s)=>{const a=(L.OWNER||"").split(",")[0].replace(/\D/g,""),n=a?`${a}@s.whatsapp.net`:_(i.user.id);await I(n,i,s,!1)}),u({name:e("horoscope.name"),classe:"fun",react:"\u{1F52E}",desc:e("horoscope.desc")},async(r,i,s)=>{const{arg:a,repondre:n}=s;if(!a[0])return n(e("horoscope.invalid"));const l=a[0].toLowerCase().replace("b\xE9lier","belier").replace("g\xE9meaux","gemeaux");try{const{data:o}=await h.get("https://kayoo123.github.io/astroo-api/jour.json");if(!o[l])return n(e("horoscope.invalid"));let c=t.TOP(e("horoscope.title"))+`
`+t.LINE(`${e("horoscope.date",{date:o.date})}
`)+t.INTER()+`
`+t.LINE(`${e("horoscope.msg",{text:o[l]})}
`)+t.BTM;n(c)}catch{n(e("horoscope.error"))}}),u({name:e("citation.name"),classe:"fun",react:"\u{1F4DC}",desc:e("citation.desc")},async(r,i,s)=>{const{repondre:a}=s;try{const{data:n}=await h.get("https://api.quotable.io/random");let l=t.TOP(e("citation.title"))+`
`+t.LINE(`${e("citation.text",{content:n.content})}
`)+t.INTER()+`
`+t.LINE(`${e("citation.author",{author:n.author})}
`)+t.BTM;a(l)}catch{a(e("citation.error"))}}),u({name:e("top.name"),classe:"fun",react:"\u{1F3C6}",desc:e("top.desc")},async(r,i,s)=>{const{repondre:a,arg:n,mbre_membre:l,verif_Gp:o,ms:c}=s;if(!o)return a(e("top.error_gp"));const d=n.join(" ");if(!d)return a("Veuillez pr\xE9ciser un sujet.");let m=[...l];for(let p=m.length-1;p>0;p--){const v=Math.floor(Math.random()*(p+1));[m[p],m[v]]=[m[v],m[p]]}const f=Math.min(3,m.length);if(f===0)return a(e("top.empty"));let g=[],T=t.TOP(e("top.title",{sujet:d}))+`
`+t.INTER()+`
`;const w=["\u{1F947}","\u{1F948}","\u{1F949}"];for(let p=0;p<f;p++){const v=m[p].id;g.push(v),T+=t.LINE(`${w[p]} - @${v.split("@")[0]}
`)}await i.sendMessage(r,{text:T+t.BTM,mentions:g},{quoted:c})}),u({name:e("blague.name"),alias:["joke"],classe:"fun",react:"\u{1F92A}",desc:e("blague.desc")},async(r,i,{repondre:s})=>{try{const{data:a}=await h.get("https://v2.jokeapi.dev/joke/Any?type=single");let n=t.TOP(e("blague.title"))+`
`;a.type==="single"?n+=t.LINE(`${e("blague.single",{joke:a.joke})}
`):n+=t.LINE(`${e("blague.twopart",{setup:a.setup,delivery:a.delivery})}
`),s(n+t.BTM)}catch{s(e("misc.error"))}}),u({name:e("anicit.name"),alias:["animequote","aniquote"],classe:"fun",react:"\u{1F250}",desc:e("anicit.desc")},async(r,i,{repondre:s})=>{try{const{data:a}=await h.get("https://animechan.io/api/v1/quotes/random");let n=t.TOP(e("anicit.title"))+`
`+t.LINE(`${e("anicit.content",{content:a.data.content})}
`)+t.LINE(`${e("anicit.character",{character:a.data.character})}
`)+t.LINE(`${e("anicit.anime",{anime:a.data.anime})}
`)+t.BTM+M;s(n)}catch{s(e("anicit.error"))}}),u({name:e("fait.name"),alias:["fact"],classe:"fun",react:"\u{1F914}",desc:e("fait.desc")},async(r,i,{repondre:s})=>{try{const{data:a}=await h.get("https://uselessfacts.jsph.pl/random.json?language=en"),n=await E(a.text);s(t.TOP(e("fait.title"))+`
`+t.LINE(`${e("fait.msg",{text:n})}
`)+t.BTM+M)}catch{s(e("fait.error"))}}),u({name:e("avis.name"),classe:"fun",react:"\u{1F9E0}",desc:e("avis.desc")},async(r,i,{repondre:s,arg:a})=>{if(!a[0])return s(e("avis.usage"));const n=e("avis.responses"),l=n[Math.floor(Math.random()*n.length)];let o=t.TOP(e("avis.title"))+`
`+t.LINE(`${e("avis.question",{question:a.join(" ")})}
`)+t.INTER()+`
`+t.LINE(`${e("avis.answer",{answer:l})}
`)+t.BTM+M;s(o)}),u({name:e("humeur.name"),classe:"fun",react:"\u{1F3AD}",desc:e("humeur.desc")},async(r,i,{repondre:s})=>{const a=e("humeur.moods"),n=a[Math.floor(Math.random()*a.length)];s(t.TOP(e("humeur.title"))+`
`+t.LINE(`${e("humeur.msg",{mood:n})}
`)+t.BTM+M)}),u({name:e("conseil.name"),alias:["advice"],classe:"fun",react:"\u{1F4A1}",desc:e("conseil.desc")},async(r,i,{repondre:s})=>{try{const{data:a}=await h.get("https://api.adviceslip.com/advice"),n=await E(a.slip.advice);s(t.TOP(e("conseil.title"))+`
`+t.LINE(`${e("conseil.msg",{text:n})}
`)+t.BTM+M)}catch{s(e("conseil.error"))}}),u({name:e("insta.name"),alias:["ig","instagram"],classe:"fun",react:"\u{1F4F8}",desc:e("insta.desc")},async(r,i,{arg:s,repondre:a,ms:n})=>{if(!s[0])return a("Veuillez fournir un nom d'utilisateur Instagram.");try{const{data:l}=await h.get(`https://api.siputzx.my.id/api/s/instagram?query=${s[0]}`);if(!l.status||!l.result)return a(e("insta.not_found"));const o=l.result;let c=t.TOP(e("insta.title",{name:o.full_name||o.username}))+`
`+t.LINE(`${e("insta.username",{username:o.username})}
`)+t.LINE(`${e("insta.bio",{bio:o.biography||"N/A"})}
`)+t.LINE(`${e("insta.followers",{followers:o.followers})}
`)+t.LINE(`${e("insta.following",{following:o.following})}
`)+t.LINE(`${e("insta.posts",{posts_count:o.posts_count})}
`)+t.LINE(`${e("insta.link",{username:o.username})}
`)+t.BTM+M;await i.sendMessage(r,{image:{url:o.profile_pic_url_hd||o.profile_pic_url},caption:c},{quoted:n})}catch{a(e("insta.error"))}}),u({name:"fake",classe:"fun",react:"\u{1F3AD}",desc:"Envoie un message en citant une fausse r\xE9ponse de quelqu'un."},async(r,i,{repondre:s,mr:a,arg:n})=>{if(!a||a.length===0)return s("\u274C Veuillez mentionner un utilisateur en utilisant @.");const l=a[0],c=n.join(" ").split("/");if(c.length<2)return s("\u274C Utilisation correcte : .fake @cible message_cible / votre_reponse");const d=c[0].replace(/@\d+/g,"").trim(),m=c.slice(1).join("/").trim();if(!d||!m)return s("\u274C Le message de la cible et votre r\xE9ponse ne peuvent pas \xEAtre vides.");const f={key:{remoteJid:r,fromMe:!1,id:"FAKE"+Math.random().toString(36).substring(2,10).toUpperCase(),participant:l},message:{conversation:d}};await s({text:m,quoted:f})});
