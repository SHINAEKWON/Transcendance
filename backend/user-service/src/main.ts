import Fastify from 'fastify';
import cors from '@fastify/cors';
import { userRoutes } from './routes/userRoutes';

const app = Fastify({ logger: true });
const PORT = 4001;

app.register(cors, { origin: true });
app.register(userRoutes);

app.listen({ port: PORT }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 user-service listening on http://localhost:${PORT}`);
});