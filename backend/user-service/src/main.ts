import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyMultipart from 'fastify-multipart';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { userRoutes } from './routes/userRoutes.js';

const app = Fastify({ logger: true });
const PORT = 4001;

app.register(cors, {
  origin: true, // autorise le frontend
  credentials: true
});

app.register(fastifyMultipart, {
  limits: {
    fileSize: 2097152,
  }
}); // Upload Plugin

app.register(userRoutes);

// Launch Server
app.listen({ port: PORT , host: '0.0.0.0'}, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 user-service listening on http://localhost:${PORT}`);
});
