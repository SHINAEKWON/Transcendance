import Fastify from "fastify";
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import path from 'path';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import cors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import  jwt  from 'jsonwebtoken'
import fastifyJwt from '@fastify/jwt';
import fs from 'fs';

const app = Fastify ({ logger: true,
    https: {
      key: fs.readFileSync('./ssl/selfsigned.key'),
      cert: fs.readFileSync('./ssl/selfsigned.crt')
    } 
});

const PORT = 4000;

app.register(cors, {
    origin: true,
    credentials: true
  });
  

// Test
app.get ("/", async (request, reply) => {
    return { message : "Fastify server received your request!" };
});

// Global error handler
app.setErrorHandler((err, request, reply) => {
    console.error('Global error has occured :', err);
    reply.status(500).send({ error: 'Something went wrong !' });
});

// Add all routes in auth service
app.register(fastifyCookie);
// app.register(fastifyJwt, { secret: process.env.JWT_SECRET!});
app.register(authRoutes);

// Server launch
app.listen ({ port: PORT, host: "0.0.0.0" }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.info(`Server is now listening at https://localhost:${PORT}`);
});
