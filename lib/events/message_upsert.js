/**
 * @file message_upsert.js
 * @description Gestionnaire principal des messages. Traite chaque message entrant,
 * gère la sécurité (antilink, antibot) et route les commandes.
 */

const config = require("../../config");
const { getContentType, jidDecode } = require("ovl_wa_baileys");
const { preseceRecupAction } = require("../../Database/presence");
const { verifstatutJid, recupActionJid } = require("../../Database/antilien");
const { atbVerifStatutJid, atbRecupActionJid } = require("../../Database/antibot");
const { getAllSudoNumbers } = require("../../Database/sudo");
const { exec } = require("child_process");
const path = require("path");
let evt = require(path.join(__dirname, "..", "menmacmd"));
const nomBot = process.env.NOM_BOT;
const dev = process.env.DEV || "Dr Djibi";

// Cache pour les métadonnées de groupe (évite les timeouts Baileys)
const groupCache = new Map();

/**
 * Décode un JID dans un format propre (supprime le :numéro des JIDs multi-device).
 * Exemple : 224625968097:12@s.whatsapp.net → 224625968097@s.whatsapp.net
 */
const decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
        const decode = jidDecode(jid) || {};
        return decode.user && decode.server ? `${decode.user}@${decode.server}` : jid;
    }
    return jid;
};

/**
 * Extrait uniquement la partie numérique d'un JID (sans @serveur)
 * Exemple : 224625968097@s.whatsapp.net → "224625968097"
 */
const getNumber = (jid) => {
    if (!jid) return "";
    return decodeJid(jid).split("@")[0].replace(/\D/g, "");
};

/**
 * Résout un LID (@lid) vers un JID téléphone en cherchant dans la liste des
 * participants du groupe — exactement comme OVL fait avec getJid.
 *
 * Dans WhatsApp Multi-Device, chaque participant a deux identifiants :
 *   - son JID téléphone : 224625968097@s.whatsapp.net
 *   - son LID          : 209320012689544@lid
 *
 * Baileys stocke parfois le LID dans ms.key.participant. On résout en
 * cherchant dans groupMetadata().participants le membre dont le LID correspond.
 *
 * @param {string} jid         - Le JID à résoudre (peut être un LID)
 * @param {Array}  participants - Liste des participants du groupe
 * @returns {string} Le JID téléphone résolu, ou le JID original si non trouvé
 */
const resolveLid = (jid, participants = []) => {
    if (!jid) return jid;
    // Si ce n'est pas un LID, rien à faire
    if (!jid.endsWith("@lid")) return jid;

    const lidNum = jid.split("@")[0];

    // Cherche dans les participants le membre dont le LID correspond
    for (const p of participants) {
        // Baileys peut exposer p.lid ou p.lidJid selon la version
        const memberLid = (p.lid || p.lidJid || "").split("@")[0];
        if (memberLid && memberLid === lidNum) {
            // Retourne le JID téléphone du membre
            return decodeJid(p.id);
        }
    }

    // Fallback : retourne tel quel (on extraira le numéro nu)
    return jid;
};

/**
 * Gestionnaire principal des messages entrants.
 * @param {Object} m - L'objet du message entrant de Baileys.
 * @param {Object} menma - L'instance WASocket.
 */
async function messages_upsert(m, menma) {
    const { messages } = m;
    const ms = messages[0];
    if (!ms || !ms.message) return;

    // --- Extraction du Contenu du Message & Métadonnées ---
    let mtype = getContentType(ms.message);
    let msgContent = ms.message;

    if (mtype === "ephemeralMessage" || mtype === "viewOnceMessage" || mtype === "viewOnceMessageV2" || mtype === "documentWithCaptionMessage") {
        msgContent = msgContent[mtype].message;
        mtype = getContentType(msgContent);
    }

    const texte = {
        conversation: msgContent.conversation,
        imageMessage: msgContent.imageMessage?.caption,
        videoMessage: msgContent.videoMessage?.caption,
        extendedTextMessage: msgContent.extendedTextMessage?.text,
        buttonsResponseMessage: msgContent.buttonsResponseMessage?.selectedButtonId,
        listResponseMessage: msgContent.listResponseMessage?.singleSelectReply?.selectedRowId,
        messageContextInfo: msgContent.buttonsResponseMessage?.selectedButtonId ||
            msgContent.listResponseMessage?.singleSelectReply?.selectedRowId || msgContent.text
    }[mtype] || "";

    // Gestion du préfixe
    let pri = config.PREFIX;
    let prefixe = (pri == "null" || pri == "undefined" || pri == "") ? "" : config.PREFIX;
    const verif_Cmd = texte ? texte.startsWith(prefixe) : false;

    const pseudo = ms.pushName || "Inconnu";

    // --- IDs Bot ---
    const id_Bot = decodeJid(menma.user.id);
    const id_Bot_N = id_Bot.split("@")[0];

    // --- Déterminer si on est dans un groupe ---
    let ms_org = decodeJid(ms.key.remoteJid);
    const verif_Gp = ms_org?.endsWith("@g.us");

    if (ms.key.fromMe && !verif_Gp) {
        if (ms_org === id_Bot || ms_org === "status@broadcast" || ms_org === "") {
            ms_org = id_Bot; // Utiliser le JID normalisé du bot pour réagir au propre message envoyé
        }
    }

    // Numéro du propriétaire depuis la config (nettoyé)
    const bare_owner = config.OWNER.replace(/\D/g, "");
    // LID du propriétaire (optionnel dans .env comme OWNER_LID)
    const bare_lid = (config.OWNER_LID || "").replace(/\D/g, "");

    // Numéro du bot (nettoyé)
    const bare_bot = id_Bot_N.replace(/\D/g, "");

    // Dans un groupe : l'auteur = participant (peut être LID @lid ou phone @s.whatsapp.net)
    // En DM : l'auteur = soit le bot (fromMe), soit le remoteJid
    let auteur_raw;
    if (verif_Gp) {
        auteur_raw = ms.key.participant || ms.key.remoteJid;
    } else {
        auteur_raw = ms.key.fromMe ? menma.user.id : ms.key.remoteJid;
    }

    // --- Métadonnées Groupe ---
    let infos_Gp = {};
    if (verif_Gp) {
        if (groupCache.has(ms_org)) {
            infos_Gp = groupCache.get(ms_org);
        } else {
            try {
                infos_Gp = await menma.groupMetadata(ms_org);
                groupCache.set(ms_org, infos_Gp);
                // Vider le cache après 5 minutes pour rester à jour
                setTimeout(() => groupCache.delete(ms_org), 5 * 60 * 1000);
            } catch {
                infos_Gp = {};
            }
        }
    }
    const nom_Gp = verif_Gp ? (infos_Gp.subject || "Groupe Inconnu") : "";
    const raw_participants = infos_Gp.participants || [];

    // ================================================================
    // RÉSOLUTION DU LID
    // ================================================================
    let auteur_Message;
    if (verif_Gp && auteur_raw && auteur_raw.endsWith("@lid")) {
        const auteur_message_raw_resolved = resolveLid(auteur_raw, raw_participants);
        auteur_Message = decodeJid(auteur_message_raw_resolved);
    } else {
        auteur_Message = decodeJid(auteur_raw);
    }

    const auteur_num = getNumber(auteur_Message);
    // Numéro brut du participant (même si LID non résolu, on le garde pour backup)
    const auteur_lid_num = auteur_raw ? auteur_raw.split("@")[0].replace(/\D/g, "") : "";

    // Sudo
    const user_sudo = await getAllSudoNumbers();
    const sudo_nums = user_sudo.map(s => String(s).replace(/\D/g, ""));

    // ================================================================
    // LOGIQUE OWNER : fromMe OU numéro téléphone OU LID correspond au owner
    // ================================================================
    const is_Owner = ms.key.fromMe                  // Envoyé par notre propre device
        || auteur_num === bare_owner                 // Numéro résolu = owner
        || auteur_num === bare_bot                   // Numéro résolu = bot
        || (bare_lid && auteur_lid_num === bare_lid) // LID brut = OWNER_LID du .env
        || (bare_lid && auteur_num === bare_lid)
        || auteur_raw === config.OWNER_LID;          // Comparaison directe avec le JID LID complet (backup)

    // premium_id = owner OU sudo
    const premium_id = is_Owner || sudo_nums.includes(auteur_num);

    // dev_id = owner uniquement (pour les commandes sensibles)
    const dev_id = is_Owner;

    // --- Données Participants ---
    const mbre_membre = verif_Gp ? raw_participants.map(p => ({ ...p, id: decodeJid(p.id) })) : [];
    const membre_Gp = verif_Gp ? auteur_Message : "";

    // Admins du groupe
    const groupe_Admin_fn = (participants) => participants.filter(p => p.admin).map(p => p.id);
    const admins = verif_Gp ? groupe_Admin_fn(mbre_membre) : [];
    const verif_menmaAdmin = verif_Gp ? admins.includes(id_Bot) : false;
    const verif_Admin = verif_Gp ? (admins.includes(auteur_Message) || is_Owner) : false;

    // --- Commande ---
    const cmds = verif_Cmd ? texte.slice(prefixe.length).trim().split(/ +/).shift().toLowerCase() : false;
    const arg = texte ? texte.trim().split(/ +/).slice(1) : [];

    // Messages cités (réponses)
    const msg_Repondu = msgContent?.extendedTextMessage?.contextInfo?.quotedMessage;
    const auteur_Msg_Repondu_raw = msgContent?.extendedTextMessage?.contextInfo?.participant;
    const auteur_Msg_Repondu = decodeJid(auteur_Msg_Repondu_raw);
    const mr = msgContent?.extendedTextMessage?.contextInfo?.mentionedJid || [];

    // --- Mise à Jour Automatique de la Présence ---
    try {
        const choix = (await preseceRecupAction(auteur_Message)).toLowerCase();
        if (choix === "enline") await menma.sendPresenceUpdate("available", ms_org);
        else if (choix === "ecrit") await menma.sendPresenceUpdate("composing", ms_org);
        else if (choix === "audio") await menma.sendPresenceUpdate("recording", ms_org);
    } catch { }

    // Lecture automatique des Status
    if (ms.key?.remoteJid === "status@broadcast" && config.STATUS === "oui") {
        menma.readMessages([ms.key]);
    }

    /**
     * Fonction de réponse facile (avec citation).
     * Sécurisée pour les LIDs et les groupes.
     */
    async function repondre(message) {
        const quote = ms.key.fromMe ? undefined : ms;
        try {
            return await menma.sendMessage(ms_org, { text: message }, { quoted: quote });
        } catch (err) {
            console.log(`[ERR] Échec envoi réponse avec citation : ${err.message}`);
            // Fallback sans citation en cas d'erreur technique (ex: LID incompatible avec citation)
            return await menma.sendMessage(ms_org, { text: message }).catch(e => {
                console.log(`[ERR] Échec critique envoi réponse : ${e.message}`);
            });
        }
    }

    /**
     * Réaction sur le message.
     */
    async function reagir(emoji) {
        try {
            await menma.sendMessage(ms_org, { react: { text: emoji, key: ms.key } });
        } catch { }
    }

    // Objet d'options complet passé aux plugins
    const com_options = {
        pseudo, dest: menma.user.id, ms_org, id_Bot, id_Bot_N,
        verif_Gp, msg_Repondu, auteur_Msg_Repondu, mr, ms,
        auteur_Message, membre_Gp, arg, premium_id, infos_Gp,
        nom_Gp, mbre_membre, dev_id, prefixe, repondre,
        groupe_Admin: groupe_Admin_fn, verif_menmaAdmin, admins,
        verif_Cmd, is_Owner, verif_Admin, reagir
    };

    // --- Journalisation Console ---
    const owner_tag = is_Owner ? " 👑[OWNER]" : "";
    const group_tag = verif_Gp ? ` [${nom_Gp}]` : "";
    console.log(`╔══════════════════════════════════════════════════⬣`);
    console.log(`║ 📩 ${nomBot}${owner_tag}${group_tag.slice(0, 30)}${group_tag.length > 30 ? "..." : ""}`);
    if (verif_Gp) {
        console.log(`╟──────────────────────────────────────────────────`);
        console.log(`║ 👥 GROUPE  : ${nom_Gp}`);
    }
    console.log(`║ 👤 AUTEUR  : ${pseudo} (${auteur_num})`);
    console.log(`║ 📑 TYPE    : ${mtype}`);
    if (texte) {
        console.log(`╟──────────────────────────────────────────────────`);
        console.log(`║ 📝 TEXTE   : ${texte.slice(0, 100)}${texte.length > 100 ? "..." : ""}`);
    }
    if (verif_Cmd) console.log(`║ ⚡ CMD     : ${cmds}`);
    console.log(`╚══════════════════════════════════════════════════⬣\n`);

    // --- Couches de Sécurité (Uniquement pour les messages tiers) ---
    if (!is_Owner) {
        // --- Antilink ---
        if (texte && (texte.includes("https://") || texte.includes("http://"))) {
            try {
                const antil = await verifstatutJid(ms_org);
                if (verif_Gp && verif_menmaAdmin && antil === "oui") {
                    const type = (await recupActionJid(ms_org)).toLowerCase();
                    const user = auteur_num;
                    switch (type) {
                        case "supp":
                            await menma.sendMessage(ms_org, { text: `@${user}, il est interdit d'envoyer des liens dans ce groupe.`, mentions: [auteur_Message] }, { quoted: ms });
                            await menma.sendMessage(ms_org, { delete: ms.key });
                            break;
                        case "kick":
                            await menma.sendMessage(ms_org, { text: `@${user} a été retiré pour avoir envoyé un lien.`, mentions: [auteur_Message] }, { quoted: ms });
                            await menma.sendMessage(ms_org, { delete: ms.key });
                            await menma.groupParticipantsUpdate(ms_org, [auteur_Message], "remove");
                            break;
                    }
                }
            } catch { }
        }

        // --- Antibot ---
        const botMsg = ms.key?.id?.startsWith("BAES") && ms.key?.id?.length === 16;
        const baileysMsg = ms.key?.id?.startsWith("BAE5") && ms.key?.id?.length === 16;
        if (botMsg || baileysMsg) {
            try {
                const settings = await atbVerifStatutJid(ms_org);
                if (verif_Gp && settings === "oui" && verif_menmaAdmin) {
                    const action = await atbRecupActionJid(ms_org);
                    switch (action) {
                        case "supp":
                            await menma.sendMessage(ms_org, { text: `*_@${auteur_num}, les bots ne sont pas autorisés ici._*`, mentions: [auteur_Message] });
                            await menma.sendMessage(ms_org, { delete: ms.key });
                            break;
                        case "kick":
                            await menma.sendMessage(ms_org, { text: `@${auteur_num} a été retiré pour avoir utilisé un bot.`, mentions: [auteur_Message] });
                            await menma.sendMessage(ms_org, { delete: ms.key });
                            await menma.groupParticipantsUpdate(ms_org, [auteur_Message], "remove");
                            break;
                    }
                }
            } catch { }
        }
    }

    // --- Commandes d'Évaluation & Débogage (Owner/Dev Uniquement) ---
    if (texte && texte.startsWith(">") && dev_id) {
        try {
            const code = texte.slice(1).trim();
            let result = await eval(code);
            if (typeof result === "object") result = JSON.stringify(result, null, 2);
            return menma.sendMessage(ms_org, { text: `\`\`\`\n${result}\n\`\`\`` }, { quoted: ms });
        } catch (err) {
            return menma.sendMessage(ms_org, { text: `❌ Erreur : ${err.message}` }, { quoted: ms });
        }
    }

    if (texte && texte.startsWith("$") && dev_id) {
        exec(texte.slice(1).trim(), (err, stdout, stderr) => {
            const out = err ? err.message : (stdout || stderr || "OK");
            menma.sendMessage(ms_org, { text: `\`\`\`\n${out.trim()}\n\`\`\`` }, { quoted: ms });
        });
        return;
    }

    // --- Déclenchement des Commandes ---
    if (verif_Cmd && cmds) {
        // Rechargement dynamique des commandes (plugins chargés à la demande)
        evt = require(path.join(__dirname, "..", "menmacmd"));
        const cd = evt.commands.find((cmd) => cmd.name === cmds || (cmd.alias && cmd.alias.includes(cmds)));

        if (cd) {
            try {
                // En mode privé, seul le premium_id peut exécuter
                if (config.MODE !== "public" && !premium_id) {
                    return repondre("❌ Le bot est en mode privé. Seul le propriétaire peut l'utiliser.");
                }
                // Réaction (non bloquante)
                reagir(cd.react || "🍷").catch(() => { });
                // Exécution de la commande
                await cd.fonction(ms_org, menma, com_options);
            } catch (e) {
                console.log("[ERR] Commande '" + cmds + "' : " + e.message);
                repondre("❌ Erreur lors de l'exécution de la commande : " + e.message);
            }
        }
    }
}

module.exports = { messages_upsert };
