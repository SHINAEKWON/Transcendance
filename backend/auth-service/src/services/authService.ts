
/*ce fichier presente la logique metier  
c'est l'intermediaire entre fastify et authModel*/


import bcrypt from 'bcrypt';
import axios from 'axios';
import { cleanEmptyData } from '../utils/utils.js';
//fonction qui assure l'enregistrement des donnes d'authenfication d'un utilisateur
import { insertAuthData, AuthData, getAuthByUserId  } from '../models/authModel.js';

export const registerUser = async (
    user_id: number,
    password_hash: string,
    token?: string,
    expires_at?: string,
    is_2fa_enabled?: boolean,
    twofa_secret?: string,
    google_id?: string,
    google_email?: string
  ): Promise<void> => {
    // const password_hash = await bcrypt.hash(password, 10);
  
    const authData: AuthData = {
      user_id,
      password_hash,
      token: token || null,
      expires_at: expires_at || null,
      created_at: undefined,
      is_2fa_enabled: is_2fa_enabled ?? false,
      twofa_secret: twofa_secret || null,
      google_id: google_id || null,
      google_email: google_email || null,
    };
  
    await insertAuthData(authData);
  };

//fonction qui assure la verification des donnes d'authenfication d'un utilisateur et sa connexion??

export const authenticateUser = async (userId: number, password: string) => {
    const authRecord = await getAuthByUserId(userId);
    if (!authRecord)
      return null;    
    console.log('hash from database: ', authRecord.password_hash);
    console.log('hash from signIn: ', password);
    const isValid = await bcrypt.compare(password, authRecord.password_hash);
    console.log('is valid = : ', isValid);
    if (isValid)
      return (authRecord)
    else 
      return (null);
};


// cette fonction va verifier si l'utilisateur google existe dans user.db, sinin elle va le creer
/*
1- verifier si user existe dans la user.db
*/
export async function findOrCreateUserWithGoogle(email: string, firstname: string, lastname: string, avatar: string) {
  try {
    const userResponse = await axios.post('http://user-service:4001/user/checkUser', {
      email,
    })
    const user_id = userResponse.data.user_id;
    if (user_id){
      console.log('user already exists, user_id = ', user_id);
      return (user_id);
    }
    } catch (error:any) {
    if(error.response && error.response.status === 404){
      console.log('User does not exist, creating new user');
      const google_data = {
        firstname,
        lastname,
        username: 'google-' + Math.random().toString(36).substring(2, 10),
        avatar,
        email,
        address: '',
        telephone: ''
      };
      console.log('\n\ngoogle data  = ', google_data, '\n\n');
      // const data = cleanEmptyData(google_data);
      // console.log('\n\ndata = ', data, '\n\n');
      const registerResponse = await axios.post('http://user-service:4001/user/register', google_data);
      return registerResponse.data.user_id;
    }
    console.error("Erreur findOrCreateUserWithGoogle:", error);
    throw error;
  }

  
}

