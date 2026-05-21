import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import config from '../config.js';
import { markTableReady } from './ready.js';

const Chatbot = sequelize.define('Chatbot', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: '1',
    },
    globalPm: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    globalGc: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    enabledChats: {
        type: DataTypes.TEXT, // On stocke une liste JSON [ "jid1", "jid2" ]
        defaultValue: '[]',
    }
}, {
    tableName: 'chatbot',
    timestamps: false,
});

(async () => {
    try {
        await Chatbot.sync({ alter: true });
        console.log("Table 'Chatbot' synchronisée avec succès.");
    } catch (e) {
        // Si alter échoue (backup table déjà existante), on fait un sync simple
        try {
            await Chatbot.sync();
            console.log("Table 'Chatbot' synchronisée (mode simple).");
        } catch (e2) {
            console.log("[CHATBOT DB] Erreur sync :", e2.message);
        }
    }
    markTableReady('Chatbot');
})();

async function getChatbotState() {
    let state = await Chatbot.findByPk('1');
    if (!state) {
        state = await Chatbot.create({ id: '1' });
    }
    return state;
}

async function updateChatbotState(updates) {
    let state = await getChatbotState();
    return await state.update(updates);
}

export { Chatbot, getChatbotState, updateChatbotState };
