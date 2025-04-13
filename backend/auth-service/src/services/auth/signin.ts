import { FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../../models/user/Users.js';
import { UserStatus } from '../../models/user/Users.js';
import * as userModel from '../../db/userModel.js';
import bcrypt from 'bcrypt';

export async function userSignin( request: FastifyRequest, reply: FastifyReply ) {

    console.log("from userSignin, DEBUG BODY :", request.body);

    // const { idNumber, email, password } = request.body as { idNumber: string, email: string, password: string };

    // try {

    // } catch {

    // }
}