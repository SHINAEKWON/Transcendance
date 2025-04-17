
import { FastifyInstance } from 'fastify';
import { initDB } from '../db';
import { getConversation, createMessage } from '../messageModel';

export async function chatRoutes(app: FastifyInstance) {
    // Récupérer les messages entre deux utilisateurs
    app.get('/messages', async (req, res) => {
      const { user1, user2 } = req.query as { user1: string; user2: string };
  
      if (!user1 || !user2) {
        return res.status(400).send({ error: 'Missing user1 or user2 parameter' });
      }
  
      const messages = await getConversation(user1, user2);
      return res.send(messages);
    });
  
    // Récupérer tous les messages de tous les utilisateurs
    app.get('/messages/all', async (req, res) => {
      const db = await initDB();
      const messages = await db.all('SELECT * FROM messages ORDER BY timestamp ASC');
      return res.send(messages);
    });
  
    // Envoyer un nouveau message
    app.post('/messages', async (req, res) => {
      const { senderId, receiverId, content } = req.body as {
        senderId: string;
        receiverId: string;
        content: string;
      };
  
      if (!senderId || !receiverId || !content) {
        return res.status(400).send({ error: 'Missing required fields' });
      }
  
      const message = await createMessage(senderId, receiverId, content);
      return res.status(201).send(message);
    });
  
    // Supprimer un message par son ID
    app.delete('/messages/:id', async (req, res) => {
      const { id } = req.params as { id: string };
      const db = await initDB();
      await db.run('DELETE FROM messages WHERE id = ?', [id]);
      return res.send({ message: `Message ${id} deleted` });
    });
  
    // Supprimer tous les messages entre deux utilisateurs
    app.delete('/messages', async (req, res) => {
      const { user1, user2 } = req.query as { user1: string; user2: string };
  
      if (!user1 || !user2) {
        return res.status(400).send({ error: 'Missing user1 or user2 parameter' });
      }
  
      const db = await initDB();
      await db.run(
        `DELETE FROM messages
         WHERE (senderId = ? AND receiverId = ?)
            OR (senderId = ? AND receiverId = ?)`,
        [user1, user2, user2, user1]
      );
  
      return res.send({ message: `Conversation between ${user1} and ${user2} deleted` });
    });
  }
  