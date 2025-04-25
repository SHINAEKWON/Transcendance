import { FastifyRequest, FastifyReply } from 'fastify';
import { isPasswordValid } from './passwordcheck.js'

export function userRegisterInforcheck( request: FastifyRequest, reply: FastifyReply) {

    const query = FastifyRequest.body;

    if (!isPasswordValid(query.password)) {
        return reply.status(400).send({ message: "Invalid password" });
}