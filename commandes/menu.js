import{menmacmd as I,commands as N}from"../lib/menmacmd.js";import{runtime as y,fwdChannelContext as O}from"../lib/fonctions.js";import{getThemeUrl as w,buildThemeMedia as L}from"../lib/themeHelper.js";import E from"../config.js";import e from"../lib/styleHelper.js";import{trd as s}from"../lib/i18n.js";const A=E.DEV,R=E.NOM_BOT;I({name:s("menu.name"),alias:["m","commands"],classe:"outils",react:"\u{1F4D1}",desc:s("menu.desc")},async(u,c,h)=>{const{pseudo:C,prefixe:m,arg:l,ms:d}=h,T=c.config||E,p=y(process.uptime()),i=await w(),g=await L(i),a=O(T),n={};N.forEach(t=>{n[t.classe]||(n[t.classe]=[]),n[t.classe].push(t.name)});const f=Object.keys(n).sort((t,r)=>t.localeCompare(r,void 0,{sensitivity:"base"}));if(l[0]&&!isNaN(l[0])){const t=parseInt(l[0])-1;if(t>=0&&t<f.length){const r=f[t],M=s(`categories.${r}`)||r,B=n[r].sort();let $=e.TOP(M.toUpperCase())+`
`;for(const b of B)$+=e.BRANCH(`${e.FANCY(b)}`)+`
`;return $+=e.BTM+e.FOOTER,await c.sendMessage(u,{...g,caption:$,contextInfo:a},{quoted:d})}}let o=e.TOP(R)+`
`;o+=e.LINE(`${s("menu.salut",{pseudo:e.FANCY(C)})}`)+`
`,o+=e.LINE(`${s("menu.uptime",{uptime:p})}`)+`
`,o+=e.LINE(`${s("menu.total",{count:N.length})}`)+`
`+e.INTER()+`
`,o+=e.LINE(`${s("menu.choose")}`)+`
`+e.INTER()+`
`,f.forEach((t,r)=>{const M=s(`categories.${t}`)||t;o+=e.BRANCH(`${r+1}- ${e.FANCY(M.toUpperCase())}`)+`
`}),o+=e.INTER()+`
`,o+=e.LINE(`${s("menu.usage",{prefixe:m})}`)+`
`,o+=e.LINE(`${s("menu.usage2",{prefixe:m})}`)+`
`,o+=e.LINE(e.FANCY(`${s("menu.dev",{dev:A})}`))+`
`,o+=e.BTM+e.FOOTER;try{await c.sendMessage(u,{...g,caption:o,contextInfo:a},{quoted:d})}catch{await c.sendMessage(u,{text:o,contextInfo:a},{quoted:d})}}),I({name:s("allmenu.name")||"allmenu",alias:["menuall"],classe:"outils",react:"\u{1F4C1}",desc:s("menu.allmenu_desc")},async(u,c,h)=>{const{pseudo:C,ms:m}=h,l=c.config||E,d=await w(),T=await L(d),p=O(l),i={};N.forEach(n=>{i[n.classe]||(i[n.classe]=[]),i[n.classe].push(n.name)});const g=Object.keys(i).sort();let a=e.TOP(R)+`
`;a+=e.LINE(`${s("menu.salut",{pseudo:C})}`)+`
`,a+=e.LINE(`${s("menu.total",{count:N.length})}`)+`
`+e.BTM+`

`;for(const n of g){const f=s(`categories.${n}`)||n;a+=e.TOP(f.toUpperCase())+`
`;const o=i[n].sort();for(const t of o)a+=e.BRANCH(`${e.FANCY(t)}`)+`
`;a+=e.BTM+`

`}a+=e.FOOTER;try{await c.sendMessage(u,{...T,caption:a,contextInfo:p},{quoted:m})}catch{await c.sendMessage(u,{text:a,contextInfo:p},{quoted:m})}});
