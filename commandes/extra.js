import{menmacmd as u}from"../lib/menmacmd.js";import y from"axios";import t from"../lib/styleHelper.js";import{trd as s}from"../lib/i18n.js";const m=t.GENERATED_BY;u({name:s("lyric.name"),alias:["paroles","lyrics"],classe:"Extra",react:"\u{1F3B6}",desc:s("lyric.desc")},async(l,o,{arg:a,repondre:e,ms:r})=>{if(!a[0])return e(s("lyric.usage"));const n=a.join(" ");try{const{data:c}=await y.get(`https://api.siputzx.my.id/api/tools/lyrics?query=${encodeURIComponent(n)}`);if(!c.status||!c.result)return e(s("lyric.not_found"));let i=t.TOP("LYRICS")+`
`+t.LINE(`\u{1F3B6} *Titre :* ${c.result.title}
`)+t.LINE(`\u{1F464} *Artiste :* ${c.result.artist}
`)+t.INTER()+`
`+t.LINE(`\u{1F4DC} *Paroles :*
`)+t.INTER()+`
> ${c.result.lyrics}
`+t.INTER()+`
`+t.BTM+m;await o.sendMessage(l,{image:{url:c.result.image},caption:i},{quoted:r})}catch{e(s("lyric.error"))}}),u({name:s("ss.name"),alias:["screenshot","webss"],classe:"Extra",react:"\u{1F4F8}",desc:s("ss.desc")},async(l,o,{arg:a,repondre:e,ms:r})=>{if(!a[0])return e(s("ss.usage"));let n=a[0];n.startsWith("http")||(n="https://"+n);try{const c=`https://api.siputzx.my.id/api/tools/ssweb?url=${encodeURIComponent(n)}`;let i=t.TOP("SCREENSHOT")+`
`+t.LINE(`\u{1F4F8} Capture de : ${n}
`)+t.BTM+m;await o.sendMessage(l,{image:{url:c},caption:i},{quoted:r})}catch{e(t.TOP("\u274C ERREUR")+`
`+t.LINE(`${s("ss.error")}
`)+t.BTM)}}),u({name:s("short.name"),alias:["shorten","tinyurl"],classe:"Extra",react:"\u{1F517}",desc:s("short.desc")},async(l,o,{arg:a,repondre:e})=>{if(!a[0])return e(s("short.usage"));try{const{data:r}=await y.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(a[0])}`);let n=t.TOP("SHORT URL")+`
`+t.LINE(`\u{1F517} *Lien r\xE9duit :*
`)+t.LINE(`${r}
`)+t.BTM+m;e(n)}catch{e(s("short.error"))}}),u({name:s("calculate.name"),alias:["calc","cal"],classe:"Extra",react:"\u{1F522}",desc:s("calculate.desc")},async(l,o,{arg:a,repondre:e,prefixe:r})=>{if(!a[0])return e(s("calculate.usage",{prefixe:r}));const n=a.join(" ");if(!/^[0-9+\-*/().\s]+$/.test(n))return e(s("calculate.invalid"));try{const c=Function('"use strict";return ('+n+")")();let i=t.TOP("\u{1F9EE} CALCULATRICE")+`
`+t.LINE(`*Expression :* ${n}
`)+t.INTER()+`
`+t.LINE(`*R\xE9sultat :* ${c}
`)+t.BTM+m;e(i)}catch{e(s("calculate.error"))}}),u({name:s("devise.name"),alias:["convert","currency"],classe:"Extra",react:"\u{1F4B1}",desc:s("devise.desc")},async(l,o,{arg:a,repondre:e,prefixe:r})=>{if(a.length<3)return e(s("devise.usage",{prefixe:r}));const n=a[0],c=a[1].toUpperCase(),i=a[2].toUpperCase();try{const{data:T}=await y.get(`https://api.exchangerate-api.com/v4/latest/${c}`),E=T.rates[i];if(!E)return e(s("devise.not_found"));const d=(n*E).toFixed(2);let p=t.TOP("DEVISE")+`
`+t.LINE(`\u{1F4B5} *Montant :* ${n} ${c}
`)+t.INTER()+`
`+t.LINE(`\u{1F4B6} *R\xE9sultat :* ${d} ${i}
`)+t.LINE(`\u{1F4C8} *Taux :* ${E}
`)+t.BTM+m;e(p)}catch{e(s("devise.error"))}});
