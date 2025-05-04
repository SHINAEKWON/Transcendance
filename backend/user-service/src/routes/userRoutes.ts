import { FastifyInstance } from 'fastify';
import { User } from '../user.js';
import { getAllUsers, getUser, createUser, updateUser, deleteUser, getUserByEmail, getUserByUsername, deleteFriends, unblockFriend, blockFriend } from '../userModel.js';
// import { avatarUpload } from '../avatarUpload.js';
// import { verifyUsername } from '../verifyUserInfo.js';
import {
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  getAllUsersWithFriendStatus
} from '../userModel.js';
import { avatarUpload } from '../avatarUpload.js';
import { renameAvatarVolume } from '../manageFile.js';


export async function userRoutes(app: FastifyInstance) {

  app.get('/users', async (req, res) => {
    return await getAllUsers();
  });

  app.get('/users/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    return await getUser(Number(id));
  });

  app.delete('/users/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    const userId = Number(id);

    try {
        // Supprimer les données liées dans auth-service
        await fetch(`http://auth-service:4000/auth/user/${userId}`, {
            method: 'DELETE'
        });

        // Supprimer les données liées dans chat-service
        await fetch(`http://chat-service:4003/messages/user/${userId}`, {
            method: 'DELETE'
        });

        // Supprimer les amitiés (dans user-service si c'est là où est la table friends)
        await deleteFriends(userId);

        // Supprimer le user lui-même
        await deleteUser(userId);

        res.status(200).send({ message: 'Utilisateur et toutes les données associées supprimées.' });
    } catch (error) {
        console.error('Erreur lors de la suppression complète :', error);
        res.status(500).send({ error: 'Erreur lors de la suppression.' });
    }
});


  /*****Modification apportee par AHlem nouvelle structure bdd */

  app.post('/user/register', async (req, res) => {
    console.log("request arrived to users/register ", req.body);
    const {
      firstname,
      lastname,
      username,
      avatar,
      email,
      address,
      telephone,
    } = req.body as {
      firstname: string;
      lastname: string;
      username: string;
      avatar?: string;
      email: string;
      address?: string;
      telephone?: string;
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
      telephone ?? null
    );

    try {
      console.log("request came to userRoutes\n");
      const user_id:any = await createUser(user);
      console.log("user_id\n", user_id);
      const id = user_id.id;
      console.log("id\n", id);
      console.log("after NewCreateUser\n");
      res.code(201).send({ message: "Utilisateur créé", user_id});
    } catch (err: any) {
      res.code(409).send({ error: err.message });
    }
  });

    app.post('/user/checkUser', async (req, res) => {
      console.log("request arrived to users/ckeckUser");
      const {
        // username,
        email,
      } = req.body as {
        // username: string | null;
        email: string | null;
      };
      console.log('email = ', email);
      try {
        let user_id = undefined;
        // if (username){
        //   user_id = await getUserByUsername(username);
        // }
        // else 
        if (email){
          console.log('je suis dans else id email ', email);
          user_id = await getUserByEmail(email);
          console.log('user_id = ', user_id);

        }
        if (user_id) {
          console.log('found user :D user_id = ', user_id);
          res.code(200).send({ message: "user exists in user.db", user_id });
        }else {
          res.code(404).send({ message: "user does not exist in user.db", user_id: null });
        }
      }catch (err: any) {
        res.code(500).send({ error: err.message });
      }
    });

    /**** Avatar Upload App (requested from editProfile of Frontend) ****/


  app.post('/getUsername', async (req, res) => {
    try {
      console.log("Inside /getUsername");

      console.log("req.body:", req.body);

      const body = req.body as { id : number };
      const id: number = body.id;

      console.log("extracted user_id : ", id);

      // chercher username and return it with status response
      const query = await getUser(id);
      const username = query.username;

      return res.status(200).send({ username });

    } catch (error) {

      console.error("500 Error has occured: ", error);
      return res.status(500).send({ message: 'Failed to extract username'});

    }
  });

  app.post('/upload', async (req, res) => {
    if (!req.isMultipart()) {
      return res.status(400).send({ error: 'Request is not multipart/form-data' });
    }
    try {
      await avatarUpload(res, req);
      return res.status(200).send({ message: 'Upload complete' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Internal Server Error: Failed to upload: ' });
    }
  });

  app.post('/renameUpload', async (req, res) => {
    console.log("Inside renameUpload");
    try {
      const body = req.body as { newName: string, oldName: string };
      const oldName = body.oldName;
      const extension = oldName.substring(oldName.lastIndexOf('.') + 1);
      const newName = body.newName + "." + extension;
      console.log("oldName: ", oldName, " newName: ", newName);

      await renameAvatarVolume(oldName, newName);
  
      return res.status(200).send({ message: 'Succesfully reanamed the uploaded file' });

    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Failed to rename the uploaded file' });
    }
  });
  
  // Accepter une demande d'amitié
  app.put('/users/:id/friends/:targetId', async (req, res) => {
    const { id, targetId } = req.params as { id: string; targetId: string };
  
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
  
    try {
      const friends = await getAllUsersWithFriendStatus(Number(id));
      res.code(200).send(friends);
    } catch (err: any) {
      res.code(500).send({ error: err.message });
    }
  });
  
  
  // Bloquer un ami
app.post('/users/:id/friends/:targetId/block', async (req, res) => {
  const { id, targetId } = req.params as { id: string; targetId: string };

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

  try {
      const result = await unblockFriend(Number(id), Number(targetId));
      res.code(200).send(result);
  } catch (err: any) {
      res.code(400).send({ error: err.message });
  }
});


}


