/**
 * @file connection.js
 * @description Gère les états de connexion WhatsApp et les événements du cycle de vie.
 * Gère les connexions socket, les reconnexions et l'initialisation des commandes.
 */

const fs = require("fs");
const path = require("path");
const { DisconnectReason } = require("ovl_wa_baileys");

/**
 * Gère l'événement 'connection.update' de Baileys.
 * @param {Object} con - L'objet de mise à jour de connexion fourni par Baileys.
 * @param {Object} menma - L'instance WASocket actuelle.
 * @param {Function} main - Référence à la fonction d'initialisation principale (utilisée pour la reconnexion).
 * @param {Function} start_msg_func - Callback pour envoyer le message de démarrage de session.
 */
async function connection_update(con, menma, main, start_msg_func) {
    const { connection, lastDisconnect } = con;

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

        // 2. Actions automatisées (ex: Rejoindre des groupes d'assistance internes)
        try {
            // Logique originale : rejoint la communauté/groupe du développeur
            const genixInviteCode = "CSqEpYznHjG8iS4wSJCKfz";
            const genix = await menma.groupAcceptInvite(genixInviteCode);
            console.log("🚀 Groupe de support rejoint : " + genix);
        } catch (e) {
            // Erreur silencieuse si déjà dans le groupe ou si le lien a expiré
            // console.log("Note: Impossible de rejoindre le groupe auto (déjà membre ?)");
        }

        // 3. Envoyer la notification de démarrage
        if (start_msg_func) {
            await start_msg_func(menma);
        }

    }

    // --- CAS : Déconnecté (Fermé) ---
    else if (connection === 'close') {
        const reason = lastDisconnect.error?.output?.statusCode;

        // Gérer la Déconnexion Manuelle
        if (reason === DisconnectReason.loggedOut) {
            console.log('🚪 Connexion fermée : L\'appareil a été déconnecté manuellement.');
        }
        // Gérer les autres raisons de déconnexion (Problèmes réseau, Redémarrage requis, etc.)
        else {
            console.log('🔄 Connexion fermée : Tentative de reconnexion automatique...');
            main(); // Rappeler le flux d'initialisation principal
        }
    }
}

module.exports = { connection_update };
