// the first command created 
const { menmacmd } = require("../lib/menmacmd");
const os = require("os");
const { ZONE_DE_TEMPS } = require("../config");
const rl = "https://files.catbox.moe/uih7xz.jpg";
const { runtime } = require("../lib/fonctions");
menmacmd({
  name: "test",
  classe: "utiles",
  react: "🔋",
  desc: "Vérifier l'état de santé du bot"
}, async (ms_org, menma, com_options) => {
  const { pseudo, repondre, prefixe } = com_options;
  const uptime = runtime(process.uptime());
  const memUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

  const message = `╭─〔 🔋 𝗠𝗘𝗡𝗠𝗔-𝗠𝗗 𝗦𝗧𝗔𝗧𝗨𝗦 〕─⬣\n`
    + `│ 👤 *Utilisateur* : ${pseudo}\n`
    + `│ ⏱️ *Uptime*      : ${uptime}\n`
    + `│ 🧠 *Mémoire*     : ${memUsage} MB\n`
    + `│ 📡 *Préfixe*    : ${prefixe}\n`
    + `│ 🤖 *Version*     : 1.0.0\n`
    + `╰──────────────────────⬣\n\n`
    + `*Menma-MD* est prêt à vous servir ! Utilisez *${prefixe}menu* pour voir mes capacités.`;

  await menma.sendMessage(ms_org, {
    image: { url: rl },
    caption: message
  });
});

menmacmd({
  name: "ping",
  classe: "utiles",
  react: "⚡",
  desc: "Mesurer la latence du bot"
}, async (ms_org, menma, { repondre }) => {
  const start = Date.now();
  await repondre("🚀 *Calcul de la vitesse...*");
  const latency = Date.now() - start;

  const message = `╭─〔 ⚡ 𝗠𝗘𝗡𝗠𝗔-𝗠𝗗 𝗣𝗜𝗡𝗚 〕─⬣\n`
    + `│ 🛰️ *Latence* : ${latency} ms\n`
    + `│ 🚅 *Vitesse*  : ${latency < 200 ? "Fulgurante" : "Stable"}\n`
    + `╰──────────────────────⬣`;

  repondre(message);
});

menmacmd({
  name: "alive",
  alias: ["envive"],
  classe: "utiles",
  desc: "Vérifier si le bot est en vie",
  react: "🍷"
}, async (ms_org, menma, { repondre, pseudo }) => {
  const uptime = runtime(process.uptime());
  const message = `╭────────〔 🍷 𝗔𝗟𝗜𝗩𝗘 〕────────⬣\n`
    + `│ 👋 *Salut* : ${pseudo}\n`
    + `│ 🚀 *Status* : Opérationnel\n`
    + `│ ⏱️ *Uptime* : ${uptime}\n`
    + `│ 👑 *Dev*    : Menma\n`
    + `╰──────────────────────────────⬣`;

  try {
    await menma.sendMessage(ms_org, {
      image: { url: rl },
      caption: message
    });
  } catch (err) {
    repondre(message);
  }
});
