import{menmacmd as E}from"../lib/menmacmd.js";import"os";import m from"../config.js";import{runtime as $,fwdChannelContext as u}from"../lib/fonctions.js";import{getThemeUrl as I,buildThemeMedia as N}from"../lib/themeHelper.js";import e from"../lib/styleHelper.js";import{trd as t}from"../lib/i18n.js";const L=m.NOM_BOT,v=m.DEV,g=m.VERSION;E({name:t("test_cmd.name"),classe:"outils",react:"\u{1F50B}",desc:t("test_cmd.desc")},async(i,o,r)=>{const{pseudo:l,repondre:f,prefixe:a}=r,c=o.config||m,n=$(process.uptime()),d=(process.memoryUsage().heapUsed/1024/1024).toFixed(2),p=await I(),_=await N(p),T=u(c);let s=e.TOP(`${L}`)+`
`;s+=e.LINE(`${t("test_cmd.label_user")} : ${l}
`),s+=e.LINE(`${t("test_cmd.label_prefix")} : ${a}
`),s+=e.LINE(`${t("test_cmd.label_uptime")} : ${n}
`),s+=e.LINE(`${t("test_cmd.label_memory")} : ${d} MB
`),s+=e.LINE(`${t("test_cmd.label_dev")} : ${v}
`),s+=e.LINE(`${t("test_cmd.label_version")} : ${g}
`),s+=e.INTER()+`
`,s+=e.LINE(t("test_cmd.menu_info",{prefixe:a})+`
`),s+=e.LINE(t("test_cmd.allmenu_info",{prefixe:a})+`
`),s+=e.BTM+e.FOOTER,await o.sendMessage(i,{..._,caption:s,contextInfo:T})}),E({name:t("alive.name"),alias:["envie"],classe:"outils",desc:t("alive.desc"),react:"\u{1F377}"},async(i,o,{repondre:r,pseudo:l})=>{const f=o.config||m,a=$(process.uptime()),c=u(f);let n=e.TOP(`${L}`)+`
`;n+=e.LINE(`${t("alive.salut",{pseudo:l})}
`),n+=e.LINE(`${t("alive.status")}
`),n+=e.LINE(`${t("alive.uptime",{uptime:a})}
`),n+=e.LINE(`${t("alive.dev",{dev:v})}
`),n+=e.BTM+e.FOOTER;const d=await I(),p=await N(d);try{await o.sendMessage(i,{...p,caption:n,contextInfo:c})}catch{r(n,{contextInfo:c})}});
