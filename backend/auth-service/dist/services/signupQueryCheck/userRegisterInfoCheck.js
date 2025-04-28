import * as checkers from './signupCheckers.js';
export async function userRegisterInfoCheck(request, reply) {
    const query = request.body;
    if (!checkers.isNameValid(query.firstname))
        return reply.status(400).send({ message: "Invalid firstname" });
    if (!checkers.isNameValid(query.lastname))
        return reply.status(400).send({ message: "Invalid lastname" });
    if (!checkers.isusernameValid(query.username))
        return reply.status(400).send({ message: "Invalid username(login)" });
    if (!checkers.isPasswordValid(query.password))
        return reply.status(400).send({ message: "Invalid password" });
    if (!checkers.isEmailValid(query.email))
        return reply.status(400).send({ message: "Invalid email form" });
    if (!checkers.isNicknameValid(query.nickname))
        return reply.status(400).send({ message: "Invalid nickname" });
}
