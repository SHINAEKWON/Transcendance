import { Server, Socket } from 'socket.io';
import { handleMessage } from './chatManager';

export function registerChatGateway(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log('🟢 Client connected:', socket.id);

    socket.on('chatMessage', (msg) => {
      const cleanMsg = handleMessage(socket, msg);
      if (cleanMsg) {
        io.emit('newMessage', cleanMsg); // Broadcast
      }
    });

    socket.on('disconnect', () => {
      console.log('🔴 Client disconnected:', socket.id);
    });
  });
}