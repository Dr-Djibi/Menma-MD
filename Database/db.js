import { Sequelize } from 'sequelize';
import config from '../config.js';
import sqlite3Lib from 'sqlite3';
import fs from 'fs';
import path from 'path';

const db = config.DATABASE_URL;
let sequelize;

if (!db) {
  const dataDir = './data';
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  const dbPath = path.join(dataDir, 'database.db');
  
  // Auto-guérison : Vérification proactive de la corruption au démarrage
  if (fs.existsSync(dbPath)) {
    try {
      const sqlite3 = sqlite3Lib.default || sqlite3Lib;
      await new Promise((resolve, reject) => {
        const testDb = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
          if (err) return reject(err);
          testDb.get("PRAGMA integrity_check;", (err, row) => {
            testDb.close();
            if (err) return reject(err);
            if (row && row.integrity_check === 'ok') {
              resolve();
            } else {
              reject(new Error("Integrity check failed: " + JSON.stringify(row)));
            }
          });
        });
      });
    } catch (error) {
      console.error(`[DB-AUTH] ⚠️ Base de données corrompue détectée (${error.message}) !`);
      console.log("[DB-AUTH] 🔄 Suppression et reconstruction automatique en cours...");
      try {
        fs.unlinkSync(dbPath);
        if (fs.existsSync(dbPath + '-wal')) fs.unlinkSync(dbPath + '-wal');
        if (fs.existsSync(dbPath + '-shm')) fs.unlinkSync(dbPath + '-shm');
        console.log("[DB-AUTH] ✅ Base de données corrompue supprimée avec succès ! Re-création saine...");
      } catch (err) {
        console.error("[DB-AUTH] ❌ Impossible de supprimer le fichier de base corrompu :", err.message);
      }
    }
  }

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false,
    dialectOptions: {
      timeout: 30000, // Attendre jusqu'à 30s avant de lancer SQLITE_BUSY
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });

  // Activer le mode WAL et sécuriser SQLite contre les corruptions de disque
  sequelize.addHook('afterConnect', (connection) => {
    connection.run('PRAGMA journal_mode=WAL;');
    connection.run('PRAGMA synchronous=FULL;'); // Plus robuste contre les corruptions en cas d'arrêt brutal (kill -9, crash panel)
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
