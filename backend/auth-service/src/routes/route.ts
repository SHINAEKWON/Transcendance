import fastify, { FastifyInstance } from 'fastify';
import receivedfromfront from '../services/testreceived.js';
import { newUserRegister } from '../services/auth/register.js';
import { userSignin } from '../services/auth/signin.js';

console.log("Into the file Route");

export default async function formRoutes(app: FastifyInstance) {
    app.post('/api/forms', async (request, reply) => {
        receivedfromfront();
        reply.send({ message: 'Forms route OK' });
    });

    app.post('/api/auth/register', async (request, reply) => {
        await newUserRegister(request, reply);
    });

    app.post('/api/auth/siginin', async (request, reply) => {
        await userSignin(request, reply);
    });
}
