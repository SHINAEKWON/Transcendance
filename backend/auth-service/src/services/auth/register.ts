import { FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../../models/user/Users.js';
import { UserStatus } from '../../models/user/Users.js';
import * as userModel from '../../db/userModel.js';
import bcrypt from 'bcrypt';


export async function newUserRegister( request: FastifyRequest,
    reply: FastifyReply ) {

    // console.log("from newuserRegister, DEBUG BODY :", request.body);

    const { 
      idNumber,
      firstName,
      lastName,
      password,
      nickname,
      status,
      email,
      address,
      telephone,
      // matchNb,
      // winNb,
      // loseNb,
      // friends,
      // blockedUsers
    } = request.body as {
      idNumber: string,
      firstName: string,
      lastName: string,
      password: string,
      nickname: string,
      status: UserStatus,
      email: string,
      address: string,
      telephone: number,
      // matchNb: number,
      // winNb: number,
      // loseNb: number,
      // friends: string[],
      // blockedUsers: string[]
    };

  // Validation simple
  if (!idNumber || !firstName || !lastName || !password || !nickname || !email) {
    return reply.status(400).send({ message: "Tous les champs ne sont pas requis." });
  }

  try {
    // Hasher le mot de passe\
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Création d'un nouvel utilisateur 
    // const newUser = new User( idNumber, firstName, lastName, hashedPassword, nickname, status, email, address, telephone, matchNb, winNb, loseNb, friends, blockedUsers );
    const newUser = new User( idNumber, firstName, lastName, hashedPassword, nickname, status, email, address, telephone );

    // Ajout de l'utilisateur à la base de données
    const createdUser = await userModel.createUser(newUser);

    return { message: "Utilisateur créé avec succès", user: createdUser };
  } catch (error: unknown) {
    // Typage explicite de l'erreur
    if (error instanceof Error) {
      return reply.status(400).send({ message: `Erreur lors de la création de l'utilisateur: ${error.message}` });
    } else {
      return reply.status(400).send({ message: "Erreur inconnue" });
    }
  }
}