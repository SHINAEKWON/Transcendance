import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function connectDB() {
  const db = await open({
    filename: './data/user.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      avatar TEXT
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS blocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      blocker_id TEXT NOT NULL,
      blocked_id TEXT NOT NULL
    );
  `);
  

  return db;
}