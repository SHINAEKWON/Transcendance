/*ce fichier presente la logique metier
c'est l'intermediaire entre fastify et authModel*/
import bcrypt from 'bcrypt';
//fonction qui assure l'enregistrement des donnes d'authenfication d'un utilisateur
import { insertAuthData, getAuthByUserId } from '../models/authModel.js';
export const registerUser = async (user_id, password_hash, token, expires_at, is_2fa_enabled, twofa_secret, google_id, google_email) => {
    // const password_hash = await bcrypt.hash(password, 10);
    const authData = {
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
export const authenticateUser = async (userId, password) => {
    const authRecord = await getAuthByUserId(userId);
    if (!authRecord)
        return null;
    console.log('hash from database: ', authRecord.password_hash);
    console.log('hash from signIn: ', password);
    const isValid = await bcrypt.compare(password, authRecord.password_hash);
    console.log('is valid = : ', isValid);
    if (isValid)
        return (authRecord);
    else
        return (null);
};
//
