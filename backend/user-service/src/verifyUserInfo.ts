import { JWT } from '@fastify/jwt';
import type { FastifyRequest, FastifyReply } from 'fastify';

export async function verifyUsername (req: FastifyRequest, reply: FastifyReply) {
    try {

        if (!req.headers.authorization) {
            return reply.status(401).send({ error: "Authorization header missing" });
          }
        await req.jwtVerify();
        return reply.status(200).send ({ user: req.user });
    } catch (error) {
        console.error("JWT auth fail", error);
        return reply.status(401).send({ error: "Unable to get user info from jwt" });
    }
}