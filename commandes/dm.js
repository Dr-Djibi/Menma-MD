import{menmacmd as o}from"../lib/menmacmd.js";import e from"../config.js";import{trd as s}from"../lib/i18n.js";o({name:"jid",classe:"owner",react:"\u{1F194}",desc:s("dm.desc_jid")},async(c,r,{repondre:d,auteur_Message:a,verif_Gp:n})=>{d(n?s("dm.jid_group",{groupJid:c,userJid:a}):s("dm.jid_user",{userJid:a}))}),o({name:"botjid",classe:"owner",react:"\u{1F916}",desc:s("dm.desc_botjid")},async(c,r,{repondre:d,id_Bot:a})=>{d(s("dm.botjid",{botJid:a}))}),o({name:"owner",alias:["proprio"],classe:"owner",react:"\u{1F451}",desc:s("dm.desc_owner")},async(c,r,{repondre:d,ms:a})=>{const n=(Array.isArray(e.OWNER)?e.OWNER[0]:e.OWNER||"").replace(/\D/g,""),t=`BEGIN:VCARD
VERSION:3.0
FN:`+e.NOM_OWNER+`
ORG:`+e.NOM_BOT+`
TEL;type=CELL;type=VOICE;waid=`+n+":+"+n+`
END:VCARD`;await r.sendMessage(c,{contacts:{displayName:e.NOM_OWNER,contacts:[{vcard:t}]}},{quoted:a})}),o({name:"dev",classe:"owner",react:"\u{1F468}\u200D\u{1F4BB}",desc:s("dm.desc_dev")},async(c,r,{repondre:d,ms:a})=>{const n=(Array.isArray(e.NUMERO_DEV)?e.NUMERO_DEV[0]:e.NUMERO_DEV||"").replace(/\D/g,""),t=`BEGIN:VCARD
VERSION:3.0
FN:`+e.DEV+`
ORG:`+e.NOM_BOT+`
TEL;type=CELL;type=VOICE;waid=`+n+":+"+n+`
END:VCARD`;await r.sendMessage(c,{contacts:{displayName:e.DEV,contacts:[{vcard:t}]}},{quoted:a})}),o({name:s("ping"),alias:["ping"],classe:"outils",react:"\u23F1\uFE0F",desc:s("dm.desc_ping")},async(c,r,{repondre:d,ms:a})=>{const n=a.messageTimestamp*1e3,t=Date.now()-n;d(s("dm.ping",{latence:t}),{quoted:a})});
