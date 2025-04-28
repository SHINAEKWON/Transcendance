import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
export async function connectDB() {
    const db = await open({
        filename: './db/auth.db',
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
