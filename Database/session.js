import { DataTypes, Op } from 'sequelize';
import sequelize from './db.js';
import config from '../config.js';
import { markTableReady } from './ready.js';

const Session = sequelize.define('Session', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'Session',
    timestamps: true,
});

// Nettoyage automatique des sessions vieilles de plus de 24h
async function pruneOldSessions() {
    try {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        await Session.destroy({
            where: {
                updatedAt: { [Op.lt]: oneDayAgo }
            }
        });
        console.log("[SESSION] Nettoyage des anciennes sessions effectué.");
    } catch (e) {
        console.error("[SESSION] Erreur de nettoyage :", e.message);
    }
}

(async () => {
    await Session.sync();
    console.log("Table 'Session' synchronisée avec succès.");
    markTableReady('Session');
    // Lancer le nettoyage au démarrage et toutes les heures
    pruneOldSessions();
    setInterval(pruneOldSessions, 60 * 60 * 1000);
})();

export { Session as session };