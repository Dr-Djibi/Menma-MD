import{menmacmd as h}from"../lib/menmacmd.js";import m from"axios";import i from"../config.js";import t from"../lib/styleHelper.js";import{getChatbotState as T,updateChatbotState as c}from"../Database/chatbot_db.js";import{trd as e}from"../lib/i18n.js";const f=i.CHATBOT_SERVER_URL||"https://menma-md-web.koyeb.app";async function w(s,u){const n=`${i.CHATBOT_PROMPT} 

 user: ${u}`;try{const a=await m.get(`${f}/serveur/chatbot`,{params:{user_id:s,text:n.trim()},timeout:15e3});if(a.data){if(a.data.timeout)return null;if(a.data.text)return a.data.text}return null}catch(a){return console.error("Erreur liaison serveur IA:",a.message),null}}h({name:e("chatbot.name"),alias:["ia","ai"],react:"\u{1F916}",classe:"IA",desc:e("chatbot.desc")},async(s,u,{arg:n,prefixe:a,repondre:o})=>{const r=await T();let l=JSON.parse(r.enabledChats||"[]");if(n&&n.length>0)switch(n[0].toLowerCase()){case"on":return l.includes(s)||(l.push(s),await c({enabledChats:JSON.stringify(l)})),await o(t.STATUS("Chatbot","\u{1F916}",!0));case"all":return await c({globalPm:!0,globalGc:!0}),await o(t.STATUS("Chatbot Global","\u{1F916}",!0));case"gc":return await c({globalGc:!0}),await o(t.STATUS("Chatbot Groupes","\u{1F916}",!0));case"pm":return await c({globalPm:!0}),await o(t.STATUS("Chatbot Priv\xE9","\u{1F916}",!0));case"off":return await c({globalPm:!1,globalGc:!1,enabledChats:"[]"}),await o(t.STATUS("Chatbot","\u{1F916}",!1));case"status":const b=t.TOP(e("chatbot.status_title"))+`
`+t.LINE(`${e("chatbot.status_gc",{status:r.globalGc?"\u2705":"\u274C"})}
`)+t.LINE(`${e("chatbot.status_pm",{status:r.globalPm?"\u2705":"\u274C"})}
`)+t.LINE(`${e("chatbot.status_local",{status:l.includes(s)?"\u2705":"\u274C"})}
`)+t.BTM;return await o(b)}return await o(t.TOP(e("chatbot.config_title"))+`
`+t.LINE(`${e("chatbot.help_on",{prefixe:a})}
`)+t.LINE(`${e("chatbot.help_all",{prefixe:a})}
`)+t.LINE(`${e("chatbot.help_gc",{prefixe:a})}
`)+t.LINE(`${e("chatbot.help_pm",{prefixe:a})}
`)+t.LINE(`${e("chatbot.help_off",{prefixe:a})}
`)+t.LINE(`${e("chatbot.help_status",{prefixe:a})}
`)+t.BTM)});export{w as getAIResponse};
