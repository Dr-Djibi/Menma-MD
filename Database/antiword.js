import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import { markTableReady } from './ready.js';

const Antiword = sequelize.define('Antiword', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'non',
  },
  type: {
    type: DataTypes.ENUM('supp', 'kick', 'warn'),
    defaultValue: 'supp',
  },
  words: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
  },
}, {
  tableName: 'antiword',
  timestamps: false,
});

(async () => {
  await Antiword.sync();
  markTableReady('Antiword');
})();

async function awAddOrUpdateJid(id, status) {
  let record = await Antiword.findByPk(id);
  if (record) {
    return await record.update({ status });
  } else {
    return await Antiword.create({ id, status });
  }
}

async function awUpdateAction(id, type) {
  let record = await Antiword.findByPk(id);
  if (record) {
    return await record.update({ type });
  } else {
    return await Antiword.create({ id, type });
  }
}

async function awVerifStatutJid(id) {
  let record = await Antiword.findByPk(id);
  if (record) {
    return record.status;
  } else {
    return 'non';
  }
}

async function awRecupActionJid(id) {
  let record = await Antiword.findByPk(id);
  if (record) {
    return record.type;
  } else {
    return 'supp';
  }
}

async function awGetWords(id) {
  let record = await Antiword.findByPk(id);
  if (record && record.words) {
    try {
      const parsed = JSON.parse(record.words);
      if (Array.isArray(parsed)) return parsed.map(w => String(w).toLowerCase());
    } catch (e) {
      return [];
    }
  }
  return [];
}

async function awAddWord(id, word) {
  const cleanWord = String(word).trim().toLowerCase();
  if (!cleanWord) return false;

  let record = await Antiword.findByPk(id);
  let currentList = [];
  if (record && record.words) {
    try {
      currentList = JSON.parse(record.words);
      if (!Array.isArray(currentList)) currentList = [];
    } catch {
      currentList = [];
    }
  }

  if (!currentList.includes(cleanWord)) {
    currentList.push(cleanWord);
    const jsonStr = JSON.stringify(currentList);
    if (record) {
      await record.update({ words: jsonStr });
    } else {
      await Antiword.create({ id, words: jsonStr });
    }
    return true;
  }
  return false;
}

async function awDelWord(id, word) {
  const cleanWord = String(word).trim().toLowerCase();
  let record = await Antiword.findByPk(id);
  if (!record || !record.words) return false;

  let currentList = [];
  try {
    currentList = JSON.parse(record.words);
    if (!Array.isArray(currentList)) return false;
  } catch {
    return false;
  }

  const initialLen = currentList.length;
  currentList = currentList.filter(w => String(w).toLowerCase() !== cleanWord);
  if (currentList.length < initialLen) {
    await record.update({ words: JSON.stringify(currentList) });
    return true;
  }
  return false;
}

async function awResetWords(id) {
  let record = await Antiword.findByPk(id);
  if (record) {
    await record.update({ words: '[]' });
    return true;
  }
  return false;
}

export {
  Antiword,
  awAddOrUpdateJid,
  awUpdateAction,
  awVerifStatutJid,
  awRecupActionJid,
  awGetWords,
  awAddWord,
  awDelWord,
  awResetWords,
};
