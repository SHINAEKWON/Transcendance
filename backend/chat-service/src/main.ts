// src/main.ts
import Fastify from 'fastify';
import fastifySocketIO from 'fastify-socket.io';
import { Server as SocketIOServer } from 'socket.io';
import { initDB } from './db.js';
import { registerChatGateway } from './chatGateway.js';

// 🪄 DÉCLARATION pour TypeScript
declare module 'fastify' {
  interface FastifyInstance {
    io: SocketIOServer;
  }
}

const app = Fastify({ logger: true });
app.register(fastifySocketIO, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = 4003;

app.ready().then(async () => {
  const db = await initDB();
  registerChatGateway(app.io, db); // ✅ plus d'erreur ici
});

app.listen({ port: PORT }, (err) => {
  if (err) throw err;
  console.log(`💬 chat-service listening on http://localhost:${PORT}`);
});