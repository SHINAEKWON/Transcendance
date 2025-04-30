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
     socket.on("paddleRelativeMove", async (msg) => {
      let id = msg.to;
      const targetSocketId = userSocketMap.get(id);
      if(targetSocketId){
        console.log("to "+targetSocketId)
        io.to(targetSocketId).emit("paddleRelativeMove", msg);
      }
      
      console.log(msg)
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
      socket.on("increaseSpeed", async (msg) => {
        let id = msg.to;
        const targetSocketId = userSocketMap.get(id);
        if(targetSocketId){
          io.to(targetSocketId).emit("increaseSpeed", msg);
        }
       });

        // 📩 Réception message
      socket.on("desactivateBall", async (msg) => {
        let id = msg.to;
        const targetSocketId = userSocketMap.get(id);
        if(targetSocketId){
          io.to(targetSocketId).emit("desactivateBall", msg);
        }
       });

        // 📩 Réception message
      socket.on("increaseRightScore", async (msg) => {
        let id = msg.to;
        const targetSocketId = userSocketMap.get(id);
        if(targetSocketId){
          io.to(targetSocketId).emit("increaseRightScore", msg);
        }
       });

       // 📩 Réception message
      socket.on("increaseLeftScore", async (msg) => {
        let id = msg.to;
        const targetSocketId = userSocketMap.get(id);
        if(targetSocketId){
          io.to(targetSocketId).emit("increaseLeftScore", msg);
        }
       });

        // 📩 Réception message
      socket.on("ballOut", async (msg) => {
        let id = msg.to;
        const targetSocketId = userSocketMap.get(id);
        if(targetSocketId){
          io.to(targetSocketId).emit("ballOut", msg);
        }
       });

     // 📩 Réception message
     socket.on("pressSpace", async (msg) => {
      console.log("receive pressSpace")
      console.log(msg)
      let id = msg.to;
      const targetSocketId = userSocketMap.get(id);
      if(targetSocketId){
        console.log("to "+targetSocketId)
        io.to(targetSocketId).emit("pressSpace", msg);
      }
      console.log(msg)
     });

    // 📩 Réception message
    socket.on("chatMessage", async (msg) => {
      console.log('receive message ', msg);
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
        console.log('send message to', receiverId);
        const targetSocketId = userSocketMap.get(receiverId);
        if (targetSocketId) {
          console.log('send message to targetSocketId', targetSocketId);
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