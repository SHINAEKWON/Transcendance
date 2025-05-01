//dans ce fichier, on trouve le contrat d'interface avec le service auth


import fastify, { FastifyInstance } from 'fastify';
import  jwt  from 'jsonwebtoken';
import axios from 'axios';
import bcrypt from 'bcrypt';
import xss from 'xss';
import { request } from 'http';
import { error } from 'console';
import { registerUser } from '../services/authService.js';
import { getAllAuthRecords } from '../models/authModel.js';
import { authenticateUser } from '../services/authService.js';
import { userRegisterInfoCheck } from '../services/signupQueryCheck/userRegisterInfoCheck.js';
import { findOrCreateUserWithGoogle } from '../services/authService.js';
import { cleanEmptyData } from '../utils/utils.js';

/**google signIN */
import {OAuth2Client} from 'google-auth-library';
import fastifyJWT from '@fastify/jwt';
import dotenv from 'dotenv';
dotenv.config(); // loads environment variables from .env file
// const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_ID = "1040530451320-9a6e95o4gf3smhi97qp6ktn973qe6vfv.apps.googleusercontent.com";
console.log('CLIENT_ID = ', CLIENT_ID);
// console.log('CLIENT_ID = ', process.env.CLIENT_ID);



/*tocken a ajouter dans le .env */
const JWT_SECRET="superscret42";

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
          nickname,
          email,
          address,
          telephone
        } = request.body as {
            username: string,
            firstname: string,
            lastname: string,
            password: string,
            nickname: string,
            email: string,
            address: string | null,
            telephone: string | null
        };
        console.log('\n\n\n');
        console.log(username, firstname, lastname, password, nickname, email);
        console.log('\n\n\n');

        if (!username || !firstname || !lastname || !password || !nickname || !email) {
            return reply.status(400).send({ message: "Tous les champs sont requis." });
        }
      
        try {
          // User information check in backened in case info are not coming from front
          await userRegisterInfoCheck(request, reply);

          const data = cleanEmptyData({
            username,
            firstname,
            lastname,
            password,
            nickname,
            email,
            address,
            telephone
          })
          const flatNickname = xss(nickname);

          console.log('before register (inside auth/signup)');

          const userResponse = await axios.post('http://user-service:4001/user/register', data);
          console.log('register passed');
          const user_id = userResponse.data.user_id;
          console.log('user id = ', user_id);
          const hashedPassword = await bcrypt.hash(password, 10);
          await registerUser(user_id, hashedPassword);
          //generation du web token
          const token = jwt.sign({user_id, username}, JWT_SECRET, {expiresIn: '1h'});
          return reply.code(201).send({ message: 'Auth registration successful ✅', token });
        } catch (err: any) {
          console.error('Error in route /auth/signup: ', err);
          if (err.reponse === 'SQLITE_CONSTRAINT' && err.reponse.status === 500){
           return reply.status(409).send({ 
              error: 'a user already exists with this username, nickname, email or phone number.' });
          }
          else{
            return reply.status(500).send({ error: "an error occurred while saving authentication data." });
          }
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
            // username,
            email,
            password
          } = request.body as {
            username: string | null;
            email: string | null;
            password: string;
          };
          // if (!password || (!username && !email)){
          if (!password || (!email)){
            reply.status(400).send({error: 'Missing identifier or password'});
          }
          // console.log('in authRoutes, email = ', email, 'username = ', username);
          //demander a user-service si l'utilisateur existe
          const userResponse = await axios.post('http://user-service:4001/user/checkUser', {
            // username,
            email
          }
          );

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

          // const nickname = payload?:isNicknameValid;

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
    }

