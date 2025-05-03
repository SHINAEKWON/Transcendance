import { Server, Socket } from 'socket.io';
import { saveMessage } from './messageManager.js';

interface ExtendedSocket extends Socket {
  userId?: string;
}

export function registerChatGateway(io: Server, db: any) {
  const userSocketMap = new Map<string, string>();
  io.on('connection', (socket: ExtendedSocket) => {
    // 🔐 Lire l'userId depuis le client
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      console.log("❌ Connexion refusée (pas d'userId)");
      socket.disconnect();
      return;
    }
    userSocketMap.set(userId, socket.id);
    socket.userId = userId;
    console.log(`🟢 Utilisateur connecté : userId=${userId}, socket.id=${socket.id}`);

    
    // 📩 Réception message
    socket.on("removedUser", async (msg) => {
      console.log('removedUser ', msg)
      let id = msg.to;
      const targetSocketId = userSocketMap.get(id);
      if(targetSocketId){
        io.to(targetSocketId).emit("removedUser", msg);
      }
     });

    // 📩 friends events
    socket.on("friendsEvents", async (msg) => {
      console.log('friendsEvents ', msg)
      let id = msg.to;
      const targetSocketId = userSocketMap.get(id);
      if(targetSocketId){
        io.to(targetSocketId).emit("friendsEvents", msg);
      }
     });

     // 📩 Réception message
     socket.on("paddleRelativeMove", async (msg) => {
      let id = msg.to;
      const targetSocketId = userSocketMap.get(id);
      if(targetSocketId){
        io.to(targetSocketId).emit("paddleRelativeMove", msg);
      }
     });

     // 📩 Réception message
     socket.on("paddleMove", async (msg) => {
      let id = msg.to;
      const targetSocketId = userSocketMap.get(id);
      if(targetSocketId){
        io.to(targetSocketId).emit("paddleMove", msg);
      }
     });

     // 📩 Réception message
     socket.on("ballMove", async (msg) => {
      let id = msg.to;
      const targetSocketId = userSocketMap.get(id);
      if(targetSocketId){
        io.to(targetSocketId).emit("ballMove", msg);
      }
     });

     // 📩 Réception message
     socket.on("pressSpace", async (msg) => {
      let id = msg.to;
      const targetSocketId = userSocketMap.get(id);
      if(targetSocketId){
        io.to(targetSocketId).emit("pressSpace", msg);
      }
     });

    // 📩 Réception message
    socket.on("chatMessage", async (msg) => {
      const { content, receiverId } = msg;
      if (!content) return;

      const message = {
        senderId: userId,
        receiverId: receiverId || null,
        content: content.trim(),
        timestamp: new Date().toISOString()
      };

      await saveMessage(db, message);

      if (receiverId) {
        const targetSocketId = userSocketMap.get(receiverId);
        if (targetSocketId) {
          io.to(targetSocketId).emit("newMessage", message);
        }
      } else {
        io.emit("newMessage", message);
      }
    });

    // 🔴 Déconnexion
    socket.on("disconnect", () => {
      console.log(`🔴 userId=${socket.userId} s'est déconnecté`);
    });
  });
}