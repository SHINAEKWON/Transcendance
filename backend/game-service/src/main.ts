import Fastify from 'fastify';
import cors from '@fastify/cors';

const app = Fastify({ logger: true });
const PORT = 4002;

app.register(cors, { origin: true });

app.listen({ port: PORT }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 game-service listening on http://localhost:${PORT}`);
});