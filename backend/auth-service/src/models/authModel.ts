
/*ce fichier contient les fonctions de requetes sql qui permettent 
d'acceder a la bdd et de manipuler les donnees
*/

import { connectDB } from '../db.js';
import sqlite3 from 'sqlite3';

export interface AuthData {
    user_id: number;
    password_hash: string;
    token?: string | null;
    expires_at?: string | null;
    created_at?: string | null;
    is_2fa_enabled?: boolean;
    twofa_secret?: string | null;
    google_id?: string | null;
    google_email?: string | null;
  }

export const insertAuthData = async (data: AuthData): Promise<void> => {
    const db = await connectDB();
    await db.run(
    `INSERT INTO auth_data 
    (user_id, password_hash, token, expires_at, created_at, is_2fa_enabled, twofa_secret, google_id, google_email)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?)`,
    [
    data.user_id,
    data.password_hash,
    data.token || null,
    data.expires_at || null,
    data.is_2fa_enabled || false,
    data.twofa_secret || null,
    data.google_id || null,
    data.google_email || null,
    ]
);
};

export const getAuthByUserId = async (user_id: number) => {
const db = await connectDB();
const row = await db.get('SELECT * FROM auth_data WHERE user_id = ?', [user_id]);
console.log("found authRecord by user_id", row);
return row;
};

export async function getAllAuthRecords() {
  const db = await connectDB();
  return await db.all('SELECT * FROM auth_data ');
}

