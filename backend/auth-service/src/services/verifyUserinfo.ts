import { FastifyRequest, FastifyReply } from 'fastify';
import  jwt  from 'jsonwebtoken';
import fastifyJwt from '@fastify/jwt';

import dotenv from 'dotenv';

dotenv.config();

export async function verifyUsername (request: FastifyRequest, reply: FastifyReply ) {
    
    const jwtsecret = process.env.JWT_SECRET ?? '';

    if (!jwtsecret) {
        throw new Error("Missing JWT_SECRET in environment variables");
      } else {
        console.log("jwtsecret print", jwtsecret);
      }
    
    console.log("verifyUsername1");
    const token = request.cookies.token;

    console.log("verifyUsername2");
    // const decoded = jwt.verify(token, jwtsecret);

    console.log("verifyUsername3");

    try {
        console.log("verifyUsername4");
        await request.jwtVerify();
        console.log("verifyUsername5");
        return { user: request.user };
    } catch (error) {
        console.log("verifyUsername error");
        return reply.status(401).send({ error: 'Token not found or expired'});
    } 
}