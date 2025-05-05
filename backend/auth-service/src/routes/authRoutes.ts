
//dans ce fichier, on trouve le contrat d'interface avec le service auth

import xss from 'xss';
import axios from 'axios';
import request from 'http';
import error from 'console';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt  from 'jsonwebtoken';
// import fastifyJWT from '@fastify/jwt'; // je vais peut etre l'utiliser plutard
import {OAuth2Client} from 'google-auth-library';
import fastify, { FastifyInstance } from 'fastify';
import { cleanEmptyData } from '../utils/utils.js';
import { registerUser } from '../services/authService.js';
import { authenticateUser } from '../services/authService.js';
import { findOrCreateUserWithGoogle } from '../services/authService.js';
import { deleteAuthByUserId, getAllAuthRecords } from '../models/authModel.js';
import { userRegisterInfoCheck } from '../services/signupQueryCheck/userRegisterInfoCheck.js';
import https from 'https';


dotenv.config();
const CLIENT_ID = process.env.CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET as string;
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
export default async function authRoutes(app: FastifyInstance) {

  app.get('/auth', async (req, res) => {
    return await getAllAuthRecords();
  });
  // si /auth/signup/ est sollicite, notre service va:
  // solliciter user-service pour creer un user
  // attendre la reponse avec le user_id
  // sauvegarder les donners de auth 
  // Generer un token pour rester connecté et le renvoyer au front
  // envoyer une reponse au client 

  app.post('/signup', async (request, reply) => {
    console.log('Request came to /auth/signup', request.body);
  
    const {
      username,
      firstname,
      lastname,
      password,
      email,
      address,
      telephone,
      avatar
    } = request.body as {
      username: string,
      firstname: string,
      lastname: string,
      password: string,
      email: string,
      address: string | null,
      telephone: string | null,
      avatar: string | null
    };
  
    // Vérification champs obligatoires
    if (!username || !firstname || !lastname || !password || !email) {
      return reply.status(400).send({
        error: true,
        code: 'MISSING_FIELDS',
        message: "Tous les champs obligatoires doivent être remplis."
      });
    }
  
    try {
      await userRegisterInfoCheck(request, reply); // Ta validation custom si nécessaire
  
      const userData = {
        username,
        firstname,
        lastname,
        password,
        email,
        address,
        telephone,
        avatar
      };
  
      console.log('before register (inside auth/signup)');
  
      const userResponse = await axios.post(
        'https://user-service:4001/user/register',
        userData,
        { httpsAgent }
      );
  
      console.log('register passed');
      const user_id = userResponse.data.user_id;
      const id = user_id.id;
  
      const hashedPassword = await bcrypt.hash(password, 10);
      await registerUser(id, hashedPassword);
  
      const token = jwt.sign({ id, username }, JWT_SECRET, { expiresIn: '1h' });
  
      return reply.code(201).send({
        message: 'Inscription réussie ✅',
        token
      });
  
    } catch (err: any) {
      // Erreur venant du user-service
      if (err.response && err.response.status === 409) {
        const backendError = err.response.data;
  
        // Si c’est une erreur de validation champ par champ
        if (backendError.code === 'VALIDATION_ERROR') {
          return reply.status(409).send({
            error: true,
            code: 'VALIDATION_ERROR',
            fields: backendError.fields,
            message: 'Des champs contiennent des données déjà utilisées.'
          });
        }
  
        // Sinon, erreur générique de conflit
        return reply.status(409).send({
          error: true,
          code: 'USER_ALREADY_EXISTS',
          message: 'Un utilisateur existe déjà avec ces identifiants.'
        });
      }
  
      // Autres erreurs serveur
      console.error('Erreur interne lors de l’inscription :', err);
      return reply.status(400).send({
        error: true,
        code: 'BAD_REQUEST',
        message: "Une erreur est survenue lors de l'inscription."
      });
    }
  });
  
      

      /* signIN ==> auth reçoit :{ email ou username + password}
                    il demande a user-service si l'uitilisateur existe
                    ce dernier envoie user_id ou Null
                    si null => user does not exist
                    si user_id => il vérifie le password
                    si le mot de passe est bon => il envoie ok
                    sinon = > wrong password
      */

      app.post('/signin', async (request, reply) => {
        console.log('Request arrived to /signin : ', request.body);
        try {

          const {
            username,
            email,
            password
          } = request.body as {
            username: string | null;
            email: string | null;
            password: string;
          };
          if (!password || (!username && !email)){
          // if (!password || (!email)){
            reply.status(400).send({error: 'Missing identifier or password'});
          }
          // console.log('in authRoutes, email = ', email, 'username = ', username);
          //demander a user-service si l'utilisateur existe
          const userResponse = await axios.post('https://user-service:4001/user/checkUser', {
            username,
            email
          }, { httpsAgent } );
          

          const user_id = userResponse.data.user_id;
          if (!user_id){
            reply.code(404).send({ message: "user does not exist in user.db", user_id: null });

          }
          const authRecord = await authenticateUser(user_id, password);
          if (!authRecord)              
          {
            reply.code(404).send({ message: "wrong identifier or password", authRecord});
          }
          console.log('user authenticated = ', authRecord);
          //generation du web token
          // const token = jwt.sign({user_id, username: username || email}, JWT_SECRET, {expiresIn: '1h'});
          const token = jwt.sign({user_id, email}, JWT_SECRET, {expiresIn: '1h'});
          reply.status(200).send({message: "authentication success", token});
        } catch (err) {
          console.error('/signin error occured', err);
        }
      });

    // Route backend pour Google Sign-In
    const client = new OAuth2Client(CLIENT_ID);

      app.post('/google-login', async (request, reply) => {
        const { credential } = request.body as { credential: string };

        try {
          const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: CLIENT_ID
          });

          const payload = ticket.getPayload();
          const email = payload?.email;
          const firstname = payload?.given_name || 'GOOGLE_USER';
          const lastname = payload?.family_name || '';
          const avatar = payload?.picture || '';
          console.log("Payload complet :", payload);

          if (!email || !firstname) {
            return reply.status(400).send({ error: 'Invalid Google account data.' });
          }
          //ici j'appelle find or create je ne sais pas si je vais le garder comme ca :D 
          const user_id = await findOrCreateUserWithGoogle(email, firstname, lastname, avatar);
          const token = jwt.sign({ user_id, email, firstname }, JWT_SECRET, { expiresIn: '1h' });
          return reply.send({ token });
        } catch (error) {
          request.log.error(error);
          return reply.status(401).send({ error: 'Invalid token' });
        }
      });

      app.delete('/auth/user/:id', async (req, res) => {
        const { id } = req.params as { id: string };
        const userId = Number(id);
        await deleteAuthByUserId(userId);
        res.status(200).send({ message: 'Auth supprimé.' });
    });
    }

    
  