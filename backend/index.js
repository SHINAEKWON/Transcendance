import Fastify from 'fastify';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import path from 'path';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';


// Charger les variables d'environnement
dotenv.config();

// Récupérer le chemin absolu du dossier actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialiser Fastify
const fastify = Fastify({ logger: true });

// Servir les fichiers statiques (HTML, CSS, JS...)
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'game'),
  prefix: '/', // Tous les fichiers statiques seront accessibles directement
});

// Route principale -> Renvoyer index.html
fastify.get('/', async (request, reply) => {
  return reply.sendFile('index.html'); // Servir index.html
});

// Route de test
fastify.get('/ping', async (request, reply) => {
  return { message: 'pong' };
});


// Lancer le serveur
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
    console.log(`🚀 Serveur en ligne : http://localhost:${process.env.PORT || 3000}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
