/**
 * @file connection.js
 * @description Gère les états de connexion WhatsApp et les événements du cycle de vie.
 * Gère les connexions socket, les reconnexions et l'initialisation des commandes.
 */

const fs = require("fs");
const path = require("path");
const qrcode = require("qrcode-terminal");
const { DisconnectReason } = require("ovl_wa_baileys");

/**
 * Gère l'événement 'connection.update' de Baileys.
 * @param {Object} con - L'objet de mise à jour de connexion fourni par Baileys.
 * @param {Object} menma - L'instance WASocket actuelle.
 * @param {Function} main - Référence à la fonction d'initialisation principale (utilisée pour la reconnexion).
 * @param {Function} start_msg_func - Callback pour envoyer le message de démarrage de session.
 */
async function connection_update(con, menma, main, start_msg_func) {
    const { connection, lastDisconnect, qr } = con;

    // --- CAS : QR Code Reçu ---
    if (qr) {
        console.log("📢 Scannez le QR Code ci-dessous pour connecter Menma-MD :");
        qrcode.generate(qr, { small: true });
    }

    // --- CAS : Connexion en cours ---
    if (connection === "connecting") {
        console.log("🌐 Connexion à WhatsApp en cours...");
    }

    // --- CAS : Succès (Ouvert) ---
    else if (connection === 'open') {
        console.log("✅ Connexion établie ; Le bot est en ligne 🌐\n\n");

        // 1. Charger les plugins/commandes actifs
        // Nous scancons le répertoire 'commandes' et importons chaque fichier pour enregistrer ses commandes.
        const commandesDir = path.join(__dirname, "..", "..", "commandes");
        const commandes = fs.readdirSync(commandesDir)
            .filter(fichier => path.extname(fichier).toLowerCase() === ".js");

        console.log(`📡 Initialisation des modules [ ${commandes.length} fichiers trouvés ]...`);
        for (const fichier of commandes) {
            try {
                require(path.join(commandesDir, fichier));
                console.log(`   🔸 ${fichier} : Installé avec succès`);
            } catch (err) {
                console.error(`   ❌ Erreur d'installation pour ${fichier} : ${err.message}`);
            }
        }

        // 2. Envoyer la notification de démarrage (avec délai pour la synchronisation)
        if (start_msg_func) {
            setTimeout(async () => {
                await start_msg_func(menma);
            }, 10000); // 10 secondes de délai
        }

    }

    // --- CAS : Déconnecté (Fermé) ---
    else if (connection === 'close') {
        const reason = lastDisconnect.error?.output?.statusCode;

        // Gérer la Déconnexion Manuelle
        if (reason === DisconnectReason.loggedOut) {
            console.log('🚪 Connexion fermée : L\'appareil a été déconnecté manuellement.');
            main(); // Rappeler le flux d'initialisation principal
        }
        // Gérer les autres raisons de déconnexion (Problèmes réseau, Redémarrage requis, etc.)
        else {
            console.log('🔄 Connexion fermée : Tentative de reconnexion automatique...');
            main(); // Rappeler le flux d'initialisation principal
        }
    }
}

module.exports = { connection_update };