/**
 * Système de Readiness centralisé pour la Base de Données.
 * 
 * Au lieu d'attendre un délai fixe (40s), ce module permet à chaque table de
 * signaler quand sa synchronisation est terminée. Les consommateurs peuvent
 * attendre `waitForDatabase()` pour être notifiés dès que TOUT est prêt.
 */

// Liste des tables attendues (doit correspondre à tous les modules DB qui font un .sync())
const EXPECTED_TABLES = new Set([
    'Session',
    'Settings',
    'Sudo',
    'Antibot',
    'Theme',
    'StickerCommand',
    'LidStore',
    'GroupEvents',
    'Antilien',
    'Chatbot',
    'Presence',
    'Antispam',
    'WarnDB',
    'Antimentiongc',
    'Antitag',
    'AntiDelete',
    'Writemode',
    'ChatSettings',
]);

const readyTables = new Set();
let _isReady = false;
let _resolveReady = null;

// Promise qui se résout quand toutes les tables sont synchronisées
const _readyPromise = new Promise((resolve) => {
    _resolveReady = resolve;
});

/**
 * Signale qu'une table a terminé sa synchronisation.
 * @param {string} tableName - Nom du modèle (ex: 'Settings', 'Session', etc.)
 */
function markTableReady(tableName) {
    readyTables.add(tableName);
    
    // Vérifier si toutes les tables attendues sont prêtes
    let allReady = true;
    for (const t of EXPECTED_TABLES) {
        if (!readyTables.has(t)) {
            allReady = false;
            break;
        }
    }
    
    if (allReady && !_isReady) {
        _isReady = true;
        console.log(`[DB READY] ✅ Toutes les ${EXPECTED_TABLES.size} tables sont synchronisées !`);
        _resolveReady();
    }
}

/**
 * Retourne true si toutes les tables DB sont synchronisées.
 */
function isDatabaseReady() {
    return _isReady;
}

/**
 * Attend que toutes les tables soient synchronisées.
 * Inclut un timeout de sécurité pour éviter de bloquer indéfiniment.
 * @param {number} timeoutMs - Timeout maximum (par défaut 30s)
 * @returns {Promise<boolean>} true si prêt normalement, false si timeout
 */
async function waitForDatabase(timeoutMs = 30000) {
    if (_isReady) return true;
    
    const result = await Promise.race([
        _readyPromise.then(() => true),
        new Promise((resolve) => setTimeout(() => resolve(false), timeoutMs))
    ]);
    
    if (!result) {
        // Timeout atteint — lister les tables manquantes pour le debug
        const missing = [];
        for (const t of EXPECTED_TABLES) {
            if (!readyTables.has(t)) missing.push(t);
        }
        console.log(`[DB READY] ⚠️ Timeout (${timeoutMs / 1000}s) — Tables manquantes : ${missing.join(', ')}`);
    }
    
    return result;
}

export { markTableReady, isDatabaseReady, waitForDatabase };
