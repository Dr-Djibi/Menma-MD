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

/**
 * Gestionnaire principal des messages entrants.
 * @param {Object} m - L'objet du message entrant de Baileys.
 * @param {Object} menma - L'instance WASocket.
 */
async function messages_upsert(m, menma) {
    const { messages } = m;
    const ms = messages[0];
    if (!ms.message) return;

    /**
     * Décode un JID dans un format propre (supprime le :numéro des JIDs multi-device).
     */
    const decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            const decode = jidDecode(jid) || {};
            return decode.user && decode.server ? `${decode.user}@${decode.server}` : jid;
        } else {
            return jid;
        }
    };

    // --- Extraction du Contenu du Message & Métadonnées ---
    const mtype = getContentType(ms.message);
    const texte = {
        conversation: ms.message.conversation,
        imageMessage: ms.message.imageMessage?.caption,
        videoMessage: ms.message.videoMessage?.caption,
        extendedTextMessage: ms.message.extendedTextMessage?.text,
        buttonsResponseMessage: ms.message.buttonsResponseMessage?.selectedButtonId,
        listResponseMessage: ms.message.listResponseMessage?.singleSelectReply?.selectedRowId,
        messageContextInfo: ms.message.buttonsResponseMessage?.selectedButtonId ||
            ms.message.listResponseMessage?.singleSelectReply?.selectedRowId || ms.text
    }[mtype] || "";

    const pseudo = ms.pushName;
    const dest = menma.user.id;
    const ms_org = ms.key.remoteJid;
    const id_Bot = decodeJid(menma.user.id);
    const id_Bot_N = id_Bot.split('@')[0];
    const verif_Gp = ms_org?.endsWith("@g.us");

    // Logique pour les messages cités (réponses)
    const msg_Repondu = ms.message.extendedTextMessage?.contextInfo?.quotedMessage;
    const auteur_Msg_Repondu = decodeJid(ms.message.extendedTextMessage?.contextInfo?.participant);
    const mr = ms.message.extendedTextMessage?.contextInfo?.mentionedJid;

    const auteur_Message = verif_Gp ? ms.key.participant : decodeJid(ms.key.fromMe ? id_Bot : ms.key.remoteJid);
    const arg = texte ? texte.trim().split(/ +/).slice(1) : null;

    // Gestion du préfixe
    let pri = config.PREFIX;
    let prefixe = (pri == "null" || pri == "undefined" || pri == "") ? "" : config.PREFIX;

    // Identification de la commande
    const verif_Cmd = texte ? texte.startsWith(prefixe) : false;
    const infos_Gp = verif_Gp ? await menma.groupMetadata(ms_org) : "";
    const nom_Gp = verif_Gp ? infos_Gp.subject : "";
    const membre_Gp = verif_Gp ? ms.key.participant : '';
    const mbre_membre = verif_Gp ? await infos_Gp.participants : '';

    // Gestion des administrateurs
    const groupe_Admin = (participants) => participants.filter((m) => m.admin).map((m) => m.id);
    const admins = verif_Gp ? groupe_Admin(mbre_membre) : '';
    const verif_menmaAdmin = verif_Gp ? admins.includes(id_Bot) : false;
    const cmds = verif_Cmd ? texte.slice(prefixe.length).trim().split(/ +/).shift().toLowerCase() : false;

    // Vérification du Développeur & Sudo
    const menmadev = '224625968097';
    const menmabot = '224625968097';
    const devNumbers = [menmadev, menmabot];
    const user_sudo = await getAllSudoNumbers();

    // Regroupement de tous les IDs autorisés
    const premium_Users_id = [menmadev, menmabot, id_Bot_N, config.OWNER, ...user_sudo]
        .flat()
        .map((s) => (typeof s === 'string' ? `${s.replace(/[^0-9]/g, "")}@s.whatsapp.net` : ''));

    const premium_id = premium_Users_id.includes(auteur_Message);
    const dev_id = devNumbers.map((s) => s.replace(/[^0-9]/g, '') + "@s.whatsapp.net").includes(auteur_Message);

    // --- Mise à Jour Automatique de la Présence ---
    var choix = preseceRecupAction(auteur_Message).toLowerCase();

    if (choix === "enline") {
        await menma.sendPresenceUpdate("available", ms_org);
    } else if (choix === "ecrit") {
        await menma.sendPresenceUpdate("composing", ms_org);
    } else if (choix === "audio") {
        await menma.sendPresenceUpdate("recording", ms_org);
    }

    /**
     * Aide : Fonction de réponse facile.
     */
    function repondre(message) {
        menma.sendMessage(ms_org, { text: message }, { quoted: ms });
    }

    // Objet d'options complet passé aux fonctions de commande
    const com_options = {
        pseudo, dest, ms_org, id_Bot, id_Bot_N, verif_Gp, msg_Repondu,
        auteur_Msg_Repondu, mr, ms, auteur_Message, membre_Gp, arg,
        premium_id, infos_Gp, nom_Gp, mbre_membre, dev_id, prefixe,
        repondre, groupe_Admin, verif_menmaAdmin, admins, verif_Cmd
    };

    // --- Lecture Automatique des Status ---
    if (ms.key && ms.key.remoteJid === 'status@broadcast' && config.STATUS === "oui") {
        menma.readMessages([ms.key]);
    }

    // --- Couche de Sécurité : Antilink ---
    if (texte.includes('https://') || texte.includes('http://')) {
        const antil = await verifstatutJid(ms_org);
        if (verif_Gp && verif_menmaAdmin && antil === 'oui') {
            const type = (await recupActionJid(ms_org)).toLowerCase();
            const user = auteur_Message.split('@')[0];
            switch (type) {
                case 'supp':
                    await menma.sendMessage(ms_org, { text: `@${user}, il est interdit d'envoyer des liens dans ce groupe.`, mentions: [auteur_Message] }, { quoted: ms });
                    await menma.sendMessage(ms_org, { delete: ms.key });
                    break;
                case 'kick':
                    await menma.sendMessage(ms_org, { text: `@${user} a été retiré pour avoir envoyé un lien dans ce groupe.`, mentions: [auteur_Message] }, { quoted: ms });
                    await menma.sendMessage(ms_org, { delete: ms.key });
                    await menma.groupParticipantsUpdate(ms_org, [auteur_Message], "remove");
                    break;
            }
        }
    }

    // --- Couche de Sécurité : Antibot ---
    const botMsg = ms.key?.id?.startsWith('BAES') && ms.key?.id?.length === 16;
    const baileysMsg = ms.key?.id?.startsWith('BAE5') && ms.key?.id?.length === 16;

    if (botMsg || baileysMsg) {
        const settings = await atbVerifStatutJid(ms_org);
        if (verif_Gp && settings === 'oui') {
            if (verif_menmaAdmin) {
                const action = await atbRecupActionJid(ms_org);
                switch (action) {
                    case 'supp':
                        await menma.sendMessage(ms_org, { text: `*_@${auteur_Message.split("@")[0]}, les bots ne sont pas autorisés ici._*`, mentions: [auteur_Message] });
                        await menma.sendMessage(ms_org, { delete: ms.key });
                        break;
                    case 'kick':
                        await menma.sendMessage(ms_org, { text: `@${auteur_Message.split("@")[0]} a été retiré pour avoir utilisé un bot.`, mentions: [auteur_Message] });
                        await menma.sendMessage(ms_org, { delete: ms.key });
                        await menma.groupParticipantsUpdate(ms_org, [auteur_Message], "remove");
                        break;
                }
            }
        }
    }

    // --- Commandes d'Évaluation & Débogage (Dév Uniquement) ---

    // Évaluation JS (commence par >)
    if (texte.startsWith(">")) {
        if (!dev_id) return;
        if (!arg[0]) return menma.sendMessage(ms_org, { text: "Veuillez fournir du code JavaScript à exécuter." });
        try {
            let result = await eval(arg.join(" "));
            if (typeof result === "object") result = JSON.stringify(result);
            menma.sendMessage(ms_org, { text: `\n${result}` });
        } catch (err) {
            return menma.sendMessage(ms_org, { text: `Erreur lors de l'exécution du code : ${err.message}` });
        }
    }

    // Commande Shell (commence par $)
    if (texte.startsWith("$")) {
        if (!dev_id) return;
        if (!arg[0]) return menma.sendMessage(ms_org, { text: "Veuillez fournir une commande shell à exécuter." });
        exec(arg.join(" "), (err, stdout, stderr) => {
            if (err) return menma.sendMessage(ms_org, { text: `Erreur d'exécution : ${err.message}` });
            if (stderr) return menma.sendMessage(ms_org, { text: `Erreur : ${stderr}` });
            menma.sendMessage(ms_org, { text: `Résultat : \n${stdout}` });
        });
    }

    /**
     * Aide : Fonction de réaction facile.
     */
    async function reagir(dest, msg, emoji) {
        await menma.sendMessage(dest, { react: { text: emoji, key: msg.key } });
    }

    // --- Déclenchement des Commandes ---
    if (verif_Cmd) {
        // Trouver la commande par nom ou alias
        const cd = evt.commands.find((menmacmd) => menmacmd.name === cmds || (menmacmd.alias && menmacmd.alias.includes(cmds)));
        if (cd) {
            try {
                // Vérifier la contrainte de mode (privé vs public)
                if (config.MODE !== 'public' && !premium_id) return;

                // Sécurité spécifique pour certains IDs internes
                if ((!dev_id && auteur_Message !== `${menmadev}@s.whatsapp.net`) && ms_org === "120363331900555103@g.us") return;

                // Déclencher la réaction et exécuter la fonction
                await reagir(ms_org, ms, cd.react);
                await cd.fonction(ms_org, menma, com_options);
            } catch (e) {
                console.log("Erreur d'exécution commande : " + e);
                await menma.sendMessage(ms_org, { text: "Erreur détectée : " + e, quoted: ms });
            }
        }
    }

    // --- Journalisation Console (Pour le Débogage) ---
    console.log("{}==[MESSAGES UTILISATEUR Menma-MD]=={}");
    if (verif_Gp) console.log("Groupe : " + nom_Gp);
    console.log("Auteur message : " + `${pseudo}\nNuméro : ${auteur_Message.split("@s.whatsapp.net")[0]}`);
    console.log("Type : " + mtype);
    console.log("Contenu du message :");
    console.log(texte);
}

module.exports = { messages_upsert };
