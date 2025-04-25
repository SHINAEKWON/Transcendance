import fastify, { FastifyInstance } from 'fastify';
import { newUserRegister } from '../auth/register.js';
import { userSignin } from '../auth/signin.js';

export default async function formRoutes(app: FastifyInstance) {

    app.post('/register', async (request, reply) => {
        
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

    app.post('/signin', async (request, reply) => {
        console.log('Request arrived to /signin : ', request.body);        
        try {
            await userSignin(request, reply);
            console.log('dans le signin');
        } catch (err) {
            console.error('/signin error occured', err);
        }

    });
}
