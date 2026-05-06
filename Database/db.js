import { Sequelize } from 'sequelize';
import config from '../config.js';
const db = config.DATABASE_URL;

let sequelize;

if (!db) {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.db',
    logging: false,
    dialectOptions: {
      timeout: 30000, // Attendre jusqu'à 30s avant de lancer SQLITE_BUSY
    },
    // Le mode WAL est activé au moment de la connexion
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });

  // Activer explicitement le mode WAL et optimiser SQLite lors de la connexion
  sequelize.addHook('afterConnect', (connection) => {
    connection.run('PRAGMA journal_mode=WAL;');
    connection.run('PRAGMA synchronous=NORMAL;');
  });

} else {
  sequelize = new Sequelize(db, {
    dialect: 'postgres',
    ssl: true,
    protocol: 'postgres',
    dialectOptions: {
      native: true,
      ssl: { require: true, rejectUnauthorized: false },
    },
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
}

export default sequelize;
