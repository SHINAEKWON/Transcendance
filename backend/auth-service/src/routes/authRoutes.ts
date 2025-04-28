//dans ce fichier, on trouve le contrat d'interface avec le service auth


import fastify, { FastifyInstance } from 'fastify';
import  jwt  from 'jsonwebtoken';
import axios from 'axios';
import bcrypt from 'bcrypt';
import { request } from 'http';
import { error } from 'console';
import xss from 'xss';
import { registerUser } from '../services/authService.js';
import { getAllAuthRecords } from '../models/authModel.js';
import { authenticateUser } from '../services/authService.js';
import { userRegisterInfoCheck } from '../services/signupQueryCheck/userRegisterInfoCheck.js';

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
            address: string,
            telephone: string
        };
        console.log('\n\n\n');
        console.log(username, firstname, lastname, password, nickname, email);
        console.log('\n\n\n');

        if (!username || !firstname || !lastname || !password || !nickname || !email) {
            return reply.status(400).send({ message: "Tous les champs sont requis." });
        }
      
        try {
          // User information check in backened in case info are not coming from front
          // await userRegisterInfoCheck(request, reply);

          // const flatNickname = xss(nickname);

          console.log('before register (inside auth/signup)');

          const userResponse = await axios.post('http://user-service:4001/user/register', {
            username,
            firstname,
            lastname,
            password,
            nickname,
            email,
            address,
            telephone
          });
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
    }

