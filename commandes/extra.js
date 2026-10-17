import{menmacmd as E}from"../lib/menmacmd.js";import p from"axios";import e from"../lib/styleHelper.js";import{trd as a}from"../lib/i18n.js";const h=e.GENERATED_BY;E({name:a("lyric.name"),alias:["paroles","lyrics"],classe:"Extra",react:"\u{1F3B6}",desc:a("lyric.desc")},async(m,s,{arg:t,repondre:r,ms:l})=>{if(!t[0])return r(a("lyric.usage"));const i=t.join(" ");try{const{data:o}=await p.get(`https://api.siputzx.my.id/api/tools/lyrics?query=${encodeURIComponent(i)}`);if(!o.status||!o.result)return r(a("lyric.not_found"));let n=e.TOP("LYRICS")+`
`+e.LINE(`\u{1F3B6} *Titre :* ${o.result.title}
`)+e.LINE(`\u{1F464} *Artiste :* ${o.result.artist}
`)+e.INTER()+`
`+e.LINE(`\u{1F4DC} *Paroles :*
`)+e.INTER()+`
> ${o.result.lyrics}
`+e.INTER()+`
`+e.BTM+h;await s.sendMessage(m,{image:{url:o.result.image},caption:n},{quoted:l})}catch{r(a("lyric.error"))}}),E({name:a("ss.name"),alias:["screenshot","webss"],classe:"Extra",react:"\u{1F4F8}",desc:a("ss.desc")},async(m,s,{arg:t,repondre:r,ms:l})=>{if(!t[0])return r(a("ss.usage"));let i=t[0];i.startsWith("http")||(i="https://"+i);try{const o=`https://api.siputzx.my.id/api/tools/ssweb?url=${encodeURIComponent(i)}`;let n=e.TOP("SCREENSHOT")+`
`+e.LINE(`\u{1F4F8} Capture de : ${i}
`)+e.BTM+h;await s.sendMessage(m,{image:{url:o},caption:n},{quoted:l})}catch{r(e.TOP("\u274C ERREUR")+`
`+e.LINE(`${a("ss.error")}
`)+e.BTM)}}),E({name:a("short.name"),alias:["shorten","tinyurl"],classe:"Extra",react:"\u{1F517}",desc:a("short.desc")},async(m,s,{arg:t,repondre:r})=>{if(!t[0])return r(a("short.usage"));try{const{data:l}=await p.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(t[0])}`);let i=e.TOP("SHORT URL")+`
`+e.LINE(`\u{1F517} *Lien r\xE9duit :*
`)+e.LINE(`${l}
`)+e.BTM+h;r(i)}catch{r(a("short.error"))}});function g(m){const s=m.match(/\d+(\.\d+)?|[+\-*/%^()]/g);if(!s||s.join("")!==m.replace(/\s+/g,""))throw new Error("Invalid tokens");let t=0;function r(){let n=l();for(;t<s.length&&(s[t]==="+"||s[t]==="-");){const u=s[t++],c=l();u==="+"?n+=c:n-=c}return n}function l(){let n=i();for(;t<s.length&&(s[t]==="*"||s[t]==="/"||s[t]==="%");){const u=s[t++],c=i();if(u==="*")n*=c;else if(u==="/"){if(c===0)throw new Error("Division by zero");n/=c}else u==="%"&&(n%=c)}return n}function i(){if(t>=s.length)throw new Error("Unexpected end of expression");let n=s[t++];if(n==="-")return-i();if(n==="+")return i();if(n==="("){let c=r();if(t>=s.length||s[t++]!==")")throw new Error("Missing closing parenthesis");return c}const u=parseFloat(n);if(isNaN(u))throw new Error("Invalid number: "+n);if(t<s.length&&s[t]==="^"){t++;const c=i();return Math.pow(u,c)}return u}const o=r();if(t<s.length)throw new Error("Unexpected token: "+s[t]);return o}E({name:a("calculate.name"),alias:["calc","cal"],classe:"Extra",react:"\u{1F522}",desc:a("calculate.desc")},async(m,s,{arg:t,repondre:r,prefixe:l})=>{if(!t[0])return r(a("calculate.usage",{prefixe:l}));const i=t.join(" ");try{const o=g(i);let n=e.TOP("\u{1F9EE} CALCULATRICE")+`
`+e.LINE(`*Expression :* ${i}
`)+e.INTER()+`
`+e.LINE(`*R\xE9sultat :* ${o}
`)+e.BTM+h;r(n)}catch{r(a("calculate.error"))}}),E({name:a("devise.name"),alias:["convert","currency"],classe:"Extra",react:"\u{1F4B1}",desc:a("devise.desc")},async(m,s,{arg:t,repondre:r,prefixe:l})=>{if(t.length<3)return r(a("devise.usage",{prefixe:l}));const i=t[0],o=t[1].toUpperCase(),n=t[2].toUpperCase();try{const{data:u}=await p.get(`https://api.exchangerate-api.com/v4/latest/${o}`),c=u.rates[n];if(!c)return r(a("devise.not_found"));const f=(i*c).toFixed(2);let d=e.TOP("DEVISE")+`
`+e.LINE(`\u{1F4B5} *Montant :* ${i} ${o}
`)+e.INTER()+`
`+e.LINE(`\u{1F4B6} *R\xE9sultat :* ${f} ${n}
`)+e.LINE(`\u{1F4C8} *Taux :* ${c}
`)+e.BTM+h;r(d)}catch{r(a("devise.error"))}});
