import { FastifyInstance } from 'fastify';
import { User } from '../user.js';
import { getAllUsers, getUser, createUser, updateUser, deleteUser, getUserByEmail, getUserByUsername, deleteFriends, unblockFriend, blockFriend, updateUserFull, getAllAcceptedFriends, updateUserStats, addHistoryEntry, getUserHistory, deleteUserHistory } from '../userModel.js';
import { avatarUpload } from '../avatarUpload.js';
import { fileErrorCode } from '../fileErrorCode.js';
import https from 'https';
import axios from 'axios';
import jwt from 'jsonwebtoken';

import {
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  getAllUsersWithFriendStatus
} from '../userModel.js';
import { checkUserUniqueness } from '../userService.js';
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
export async function userRoutes(app: FastifyInstance) {
  const JWT_SECRET = process.env.JWT_SECRET as string;
  app.get('/users', async (req, res) => {
    return await getAllUsers();
  });

  app.get('/users/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      res.code(401).send({ error: 'No Authorization header' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    // Vérifier le token ici (exemple avec JWT)
    try {
      const payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      res.code(403).send({ error: 'Invalid or expired token' });
      return;
    }
    return await getUser(Number(id));
  });

  app.delete('/users/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    const userId = Number(id);
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      res.code(401).send({ error: 'No Authorization header' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    // Vérifier le token ici (exemple avec JWT)
    try {
      const payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      res.code(403).send({ error: 'Invalid or expired token' });
      return;
    }

    try {
      // Supprimer les données liées dans auth-service
      await axios.delete(`https://auth-service:4000/auth/user/${userId}`, { httpsAgent, headers: { Authorization: authHeader } });



      // Supprimer les données liées dans chat-service
      await axios.delete(`https://chat-service:4003/messages/user/${userId}`, { httpsAgent, headers: { Authorization: authHeader } });

      // Supprimer les amitiés (dans user-service si c'est là où est la table friends)
      await deleteFriends(userId);

      // Supprimer le user lui-même
      await deleteUser(userId);

      res.status(200).send({ message: 'Utilisateur et toutes les données associées supprimées.' });
    } catch (error) {
      console.error('Erreur lors de la suppression complète :', error);
      res.status(409).send({ error: 'Erreur lors de la suppression.' });
    }
  });


  /*****Modification apportee par AHlem nouvelle structure bdd */

  app.post('/user/register', async (req, res) => {
    const {
      firstname,
      lastname,
      username,
      avatar,
      email,
      address,
      telephone,
      type
    } = req.body as {
      firstname: string;
      lastname: string;
      username: string;
      avatar?: string;
      email: string;
      address?: string;
      telephone?: string;
      type: string;
    };

    const user = new User(
      null,
      firstname,
      lastname,
      username,
      avatar ?? null,
      'offline',
      email,
      address ?? null,
      telephone ?? null,
      type
    );
    // Étape 1 : Check validations
    const validationErrors = await checkUserUniqueness({ username, email, telephone });

    if (validationErrors) {
      return res.status(409).send({
        error: true,
        code: 'VALIDATION_ERROR',
        fields: validationErrors
      });
    }

    // Étape 2 : Créer l'utilisateur
    try {
      const user_id = await createUser(user);
      return res.code(201).send({ message: 'Utilisateur créé', user_id });
    } catch (err: any) {
      console.error(err);
      return res.status(500).send({ error: true, code: 'SERVER_ERROR', message: 'Erreur serveur.' });
    }
  });


  // ✅ Update user (firstname, lastname, avatar, status, address, telephone)
  app.put('/users/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    const userId = Number(id);
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      res.code(401).send({ error: 'No Authorization header' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    // Vérifier le token ici (exemple avec JWT)
    try {
      const payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      res.code(403).send({ error: 'Invalid or expired token' });
      return;
    }

    const {
      firstname,
      lastname,
      avatar,
      status,
      address,
      telephone
    } = req.body as {
      firstname: string;
      lastname: string;
      avatar: string;
      status: string;
      address: string;
      telephone: string;
    };

    try {
      const updatedUser = await updateUserFull(
        userId,
        firstname,
        lastname,
        avatar,
        status,
        address,
        telephone
      );
      res.code(200).send({ message: 'User updated successfully', user: updatedUser });
    } catch (err: any) {
      console.error('Erreur update user:', err);
      res.status(409).send({ error: 'Erreur lors de la mise à jour de l\'utilisateur.' });
    }
  });

  app.post('/user/checkUser', async (req, res) => {
    console.log("request arrived to users/ckeckUser");
    const {
      username,
      email,
    } = req.body as {
      username: string | null;
      email: string | null;
    };
    console.log('email = ', email);
    try {
      let user_id = undefined;
      if (username) {
        user_id = await getUserByUsername(username);
      }
      else
        if (email) {
          console.log('je suis dans else id email ', email);
          user_id = await getUserByEmail(email);
          console.log('user_id = ', user_id);

        }
      if (user_id) {
        console.log('found user :D user_id = ', user_id);
        res.code(200).send({ message: "user exists in user.db", user_id });
      } else {
        res.code(404).send({ message: "user does not exist in user.db", user_id: null });
      }
    } catch (err: any) {
      res.code(500).send({ error: err.message });
    }
  });

  /**** Avatar Upload App (requested from editProfile of Frontend) ****/

  app.post('/upload', async (req, res) => {
    try {
      console.log("from Upload");
      const avatarUploaded: number = await avatarUpload(res, req);

      if (avatarUploaded == fileErrorCode.SUCCESS) {
        return res.status(200).send({ message: 'Successfully uploaded' });
      } else {
        return res.status(400).send({ message: 'Upload failed' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // Envoyer une demande d'amitié
  app.post('/users/:id/friends/:targetId', async (req, res) => {
    const { id, targetId } = req.params as { id: string; targetId: string };
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      res.code(401).send({ error: 'No Authorization header' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    // Vérifier le token ici (exemple avec JWT)
    try {
      const payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      res.code(403).send({ error: 'Invalid or expired token' });
      return;
    }
    try {
      const result = await sendFriendRequest(Number(id), Number(targetId));
      res.code(201).send(result);
    } catch (err: any) {
      res.code(400).send({ error: err.message });
    }
  });

  // Accepter une demande d'amitié
  app.put('/users/:id/friends/:targetId', async (req, res) => {
    const { id, targetId } = req.params as { id: string; targetId: string };
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      res.code(401).send({ error: 'No Authorization header' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    // Vérifier le token ici (exemple avec JWT)
    try {
      const payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      res.code(403).send({ error: 'Invalid or expired token' });
      return;
    }
    try {
      const result = await acceptFriendRequest(Number(id), Number(targetId));
      res.code(200).send(result);
    } catch (err: any) {
      res.code(400).send({ error: err.message });
    }
  });

  // Supprimer un ami (ou annuler une demande)
  app.delete('/users/:id/friends/:targetId', async (req, res) => {
    const { id, targetId } = req.params as { id: string; targetId: string };
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      res.code(401).send({ error: 'No Authorization header' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    // Vérifier le token ici (exemple avec JWT)
    try {
      const payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      res.code(403).send({ error: 'Invalid or expired token' });
      return;
    }
    try {
      const result = await removeFriend(Number(id), Number(targetId));
      res.code(200).send(result);
    } catch (err: any) {
      res.code(400).send({ error: err.message });
    }
  });

  // Liste des amis
  app.get('/users/:id/usersFriendsStatus', async (req, res) => {
    const { id } = req.params as { id: string };
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      res.code(401).send({ error: 'No Authorization header' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    // Vérifier le token ici (exemple avec JWT)
    try {
      const payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      res.code(403).send({ error: 'Invalid or expired token' });
      return;
    }
    try {
      const friends = await getAllUsersWithFriendStatus(Number(id));
      res.code(200).send(friends);
    } catch (err: any) {
      res.code(400).send({ error: err.message });
    }
  });


  app.get('/users/:id/friends', async (req, res) => {
    const { id } = req.params as { id: string };
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      res.code(401).send({ error: 'No Authorization header' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    // Vérifier le token ici (exemple avec JWT)
    try {
      const payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      res.code(403).send({ error: 'Invalid or expired token' });
      return;
    }
    try {
      const friends = await getAllAcceptedFriends(Number(id));
      res.code(200).send(friends);
    } catch (err: any) {
      console.error('Erreur pour récupérer la liste des amis :', err);
      res.status(400).send({ error: 'Erreur serveur lors de la récupération des amis.' });
    }
  });

  app.put('/users/:id/stats', async (req, res) => {
    const { id } = req.params as { id: string };
    const { didWin } = req.body as { didWin: boolean };
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      res.code(401).send({ error: 'No Authorization header' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    // Vérifier le token ici (exemple avec JWT)
    try {
      const payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      res.code(403).send({ error: 'Invalid or expired token' });
      return;
    }
    try {
      const result = await updateUserStats(Number(id), didWin);
      res.code(200).send({ message: 'Stats mises à jour', result });
    } catch (err: any) {
      console.error('Erreur mise à jour stats :', err);
      res.status(400).send({ error: 'Erreur lors de la mise à jour des stats.' });
    }
  });


  // Bloquer un ami
  app.post('/users/:id/friends/:targetId/block', async (req, res) => {
    const { id, targetId } = req.params as { id: string; targetId: string };
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      res.code(401).send({ error: 'No Authorization header' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    // Vérifier le token ici (exemple avec JWT)
    try {
      const payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      res.code(403).send({ error: 'Invalid or expired token' });
      return;
    }
    try {
      const result = await blockFriend(Number(id), Number(targetId));
      res.code(200).send(result);
    } catch (err: any) {
      res.code(400).send({ error: err.message });
    }
  });

  // Débloquer un ami
  app.delete('/users/:id/friends/:targetId/block', async (req, res) => {
    const { id, targetId } = req.params as { id: string; targetId: string };
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      res.code(401).send({ error: 'No Authorization header' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    // Vérifier le token ici (exemple avec JWT)
    try {
      const payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      res.code(403).send({ error: 'Invalid or expired token' });
      return;
    }
    try {
      const result = await unblockFriend(Number(id), Number(targetId));
      res.code(200).send(result);
    } catch (err: any) {
      res.code(400).send({ error: err.message });
    }
  });



/** Ajouter une entrée dans l'historique */
app.post('/users/:id/history', async (req, res) => {
  const { id } = req.params as { id: string };
  const { name, type, isWinner } = req.body as {
    name: string;
    type: string;
    isWinner: boolean;
  };

  try {
    const result = await addHistoryEntry(name, type, Number(id), isWinner);
    res.code(201).send({ message: 'Historique ajouté', result });
  } catch (err: any) {
    console.error('Erreur ajout historique :', err);
    res.status(400).send({ error: err.message });
  }
});

/** Récupérer l'historique d'un utilisateur */
app.get('/users/:id/history', async (req, res) => {
  const { id } = req.params as { id: string };

  try {
    const history = await getUserHistory(Number(id));
    res.code(200).send(history);
  } catch (err: any) {
    console.error('Erreur récupération historique :', err);
    res.status(400).send({ error: err.message });
  }
});

/** Supprimer tout l'historique d'un utilisateur */
app.delete('/users/:id/history', async (req, res) => {
  const { id } = req.params as { id: string };

  try {
    const result = await deleteUserHistory(Number(id));
    res.code(200).send({ message: 'Historique supprimé', result });
  } catch (err: any) {
    console.error('Erreur suppression historique :', err);
    res.status(400).send({ error: err.message });
  }
});



}


