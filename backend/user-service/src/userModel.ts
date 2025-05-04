import { connectDB } from './db.js';
import { FriendUser } from './friendUser.js';
import { User } from './user.js';
export async function getAllUsers() {
  const db = await connectDB();
  return await db.all('SELECT * FROM users');
}

export async function getUser(id: number) {
  const db = await connectDB();
  return await db.get('SELECT * FROM users WHERE id = ?', [id]);
}

export async function createUser(user: User) {
  const db = await connectDB();
  const result = await db.run(`INSERT INTO users (
    firstname, lastname, username, avatar, status,
    email, address, telephone, matches, wins, losses, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      user.firstname,
      user.lastname,
      user.username,
      user.avatar,
      user.status,
      user.email,
      user.address,
      user.telephone,
      user.matches,
      user.wins,
      user.losses,
      user.created_at
    ]);
  return { id: result.lastID };
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

export async function getUserByEmail(email: string)
{
  const db = await connectDB();
  const row = await db.get<{id: number}>( 'SELECT * FROM users WHERE email = ?', [email]);
  console.log('dans getUserByEmal user_id = ', row);
  if (!row){
    return null;
  }
  console.log('dans getUserByEmal user_id = ', row.id);
  return row.id;
}


export async function getUserByUsername(username: string)
{
  const db = await connectDB();
  const row =  await  db.get<{id: number}>(
    'SELECT * FROM users WHERE username = ?', [username]);
  if (!row){
    return null;
  }
  return row.id; 
}

export async function getUserByTelephone(telephone: string)
{
  const db = await connectDB();
  const row =  await  db.get<{id: number}>(
    'SELECT * FROM users WHERE telephone = ?', [telephone]);
  if (!row){
    return null;
  }
  return row.id; 
}


// Envoyer une demande d'ami
export async function sendFriendRequest(userId: number, friendId: number) {
  const db = await connectDB();

  // Vérifie si une relation existe déjà
  const existing = await db.get(`
    SELECT * FROM friends 
    WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
    [userId, friendId, friendId, userId]);

  if (existing) {
    throw new Error("Une relation existe déjà.");
  }

  await db.run(`
    INSERT INTO friends (user_id, friend_id, status, action_user_id)
    VALUES (?, ?, 'pending', ?)`,
    [userId, friendId, userId]);

  return { message: 'Demande d\'ami envoyée' };
}

// Accepter une demande d'ami
export async function acceptFriendRequest(userId: number, friendId: number) {
  const db = await connectDB();

  const result = await db.run(`
    UPDATE friends
    SET status = 'accepted', action_user_id = ?
    WHERE user_id = ? AND friend_id = ? AND status = 'pending'`,
    [userId, friendId, userId]);

  if (result.changes === 0) {
    throw new Error("Aucune demande en attente trouvée.");
  }

  return { message: 'Demande d\'ami acceptée' };
}

// Supprimer un ami ou annuler une demande
export async function removeFriend(userId: number, friendId: number) {
  const db = await connectDB();

  await db.run(`
    DELETE FROM friends
    WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
    [userId, friendId, friendId, userId]);

  return { message: 'Relation supprimée' };
}

export async function deleteFriends(userId: number) {
  const db = await connectDB();

  try {
      await db.run(
          'DELETE FROM friends WHERE user_id = ? OR friend_id = ?',
          userId,
          userId
      );
      console.log(`Toutes les amitiés liées à l'utilisateur ${userId} supprimées.`);
  } catch (error) {
      console.error('Erreur lors de la suppression des amis :', error);
      throw error;
  } finally {
      await db.close();
  }
}

export async function getAllUsersWithFriendStatus(userId: number): Promise<FriendUser[]> {
  const db = await connectDB();

  const rows = await db.all(`
    SELECT 
      u.*, 
      f.status AS friend_status, 
      f.action_user_id
    FROM users u
    LEFT JOIN friends f 
      ON (
        (f.user_id = ? AND f.friend_id = u.id)
        OR
        (f.friend_id = ? AND f.user_id = u.id)
      )
  `, [userId, userId]);

  return rows.map(row => new FriendUser(
    new User(
      row.id,
      row.firstname,
      row.lastname,
      row.username,
      row.avatar,
      row.status,
      row.email,
      row.address,
      row.telephone,
      row.matches,
      row.wins,
      row.losses,
      row.created_at
    ),
    row.friend_status ?? null,
    row.action_user_id ?? null
  ));

}

export async function blockFriend(userId: number, friendId: number) {
  const db = await connectDB();

  // Vérifier si une relation existe
  const existing = await db.get(`
      SELECT * FROM friends 
      WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
      [userId, friendId, friendId, userId]);

  if (!existing) {
      throw new Error("Aucune relation existante pour bloquer.");
  }

  await db.run(`
      UPDATE friends
      SET status = 'blocked', action_user_id = ?
      WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
      [userId, userId, friendId, friendId, userId]);

  return { message: 'Utilisateur bloqué.' };
}

export async function unblockFriend(userId: number, friendId: number) {
  const db = await connectDB();

  const result = await db.run(`
      UPDATE friends
      SET status = 'accepted'
      WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?) AND status = 'blocked'`,
      [userId, friendId, friendId, userId]);

  if (result.changes === 0) {
      throw new Error("Aucun utilisateur bloqué trouvé.");
  }

  return { message: 'Utilisateur débloqué.' };
}


