import{menmacmd as A}from"../lib/menmacmd.js";import{getAntiDeleteStatus as d,setAntiDeleteStatus as p}from"../Database/antidelete.js";import e from"../lib/styleHelper.js";import{trd as c}from"../lib/i18n.js";A({name:c("antidelete.name"),alias:["antidel"],classe:"owner",react:"\u{1F5D1}\uFE0F",desc:c("antidelete.desc")},async(u,$,m)=>{const{arg:f,repondre:s,verif_Gp:g,prefixe:t}=m,i=f.join("").toLowerCase(),E=["non","off","pm","gc","group","status","all","gc-org","gc-pm"],N=["on","gc-org","gc-pm","off","non"];if(!i){const o=await d("global");let n=e.TOP(c("antidelete.title"))+`
`;if(n+=e.LINE(`\u{1F30D} *Configuration Globale :* ${o.toUpperCase()}
`),g){const r=await d(u),L=r?r.toUpperCase():"NON";n+=e.LINE(`\u{1F465} *Configuration du Groupe :* ${L}
`),n+=e.INTER()+`
`,n+=e.LINE(`\u{1F539} *Commandes pour ce groupe :*
`),n+=e.LINE(`\u25FD \`${t}antidelete on 
 ou gc-org\` Activer dans 
 ce groupe (alerte ici)
 
`),n+=e.LINE(`\u25FD \`${t}antidelete gc-pm\` : 
 Activer dans ce 
 groupe (alerte en PV)
 
`),n+=e.LINE(`\u25FD \`${t}antidelete off\` : 
 D\xE9sactiver dans ce groupe
 
`)}return n+=e.INTER()+`
`,n+=e.LINE(`\u{1F539} *Commandes globales :*
 
`),n+=e.LINE(`\u25FD \`${t}antidelete all\` : 
 Partout
 
`),n+=e.LINE(`\u25FD \`${t}antidelete pm\` : 
 PV seulement
 
`),n+=e.LINE(`\u25FD \`${t}antidelete gc\` : 
 Groupes (alerte en PV)
 
`),n+=e.LINE(`\u25FD \`${t}antidelete gc-org\` : 
 Groupes (alerte dans le groupe)
 
`),n+=e.LINE(`\u25FD \`${t}antidelete status\` : 
 Statuts seulement
 
`),n+=e.LINE(`\u25FD \`${t}antidelete non\` : 
 D\xE9sactiver globalement
 
`),n+=e.BTM+e.GENERATED_BY,s(n)}if(g&&N.includes(i)){let o;["on","gc-org"].includes(i)?o="gc-org":["gc-pm"].includes(i)?o="gc-pm":o="non",await p(o,u);const n=o!=="non";let r=e.STATUS(`AntiDelete (${o})`,"\u{1F5D1}\uFE0F",n);return s(r)}const l=i.split(",").filter(Boolean);if(!(l.length>0&&l.every(o=>E.includes(o))))return s(`\u274C Option invalide. Tapez \`${t}antidelete\` sans argument pour voir les options.`);let a;l.includes("non")||l.includes("off")?a="non":l.includes("all")?a="all":a=l.join(","),await p(a,"global");const I=a!=="non";s(e.STATUS(`AntiDelete Global (${a})`,"\u{1F5D1}\uFE0F",I))});
