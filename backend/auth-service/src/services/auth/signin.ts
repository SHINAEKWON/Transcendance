import { FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../../models/user/Users.js';
import { UserStatus } from '../../models/user/Users.js';
import * as userModel from '../../db/userModel.js';
import bcrypt from 'bcrypt';

export async function userSignin( request: FastifyRequest, reply: FastifyReply ) {

    const { email, password } = request.body as { email: string, password: string };

    console.log(request.body);
    
    try {
    // Vérifier les identifiants de l'utilisateur
    const user = await userModel.checkCredentials(email, password);

    if (!user) {
      // Si les identifiants sont incorrects
      return reply.status(401).send({ message: 'Identifiants incorrects' });
    }

    // Si l'utilisateur est trouvé et les identifiants sont corrects
    return reply.status(200).send({
      message: 'Connexion réussie',
      user: {
        username: user.getFirstName(),
        email: user.getEmail()
      },
    });

    } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return reply.status(500).send({ message: 'Erreur interne du serveur' });
  }
}