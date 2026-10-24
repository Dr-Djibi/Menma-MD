import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import { markTableReady } from './ready.js';

const Antimedia = sequelize.define('Antimedia', {
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
  mediaTypes: {
    type: DataTypes.TEXT,
    defaultValue: '["all"]',
  },
}, {
  tableName: 'antimedia',
  timestamps: false,
});

(async () => {
  await Antimedia.sync();
  markTableReady('Antimedia');
})();

async function amAddOrUpdateJid(id, status) {
  let record = await Antimedia.findByPk(id);
  if (record) {
    return await record.update({ status });
  } else {
    return await Antimedia.create({ id, status });
  }
}

async function amUpdateAction(id, type) {
  let record = await Antimedia.findByPk(id);
  if (record) {
    return await record.update({ type });
  } else {
    return await Antimedia.create({ id, type });
  }
}

async function amVerifStatutJid(id) {
  let record = await Antimedia.findByPk(id);
  if (record) {
    return record.status;
  } else {
    return 'non';
  }
}

async function amRecupActionJid(id) {
  let record = await Antimedia.findByPk(id);
  if (record) {
    return record.type;
  } else {
    return 'supp';
  }
}

async function amGetMediaTypes(id) {
  let record = await Antimedia.findByPk(id);
  if (record && record.mediaTypes) {
    try {
      const parsed = JSON.parse(record.mediaTypes);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(t => String(t).toLowerCase());
      }
    } catch (e) {
      return ['all'];
    }
  }
  return ['all'];
}

async function amSetMediaTypes(id, typesArray) {
  const cleanTypes = Array.isArray(typesArray)
    ? typesArray.map(t => String(t).trim().toLowerCase()).filter(Boolean)
    : ['all'];
  const jsonStr = JSON.stringify(cleanTypes.length > 0 ? cleanTypes : ['all']);

  let record = await Antimedia.findByPk(id);
  if (record) {
    return await record.update({ mediaTypes: jsonStr });
  } else {
    return await Antimedia.create({ id, mediaTypes: jsonStr });
  }
}

async function amAddMediaType(id, mediaType) {
  const cleanType = String(mediaType).trim().toLowerCase();
  if (!cleanType) return false;

  let currentList = await amGetMediaTypes(id);
  if (!currentList.includes(cleanType)) {
    // If "all" was in list and we add a specific type, replace or keep accordingly
    if (cleanType === 'all') {
      currentList = ['all'];
    } else {
      currentList = currentList.filter(t => t !== 'all');
      currentList.push(cleanType);
    }
    await amSetMediaTypes(id, currentList);
    return true;
  }
  return false;
}

async function amDelMediaType(id, mediaType) {
  const cleanType = String(mediaType).trim().toLowerCase();
  let currentList = await amGetMediaTypes(id);

  if (!currentList.includes(cleanType)) return false;

  currentList = currentList.filter(t => t !== cleanType);
  if (currentList.length === 0) {
    currentList = ['all'];
  }
  await amSetMediaTypes(id, currentList);
  return true;
}

export {
  Antimedia,
  amAddOrUpdateJid,
  amUpdateAction,
  amVerifStatutJid,
  amRecupActionJid,
  amGetMediaTypes,
  amSetMediaTypes,
  amAddMediaType,
  amDelMediaType,
};
