import Fastify from 'fastify';
import fastifySocketIO from 'fastify-socket.io';
import { registerChatGateway } from './chatGateway';

const app = Fastify();

app.register(fastifySocketIO);

app.ready().then(() => {
  registerChatGateway(app.io); // Plug le système de chat
});

app.listen({ port: 4002 }, (err) => {
  if (err) throw err;
  console.log('🚀 Chat-service listening on http://localhost:4002');
});