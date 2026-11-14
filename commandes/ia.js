import{menmacmd as g}from"../lib/menmacmd.js";import p from"axios";import a from"../lib/styleHelper.js";import w from"@vitalets/google-translate-api";const d=a.GENERATED_BY,h="MenmaBot/1.0 (https://github.com/Dr-Djibi/Menma-MD)";async function y(l,m="Tu es un assistant IA serviable, pr\xE9cis et concis en fran\xE7ais."){try{const e=encodeURIComponent(l),s=encodeURIComponent(m),c=`https://text.pollinations.ai/${e}?system=${s}&model=openai`,o=await p.get(c,{timeout:15e3});if(o.data&&typeof o.data=="string"&&!o.data.includes("Free limit reached"))return o.data.trim()}catch{}return null}g({name:"gpt",alias:["chatgpt","ask","ia2","ai2"],classe:"IA",react:"\u{1F9E0}",desc:"Poser une question rapide \xE0 l'intelligence artificielle sans historique."},async(l,m,{repondre:e,arg:s,prefixe:c,ms:o})=>{if(!s[0])return e(`\u2753 *Que veux-tu savoir ?*

Usage : \`${c}gpt Quelle est la distance Terre-Lune ?\``);const r=s.join(" ");await e("\u{1F4AD} *R\xE9flexion de l'IA en cours...*");try{const i=await y(r);if(i){let t=a.TOP("\u{1F916} R\xC9PONSE IA")+`
`;return t+=a.LINE(`*Q :* ${r}

`),t+=a.INTER()+`
`,t+=`${i}

`,t+=a.BTM+d,await e(t)}const n=(await p.get("https://fr.wikipedia.org/w/api.php",{params:{action:"query",list:"search",srsearch:r,format:"json"},headers:{"User-Agent":h},timeout:6e3})).data?.query?.search?.[0]?.title;if(n){const t=await p.get(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(n)}`,{headers:{"User-Agent":h},timeout:6e3});if(t.data?.extract){let f=a.TOP(`\u{1F4DA} ENCYCLOP\xC9DIE : ${n.toUpperCase()}`)+`
`;return f+=`${t.data.extract}

`,f+=a.BTM+d,await e(f)}}return e("\u26A0\uFE0F L'IA est temporairement occup\xE9e. R\xE9essayez dans quelques instants.")}catch(i){e(`\u274C Erreur IA : ${i.message}`)}}),g({name:"codeai",alias:["code","dev","coder"],classe:"IA",react:"\u{1F4BB}",desc:"G\xE9n\xE9rer ou expliquer un extrait de code informatique."},async(l,m,{repondre:e,arg:s,prefixe:c})=>{if(!s[0])return e(`\u{1F4BB} *Que veux-tu programmer ?*

Usage : \`${c}codeai fonction python pour trier une liste\``);const o=s.join(" ");await e("\u2699\uFE0F *G\xE9n\xE9ration du code par l'IA...*");try{const i=await y(o,"Tu es un expert d\xE9veloppeur senior. R\xE9ponds directement en fournissant le code propre, comment\xE9 et optimis\xE9.");if(i){let u=a.TOP("\u{1F4BB} CODE G\xC9N\xC9R\xC9")+`
`;return u+=`${i}

`,u+=a.BTM+d,await e(u)}e("\u26A0\uFE0F Service de g\xE9n\xE9ration de code temporairement surcharg\xE9. R\xE9essayez dans 30 secondes.")}catch(r){e(`\u274C Erreur : ${r.message}`)}}),g({name:"tradai",alias:["trad","translate","traduire"],classe:"IA",react:"\u{1F310}",desc:"Traduire automatiquement un texte dans la langue de votre choix."},async(l,m,{repondre:e,arg:s,prefixe:c,msg_Repondu:o,text_Msg_Repondu:r})=>{let i="fr",u="";if(s.length>=2&&s[0].length<=3)i=s[0].toLowerCase(),u=s.slice(1).join(" ");else if(s.length>=1)u=s.join(" ");else if(o&&r)u=r;else return e(`\u{1F310} *Comment utiliser le traducteur :*

\`${c}tradai en Bonjour tout le monde\`
\`${c}tradai es Comment vas-tu ?\`
Ou r\xE9pondez \xE0 un message avec \`${c}tradai en\``);try{const n=await w(u,{to:i});let t=a.TOP("\u{1F310} TRADUCTION INTELLIGENTE")+`
`;t+=a.LINE(`Origine [${n.from.language.iso.toUpperCase()}] : _${u}_
`),t+=a.LINE(`Cible [${i.toUpperCase()}] : *${n.text}*
`),t+=a.BTM+d,await e(t)}catch(n){e(`\u274C Erreur de traduction : ${n.message}`)}}),g({name:"imagine",alias:["aiart","draw","dalle","genimg"],classe:"IA",react:"\u{1F3A8}",desc:"G\xE9n\xE9rer une image par intelligence artificielle \xE0 partir d'une description."},async(l,m,{repondre:e,arg:s,prefixe:c,ms:o})=>{if(!s[0])return e(`\u{1F3A8} *Que souhaites-tu cr\xE9er ?*

Usage : \`${c}imagine a futuristic cyberpunk city with neon lights, 4k digital art\``);const r=s.join(" ");await e(`\u{1F3A8} *Cr\xE9ation de votre chef-d'\u0153uvre par l'IA en cours pour : "${r}"...*`);try{const u=`https://image.pollinations.ai/prompt/${encodeURIComponent(r)}?width=512&height=512&nologo=true`,n=await p.get(u,{responseType:"arraybuffer",timeout:25e3});await m.sendMessage(l,{image:Buffer.from(n.data),caption:a.TOP("\u{1F3A8} ART G\xC9N\xC9R\xC9 PAR IA")+`
`+a.LINE(`Prompt : *${r}*
`)+a.BTM+d},{quoted:o})}catch(i){e(`\u274C Erreur lors de la g\xE9n\xE9ration d'image : ${i.message}`)}}),g({name:"wiki",alias:["wikipedia","savoir","encyclo"],classe:"IA",react:"\u{1F4D6}",desc:"Rechercher une d\xE9finition ou un r\xE9sum\xE9 encyclop\xE9dique imm\xE9diat."},async(l,m,{repondre:e,arg:s,prefixe:c})=>{if(!s[0])return e(`\u{1F4D6} *Quel sujet voulez-vous explorer ?*

Usage : \`${c}wiki Trou noir\``);const o=s.join(" ");try{const i=(await p.get("https://fr.wikipedia.org/w/api.php",{params:{action:"query",list:"search",srsearch:o,format:"json"},headers:{"User-Agent":h},timeout:7e3})).data?.query?.search?.[0]?.title;if(!i)return e(`\u274C Aucun r\xE9sultat trouv\xE9 pour "*${o}*".`);const n=(await p.get(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(i)}`,{headers:{"User-Agent":h},timeout:7e3})).data;let t=a.TOP(`\u{1F4D6} ${n.title.toUpperCase()}`)+`
`;n.description&&(t+=a.LINE(`\u{1F4CC} _${n.description}_
`),t+=a.INTER()+`
`),t+=`${n.extract||"Pas de r\xE9sum\xE9 disponible."}

`,n.content_urls?.desktop?.page&&(t+=a.LINE(`\u{1F517} En savoir plus : ${n.content_urls.desktop.page}
`)),t+=a.BTM+d,n.thumbnail?.source?await m.sendMessage(l,{image:{url:n.thumbnail.source},caption:t}):await e(t)}catch(r){e(`\u274C Erreur recherche wiki : ${r.message}`)}});
