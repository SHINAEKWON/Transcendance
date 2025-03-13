import Fastify from 'fastify';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Initialiser Fastify
const fastify = Fastify({ logger: true });

// Route principale
fastify.get('/', async (request, reply) => {
  return { message: 'Bienvenue sur ft_transcendence 🎮' };
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
