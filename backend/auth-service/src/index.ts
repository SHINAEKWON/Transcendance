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

        const allowedOrigins = ['http://0.0.0.0:3000', 'http://localhost:3000'];
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
app.register(formRoutes);


app.listen ({ port: 3001, host: "0.0.0.0" }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.info('Server is now listening at 0.0.0.0:3001');
});
