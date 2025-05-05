import type { FastifyRequest, FastifyReply } from 'fastify';
import * as checkers from './signupCheckers.js'

export async function userRegisterInfoCheck(request: FastifyRequest) {
    const query = request.body as any;

    if (!checkers.isNameValid(query.firstname))
        throw new Error("Invalid firstname");
    if (!checkers.isNameValid(query.lastname))
        throw new Error("Invalid lastname");
    if (!checkers.isusernameValid(query.username))
        throw new Error("Invalid username (login)");
    if (!checkers.isPasswordValid(query.password))
        throw new Error("Invalid password");
    if (!checkers.isEmailValid(query.email))
        throw new Error("Invalid email form");
}
