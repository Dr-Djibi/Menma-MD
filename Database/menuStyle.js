import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import { markTableReady } from './ready.js';

const MenuStyle = sequelize.define('MenuStyle', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: 'global'
    },
    value: {
        type: DataTypes.STRING,
        defaultValue: '1',
    },
}, {
    tableName: 'MenuStyle',
    timestamps: false,
});

(async () => {
    await MenuStyle.sync();
    console.log("Table 'MenuStyle' synchronisée avec succès.");
    markTableReady('MenuStyle');
})();

async function setMenuStyle(value) {
    let row = await MenuStyle.findByPk('global');
    if (row) return await row.update({ value });
    return await MenuStyle.create({ id: 'global', value });
}

async function getMenuStyle() {
    const row = await MenuStyle.findByPk('global');
    return row ? row.value : '1';

}

export { MenuStyle, setMenuStyle, getMenuStyle };
