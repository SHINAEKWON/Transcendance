import '@fastify/jwt';

declare module '@fastify/jwt' {
    interface fastifyJwt {
        payload: { user_id: string; email: string };
        user: { user_id: string; email: string };
    }
}