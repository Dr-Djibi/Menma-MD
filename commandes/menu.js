/**
 * @file menu.js
 * @description Liste de commandes hautement formatée et catégorisée pour Menma-MD.
 * Construit dynamiquement une liste de toutes les commandes disponibles basées sur leur attribut 'classe'.
 */

const { menmacmd } = require("../lib/menmacmd");
const { runtime } = require("../lib/fonctions");
const config = require("../config");
const fs = require("fs");
const path = require("path");
const dev = process.env.DEV || "Dr Djibi";

menmacmd({
    name: "menu",
    alias: ["m", "commands", "liste"],
    classe: "utiles",
    react: "📑",
    desc: "Affiche la liste des commandes du bot."
}, async (ms_org, menma, com_options) => {
    const { pseudo, prefixe } = com_options;
    const { commands } = require("../lib/menmacmd");

    // --- Collecte des Données Contextuelles ---
    const timeZone = config.ZONE_DE_TEMPS || 'Africa/Conakry';
    const now = new Date();
    const date = now.toLocaleDateString('fr-FR', { timeZone, day: 'numeric', month: 'long', year: 'numeric' });
    const time = now.toLocaleTimeString('fr-FR', { timeZone, hour: '2-digit', minute: '2-digit' });
    const uptime = runtime(process.uptime());

    // --- Logique de Catégorisation des Commandes ---
    // Parcourir le registre de commandes global et les grouper par catégorie (classe).
    const categories = {};
    commands.forEach(cmd => {
        if (!categories[cmd.classe]) categories[cmd.classe] = [];
        categories[cmd.classe].push(cmd.name);
    });

    // --- Construction du Message : Section d'En-tête ---
    // --- Construction du Message : Section d'En-tête ---
    let menuMsg = `╭───〔 🤖 𝗠𝗘𝗡𝗠𝗔-𝗠𝗗 〕───⬣\n`;
    menuMsg += `│ ◈ *Utilisateur* ➜ ${pseudo}\n`;
    menuMsg += `│ ◈ *Etat*        ➜ En ligne ✅\n`;
    menuMsg += `│ ◈ *Date*        ➜ ${date}\n`;
    menuMsg += `│ ◈ *Heure*       : ${time}\n`;
    menuMsg += `│ ◈ *Uptime*      ➜ ${uptime}\n`;
    menuMsg += `│ ◈ *Préfixe*     ➜ ${prefixe}\n`;
    menuMsg += `│ ◈ *Commandes*   ➜ ${commands.length}\n`;
    menuMsg += `│ ◈ *Développeur* ➜ ${dev}\n`;
    menuMsg += `╰──────────────⬣\n\n`;

    // --- Construction du Message : Corps Dynamique ---
    // Trier les catégories par ordre alphabétique pour assurer une présentation cohérente.
    const sortedCategories = Object.keys(categories).sort();

    for (const cat of sortedCategories) {
        menuMsg += `╭─── 「 *${cat.toUpperCase()}* 」\n`;
        const categoryCmds = categories[cat].sort();

        // Lister chaque commande sous sa catégorie respective.
        for (let i = 0; i < categoryCmds.length; i++) {
            menuMsg += `│ ⌲ ${prefixe}${categoryCmds[i]}\n`;
        }
        menuMsg += `╰───────────────────\n\n`;
    }

    // Pied de page avec branding
    menuMsg += `_Développé par ${dev}_`;

    // Image du bot (branding Menma)
    const imageUrl = process.env.MENU;

    // --- Envoi de la Réponse à la Commande ---
    try {
        await menma.sendMessage(ms_org, {
            image: { url: imageUrl },
            caption: menuMsg
        }, { quoted: com_options.ms });
        console.log(`[MSG] Menu image envoyé à ${ms_org}`);
    } catch (e) {
        console.log(`[WRN] Échec envoi menu image, tentative texte seul...`);
        // Repli vers le texte si l'image ne parvient pas à se charger
        await menma.sendMessage(ms_org, { text: menuMsg }, { quoted: com_options.ms });
        console.log(`[MSG] Menu texte envoyé à ${ms_org}`);
    }
});
