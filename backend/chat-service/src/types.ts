export interface ChatMessage {
  id?: number;
  senderId: string;
  receiverId: string | null; // null = global
  content: string;
  timestamp: string;
}

