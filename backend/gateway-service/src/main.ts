import Fastify from 'fastify';
import proxy from '@fastify/http-proxy';
import cors from '@fastify/cors';

const app = Fastify();
const PORT = 5000;

await app.register(cors, {
  origin: ['http://localhost:3000'], // autorise le frontend
  credentials: true
});

// ici on connecte (Auth routes) sur http://localhost:4000
app.register(proxy, {
  upstream: 'http://localhost:4000',
  prefix: '/auth',
  rewritePrefix: ''
});

app.register(proxy, {
  upstream: 'http://localhost:4001',
  prefix: '/user',
  rewritePrefix: ''
});

app.register(proxy, {
  upstream: 'http://localhost:4002',
  prefix: '/game',
  rewritePrefix: ''
});

app.register(proxy, {
  upstream: 'http://localhost:4003',
  prefix: '/chat',
  rewritePrefix: ''
});


app.listen({ port: PORT }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚪 Gateway ready at http://localhost:${PORT}`);
});
