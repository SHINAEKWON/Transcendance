import sqlite3 from 'sqlite3'; // Utilisation de `sqlite3` pour interagir avec la base de données
import { User } from '../models/user/Users'; // Importer ta classe User
import bcrypt from 'bcrypt';

// Ouvrir la base de données
const db = new sqlite3.Database('./data/user_db.sqlite', (err) => {
  if (err) {
    console.error("Erreur d'ouverture de la base de données :", err.message);
  } else {
    console.log("Base de données ouverte avec succès");
  }
});

// Créer la table 'users' si elle n'existe pas
// Pour [friends] et [blockedUsers] qui sont cences recevoir des arrays,
// meilleure methode serait de creer un autre sous-table pour chaque utilisateur,
// mais je laisse en format TEXT provisoirement
const createTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      idNumber TEXT NOT NULL UNIQUE,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      password TEXT NOT NULL,
      nickname TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      address TEXT,
      telephone INTEGER UNIQUE,
      matchNb  INTEGER DEFAULT 0,
      winNb INTEGER DEFAULT 0,
      loseNb INTEGER DEFAULT 0,
      friends TEXT,
      blockedUsers TEXT,
      status TEXT CHECK (status IN ('online', 'offline')) DEFAULT 'offline'
    );
  `;
  db.run(createTableQuery, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table:', err);
    } else {
      console.log('Table "users" créée ou déjà existante');
    }
  });
};

// Fonction pour ajouter un utilisateur à la base de données
export const createUser = (user: User): Promise<User> => {
  return new Promise((resolve, reject) => {
    const idNumber = user.getId(); 
    const firstName = user.getFirstName(); 
    const lastName = user.getLastName(); 
    const password = user.getPassword(); 
    const nickname = user.getNickName(); 
    const email = user.getEmail(); 
    const status = user.getStatus(); 
    const address = user.getAddress(); 
    const telephone = user.getTelephone(); 
    const matchNb = user.getMatchNb(); 
    const winNb = user.getWinNb(); 
    const loseNb = user.getloseNb(); 
    const friends = user.getFriends(); 
    const blockedUsers = user.getBlockedUsers();
    
    const insertQuery = `
    INSERT INTO users (idNumber, firstName, lastName, password, nickname, email, status, address, telephone, matchNb, winNb, loseNb, friends, blockedUsers)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
      db.run(insertQuery, [idNumber, firstName, lastName, password, nickname, email, status, address, telephone, matchNb, winNb, loseNb, friends, blockedUsers], function (err) {
        if (err) {
          console.error("Erreur d'insertion :", err.message);
          reject (new Error(err.message));
        } else {
          console.log('Utilisateur ajouté avec l\'ID:', this.lastID);
          resolve(user);
        }
    });
  });
};

createTable();

// // Fonction pour verifier si un utilisateur existe
// export const checkCredentials = (email: string, password: string): Promise<User | null> => {
//   return new Promise((resolve, reject) => {
//     const query = `SELECT * FROM users WHERE email = ?`;
//     interface UserRow {
//       username: string;
//       email: string;
//       password: string;
//       wins: number;
//       losses: number;
//     }
// //verification de l'email
//     db.get(query, [email], async (err, row: UserRow | undefined) => {
//       if (err){
//         console.log('erreur lors de la verification des identifiants: ', err);
//         return reject(err);
//       }
//       if (!row){
//         console.log("email incorrect ou n'a pas ete trouve");
//         return resolve(null); //l'email n'as pas ete trouve
//       }
// //verifiaction du mot de passe
//       const isPasswordValid = await bcrypt.compare(password, row.password);
//       if (!isPasswordValid){
//         console.log("mot de passe incorrect");
//         return resolve(null) // mauvais mot de passe
//       }
//       //email et mot de passe correct
//       console.log("utilisateur trouve :D \n ",row.username,"\n",row.email,"\n",row.password);
//       // => on reconstruit l'objet User :D
//       const user: User = {
//         username: row.username,
//         email: row.email,
//         password: row.password,  // Assure-toi de ne pas renvoyer le mot de passe dans un contexte réel
//         stats: {
//           wins: row.wins,
//           losses: row.losses
//         },
//       };
//       return resolve(user);
//     });
//   });
// };


// Fonction pour fermer la base de données proprement
// export const closeDb = () => {
//   db.close((err) => {
//     if (err) {
//       console.error("Erreur de fermeture de la base de données :", err.message);
//     } else {
//       console.log("Base de données fermée avec succès");
//     }
//   });
// };

// Appeler createTable à l'initialisation pour s'assurer que la table existe

