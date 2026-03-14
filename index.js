/**
 * ███╗   ███╗███████╗███╗   ██╗███╗   ███╗ █████╗ 
 * ████╗ ████║██╔════╝████╗  ██║████╗ ████║██╔══██╗
 * ██╔████╔██║█████╗  ██╔██╗ ██║██╔████╔██║███████║
 * ██║╚██╔╝██║██╔══╝  ██║╚██╗██║██║╚██╔╝██║██║  ██║
 * ██║ ╚═╝ ██║███████╗██║ ╚═╝██║██║ ╚═╝ ██║██║  ██║
 * ╚═╝     ╚═╝╚══════╝╚═╝     ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝
 * 
 * @project Menma-MD
 * @description Un bot WhatsApp Multi-Device professionnel et modulaire.
 * @author Menma
 * @license MIT
 */

// --- Importation des Modules de Base ---
const config = require("./config");
const axios = require("axios");
const fs = require("fs");
const pino = require("pino");
const path = require('path');
const express = require('express');

// --- Importation de la Bibliothèque Baileys Multi-Device ---
const {
    default: makeWASocket,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    makeInMemoryStore,
    fetchLatestBaileysVersion
} = require("ovl_wa_baileys");

// --- Importation de la Base de Données et des Modules d'Événements Internes ---
const { session: Session } = require("./Database/session");
const { connection_update, messages_upsert } = require("./lib/events");
const { loadPlugins } = require("./lib/menmacmd");


// --- Constantes Globales & Chemins ---
const credsPath = path.join(__dirname, 'auth', 'creds.json');
const app = express();
const port = process.env.PORT || 3000;

/**
 * Gère le processus d'authentification.
 * Télécharge et restaure les identifiants de session si un SESSION_ID valide est fourni.
 */
async function menmaAuth() {
    if (config.SESSION_ID.startsWith("MenMa-MD_")) {
        const sessdata = config.SESSION_ID;
        try {
            console.log("🛠️ Initialisation de l'authentification...");
            const sess = await Session.findByPk(sessdata);
            if (sess) {
                fs.writeFileSync(credsPath, sess.content);
                console.log("🔒 Session téléchargée et synchronisée avec succès !!");
            }
        } catch (error) {
            console.error('❌ Erreur lors de la récupération de la session :', error);
        }
    }
}

/**
 * Envoie un message de notification au propriétaire du bot lors d'une connexion réussie.
 * @param {Object} menma - L'instance WASocket.
 */
async function send_start_msg(menma) {
    try {
        const { jidDecode } = require("ovl_wa_baileys");

        // Charger les commandes pour compter le nombre total de plugins
        let evt = require(path.join(__dirname, "lib/menmacmd"));
        let pri = config.PREFIX;
        let prefixe = (pri == "null" || pri == "undefined" || pri == "") ? "" : config.PREFIX;

        // Normalisation du JID (pour éviter le ghosting multi-device)
        const rawJid = menma.user.id;
        const decoded = jidDecode(rawJid) || {};
        const cleanedJid = decoded.user && decoded.server ? `${decoded.user}@${decoded.server}` : rawJid;

        // Construction du rapport de connexion
        let start_msg = `╭───〔 🤖 𝗠𝗘𝗡𝗠𝗔-𝗠𝗗 〕───⬣
│ ◈ *Etat*       ➜ Connecté ✅
│ ◈ *Préfixe*    ➜ ${prefixe}
│ ◈ *Mode*       ➜ ${config.MODE}
│ ◈ *Commandes*  ➜ ${evt.commands.length}
│ ◈ *Version*    ➜ 1.0.0
│ ◈ *Développeur*➜ Menma
╰──────────────⬣`;

        // Envoyer au propre JID du bot
        await menma.sendMessage(cleanedJid, { text: start_msg });
    } catch (e) {
        console.log("[ERR] Échec de l'envoi du message de démarrage : " + e.message);
    }
}

/**
 * Point d'entrée de l'application.
 * Initialise la connexion WASocket, configure le stockage et lie les écouteurs d'événements.
 */
async function main() {
    // 0. Charger les plugins (commandes)
    loadPlugins();

    // 1. Authentifier la session
    await menmaAuth();

    // 2. Configurer le stockage en mémoire pour la mise en cache des messages
    const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });

    // 3. Charger l'état d'authentification depuis le système de fichiers
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'auth'));
    const { version } = await fetchLatestBaileysVersion();

    // 4. Initialiser le Socket WhatsApp
    const menma = makeWASocket({
        version,
        printQRInTerminal: true,
        qrTerminalOpts: { small: true }, // Option pour réduire la taille du QR code dans le terminal
        logger: pino({ level: "silent" }),
        browser: ["Menma-MD", "Chrome", "1.0.0"],
        generateHighQualityLinkPreview: true,
        syncFullHistory: false,
        cachedGroupMetadata: async (jid) => {
            return await store.fetchGroupMetadata(jid);
        },
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }))
        }
    });

    /**
     * Aide pour récupérer les messages du stockage.
     * Requis pour des fonctionnalités comme citer des messages ou les supprimer.
     */
    menma.getMessage = async (key) => {
        if (store) {
            const msg = await store.loadMessage(key.remoteJid, key.id);
            return msg?.message || undefined;
        }
        return {
            conversation: 'hello'
        };
    };

    // Lier le stockage aux événements du socket
    store.bind(menma.ev);

    // --- Écouteurs d'Événements ---

    // Sauvegarder les identifiants chaque fois qu'ils sont mis à jour (essentiel pour la persistance)
    menma.ev.on('creds.update', saveCreds);

    // Gérer les messages entrants
    menma.ev.on("messages.upsert", async (m) => {
        await messages_upsert(m, menma);
    });

    // Gérer les mises à jour du statut de connexion
    menma.ev.on("connection.update", async (con) => {
        await connection_update(con, menma, main, send_start_msg);
    });
}

// Lancer le bot
main();

// --- Tableau de bord Web (Express) ---

app.get("/", (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MENMA BOT</title>
    <style>
        body { background-color: #f0f0f0; font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .container { border: 5px solid transparent; border-radius: 15px; padding: 20px; background: linear-gradient(135deg, #ff7e5f, #feb47b); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); max-width: 600px; margin: auto; }
        h1 { color: #333; text-align: center; }
        h2 { color: #555; text-align: center; }
        p { color: #759; line-height: 1.6; text-align: justify; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Bienvenue sur Menma-MD</h1>
        <h2>Votre assistant WhatsApp</h2>
        <p>Je suis <strong>Menma-MD</strong>, un bot WhatsApp en français multifonctions créé par <strong>Dr Djibi/strong> dans le but d'enrichir votre expérience sur les innombrables fonctionnalitées que peut vous offrir les bots sur la plateforme WhatsApp.</p>
    </div>
</body>
</html>`);
});

app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
