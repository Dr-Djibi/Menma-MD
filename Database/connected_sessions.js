import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import { markTableReady } from './ready.js';

/**
 * @file connected_sessions.js
 * @description Modèle pour les sessions connectées à distance.
 * Chaque session connectée dispose de sa propre configuration isolée
 * (préfixe, nom du bot, sticker pack, auteur, owner, etc.)
 * sans affecter la base de données principale du bot hôte.
 */

const ConnectedSession = sequelize.define('ConnectedSession', {
    sessionId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        comment: "L'identifiant unique de la session connectée",
    },
    connectedBy: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Le JID de l'utilisateur qui a connecté cette session",
    },
    prefix: {
        type: DataTypes.STRING,
        defaultValue: '.',
    },
    botName: {
        type: DataTypes.STRING,
        defaultValue: 'Menma-MD',
    },
    ownerName: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    ownerNumber: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    stickerPackname: {
        type: DataTypes.STRING,
        defaultValue: 'Menma-MD',
    },
    stickerAuthor: {
        type: DataTypes.STRING,
        defaultValue: 'Dr-Djibi',
    },
    mode: {
        type: DataTypes.STRING,
        defaultValue: 'public',
    },
    lang: {
        type: DataTypes.STRING,
        defaultValue: 'fr',
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'connected_sessions',
    timestamps: true,
});

(async () => {
    await ConnectedSession.sync({ alter: true });
    console.log("Table 'ConnectedSession' synchronisée avec succès.");
    markTableReady('ConnectedSession');
})();

// ─── Fonctions CRUD ──────────────────────────────────────────────────────────

async function connectSession(sessionId, connectedBy) {
    const [session, created] = await ConnectedSession.findOrCreate({
        where: { sessionId },
        defaults: { connectedBy },
    });
    if (!created) {
        await session.update({ active: true, connectedBy });
    }
    return { session, created };
}

async function disconnectSession(sessionId) {
    const session = await ConnectedSession.findByPk(sessionId);
    if (!session) return null;
    await session.update({ active: false });
    return session;
}

async function deleteConnectedSession(sessionId) {
    return await ConnectedSession.destroy({ where: { sessionId } });
}

async function getConnectedSession(sessionId) {
    return await ConnectedSession.findByPk(sessionId);
}

async function getAllConnectedSessions() {
    return await ConnectedSession.findAll({ where: { active: true } });
}

async function updateSessionConfig(sessionId, key, value) {
    const session = await ConnectedSession.findByPk(sessionId);
    if (!session) return null;
    return await session.update({ [key]: value });
}

async function getSessionConfig(sessionId) {
    const session = await ConnectedSession.findByPk(sessionId);
    if (!session) return null;
    return session.toJSON();
}

export {
    ConnectedSession,
    connectSession,
    disconnectSession,
    deleteConnectedSession,
    getConnectedSession,
    getAllConnectedSessions,
    updateSessionConfig,
    getSessionConfig,
};
