import { User } from '../user.js';
import { NewCreateUser } from '../userModel.js';
import { FastifyInstance } from 'fastify';
import { getAllUsers, getUser, createUser, updateUser, deleteUser, isUserBlocked, blockUser, unblockUser, getUserByEmail, getUserByUsername } from '../userModel.js';

export async function userRoutes(app: FastifyInstance) {
  app.get('/users', async (req, res) => {
    return await getAllUsers();
  });

  app.get('/users/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    return await getUser(Number(id));
  });

  app.put('/users/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    const { username, avatar } = req.body as { username: string; avatar: string };
    return await updateUser(Number(id), username, avatar);
  });

  app.delete('/users/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    return await deleteUser(Number(id));
  });

app.get('/users/:id/blocked/:targetId', async (req, res) => {
  const { id, targetId } = req.params as { id: string; targetId: string };
  const blocked = await isUserBlocked(id, targetId);
  return { blocked };
});

app.post('/users/:id/block/:targetId', async (req, res) => {
  const { id, targetId } = req.params as { id: string; targetId: string };
  await blockUser(id, targetId);
  return { message: `User ${targetId} blocked by ${id}` };
});

app.delete('/users/:id/block/:targetId', async (req, res) => {
  const { id, targetId } = req.params as { id: string; targetId: string };
  await unblockUser(id, targetId);
  return { message: `User ${targetId} unblocked by ${id}` };
});

/*****Modification apportee par AHlem nouvelle structure bdd */

app.post('/user/register', async (req, res) => {
  console.log("request arrived to users/register");
  const {
    firstname,
    lastname,
    username,
    nickname,
    avatar,
    email,
    address,
    telephone
  } = req.body as {
    firstname: string;
    lastname: string;
    username: string;
    nickname: string;
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
    nickname,
    avatar ?? null,
    'offline',
    email,
    address ?? null,
    telephone ?? null
  );

  try {
    console.log("request came to userRoutes\n");
    const user_id = await NewCreateUser(user);
    console.log("after NewCreateUser\n");
    res.code(201).send({ message: "Utilisateur créé", user_id });
  } catch (err: any) {
    res.code(409).send({ error: err.message });
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
    try {
      let user_id = undefined;
      if (username){
        user_id = await getUserByUsername(username);
      }
      else if (email){
        user_id = await getUserByEmail(email);
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

  /********** Upload (from branch shinae) ***********/

  // app.post('/upload', async (req, res) => {
// 	try {
// 		// App to execute : photoUpload.ts
// 	}
// 	catch {

// 	}
// });

}


