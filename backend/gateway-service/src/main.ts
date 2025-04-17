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

// app.register(proxy, {
//   upstream: 'http://auth:4000',
//   prefix: '/api/auth',
//   rewritePrefix: '',
//   preHandler: (request,reply, done) => {
//     console.log('[Proxy Handling to 4000]');
//     done();
//   },
// });

// app.register(proxy, {
//   upstream: 'http://auth:4000',
//   prefix: '/api/auth',
//   rewritePrefix: '',
//   preHandler: (req, reply, done) => {
//     console.log('[Proxy Handling to 4000]');
//     done();
//   },
//   onResponse: (request, reply, res) => {
//     console.log('[Gateway] 응답 수신 완료');
//     res.pipe(reply.raw);
//   },
//   onError: (req, reply, error) => {
//     console.error('[Gateway] 에러 발생:', error.message);
//     reply.status(500).send({ error: 'Gateway Error' });
//   }
// });

app.register(proxy, {
  upstream: 'http://auth:4000',
  prefix: '/api/auth',
  rewritePrefix: '',
  preHandler: (req, reply, done) => {
    console.log('[Gateway] 프록시 시도 중...');
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


// app.listen({ port: PORT }, (err) => {
//   if (err) {
//     console.error(err);
//     throw err;
//     process.exit(1);
//   }
//   console.log(`🚪 Gateway ready at http://localhost:${PORT}`);
// });

app.listen({ port: PORT, host: '0.0.0.0' }, () => {
  console.log('Gateway running');
});
