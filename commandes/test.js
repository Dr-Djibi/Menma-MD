// the first command created 
const { menmacmd } = require("../lib/menmacmd");
const os = require("os");
const { ZONE_DE_TEMPS } = require("../config");
const rl = "https://files.catbox.moe/uih7xz.jpg";
const { runtime } = require("../lib/fonctions");
menmacmd({
  name: "test",
  classe: "utiles",
  react: "🔋"
},
  async (ms_org, menma, com_options) => {
    const { pseudo } = com_options;
    const mess = `Salut ${pseudo}\n je suis *Menma-MD* un bot développé par Menma`;
    console.log("le bot est en ligne");

    menma.sendMessage(ms_org, { image: { url: rl }, caption: mess });
  });



menmacmd({
  name: "ping",
  classe: "utiles",
  react: "⚡"
},

  async (ms_org, menma) => {
    const pi = Date.now();
    await menma.sendMessage(ms_org, { text: `*_ping....._*` });
    const ng = Date.now();
    console.log("ping...");
    const ping = ng - pi

    menma.sendMessage(ms_org, { text: `> pong ${ping} ms` });
  });


menmacmd({
  name: "alive",
  classe: "utiles",
  desc: "temps de fonctionnement",
  react: "🍷"
}, async (ms_org, menma) => {
  const timeZone = 'Africa/Lagos';
  const now = new Date();

  const jour = now.toLocaleDateString('en-US', { timeZone, weekday: 'long' });
  const time = now.toLocaleTimeString('en-US', { timeZone });
  const date = now.toLocaleDateString('en-US', { timeZone });

  const uptime = runtime(process.uptime());

  const m = `*NOUS SOMMES ${jour} LE ${date}*\n`;
  const es = `*AVEC UN UPTIME DE ${uptime} À ${time}*`;

  const mes = m + es



  try {
    menma.sendMessage(ms_org, { text: mes });
  } catch (err) {
    menma.sendMessage(ms_org, { text: err.message });
  }
});
