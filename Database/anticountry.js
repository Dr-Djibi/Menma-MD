import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import { markTableReady } from './ready.js';

const Anticountry = sequelize.define('Anticountry', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'non',
  },
  countryCodes: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
  },
}, {
  tableName: 'anticountry',
  timestamps: false,
});

(async () => {
  await Anticountry.sync();
  console.log("Table 'Anticountry' synchronisée avec succès.");
  markTableReady('Anticountry');
})();

async function acAddOrUpdateJid(id, status) {
  let record = await Anticountry.findByPk(id);
  if (record) {
    return await record.update({ status });
  } else {
    return await Anticountry.create({ id, status });
  }
}

async function acVerifStatutJid(id) {
  let record = await Anticountry.findByPk(id);
  if (record) {
    return record.status;
  } else {
    return 'non';
  }
}

async function acGetCountryCodes(id) {
  let record = await Anticountry.findByPk(id);
  if (record && record.countryCodes) {
    try {
      const parsed = JSON.parse(record.countryCodes);
      if (Array.isArray(parsed)) {
        return parsed.map(c => String(c).replace(/\D/g, "")).filter(Boolean);
      }
    } catch (e) {
      return [];
    }
  }
  return [];
}

async function acSetCountryCodes(id, codesArray) {
  const cleanCodes = Array.isArray(codesArray)
    ? [...new Set(codesArray.map(c => String(c).replace(/\D/g, "")).filter(Boolean))]
    : [];
  const jsonStr = JSON.stringify(cleanCodes);

  let record = await Anticountry.findByPk(id);
  if (record) {
    return await record.update({ countryCodes: jsonStr });
  } else {
    return await Anticountry.create({ id, countryCodes: jsonStr });
  }
}

async function acAddCountryCode(id, code) {
  const cleanCode = String(code).replace(/\D/g, "");
  if (!cleanCode) return false;

  let currentList = await acGetCountryCodes(id);
  if (!currentList.includes(cleanCode)) {
    currentList.push(cleanCode);
    await acSetCountryCodes(id, currentList);
    return true;
  }
  return false;
}

async function acDelCountryCode(id, code) {
  const cleanCode = String(code).replace(/\D/g, "");
  let currentList = await acGetCountryCodes(id);

  if (!currentList.includes(cleanCode)) return false;

  currentList = currentList.filter(c => c !== cleanCode);
  await acSetCountryCodes(id, currentList);
  return true;
}

async function acResetCountryCodes(id) {
  return await acSetCountryCodes(id, []);
}

export {
  Anticountry,
  acAddOrUpdateJid,
  acVerifStatutJid,
  acGetCountryCodes,
  acSetCountryCodes,
  acAddCountryCode,
  acDelCountryCode,
  acResetCountryCodes,
};
