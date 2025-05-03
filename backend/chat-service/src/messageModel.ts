
import { initDB } from './db.js';

export type Message = {
  id?: number;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp?: string;
};

// 🔹 Récupère tous les messages entre deux utilisateurs
export async function getConversation(senderId: string, receiverId: string): Promise<Message[]> {
  const db = await initDB();
  return await db.all(
    `SELECT * FROM messages
     WHERE (senderId = ? AND receiverId = ?)
        OR (senderId = ? AND receiverId = ?)
     ORDER BY timestamp ASC`,
    [senderId, receiverId, receiverId, senderId]
  );
}

// 🔹 Crée un nouveau message
export async function createMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
  const db = await initDB();
  const result = await db.run(
    `INSERT INTO messages (senderId, receiverId, content) VALUES (?, ?, ?)`,
    [senderId, receiverId, content]
  );

  return {
    id: result.lastID,
    senderId,
    receiverId,
    content,
    timestamp: new Date().toISOString(),
  };
}
export async function deleteMessagesByUserId(userId: number) {
  const db = await initDB();

  const userIdStr = userId.toString();

  try {
      await db.run(
          'DELETE FROM messages WHERE senderId = ? OR receiverId = ?',
          userIdStr,
          userIdStr
      );
      console.log(`Messages supprimés pour user_id=${userId}`);
  } catch (error) {
      console.error('Erreur lors de la suppression des messages :', error);
      throw error;
  } finally {
      await db.close();
  }
}
