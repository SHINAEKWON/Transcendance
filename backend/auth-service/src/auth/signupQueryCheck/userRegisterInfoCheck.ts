import { FastifyRequest, FastifyReply } from 'fastify';
import * as checkers from './signupCheckers.js'

export function userRegisterInforcheck( request: FastifyRequest, reply: FastifyReply ) {

    const query = FastifyRequest.body;

    if (!checkers.isNameValid(query.firstName))
        return reply.status(400).send({ message: "Invalid firstname" });
    if (!checkers.isNameValid(query.lastName))
        return reply.status(400).send({ message: "Invalid lastname" });
    if (!checkers.isIDNumberValid(query.idNumber))
        return reply.status(400).send({ message: "Invalid idNumber(login)" });
    if (!checkers.isPasswordValid(query.password))
        return reply.status(400).send({ message: "Invalid password" });
    // How to xss nickname ?? How to replace ? How to check?
}