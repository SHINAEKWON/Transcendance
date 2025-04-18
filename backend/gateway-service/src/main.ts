import Fastify from 'fastify';
import proxy from '@fastify/http-proxy';
import cors from '@fastify/cors';
import dotenv from 'dotenv';

const app = Fastify({ logger: true });
const PORT = 5000;

// Allowing CORS (from front)
app.register(cors, {
  origin: (origin, cb) => {
      if (!origin) {
          cb (null, true);
          return;
      }

      const allowedOrigins = ['http://0.0.0.0:3000', 'http://localhost:3000', 'http://127.0.0.1:3000'];
      if (allowedOrigins.includes(origin)) {
          cb(null, true);
          console.log('Cors OK');
      } else {
          cb(new Error("Not allowed by CORS"), false);
      }
  },
  credentials: true,
});

app.register(proxy, {
  upstream: 'http://auth:4000',
  prefix: '/api/auth',
  rewritePrefix: '',
  preHandler: (req, reply, done) => {
    console.log('Trying proxy -> Gateway...');
    done();
  }
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


app.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
  if (err) {
    console.error(err);
    throw err;
    process.exit(1);
  }
  console.log(`🚪 Gateway ready at http://localhost:${PORT}`);
});
