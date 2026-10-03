import{menmacmd as j}from"../lib/menmacmd.js";import t from"../lib/styleHelper.js";import{trd as s}from"../lib/i18n.js";const Y=t.GENERATED_BY,r=new Map;let k=1;const v=["once","daily","monthly","yearly"];j({name:s("prog.name"),alias:["planifier"],react:"\u{1F552}",classe:"outils",desc:s("prog.desc")},async(W,L,{arg:x,prefixe:_,repondre:a})=>{const u=x.join(" ").trim(),p=()=>{const o=s("prog.usage_msg",{sep:"||SEP||",inter:"||INTER||",prefixe:_}).split(`
`).map(i=>i.includes("||SEP||")?t.INTER():i.includes("||INTER||")?t.INTER():t.LINE(i)).join(`
`);return a(t.TOP(s("prog.usage_title"))+`
`+o+`
`+t.BTM)};if(!u)return p();if(u==="list"){if(r.size===0)return a(t.TOP("\u{1F4ED} PROG")+`
`+t.LINE(s("prog.no_tasks")+`
`)+t.BTM);let e=t.TOP(s("prog.list_title"))+`
`;for(const[o,i]of r.entries()){const n=s(i.type==="pm"?"prog.type_pm":"prog.type_gc"),b=s(`prog.${i.repeat}`)||i.repeat;e+=t.LINE(`\u{1F194} *ID* : \`${o}\`
`)+t.LINE(`\u{1F4CD} *Dest* : ${n}
`)+t.LINE(`\u{1F4C6} *Date* : ${new Date(i.nextDate).toLocaleString("fr-FR")}
`)+t.LINE(`\u{1F501} *Fr\xE9q* : ${b}
`)+t.LINE(`\u{1F4AC} *Msg* : "${i.message.substring(0,30)}${i.message.length>30?"...":""}"
`)+t.LINE(`${t.SEP}
`)}return a(e+t.BTM)}if(u==="clear"){for(const e of r.values())clearTimeout(e.timeout);return r.clear(),k=1,a(t.TOP(s("prog.clear_success"))+`
`+t.BTM)}if(u.startsWith("supp ")){const e=parseInt(u.split(" ")[1],10);if(!e||isNaN(e))return a(s("prog.supp_usage",{prefixe:_}));const o=r.get(e);return o?(clearTimeout(o.timeout),r.delete(e),a(t.TOP(s("prog.supp_success",{id:e}))+`
`+t.BTM)):a(t.TOP("\u274C ERREUR")+`
`+t.LINE(s("prog.supp_not_found",{id:e})+`
`)+t.BTM)}const l=u.split(/\s+/),m=l[0]?.toLowerCase();if(m!=="pm"&&m!=="gc")return p();const f=l[1],d=l[2],y=l[3];if(!f||!d||!y)return p();const h=l[l.length-1].toLowerCase();let g="once",D=l.length;v.includes(h)&&(g=h,D=l.length-1);const E=l.slice(4,D).join(" ").trim();if(!E)return p();const M=d.split("/"),$=y.split(":");if(M.length!==3||$.length!==2)return p();const[w,P,R]=M.map(Number),[O,S]=$.map(Number);if([w,P,R,O,S].some(isNaN))return p();const T=new Date(R,P-1,w,O,S);if(isNaN(T.getTime())||T<=new Date)return a(s("prog.future_date"));let N;if(m==="pm"){const e=f.replace(/\D/g,"");if(!/^\d{8,15}$/.test(e))return a(s("prog.invalid_num"));N=e+"@s.whatsapp.net"}else{if(!f.endsWith("@g.us"))return a(s("prog.invalid_jid"));try{await L.groupMetadata(f)}catch{return a(s("prog.not_in_group"))}N=f}const c=k++,B=s(m==="pm"?"prog.type_pm":"prog.type_gc"),F=s(`prog.${g}`)||g;a(t.TOP(s("prog.task_success_title"))+`
`+t.LINE(`\u{1F194} *ID* : \`${c}\`
`)+t.LINE(`\u{1F4CD} *Dest* : ${B}
`)+t.LINE(`\u{1F4C6} *Date* : ${T.toLocaleString("fr-FR")}
`)+t.LINE(`\u{1F501} *Fr\xE9q* : ${F}
`)+t.LINE(`\u{1F4AC} *Msg* : "${E}"
`)+t.BTM+Y);const I=e=>{const o=e.getTime()-Date.now();if(o<=0)return;let i;if(o>2147483647?i=setTimeout(()=>I(e),2147483647):i=setTimeout(async()=>{try{await L.sendMessage(N,{text:E})}catch{}if(r.has(c)){let n=new Date(e);if(g==="daily")n.setDate(n.getDate()+1);else if(g==="monthly")n.setMonth(n.getMonth()+1);else if(g==="yearly")n.setFullYear(n.getFullYear()+1);else return r.delete(c);r.set(c,{...r.get(c),nextDate:n.getTime(),timeout:null}),I(n)}},o),r.has(c)){const n=r.get(c);n.timeout&&clearTimeout(n.timeout),r.set(c,{...n,timeout:i,nextDate:e.getTime()})}};r.set(c,{timeout:null,mode:m,destinataire:N,message:E,nextDate:T.getTime(),repeat:g,type:m}),I(T)});
