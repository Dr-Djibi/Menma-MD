/**
 * @file outils.js
 * @description Commandes de gestion de groupe (style OVL-MD-V2).
 */

const { menmacmd } = require("../lib/menmacmd");

// ------------------------------------------------------------------
// kick : Exclure un membre du groupe
// ------------------------------------------------------------------
menmacmd({
    name: "kick",
    alias: ["virer", "retirer"],
    classe: "groupe",
    react: "🦶",
    desc: "Exclure un membre du groupe"
}, async (ms_org, menma, { repondre, verif_Gp, verif_menmaAdmin, verif_Admin, mr, auteur_Msg_Repondu, ms }) => {
    if (!verif_Gp) return repondre("❌ Commande réservée aux groupes.");
    if (!verif_Admin) return repondre("❌ Seuls les admins peuvent faire ça.");
    if (!verif_menmaAdmin) return repondre("❌ Je dois être admin pour exclure quelqu'un.");

    const cible = (mr && mr[0]) || auteur_Msg_Repondu;
    if (!cible) return repondre("╭───〔 ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 〕───⬣\n│ *Usage* : Mentionne ou réponds\n│ au message du membre.\n╰──────────────────────────────⬣");

    try {
        await menma.groupParticipantsUpdate(ms_org, [cible], "remove");
        repondre(`✅ @${cible.split("@")[0]} a été exclu du groupe.`);
    } catch (e) {
        repondre(`❌ Erreur : ${e.message}`);
    }
});

// ------------------------------------------------------------------
// add : Ajouter un membre au groupe
// ------------------------------------------------------------------
menmacmd({
    name: "add",
    alias: ["ajouter"],
    classe: "groupe",
    react: "➕",
    desc: "Ajouter un membre au groupe"
}, async (ms_org, menma, { repondre, verif_Gp, verif_menmaAdmin, verif_Admin, arg }) => {
    if (!verif_Gp) return repondre("❌ Commande réservée aux groupes.");
    if (!verif_Admin) return repondre("❌ Seuls les admins peuvent faire ça.");
    if (!verif_menmaAdmin) return repondre("❌ Je dois être admin pour ajouter quelqu'un.");

    let numero = arg[0];
    if (!numero) return repondre("╭───〔 ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 〕───⬣\n│ *Usage* : ${prefixe}add <numéro>\n│ *Ex* : ${prefixe}add 224625xxxxxx\n╰──────────────────────────────⬣");
    numero = numero.replace(/\D/g, "");
    const jid = `${numero}@s.whatsapp.net`;

    try {
        await menma.groupParticipantsUpdate(ms_org, [jid], "add");
        repondre(`✅ @${numero} a été ajouté au groupe.`);
    } catch (e) {
        repondre(`❌ Erreur : ${e.message}`);
    }
});

// ------------------------------------------------------------------
// promote : Promouvoir un membre en admin
// ------------------------------------------------------------------
menmacmd({
    name: "promote",
    alias: ["admin", "promouvoir"],
    classe: "groupe",
    react: "🔺",
    desc: "Promouvoir un membre en administrateur"
}, async (ms_org, menma, { repondre, verif_Gp, verif_menmaAdmin, verif_Admin, mr, auteur_Msg_Repondu }) => {
    if (!verif_Gp) return repondre("❌ Commande réservée aux groupes.");
    if (!verif_Admin) return repondre("❌ Seuls les admins peuvent faire ça.");
    if (!verif_menmaAdmin) return repondre("❌ Je dois être admin pour promouvoir.");

    const cible = (mr && mr[0]) || auteur_Msg_Repondu;
    if (!cible) return repondre("╭───〔 ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 〕───⬣\n│ *Usage* : Mentionne ou réponds\n│ au membre à promouvoir.\n╰──────────────────────────────⬣");

    try {
        await menma.groupParticipantsUpdate(ms_org, [cible], "promote");
        repondre(`✅ @${cible.split("@")[0]} est maintenant administrateur !`);
    } catch (e) {
        repondre(`❌ Erreur : ${e.message}`);
    }
});

// ------------------------------------------------------------------
// demote : Rétrograder un admin
// ------------------------------------------------------------------
menmacmd({
    name: "demote",
    alias: ["deadmin", "retrograder"],
    classe: "groupe",
    react: "🔻",
    desc: "Retirer le rôle d'admin à un membre"
}, async (ms_org, menma, { repondre, verif_Gp, verif_menmaAdmin, verif_Admin, mr, auteur_Msg_Repondu }) => {
    if (!verif_Gp) return repondre("❌ Commande réservée aux groupes.");
    if (!verif_Admin) return repondre("❌ Seuls les admins peuvent faire ça.");
    if (!verif_menmaAdmin) return repondre("❌ Je dois être admin pour rétrograder.");

    const cible = (mr && mr[0]) || auteur_Msg_Repondu;
    if (!cible) return repondre("╭───〔 ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 〕───⬣\n│ *Usage* : Mentionne ou réponds\n│ à l'admin à rétrograder.\n╰──────────────────────────────⬣");

    try {
        await menma.groupParticipantsUpdate(ms_org, [cible], "demote");
        repondre(`✅ @${cible.split("@")[0]} n'est plus administrateur.`);
    } catch (e) {
        repondre(`❌ Erreur : ${e.message}`);
    }
});

// ------------------------------------------------------------------
// tagall : Mentionner tous les membres du groupe
// ------------------------------------------------------------------
menmacmd({
    name: "tagall",
    alias: ["mentionall", "touslemonde"],
    classe: "groupe",
    react: "📣",
    desc: "Mentionner tous les membres du groupe"
}, async (ms_org, menma, { repondre, verif_Gp, verif_Admin, mbre_membre, arg }) => {
    if (!verif_Gp) return repondre("❌ Commande réservée aux groupes.");
    if (!verif_Admin) return repondre("❌ Seuls les admins peuvent faire ça.");

    const msg = arg.join(" ") || "📣 Attention tout le monde !";
    const mentions = mbre_membre.map(p => p.id);
    const text = msg + "\n\n" + mentions.map(j => `@${j.split("@")[0]}`).join(" ");

    try {
        await menma.sendMessage(ms_org, { text, mentions });
    } catch (e) {
        repondre(`❌ Erreur : ${e.message}`);
    }
});

// ------------------------------------------------------------------
// hidetag : Mentionner tous les membres discrètement (message invisible)
// ------------------------------------------------------------------
menmacmd({
    name: "hidetag",
    alias: ["h", "hidtag"],
    classe: "groupe",
    react: "👻",
    desc: "Mentionner tous les membres discrètement"
}, async (ms_org, menma, { repondre, verif_Gp, verif_Admin, mbre_membre, arg, ms }) => {
    if (!verif_Gp) return repondre("❌ Commande réservée aux groupes.");
    if (!verif_Admin) return repondre("❌ Seuls les admins peuvent faire ça.");

    const msg = arg.join(" ") || "👻";
    const mentions = mbre_membre.map(p => p.id);

    try {
        await menma.sendMessage(ms_org, { text: msg, mentions }, { quoted: ms });
    } catch (e) {
        repondre(`❌ Erreur : ${e.message}`);
    }
});

// ------------------------------------------------------------------
// open : Ouvrir le groupe (tout le monde peut écrire)
// ------------------------------------------------------------------
menmacmd({
    name: "open",
    alias: ["ouvrir", "ouvrirgroupe"],
    classe: "groupe",
    react: "🔓",
    desc: "Ouvrir le groupe"
}, async (ms_org, menma, { repondre, verif_Gp, verif_menmaAdmin, verif_Admin }) => {
    if (!verif_Gp) return repondre("❌ Commande réservée aux groupes.");
    if (!verif_Admin) return repondre("❌ Seuls les admins peuvent faire ça.");
    if (!verif_menmaAdmin) return repondre("❌ Je dois être admin.");

    try {
        await menma.groupSettingUpdate(ms_org, "not_announcement");
        repondre("🔓 Groupe ouvert ! Tout le monde peut écrire.");
    } catch (e) {
        repondre(`❌ Erreur : ${e.message}`);
    }
});

// ------------------------------------------------------------------
// close : Fermer le groupe (admins uniquement)
// ------------------------------------------------------------------
menmacmd({
    name: "close",
    alias: ["fermer", "fermergroupe"],
    classe: "groupe",
    react: "🔒",
    desc: "Fermer le groupe (admins seulement)"
}, async (ms_org, menma, { repondre, verif_Gp, verif_menmaAdmin, verif_Admin }) => {
    if (!verif_Gp) return repondre("❌ Commande réservée aux groupes.");
    if (!verif_Admin) return repondre("❌ Seuls les admins peuvent faire ça.");
    if (!verif_menmaAdmin) return repondre("❌ Je dois être admin.");

    try {
        await menma.groupSettingUpdate(ms_org, "announcement");
        repondre("🔒 Groupe fermé ! Seuls les admins peuvent écrire.");
    } catch (e) {
        repondre(`❌ Erreur : ${e.message}`);
    }
});

// ------------------------------------------------------------------
// listmembers : Lister les membres du groupe
// ------------------------------------------------------------------
menmacmd({
    name: "listmembers",
    alias: ["membres", "listmembre"],
    classe: "groupe",
    react: "👥",
    desc: "Lister tous les membres du groupe"
}, async (ms_org, menma, { repondre, verif_Gp, mbre_membre, nom_Gp }) => {
    if (!verif_Gp) return repondre("❌ Commande réservée aux groupes.");

    const admins = mbre_membre.filter(p => p.admin).map(p => `👑 +${p.id.split("@")[0]}`);
    const members = mbre_membre.filter(p => !p.admin).map(p => `👤 +${p.id.split("@")[0]}`);

    let msg = `👥 *Membres de « ${nom_Gp} »* (${mbre_membre.length})\n\n`;
    if (admins.length) msg += `*Admins (${admins.length}) :*\n${admins.join("\n")}\n\n`;
    if (members.length) msg += `*Membres (${members.length}) :*\n${members.join("\n")}`;

    repondre(msg);
});

// ------------------------------------------------------------------
// setdesc : Changer la description du groupe
// ------------------------------------------------------------------
menmacmd({
    name: "setdesc",
    alias: ["desc", "description"],
    classe: "groupe",
    react: "📝",
    desc: "Changer la description du groupe"
}, async (ms_org, menma, { repondre, verif_Gp, verif_menmaAdmin, verif_Admin, arg }) => {
    if (!verif_Gp) return repondre("❌ Commande réservée aux groupes.");
    if (!verif_Admin) return repondre("❌ Seuls les admins peuvent faire ça.");
    if (!verif_menmaAdmin) return repondre("❌ Je dois être admin.");

    const desc = arg.join(" ");
    if (!desc) return repondre("╭───〔 ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 〕───⬣\n│ *Usage* : ${prefixe}setdesc <texte>\n╰──────────────────────────────⬣");

    try {
        await menma.groupUpdateDescription(ms_org, desc);
        repondre(`✅ Description mise à jour.`);
    } catch (e) {
        repondre(`❌ Erreur : ${e.message}`);
    }
});

// ------------------------------------------------------------------
// setname : Changer le nom/sujet du groupe
// ------------------------------------------------------------------
menmacmd({
    name: "setname",
    alias: ["renommer", "nomgroupe"],
    classe: "groupe",
    react: "✏️",
    desc: "Changer le nom du groupe"
}, async (ms_org, menma, { repondre, verif_Gp, verif_menmaAdmin, verif_Admin, arg }) => {
    if (!verif_Gp) return repondre("❌ Commande réservée aux groupes.");
    if (!verif_Admin) return repondre("❌ Seuls les admins peuvent faire ça.");
    if (!verif_menmaAdmin) return repondre("❌ Je dois être admin.");

    const nom = arg.join(" ");
    if (!nom) return repondre("╭───〔 ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 〕───⬣\n│ *Usage* : ${prefixe}setname <texte>\n╰──────────────────────────────⬣");

    try {
        await menma.groupUpdateSubject(ms_org, nom);
        repondre(`✅ Nom du groupe changé en : *${nom}*`);
    } catch (e) {
        repondre(`❌ Erreur : ${e.message}`);
    }
});

// ------------------------------------------------------------------
// linkgroupe : Obtenir le lien d'invitation du groupe
// ------------------------------------------------------------------
menmacmd({
    name: "linkgroupe",
    alias: ["link", "invitelink"],
    classe: "groupe",
    react: "🔗",
    desc: "Obtenir le lien d'invitation du groupe"
}, async (ms_org, menma, { repondre, verif_Gp, verif_menmaAdmin, verif_Admin }) => {
    if (!verif_Gp) return repondre("❌ Commande réservée aux groupes.");
    if (!verif_Admin) return repondre("❌ Seuls les admins peuvent faire ça.");
    if (!verif_menmaAdmin) return repondre("❌ Je dois être admin.");

    try {
        const code = await menma.groupInviteCode(ms_org);
        repondre(`🔗 Lien d'invitation :\nhttps://chat.whatsapp.com/${code}`);
    } catch (e) {
        repondre(`❌ Erreur : ${e.message}`);
    }
});

// ------------------------------------------------------------------
// infogroupe : Informations du groupe
// ------------------------------------------------------------------
menmacmd({
    name: "infogroupe",
    alias: ["groupinfo", "infogp"],
    classe: "groupe",
    react: "ℹ️",
    desc: "Afficher les informations du groupe"
}, async (ms_org, menma, { repondre, verif_Gp, infos_Gp, mbre_membre, admins }) => {
    if (!verif_Gp) return repondre("❌ Commande réservée aux groupes.");

    const creation = infos_Gp.creation
        ? new Date(infos_Gp.creation * 1000).toLocaleDateString("fr-FR")
        : "Inconnue";

    const msg = `ℹ️ *Informations du groupe*

📛 *Nom :* ${infos_Gp.subject || "N/A"}
👥 *Membres :* ${mbre_membre.length}
👑 *Admins :* ${admins.length}
📅 *Créé le :* ${creation}
📝 *Description :*
${infos_Gp.desc || "Aucune description"}`;

    repondre(msg);
});
