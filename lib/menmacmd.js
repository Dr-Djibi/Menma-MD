/**
 * @file menmacmd.js
 * @description Registre centralisé d'enregistrement des commandes.
 * Charge automatiquement tous les plugins depuis le dossier `commandes/`.
 */

const fs = require("fs");
const path = require("path");

/**
 * Tableau contenant tous les objets de commande enregistrés.
 */
let commands = [];

/**
 * Enregistre une nouvelle commande dans le système du bot.
 */
function menmacmd(obj, fonctions) {
    let cmd_info = { ...obj };

    // Valeurs par défaut
    if (!cmd_info.classe) cmd_info.classe = "General";
    if (!cmd_info.react) cmd_info.react = "🍷";
    if (!cmd_info.desc) cmd_info.desc = "Aucune description fournie";
    if (!cmd_info.alias) cmd_info.alias = [];

    cmd_info.fonction = fonctions;
    commands.push(cmd_info);
    return cmd_info;
}

function loadPlugins() {
    const pluginsDir = path.join(__dirname, "..", "commandes");
    if (fs.existsSync(pluginsDir)) {
        const pluginFiles = fs.readdirSync(pluginsDir).filter(f => f.endsWith(".js"));
        for (const file of pluginFiles) {
            try {
                // Forcer le rechargement pour éviter le cache
                const fullPath = path.join(pluginsDir, file);
                delete require.cache[require.resolve(fullPath)];
                require(fullPath);
            } catch (err) {
                console.error(`[PLUGIN] Erreur chargement ${file} :`, err.message);
            }
        }
        console.log(`[PLUGIN] ✅ ${commands.length} commande(s) chargée(s).`);
    }
}

module.exports = {
    menmacmd,
    Module: menmacmd,
    commands,
    loadPlugins
};


