import{menmacmd as y,commands as N}from"../lib/menmacmd.js";import{runtime as x,fwdChannelContext as b}from"../lib/fonctions.js";import{getThemeUrl as R,buildThemeMedia as M,getDefaultThemeUrl as I}from"../lib/themeHelper.js";import w from"../config.js";import e from"../lib/styleHelper.js";import{trd as s}from"../lib/i18n.js";const A=w.DEV,q=w.NOM_BOT;y({name:s("menu.name"),alias:["m","commands"],classe:"outils",react:"\u{1F4D1}",desc:s("menu.desc")},async(i,c,E)=>{const{pseudo:T,prefixe:f,arg:m,ms:u}=E,C=c.config||w,p=x(process.uptime()),d=await R(),h=await M(d),t=b(C),n={};N.forEach(a=>{n[a.classe]||(n[a.classe]=[]),n[a.classe].push(a.name)});const l=Object.keys(n).sort((a,r)=>a.localeCompare(r,void 0,{sensitivity:"base"}));if(m[0]&&!isNaN(m[0])){const a=parseInt(m[0])-1;if(a>=0&&a<l.length){const r=l[a],$=s(`categories.${r}`)||r,B=n[r].sort();let g=e.TOP($.toUpperCase())+`
`;for(const O of B)g+=e.BRANCH(`${e.FANCY(O)}`)+`
`;g+=e.BTM+e.FOOTER;try{return await c.sendMessage(i,{...h,caption:g,contextInfo:t},{quoted:u})}catch{try{const L=await M(I());return await c.sendMessage(i,{...L,caption:g,contextInfo:t},{quoted:u})}catch{return await c.sendMessage(i,{text:g,contextInfo:t},{quoted:u})}}}}let o=e.TOP(q)+`
`;o+=e.LINE(`${s("menu.salut",{pseudo:e.FANCY(T)})}`)+`
`,o+=e.LINE(`${s("menu.uptime",{uptime:p})}`)+`
`,o+=e.LINE(`${s("menu.total",{count:N.length})}`)+`
`+e.INTER()+`
`,o+=e.LINE(`${s("menu.choose")}`)+`
`+e.INTER()+`
`,l.forEach((a,r)=>{const $=s(`categories.${a}`)||a;o+=e.BRANCH(`${r+1}- ${e.FANCY($.toUpperCase())}`)+`
`}),o+=e.INTER()+`
`,o+=e.LINE(`${s("menu.usage",{prefixe:f})}`)+`
`,o+=e.LINE(`${s("menu.usage2",{prefixe:f})}`)+`
`,o+=e.LINE(e.FANCY(`${s("menu.dev",{dev:A})}`))+`
`,o+=e.BTM+e.FOOTER;try{await c.sendMessage(i,{...h,caption:o,contextInfo:t},{quoted:u})}catch{try{const r=await M(I());await c.sendMessage(i,{...r,caption:o,contextInfo:t},{quoted:u})}catch{await c.sendMessage(i,{text:o,contextInfo:t},{quoted:u})}}}),y({name:s("allmenu.name")||"allmenu",alias:["menuall"],classe:"outils",react:"\u{1F4C1}",desc:s("menu.allmenu_desc")},async(i,c,E)=>{const{pseudo:T,ms:f}=E,m=c.config||w,u=await R(),C=await M(u),p=b(m),d={};N.forEach(n=>{d[n.classe]||(d[n.classe]=[]),d[n.classe].push(n.name)});const h=Object.keys(d).sort();let t=e.TOP(q)+`
`;t+=e.LINE(`${s("menu.salut",{pseudo:T})}`)+`
`,t+=e.LINE(`${s("menu.total",{count:N.length})}`)+`
`+e.BTM+`

`;for(const n of h){const l=s(`categories.${n}`)||n;t+=e.TOP(l.toUpperCase())+`
`;const o=d[n].sort();for(const a of o)t+=e.BRANCH(`${e.FANCY(a)}`)+`
`;t+=e.BTM+`

`}t+=e.FOOTER;try{await c.sendMessage(i,{...C,caption:t,contextInfo:p},{quoted:f})}catch{try{const l=await M(I());await c.sendMessage(i,{...l,caption:t,contextInfo:p},{quoted:f})}catch{await c.sendMessage(i,{text:t,contextInfo:p},{quoted:f})}}});
