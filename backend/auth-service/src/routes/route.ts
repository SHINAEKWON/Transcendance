import fastify, { FastifyInstance } from 'fastify';
import receivedfromfront from '../services/testreceived.js';
import { newUserRegister } from '../services/auth/register.js';
import { userSignin } from '../services/auth/signin.js';

export default async function formRoutes(app: FastifyInstance) {
    app.post('/api/forms', async (request, reply) => {
        receivedfromfront();
        reply.send({ message: 'Forms route OK' });
    });

    app.post('/register', async (request, reply) => {
        // await newUserRegister(request, reply);
        // reply.send({ message: 'register of newUserRegister OK' });
        console.log('Request arrived to /register : ', request.body);
        
        try {
            const body = request.body;
    
            const user = await newUserRegister(request, reply);
            console.log('newUserRegister OK');
            reply.status(200).send({ success: true, user });
        } catch (err) { 
            console.error('/register erreur occured', err);
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    });

    app.post('/api/auth/signin', async (request, reply) => {
        await userSignin(request, reply);
    });
}
