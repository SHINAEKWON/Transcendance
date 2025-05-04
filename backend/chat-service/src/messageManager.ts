import axios from 'axios';
import https from 'https';
import { Database } from 'sqlite';
import { ChatMessage } from './types.js';
import { env } from 'process';

type BlockResponse = { blocked: boolean };

// Agent HTTPS avec rejet désactivé (auto-signé)
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export async function isBlocked(senderId: string, receiverId: string): Promise<boolean> {
  try {
    const res = await axios.get<BlockResponse>(
      `${env.backUser}/${receiverId}/blocked/${senderId}`,
      { httpsAgent }
    );
    return res.data.blocked === true;
  } catch (error) {
    console.error('Erreur lors de l’appel à isBlocked:', error);
    return false;
  }
}

export async function saveMessage(db: Database, message: ChatMessage): Promise<void> {
  await db.run(
    `INSERT INTO messages (senderId, receiverId, content) VALUES (?, ?, ?)`,
    [message.senderId, message.receiverId, message.content]
  );
}
