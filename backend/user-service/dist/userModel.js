import { connectDB } from './db.js';
export async function getAllUsers() {
    const db = await connectDB();
    return await db.all('SELECT * FROM users');
}
export async function getUser(id) {
    const db = await connectDB();
    return await db.get('SELECT * FROM users WHERE id = ?', [id]);
}
export async function createUser(username, avatar) {
    const db = await connectDB();
    const result = await db.run('INSERT INTO users (username, avatar) VALUES (?, ?)', [username, avatar]);
    return { id: result.lastID, username, avatar };
}
export async function updateUser(id, username, avatar) {
    const db = await connectDB();
    await db.run('UPDATE users SET username = ?, avatar = ? WHERE id = ?', [username, avatar, id]);
    return { id, username, avatar };
}
export async function deleteUser(id) {
    const db = await connectDB();
    await db.run('DELETE FROM users WHERE id = ?', [id]);
    return { message: 'User deleted', id };
}
export async function isUserBlocked(blockerId, targetId) {
    const db = await connectDB();
    const result = await db.get('SELECT 1 FROM blocks WHERE blocker_id = ? AND blocked_id = ?', [blockerId, targetId]);
    return !!result;
}
export async function blockUser(blockerId, targetId) {
    const db = await connectDB();
    await db.run('INSERT INTO blocks (blocker_id, blocked_id) VALUES (?, ?)', [blockerId, targetId]);
}
export async function unblockUser(blockerId, targetId) {
    const db = await connectDB();
    await db.run('DELETE FROM blocks WHERE blocker_id = ? AND blocked_id = ?', [blockerId, targetId]);
}
export async function getUserByEmail(email) {
    const db = await connectDB();
    const row = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!row) {
        return null;
    }
    return row.id;
}
export async function getUserByUsername(username) {
    const db = await connectDB();
    const row = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (!row) {
        return null;
    }
    return row.id;
}
export const NewCreateUser = async (user) => {
    try {
        const db = await connectDB();
        const insertQuery = `INSERT INTO users (
    firstname, lastname, username, nickname, avatar, status,
    email, address, telephone, matches, wins, losses, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const result = await db.run(insertQuery, [
            user.firstname,
            user.lastname,
            user.username,
            user.nickname,
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
        console.log("sent query to database\n");
        console.log('User created with ID: ', result.lastID);
        return (result.lastID);
    }
    catch (err) {
        console.error("error while insertin user: ", err.message);
        throw err;
    }
};
