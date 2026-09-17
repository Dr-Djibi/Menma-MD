import{menmacmd as i}from"../lib/menmacmd.js";import{addPublicCmd as d,delPublicCmd as b,getAllPublicCmds as p}from"../Database/public_cmd.js";import*as E from"../lib/menmacmd.js";import e from"../lib/styleHelper.js";import{trd as o}from"../lib/i18n.js";i({name:o("public_cmd.set_name")||"setpublic_cmd",alias:["addpublic","publiccmd"],classe:"owner",react:"\u{1F513}",desc:o("public_cmd.set_desc")},async(u,l,{repondre:a,is_Owner:c,arg:n,prefixe:s})=>{if(!c)return a("\u274C R\xE9serv\xE9 au propri\xE9taire du bot.");const m=n[0]?.toLowerCase();return m?E.commands.find(t=>t.name===m||t.alias&&t.alias.includes(m))?(await d(m),a(e.TOP("\u{1F513} PUBLIC CMD")+`
`+e.LINE(`\u2705 La commande \xAB ${s}${m} \xBB est maintenant publique.
`)+e.INTER()+`
`+e.LINE(`Elle sera accessible \xE0 tous, m\xEAme en mode priv\xE9.
`)+e.BTM)):a(`\u274C La commande \xAB ${m} \xBB n'existe pas.`):a(`\u274C Usage : ${s}setpublic_cmd <nom_commande>`)}),i({name:"delpublic_cmd",alias:["rmpublic","unpublic"],classe:"owner",react:"\u{1F512}",desc:"Retirer une commande de la liste publique"},async(u,l,{repondre:a,is_Owner:c,arg:n,prefixe:s})=>{if(!c)return a("\u274C R\xE9serv\xE9 au propri\xE9taire du bot.");const m=n[0]?.toLowerCase();return m?(await b(m),a(e.TOP("\u{1F512} PUBLIC CMD")+`
`+e.LINE(`\u2705 La commande \xAB ${s}${m} \xBB n'est plus publique.
`)+e.INTER()+`
`+e.LINE(`En mode priv\xE9, seuls les owners/sudo y auront acc\xE8s.
`)+e.BTM)):a(`\u274C Usage : ${s}delpublic_cmd <nom_commande>`)}),i({name:"getpublic_cmd",alias:["listpublic","publiclist"],classe:"owner",react:"\u{1F4CB}",desc:"Afficher toutes les commandes publiques"},async(u,l,{repondre:a,is_Owner:c,prefixe:n})=>{if(!c)return a("\u274C R\xE9serv\xE9 au propri\xE9taire du bot.");const s=await p();if(!s||s.length===0)return a(e.TOP("\u{1F4CB} PUBLIC CMD")+`
`+e.LINE(`Aucune commande publique configur\xE9e.
`)+e.INTER()+`
`+e.LINE(`Utilisez ${n}setpublic_cmd <commande> pour en ajouter.
`)+e.BTM);let m=e.TOP("\u{1F4CB} COMMANDES PUBLIQUES")+`
`;return s.forEach((r,t)=>{m+=e.LINE(`${t+1}. ${n}${r.cmdName}
`)}),m+=e.INTER()+`
`,m+=e.LINE(`Total : ${s.length} commande(s)
`),m+=e.BTM,a(m)});
