/**
 * @file owner.js
 * @description Commandes réservées au propriétaire du bot.
 */

const { menmacmd } = require("../lib/menmacmd");
const { addSudoNumber, delSudoNumber, getAllSudoNumbers } = require("../Database/sudo");
const {
    addOrUpdatePresence,
    presenceUpdateActionJid
} = require("../Database/presence");

// ------------------------------------------------------------------
// sudo : Ajouter un numéro en tant que sudo (utilisateur de confiance)
// ------------------------------------------------------------------
menmacmd({
    name: "setsudo",
    alias: [],
    classe: "owner",
    react: "⭐",
    desc: "Ajouter un numéro en tant que sudo"
}, async (ms_org, menma, { repondre, dev_id, arg, mr, ms, auteur_Msg_Repondu }) => {
    if (!dev_id) return repondre("❌ Commande réservée au owner.");

    const cible = (mr && mr[0]) || auteur_Msg_Repondu;
    if (!cible) return repondre("╭───〔 ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 〕───⬣\n│ *Usage* : Mentionne ou réponds\n│ au futur sudo.\n╰────────────────────⬣");

    let numero = arg[0]
        || (mr && mr[0] ? mr[0].split("@")[0] : null)
        || (auteur_Msg_Repondu ? auteur_Msg_Repondu.split("@")[0] : null);

    numero = numero.replace(/\D/g, "");
    await addSudoNumber(numero);
    repondre(`✅ *${numero}* ajouté en tant que sudo !`);
});

// ------------------------------------------------------------------
// delsudo : Supprimer un sudo
// ------------------------------------------------------------------
menmacmd({
    name: "delsudo",
    alias: ["unsudo"],
    classe: "owner",
    react: "🗑️",
    desc: "Retirer un numéro des sudos"
}, async (ms_org, menma, { repondre, dev_id, arg, mr, auteur_Msg_Repondu }) => {
    if (!dev_id) return repondre("❌ Commande réservée au owner.");

    let numero = arg[0]
        || (mr && mr[0] ? mr[0].split("@")[0] : null)
        || (auteur_Msg_Repondu ? auteur_Msg_Repondu.split("@")[0] : null);

    if (!numero) return repondre("❌ Spécifie un numéro.");
    numero = numero.replace(/\D/g, "");
    await delSudoNumber(numero);
    repondre(`✅ *${numero}* retiré des sudos !`);
});

// ------------------------------------------------------------------
// listsudo : Lister les sudos
// ------------------------------------------------------------------
menmacmd({
    name: "listsudo",
    alias: ["sudolist"],
    classe: "owner",
    react: "📋",
    desc: "Lister tous les sudos"
}, async (ms_org, menma, { repondre, dev_id }) => {
    if (!dev_id) return repondre("❌ Commande réservée au owner.");
    const list = await getAllSudoNumbers();
    if (!list || list.length === 0) return repondre("📋 Aucun sudo enregistré.");
    repondre(`📋 *Liste des Sudos :*\n${list.map((n, i) => `${i + 1}. +${n}`).join("\n")}`);
});

// ------------------------------------------------------------------
// presence : Changer l'état de présence du bot
// ------------------------------------------------------------------
menmacmd({
    name: "presence",
    classe: "owner",
    react: "📶",
    desc: "Changer la présence du bot (enline | ecrit | audio | rien)"
}, async (ms_org, menma, { repondre, dev_id, arg, auteur_Message }) => {
    if (!dev_id) return repondre("❌ Commande réservée au owner.");
    const valid = ["enline", "ecrit", "audio", "rien"];
    const choix = arg[0]?.toLowerCase();
    if (!choix || !valid.includes(choix)) {
        return repondre(`❌ Usage : presence <${valid.join(" | ")}>`);
    }
    await addOrUpdatePresence(auteur_Message, choix);
    repondre(`✅ Présence mise à jour : *${choix}*`);
});

// ------------------------------------------------------------------
// broadcast : Envoyer un message à tous les groupes
// ------------------------------------------------------------------
menmacmd({
    name: "broadcast",
    alias: ["bc"],
    classe: "owner",
    react: "📢",
    desc: "Envoyer un message à tous les groupes"
}, async (ms_org, menma, { repondre, dev_id, arg, ms }) => {
    if (!dev_id) return repondre("❌ Commande réservée au owner.");
    const msg = arg.join(" ");
    if (!msg) return repondre("❌ Donne un message à diffuser.");

    try {
        const groups = await menma.groupFetchAllParticipating();
        const groupIds = Object.keys(groups);
        let sent = 0;
        for (const gid of groupIds) {
            try {
                await menma.sendMessage(gid, { text: `📢 *Broadcast Menma-MD*\n\n${msg}` });
                sent++;
            } catch { }
        }
        repondre(`✅ Message envoyé à *${sent}* groupe(s).`);
    } catch (e) {
        repondre(`❌ Erreur : ${e.message}`);
    }
});

// ------------------------------------------------------------------
// setmode : Changer le mode du bot (public / prive)
// ------------------------------------------------------------------
menmacmd({
    name: "setmode",
    alias: ["mode"],
    classe: "owner",
    react: "⚙️",
    desc: "Changer le mode du bot (public / prive)"
}, async (ms_org, menma, { repondre, dev_id, arg }) => {
    if (!dev_id) return repondre("❌ Commande réservée au owner.");
    const choix = arg[0]?.toLowerCase();
    if (!["public", "prive"].includes(choix)) {
        return repondre(`╭───〔 ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 〕───⬣\n│ *Usage* : ${prefixe}setmode <public | prive>\n╰──────────────────⬣`);
    }
    const config = require("../config");
    config.MODE = choix;
    repondre(`✅ Mode du bot changé en *${choix}*.`);
});

// ------------------------------------------------------------------
// restart : Redémarrer le bot (via PM2)
// ------------------------------------------------------------------
menmacmd({
    name: "restart",
    alias: ["reboot"],
    classe: "owner",
    react: "🔄",
    desc: "Redémarrer le bot"
}, async (ms_org, menma, { repondre, dev_id }) => {
    if (!dev_id) return repondre("❌ Commande réservée au propriétaire.");

    await repondre("🔄 Redémarrage en cours...");
    setTimeout(() => {
        process.exit(); // PM2 redémarrera le processus automatiquement
    }, 1000);
});