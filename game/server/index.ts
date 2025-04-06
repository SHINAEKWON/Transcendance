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

/*
    - fastify.register(fastifyStatic, ...): registers the @fastify/static
      plugin with Fastify (will allow to serve static files from a directory)
    - root: path.join(__dirname, ../build): specifies the root folder where to look for
      static files
    - prefix: '/': defines URL path used to access static files
*/
fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../../public'),
    prefix: '/',
});

/*
    fastify.setNotFoundHandler: fallback route for all requests that don't match 
    a specific route (important for SPAs)
    - reply.type('text/html').sendFile('index.html'): return the index.html file
*/
fastify.setNotFoundHandler((_, reply: any) => {
    reply.type('text/html').sendFile('index.html');
});

/*
    Starting server: 
    - fastify.listen: starts fastify server on specified port and binds it to specified
      ip-address
    - console.log: logs
    - process.exit(1): exits with code 1
*/
const start = async() => {
    try {
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Server ready at http://localhost:3000');
    } catch(err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();