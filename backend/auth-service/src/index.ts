import Fastify from "fastify";
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import path from 'path';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';
import formRoutes from './routes/route.js';
import cors from '@fastify/cors';

const app = Fastify ({ logger: true });

// Allowing CORS (from front)
app.register(cors, {
    origin: (origin, cb) => {
        if (!origin) {
            cb (null, true);
            return;
        }

        const allowedOrigins = [
          'http://0.0.0.0:3000',
          'http://localhost:3000',
          'http://127.0.0.1:3000',
          'http://0.0.0.0:5000',
          'http://localhost:5000',
          'http://127.0.0.1:5000'];
        if (allowedOrigins.includes(origin)) {
            cb(null, true);
        } else {
            cb(new Error("Not allowed by CORS"), false);
        }
    },
    credentials: true,
});

app.get ("/", async (request, reply) => {
    return { message : "Fastify server received your request!" };
});

// Backend Router

const PORT = 4000;

app.setErrorHandler((err, request, reply) => {
    console.error('🔥 글로벌 에러 발생:', err);
    reply.status(500).send({ error: 'Something broke!' });
});

app.register(formRoutes);

app.listen ({ port: PORT, host: "0.0.0.0" }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.info('Server is now listening at http://localhost:${PORT}');
});
