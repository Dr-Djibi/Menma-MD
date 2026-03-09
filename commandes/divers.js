/**
 * @file divers.js
 * @description Commandes diverses (Style OVL-MD-V2).
 */

const { menmacmd } = require("../lib/menmacmd");
const axios = require("axios");

// ------------------------------------------------------------------
// fancy : Texte stylisé
// ------------------------------------------------------------------
menmacmd({
    name: "fancy",
    alias: ["style", "font"],
    classe: "fun",
    react: "✍️",
    desc: "Transformer votre texte en styles variés"
}, async (ms_org, menma, { repondre, arg, prefixe }) => {
    if (!arg[0]) return repondre(`╭───〔 ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 〕───⬣\n│ *Usage* : ${prefixe}fancy <texte>\n╰──────────────────────────────⬣`);
    const text = arg.join(" ");

    try {
        // Optionnel : Intégrer une API de fonts ou un mapping local
        // Ici on fait un mapping simple pour l'exemple
        const fonts = {
            "Gras": text.toUpperCase(),
            "Bulles": text.split("").map(c => c === " " ? " " : String.fromCharCode(c.charCodeAt(0) + 0x2460)).join(""),
        };

        let msg = "✍️ *Styles Disponibles :*\n\n";
        for (const [name, val] of Object.entries(fonts)) {
            msg += `*${name}* : ${val}\n`;
        }
        repondre(msg);
    } catch (e) {
        repondre(`❌ Erreur : ${e.message}`);
    }
});

// ------------------------------------------------------------------
// trt : Traduction
// ------------------------------------------------------------------
menmacmd({
    name: "trt",
    alias: ["translate", "trad", "tr"],
    classe: "utiles",
    react: "🌍",
    desc: "Traduire un texte (ex: trt fr hello)"
}, async (ms_org, menma, { repondre, arg, msg_Repondu, prefixe }) => {
    let lang = arg[0] || "fr";
    let text = arg.slice(1).join(" ") || (msg_Repondu ? (msg_Repondu.conversation || msg_Repondu.extendedTextMessage?.text) : "");

    if (!text) return repondre(`╭───〔 ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 〕───⬣\n│ *Usage* : ${prefixe}trt <lang> <texte>\n│ *Ex* : ${prefixe}trt fr hello\n╰──────────────────────────────⬣`);

    try {
        const res = await axios.get(`https://api.popcat.xyz/translate?to=${lang}&text=${encodeURIComponent(text)}`);
        repondre(`🌍 *Traduction (${lang}) :*\n\n${res.data.translated}`);
    } catch (e) {
        repondre(`❌ Erreur API : ${e.message}`);
    }
});

// ------------------------------------------------------------------
// google : Recherche Google
// ------------------------------------------------------------------
menmacmd({
    name: "google",
    alias: ["search", "g"],
    classe: "utiles",
    react: "🔍",
    desc: "Rechercher sur Google"
}, async (ms_org, menma, { repondre, arg, prefixe }) => {
    if (!arg[0]) return repondre(`╭───〔 ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 〕───⬣\n│ *Usage* : ${prefixe}google <requête>\n╰──────────────────────────────⬣`);
    const query = arg.join(" ");
    repondre(`🔍 *Résultat de recherche pour "${query}" :*\n\nhttps://www.google.com/search?q=${encodeURIComponent(query)}`);
});

// ------------------------------------------------------------------
// weather : Météo
// ------------------------------------------------------------------
menmacmd({
    name: "weather",
    alias: ["meteo"],
    classe: "utiles",
    react: "☁️",
    desc: "Afficher la météo d'une ville"
}, async (ms_org, menma, { repondre, arg, prefixe }) => {
    if (!arg[0]) return repondre(`╭───〔 ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 〕───⬣\n│ *Usage* : ${prefixe}weather <ville>\n╰──────────────────────────────⬣`);
    const city = arg.join(" ");

    try {
        const res = await axios.get(`https://api.popcat.xyz/weather?q=${encodeURIComponent(city)}`);
        const data = res.data[0];
        if (!data) return repondre("❌ Ville non trouvée.");

        const msg = `🏙️ *Météo pour ${data.location.name}*\n\n`
            + `🌡️ *Température :* ${data.current.temperature}°C\n`
            + `☁️ *Ciel :* ${data.current.skytext}\n`
            + `💧 *Humidité :* ${data.current.humidity}%\n`
            + `🌬️ *Vent :* ${data.current.winddisplay}`;
        repondre(msg);
    } catch (e) {
        repondre(`❌ Ville introuvable ou erreur API.`);
    }
});

// ------------------------------------------------------------------
// gpt : Chat avec IA
// ------------------------------------------------------------------
menmacmd({
    name: "gpt",
    alias: ["ai", "chat"],
    classe: "fun",
    react: "🤖",
    desc: "Demander quelque chose à l'IA"
}, async (ms_org, menma, { repondre, arg }) => {
    if (!arg[0]) return repondre("❌ Pose-moi une question.");
    const q = arg.join(" ");

    try {
        const res = await axios.get(`https://api.popcat.xyz/chatbot?msg=${encodeURIComponent(q)}&owner=Menma&botname=Menma-MD`);
        repondre(res.data.response);
    } catch (e) {
        repondre(`❌ L'IA est fatiguée... Réessaie plus tard.`);
    }
});
