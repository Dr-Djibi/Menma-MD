import { DataTypes } from 'sequelize';
import sequelize from './db.js';

const Writemode = sequelize.define('Writemode', {
    jid: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    style: {
        type: DataTypes.STRING,
        defaultValue: '9',
    },
    suffix: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    tableName: 'writemode',
    timestamps: false,
});

(async () => {
    await Writemode.sync();
})();

async function getWritemode(jid) {
    let mode = await Writemode.findByPk(jid);
    return mode;
}

async function setWritemode(jid, data) {
    let [mode, created] = await Writemode.findOrCreate({
        where: { jid },
        defaults: data
    });
    if (!created) {
        await mode.update(data);
    }
    return mode;
}

export { Writemode, getWritemode, setWritemode };
