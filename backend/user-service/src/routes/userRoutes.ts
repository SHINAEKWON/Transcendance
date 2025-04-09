import { FastifyInstance } from 'fastify';
import { getAllUsers, getUser, createUser, updateUser, deleteUser, isUserBlocked, blockUser, unblockUser } from '../userModel';

export async function userRoutes(app: FastifyInstance) {
  app.get('/users', async (req, res) => {
    return await getAllUsers();
  });

  app.get('/users/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    return await getUser(Number(id));
  });

  app.post('/users', async (req, res) => {
    const { username, avatar } = req.body as { username: string; avatar: string };
    return await createUser(username, avatar);
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

  // app.delete('/users/:id', async (req, res) => {
  //   const { id } = req.params as { id: string };
  //   return await deleteUser(Number(id));
  // });
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

}