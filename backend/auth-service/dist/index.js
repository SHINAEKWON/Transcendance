import Fastify from "fastify";
import authRoutes from './routes/authRoutes.js';
const app = Fastify({ logger: true });
const PORT = 4000;
// Test
app.get("/", async (request, reply) => {
    return { message: "Fastify server received your request!" };
});
// Global error handler
app.setErrorHandler((err, request, reply) => {
    console.error('Global error has occured :', err);
    reply.status(500).send({ error: 'Something went wrong !' });
});
// Add all routes in auth service
app.register(authRoutes);
// Server launch
app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.info(`Server is now listening at http://localhost:${PORT}`);
});
