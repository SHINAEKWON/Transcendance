import { connectDB } from './db';

export async function getAllUsers() {
  const db = await connectDB();
  return await db.all('SELECT * FROM users');
}

export async function getUser(id: number) {
  const db = await connectDB();
  return await db.get('SELECT * FROM users WHERE id = ?', [id]);
}

export async function createUser(username: string, avatar: string) {
  const db = await connectDB();
  const result = await db.run('INSERT INTO users (username, avatar) VALUES (?, ?)', [username, avatar]);
  return { id: result.lastID, username, avatar };
}

export async function updateUser(id: number, username: string, avatar: string) {
  const db = await connectDB();
  await db.run('UPDATE users SET username = ?, avatar = ? WHERE id = ?', [username, avatar, id]);
  return { id, username, avatar };
}

export async function deleteUser(id: number) {
  const db = await connectDB();
  await db.run('DELETE FROM users WHERE id = ?', [id]);
  return { message: 'User deleted', id };
}

export async function isUserBlocked(blockerId: string, targetId: string): Promise<boolean> {
  const db = await connectDB();
  const result = await db.get(
    'SELECT 1 FROM blocks WHERE blocker_id = ? AND blocked_id = ?',
    [blockerId, targetId]
  );
  return !!result;
}

export async function blockUser(blockerId: string, targetId: string) {
  const db = await connectDB();
  await db.run(
    'INSERT INTO blocks (blocker_id, blocked_id) VALUES (?, ?)',
    [blockerId, targetId]
  );
}

export async function unblockUser(blockerId: string, targetId: string) {
  const db = await connectDB();
  await db.run(
    'DELETE FROM blocks WHERE blocker_id = ? AND blocked_id = ?',
    [blockerId, targetId]
  );
}
