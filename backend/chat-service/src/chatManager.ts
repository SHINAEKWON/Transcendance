import { Socket } from 'socket.io';
import { ChatMessage } from './types';

export function handleMessage(socket: Socket, msg: any): ChatMessage | null {
  if (!msg || typeof msg.text !== 'string' || msg.text.trim() === '') {
    return null;
  }

  const message: ChatMessage = {
    userId: socket.id, // tu peux remplacer par un vrai ID utilisateur plus tard
    text: msg.text.trim(),
    timestamp: new Date().toISOString(),
  };

  return message;
}