/**
 * @file fun.js
 * @description Commandes fun et utilitaires (style OVL-MD-V2).
 */

const { menmacmd } = require("../lib/menmacmd");
const { runtime } = require("../lib/fonctions");

// ------------------------------------------------------------------
// sticker : Convertir une image en sticker
// ------------------------------------------------------------------
menmacmd({
    name: "sticker",
    alias: ["s", "stick"],
    classe: "fun",
    react: "🎭",
    desc: "Convertir une image ou vidéo en sticker"
}, async (ms_org, menma, { repondre, ms, auteur_Message }) => {
    const quoted = ms.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const media = quoted?.imageMessage || quoted?.videoMessage
        || ms.message?.imageMessage || ms.message?.videoMessage;

    if (!media) return repondre("╭───〔 ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 〕───⬣\n│ Envoie ou réponds à une\n│ image ou une vidéo.\n╰──────────────────────────────⬣");

    try {
        const msgType = quoted?.imageMessage ? "imageMessage"
            : quoted?.videoMessage ? "videoMessage"
                : ms.message?.imageMessage ? "imageMessage" : "videoMessage";

        const stream = await menma.downloadContentFromMessage(
            quoted ? quoted[msgType] : ms.message[msgType],
            msgType.replace("Message", "")
        );

        let buffer = Buffer.alloc(0);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        await menma.sendMessage(ms_org, {
            sticker: buffer
        }, { quoted: ms });
    } catch (e) {
        repondre(`❌ Erreur : ${e.message}`);
    }
});

// ------------------------------------------------------------------
// pp : Obtenir la photo de profil d'un membre
// ------------------------------------------------------------------
menmacmd({
    name: "pp",
    alias: ["photo", "profil"],
    classe: "fun",
    react: "📸",
    desc: "Obtenir la photo de profil"
}, async (ms_org, menma, { repondre, mr, auteur_Msg_Repondu, auteur_Message, ms }) => {
    const cible = (mr && mr[0]) || auteur_Msg_Repondu || auteur_Message;
    try {
        const url = await menma.profilePictureUrl(cible, "image");
        await menma.sendMessage(ms_org, {
            image: { url },
            caption: `📸 Photo de profil de @${cible.split("@")[0]}`,
            mentions: [cible]
        }, { quoted: ms });
    } catch (e) {
        repondre(`❌ Impossible d'obtenir la photo (compte privé ou inexistant).`);
    }
});

// ------------------------------------------------------------------
// bio : Obtenir le statut (bio) d'un membre
// ------------------------------------------------------------------
menmacmd({
    name: "bio",
    alias: ["statut", "status"],
    classe: "fun",
    react: "📖",
    desc: "Afficher le statut/bio d'un utilisateur"
}, async (ms_org, menma, { repondre, mr, auteur_Msg_Repondu, auteur_Message }) => {
    const cible = (mr && mr[0]) || auteur_Msg_Repondu || auteur_Message;
    try {
        const status = await menma.fetchStatus(cible);
        repondre(`📖 *Bio de @${cible.split("@")[0]} :*\n${status?.status || "Aucun statut défini."}`);
    } catch (e) {
        repondre(`❌ Impossible d'obtenir le statut.`);
    }
});

// ------------------------------------------------------------------
// react : Réagir à un message
// ------------------------------------------------------------------
menmacmd({
    name: "react",
    alias: ["reaction", "emoji"],
    classe: "fun",
    react: "😊",
    desc: "Réagir au message cité avec un emoji"
}, async (ms_org, menma, { repondre, arg, ms }) => {
    const emoji = arg[0];
    if (!emoji) return repondre("╭───〔 ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 〕───⬣\n│ *Usage* : react <emoji>\n│ *Ex* : react 😍\n╰──────────────────────────────⬣");

    const quoted = ms.message?.extendedTextMessage?.contextInfo;
    if (!quoted?.stanzaId) return repondre("╭───〔 ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 〕───⬣\n│ Réponds à un message pour\n│ y réagir.\n╰──────────────────────────────⬣");

    try {
        await menma.sendMessage(ms_org, {
            react: {
                text: emoji,
                key: {
                    remoteJid: ms_org,
                    id: quoted.stanzaId,
                    participant: quoted.participant
                }
            }
        });
    } catch (e) {
        repondre(`❌ Erreur : ${e.message}`);
    }
});

// ------------------------------------------------------------------
// uptime : Temps de fonctionnement du bot
// ------------------------------------------------------------------
menmacmd({
    name: "uptime",
    alias: ["ut", "runtime"],
    classe: "utiles",
    react: "⏱️",
    desc: "Afficher le temps de fonctionnement du bot"
}, async (ms_org, menma, { repondre }) => {
    const up = runtime(process.uptime());
    repondre(`⏱️ *Menma-MD est en ligne depuis :* ${up}`);
});

// ------------------------------------------------------------------
// del : Supprimer un message (bot doit avoir envoyé ou être admin)
// ------------------------------------------------------------------
menmacmd({
    name: "del",
    alias: ["delete", "supp", "supprimer"],
    classe: "utiles",
    react: "🗑️",
    desc: "Supprimer un message cité"
}, async (ms_org, menma, { repondre, ms, premium_id }) => {
    if (!premium_id) return repondre("❌ Commande réservée au owner/sudo.");

    const quoted = ms.message?.extendedTextMessage?.contextInfo;
    if (!quoted?.stanzaId) return repondre("❌ Réponds au message à supprimer.");

    try {
        await menma.sendMessage(ms_org, {
            delete: {
                remoteJid: ms_org,
                id: quoted.stanzaId,
                participant: quoted.participant,
                fromMe: false
            }
        });
    } catch (e) {
        repondre(`❌ Erreur : ${e.message}`);
    }
});
// ------------------------------------------------------------------
// afk : Se mettre en mode AFK
// ------------------------------------------------------------------
let afkData = {};
menmacmd({
    name: "afk",
    classe: "fun",
    react: "💤",
    desc: "Se mettre en mode AFK (Away From Keyboard)"
}, async (ms_org, menma, { repondre, arg, pseudo, auteur_Message }) => {
    const reason = arg.join(" ") || "Pas de raison fournie";
    afkData[auteur_Message] = {
        reason,
        time: Date.now(),
        pseudo
    };
    repondre(`💤 *${pseudo}* est maintenant AFK.\n📝 *Raison :* ${reason}`);
});

// Note: La logique pour détecter quand quelqu'un mentionne un AFK 
// doit être ajoutée dans message_upsert.js pour être vraiment efficace.

// ------------------------------------------------------------------
// poll : Créer un sondage
// ------------------------------------------------------------------
menmacmd({
    name: "poll",
    alias: ["sondage"],
    classe: "fun",
    react: "📊",
    desc: "Créer un sondage"
}, async (ms_org, menma, { repondre, arg, prefixe }) => {
    const text = arg.join(" ");
    if (!text || !text.includes("|")) return repondre(`╭───〔 ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 〕───⬣\n│ *Usage* : ${prefixe}poll Question | Op1 | Op2\n╰──────────────────────────────⬣`);

    const parts = text.split("|").map(p => p.trim());
    const question = parts[0];
    const options = parts.slice(1);

    if (options.length < 2) return repondre("╭───〔 ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 〕───⬣\n│ Il faut au moins 2 options.\n╰──────────────────────────────⬣");

    try {
        await menma.sendMessage(ms_org, {
            poll: {
                name: question,
                values: options,
                selectableCount: 1
            }
        });
    } catch (e) {
        repondre(`❌ Erreur : ${e.message}`);
    }
});
