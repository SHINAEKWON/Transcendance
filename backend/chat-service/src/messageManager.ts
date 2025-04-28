import { Database } from 'sqlite';
import { ChatMessage } from './types.js';
import { env } from 'process';


type BlockResponse = { blocked: boolean };

export async function isBlocked(senderId: string, receiverId: string): Promise<boolean> {
  try {
    const res = await fetch(`${env.backUser}/${receiverId}/blocked/${senderId}`);
    const result = await res.json() as BlockResponse;
    return result.blocked === true;
  } catch {
    return false;
  }
}

export async function saveMessage(db: Database, message: ChatMessage): Promise<void> {
  await db.run(
    `INSERT INTO messages (senderId, receiverId, content) VALUES (?, ?, ?)`,
    [message.senderId, message.receiverId, message.content]
  );
}
