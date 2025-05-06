import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_DIR = path.resolve(__dirname, '../data');
const DB_PATH = path.join(DB_DIR, 'user.db');
export async function connectDB() {

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstname TEXT,
      lastname TEXT,
      username TEXT UNIQUE NOT NULL,
      avatar TEXT,
      status TEXT DEFAULT 'offline',
      email TEXT UNIQUE NOT NULL,
      address TEXT,
      telephone TEXT,
      matches INTEGER DEFAULT 0,
      wins INTEGER DEFAULT 0,
      losses INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      type TEXT DEFAULT 'user'
    )
  `);
await db.exec(`
    CREATE TABLE IF NOT EXISTS friends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,           
      friend_id INTEGER NOT NULL,         
      status TEXT NOT NULL,               
      action_user_id INTEGER NOT NULL,    
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (friend_id) REFERENCES users(id)
    );
  `);


  await db.exec(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,              
      type TEXT NOT NULL,              -- "match" ou "tournament"
      finished_at DATETIME DEFAULT CURRENT_TIMESTAMP,  
      user_id INTEGER NOT NULL,        
      isWinner BOOLEAN NOT NULL,       
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  return db;
}