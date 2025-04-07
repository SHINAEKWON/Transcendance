import { Server, Socket } from 'socket.io';
import { saveMessage, isBlocked } from './messageManager';
import { Database } from 'sqlite';

export function registerChatGateway(io: Server, db: Database) {
  io.on('connection', (socket: Socket) => {
    console.log(`🟢 User connected: ${socket.id}`);

    // Message reçu
    socket.on('chatMessage', async (msg) => {
      const { receiverId, content } = msg;

      if (!content || typeof content !== 'string') return;

      const message = {
        senderId: socket.id,
        receiverId: receiverId || null,
        content: content.trim(),
        timestamp: new Date().toISOString(),
      };

      // Vérifie blocage
      if (receiverId && await isBlocked(message.senderId, receiverId)) {
        console.log(`❌ Message bloqué : ${message.senderId} -> ${receiverId}`);
        return;
      }

      // Sauvegarde
      await saveMessage(db, message);

      // Envoi ciblé ou global
      if (receiverId) {
        socket.to(receiverId).emit('newMessage', message);
      } else {
        io.emit('newMessage', message);
      }
    });

    // Invitation à jouer
    socket.on('inviteToGame', ({ to }) => {
      io.to(to).emit('gameInvitation', {
        from: socket.id,
        message: '🎮 Tu as reçu une invitation à jouer !'
      });
    });

    // Notification de tournoi
    socket.on('notifyTournament', ({ userId, matchTime }) => {
      io.to(userId).emit('tournamentUpdate', {
        message: `🏆 Ton match commence à ${matchTime}`,
        time: matchTime
      });
    });

    socket.on('disconnect', () => {
      console.log(`🔴 Disconnected: ${socket.id}`);
    });
  });
}
