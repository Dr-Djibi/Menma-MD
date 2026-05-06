import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import config from '../config.js';

const GroupEvents = sequelize.define('GroupEvents', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    welcome: {
        type: DataTypes.STRING,
        defaultValue: 'non',
    },
    goodbye: {
        type: DataTypes.STRING,
        defaultValue: 'non',
    },
    welcome_msg: {
        type: DataTypes.TEXT,
        defaultValue: 'Salut @user, bienvenue dans #groupe ! 👋',
    },
    goodbye_msg: {
        type: DataTypes.TEXT,
        defaultValue: 'Au revoir @user, on espère te revoir bientôt ! 👋',
    },
    antipromote: {
        type: DataTypes.STRING,
        defaultValue: 'non',
    },
    antidemote: {
        type: DataTypes.STRING,
        defaultValue: 'non',
    }
}, {
    tableName: 'group_events',
    timestamps: false,
});

(async () => {
    await GroupEvents.sync();
    console.log("Table 'GroupEvents' synchronisée avec succès.");
})();

async function getGroupEvents(id) {
    let events = await GroupEvents.findByPk(id);
    if (!events) {
        events = await GroupEvents.create({ id });
    }
    return events;
}

async function updateGroupEventStatus(id, type, status) {
    let events = await GroupEvents.findByPk(id);
    if (events) {
        return await events.update({ [type]: status });
    } else {
        return await GroupEvents.create({ id, [type]: status });
    }
}

async function updateGroupEventMsg(id, type, msg) {
    let events = await GroupEvents.findByPk(id);
    const field = type === 'welcome' ? 'welcome_msg' : 'goodbye_msg';
    if (events) {
        return await events.update({ [field]: msg });
    } else {
        return await GroupEvents.create({ id, [field]: msg });
    }
}

export { GroupEvents, getGroupEvents, updateGroupEventStatus, updateGroupEventMsg };
