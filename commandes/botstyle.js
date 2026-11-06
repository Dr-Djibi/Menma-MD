import{menmacmd as T}from"../lib/menmacmd.js";import e,{listStyles as r,getStyle as y}from"../lib/styleHelper.js";T({name:"botstyle",alias:["stylbot","setstyle"],classe:"owner",react:"\u{1F3A8}",desc:"Changer le style visuel global du bot (affecte toutes les commandes)."},async(I,N,{arg:o,prefixe:c,repondre:l})=>{const i=r();if(!o[0]||o[0].toLowerCase()==="list"){let n=e.TOP("\u{1F3A8} STYLES BOT")+`
`;return n+=e.LINE(`Style actif : *${e.getActiveId()}*
`),n+=e.INTER()+`
`,i.forEach(a=>{const E=a.id===e.getActiveId()?" \u2190 actif":"";n+=e.LINE(`*${a.id}* \u2014 ${a.name}${E}
`)}),n+=e.INTER()+`
`,n+=e.LINE(`Usage : \`${c}botstyle <1-${i.length}>\`
`),n+=e.BTM+e.FOOTER,l(n)}const s=String(o[0]).trim();if(!i.some(n=>n.id===s))return l(e.TOP("\u274C ERREUR")+`
`+e.LINE(`Style *${s}* introuvable.
`)+e.LINE(`Choisissez entre *1* et *${i.length}*.
`)+e.LINE(`Tapez \`${c}botstyle list\` pour voir les styles.
`)+e.BTM);const t=y(s),m=t.TOP(`Aper\xE7u \u2014 ${t.name}`)+`
`+t.LINE("Ligne exemple")+`
`+t.LINE("Autre info")+`
`+t.INTER()+`
`+t.BRANCH("commande1")+`
`+t.BRANCH("commande2")+`
`+t.BTM;await e.setActiveStyle(s),l(e.TOP(`\u2705 STYLE ${s} ACTIV\xC9`)+`
`+e.LINE(`*${t.name}* est maintenant actif partout !
`)+e.BTM+`

*Aper\xE7u :*

`+m+e.GENERATED_BY)});
