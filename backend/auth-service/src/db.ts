import sqlite3 from 'sqlite3';
import {open} from 'sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_DIR = path.resolve(__dirname, '../data');
const DB_PATH = path.join(DB_DIR, 'auth.db');

export async function connectDB() {

    if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

    const db = await open({
        filename: DB_PATH,
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS auth_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            password_hash TEXT,
            token TEXT,
            expires_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_2fa_enabled BOOLEAN DEFAULT FALSE,
            twofa_secret TEXT,
            google_id TEXT,
            google_email TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

    return db;
}