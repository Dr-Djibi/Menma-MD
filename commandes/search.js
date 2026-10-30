import{menmacmd as g}from"../lib/menmacmd.js";import d from"axios";import h from"yt-search";import t from"../lib/styleHelper.js";import{trd as e}from"../lib/i18n.js";import E from"../config.js";import{googleSearch as N,googleImage as I,wikiScrape as y}from"../lib/fonctions.js";const u=t.GENERATED_BY;g({name:e("wiki.name"),classe:"Search",react:"\u{1F4D6}",desc:e("wiki.desc")},async(c,r,{arg:s,repondre:i,ms:o})=>{if(!s[0])return i(e("wiki.usage"));const a=s.join(" ");try{const n=await y(a,E.LANG||"fr");if(!n)return i(e("wiki.not_found"));let m=t.TOP(e("wiki.title"))+`
`+t.LINE(`\u{1F4D6} *Sujet :* ${n.title}
`)+t.INTER()+`
`+t.LINE(`\u{1F4DD} *R\xE9sum\xE9 :*
`)+t.INTER()+`
> ${n.extract}
`+t.INTER()+`
`+t.LINE(`\u{1F517} *Lien :* ${n.link}
`)+t.BTM+u;n.thumbnail?await r.sendMessage(c,{image:{url:n.thumbnail},caption:m},{quoted:o}):i(m)}catch{i(e("wiki.not_found"))}}),g({name:e("github_cmd.name"),classe:"Search",react:"\u{1F419}",desc:e("github_cmd.desc")},async(c,r,{arg:s,repondre:i,ms:o})=>{if(!s[0])return i(e("github_cmd.usage"));try{const{data:a}=await d.get(`https://api.github.com/users/${s[0]}`);let n=t.TOP(e("github_cmd.title"))+`
`+t.LINE(`\u{1F464} *Nom :* ${a.name||a.login}
`)+t.LINE(`${e("github_cmd.bio",{bio:a.bio||e("github_cmd.no_bio")})}
`)+t.LINE(`${e("github_cmd.location",{location:a.location||e("github_cmd.no_loc")})}
`)+t.LINE(`\u{1F465} *Followers :* ${a.followers}
`)+t.LINE(`\u{1F464} *Following :* ${a.following}
`)+t.LINE(`\u{1F4E6} *Repos :* ${a.public_repos}
`)+t.INTER()+`
`+t.LINE(`\u{1F517} *Lien :* ${a.html_url}
`)+t.BTM+u;await r.sendMessage(c,{image:{url:a.avatar_url},caption:n},{quoted:o})}catch{i(e("github_cmd.not_found"))}}),g({name:e("imdb.name"),classe:"Search",react:"\u{1F3AC}",desc:e("imdb.desc")},async(c,r,{arg:s,repondre:i,ms:o})=>{if(!s[0])return i(e("imdb.usage"));try{const{data:a}=await d.get(`http://www.omdbapi.com/?t=${encodeURIComponent(s.join(" "))}&apikey=6a451596`);if(a.Response==="False")return i(e("imdb.error"));let n=t.TOP(e("imdb.title"))+`
`+t.LINE(`\u{1F3AC} *Titre :* ${a.Title}
`)+t.LINE(`\u{1F4C5} *Ann\xE9e :* ${a.Year}
`)+t.LINE(`\u2B50 *Note :* ${a.imdbRating}
`)+t.LINE(`\u{1F3AD} *Genre :* ${a.Genre}
`)+t.LINE(`\u{1F464} *R\xE9alisateur :* ${a.Director}
`)+t.INTER()+`
`+t.LINE(`\u{1F4DD} *Intrigue :*
`)+t.INTER()+`
> ${a.Plot}
`+t.INTER()+`
`+t.BTM+u;a.Poster&&a.Poster!=="N/A"?await r.sendMessage(c,{image:{url:a.Poster},caption:n},{quoted:o}):i(n)}catch{i(e("imdb.error"))}}),g({name:"pinsearch",alias:["pinterestsearch"],classe:"Search",react:"\u{1F4CC}",desc:e("pinterest.desc")},async(c,r,{arg:s,repondre:i,ms:o})=>{if(!s[0])return i(e("pinterest.usage"));const a=s.join(" ");try{const{data:n}=await d.get(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(a)}`);if(!n.status||!n.result||n.result.length===0)return i(e("pinterest.not_found"));const m=n.result.slice(0,5);for(const l of m)await r.sendMessage(c,{image:{url:l},caption:e("pinterest.caption",{query:a})+u},{quoted:o})}catch{i(e("pinterest.error"))}}),g({name:e("google.name"),alias:["search","g","ddg"],classe:"Search",react:"\u{1F50D}",desc:e("google.desc")},async(c,r,{arg:s,repondre:i})=>{if(!s[0])return i(e("google.usage"));try{const o=s.join(" "),a=await N(o);if(a.length===0)return i(e("google.not_found"));let n=t.TOP(e("google.title"))+`
`;a.forEach((m,l)=>{n+=`> ${l+1}. *${m.title}*
   \u{1F517} ${m.link}
`,l<a.length-1&&(n+=t.INTER()+`
`)}),i(n+t.BTM+u)}catch{i(e("google.error"))}}),g({name:e("img.name"),alias:["image"],classe:"Search",react:"\u{1F5BC}\uFE0F",desc:e("img.desc")},async(c,r,{arg:s,repondre:i,ms:o})=>{if(!s[0])return i(e("img.usage"));try{const a=s.join(" "),n=await I(a);if(n.length===0)return i(e("img.not_found"));const m=n.map(async l=>{try{await r.sendMessage(c,{image:{url:l}},{quoted:o})}catch{const f=await getBuffer(l);f&&await r.sendMessage(c,{image:f},{quoted:o})}});await Promise.all(m)}catch{i(e("img.error"))}}),g({name:e("anime.name"),classe:"Search",react:"\u26E9\uFE0F",desc:e("anime.desc")},async(c,r,{arg:s,repondre:i,ms:o})=>{if(!s[0])return i(e("anime.usage"));try{const{data:a}=await d.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(s.join(" "))}&limit=1`),n=a.data[0];if(!n)return i(e("anime.not_found"));let m=t.TOP(e("anime.title"))+`
`+t.LINE(`\u26E9\uFE0F *Titre :* ${n.title}
`)+t.LINE(`\u{1F4CA} *Score :* ${n.score||"N/A"}
`)+t.LINE(`\u{1F4FA} *Type :* ${n.type}
`)+t.LINE(`\u{1F4C5} *Statut :* ${n.status}
`)+t.LINE(`\u{1F39E}\uFE0F *\xC9pisodes :* ${n.episodes||"?"}
`)+t.INTER()+`
`+t.LINE(`\u{1F4DD} *Synopsis :*
`)+t.INTER()+`
> ${n.synopsis?.slice(0,300)}...
`+t.INTER()+`
`+t.BTM+u;await r.sendMessage(c,{image:{url:n.images.jpg.image_url},caption:m},{quoted:o})}catch{i(e("anime.error"))}}),g({name:e("manga.name"),classe:"Search",react:"\u{1F4D6}",desc:e("manga.desc")},async(c,r,{arg:s,repondre:i,ms:o})=>{if(!s[0])return i(e("manga.usage"));try{const{data:a}=await d.get(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(s.join(" "))}&limit=1`),n=a.data[0];if(!n)return i(e("manga.not_found"));let m=t.TOP(e("manga.title"))+`
`+t.LINE(`\u{1F4D6} *Titre :* ${n.title}
`)+t.LINE(`\u{1F4CA} *Score :* ${n.score||"N/A"}
`)+t.LINE(`\u{1F4DA} *Chapitres :* ${n.chapters||"?"}
`)+t.LINE(`\u{1F4C5} *Statut :* ${n.status}
`)+t.INTER()+`
`+t.LINE(`\u{1F4DD} *Synopsis :*
`)+t.INTER()+`
> ${n.synopsis?.slice(0,300)}...
`+t.INTER()+`
`+t.BTM+u;await r.sendMessage(c,{image:{url:n.images.jpg.image_url},caption:m},{quoted:o})}catch{i(e("manga.error"))}}),g({name:e("yts.name"),alias:["ytsearch"],classe:"Search",react:"\u{1F4FA}",desc:e("yts.desc")},async(c,r,{arg:s,repondre:i})=>{if(!s[0])return i(e("yts.usage"));try{const o=await h(s.join(" ")),a=o.videos.slice(0,5);if(!a.length)return i(e("yts.not_found"));let n=t.TOP(e("yts.title"))+`
`;a.forEach((m,l)=>{n+=t.LINE(`${l+1}. *${m.title}*
`)+t.LINE(`   \u{1F552} ${m.timestamp} | \u{1F517} ${m.url}
`),l<a.length-1&&(n+=t.INTER()+`
`)}),i(n+t.BTM+u)}catch{i(e("yts.error"))}}),g({name:e("infos.name"),alias:["news","actu"],classe:"Search",react:"\u{1F4F0}",desc:e("infos.desc")},async(c,r,{repondre:s})=>{try{const{data:i}=await d.get("https://newsapi.org/v2/top-headlines?country=fr&apiKey=0632a4879de748309a96e1a47346b0a6");if(i.status!=="ok"||!i.articles.length)return s(e("infos.error"));let o=e("infos.title");for(let a=0;a<Math.min(5,i.articles.length);a++)o+=`\u{1F539} *${i.articles[a].title}*
\u{1F517} ${i.articles[a].url}

`;s(o+u)}catch{s(e("infos.error"))}});
