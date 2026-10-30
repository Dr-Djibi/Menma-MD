import{menmacmd as E}from"../lib/menmacmd.js";import"os";import c from"../config.js";import{runtime as $,fwdChannelContext as u}from"../lib/fonctions.js";import{getThemeUrl as I,buildThemeMedia as N}from"../lib/themeHelper.js";import e from"../lib/styleHelper.js";import{trd as t}from"../lib/i18n.js";const L=c.NOM_BOT,v=c.DEV,g=c.VERSION;E({name:t("test_cmd.name"),classe:"outils",react:"\u{1F50B}",desc:t("test_cmd.desc")},async(i,o,r)=>{const{pseudo:l,repondre:d,prefixe:a}=r,m=o.config||c,n=$(process.uptime()),p=(process.memoryUsage().heapUsed/1024/1024).toFixed(2),f=u(m);let s=e.TOP(`${L}`)+`
`;s+=e.LINE(`${t("test_cmd.label_user")} : ${l}
`),s+=e.LINE(`${t("test_cmd.label_prefix")} : ${a}
`),s+=e.LINE(`${t("test_cmd.label_uptime")} : ${n}
`),s+=e.LINE(`${t("test_cmd.label_memory")} : ${p} MB
`),s+=e.LINE(`${t("test_cmd.label_dev")} : ${v}
`),s+=e.LINE(`${t("test_cmd.label_version")} : ${g}
`),s+=e.INTER()+`
`,s+=e.LINE(t("test_cmd.menu_info",{prefixe:a})+`
`),s+=e.LINE(t("test_cmd.allmenu_info",{prefixe:a})+`
`),s+=e.BTM+e.FOOTER;try{const _=await I(),T=await N(_);await o.sendMessage(i,{...T,caption:s,contextInfo:f})}catch{await d(s)}}),E({name:t("alive.name"),alias:["envie"],classe:"outils",desc:t("alive.desc"),react:"\u{1F377}"},async(i,o,{repondre:r,pseudo:l})=>{const d=o.config||c,a=$(process.uptime()),m=u(d);let n=e.TOP(`${L}`)+`
`;n+=e.LINE(`${t("alive.salut",{pseudo:l})}
`),n+=e.LINE(`${t("alive.status")}
`),n+=e.LINE(`${t("alive.uptime",{uptime:a})}
`),n+=e.LINE(`${t("alive.dev",{dev:v})}
`),n+=e.BTM+e.FOOTER;const p=await I(),f=await N(p);try{await o.sendMessage(i,{...f,caption:n,contextInfo:m})}catch{r(n,{contextInfo:m})}});
