// Fastify framwork: a HTTP server for Node.js
import Fastify from 'fastify';
// path: Node.js built-in module for file paths
import path from 'path';
// fileUrlToPath: helper to handle __filename and __dirname in ES modules
import { fileURLToPath } from 'url';
// fastify/static: Fastify plugin to serve static files
import fastifyStatic from '@fastify/static';

/*
    ES modules (modules defined with import/export) do not have 
    __dirname to get the current directory of the executing script.
    fileURLToPath and path.dirname help by:
    - import.meta.url: URL of the current module file
    - fileURLToPath: converts url to a file path
    - path.dirname: gets the directory name of the current file (i.e. where index.js is located)
*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
    Creates a Fastify application instance
    logger: true enables logging in Fastify
*/
const fastify = Fastify({
    logger: true 
});

// Register the static plugin to serve all static files
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../build'),
  decorateReply: true,
});

// fastify.register(fastifyStatic, {
//   root: path.join(__dirname, '../styles'),
//   prefix: '/styles/', // URL prefix to access files in 'styles'
// });

// fastify.register(fastifyStatic, {
//   root: path.join(__dirname, '../build'),
//   prefix: '/build/', // URL prefix to access files in 'build'
// });

// Serve 'index.html' from the 'public' directory when the root URL is accessed
fastify.get('/', async (request, reply) => {
  return reply.sendFile('index.html');  // Make sure 'index.html' is in the 'public' folder
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server listening at http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();