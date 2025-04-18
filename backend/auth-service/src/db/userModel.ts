import sqlite3 from 'sqlite3' // Utilisation de `sqlite3` pour interagir avec la base de données
import { User } from '../models/user/Users.js'; // Importer ta classe User
import * as bcrypt from 'bcrypt';

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
      nickName TEXT NOT NULL,
      password TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      address TEXT,
      telephone TEXT UNIQUE
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
export const createUser = (user: User) => {
  
  const idNumber = user.getId(); 
  const firstName = user.getFirstName(); 
  const lastName = user.getLastName(); 
  const nickName = user.getNickName();
  const password = user.getPassword(); 
  const email = user.getEmail(); 
  const address = user.getAddress(); 
  const telephone = user.getTelephone(); 
  
  const insertQuery = `
  INSERT INTO users (idNumber, firstName, lastName, nickName, password, email, address, telephone)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(insertQuery, [idNumber, firstName, lastName, nickName, password, email, address, telephone], function (err) {
    if (err) {
      console.error("Erreur d'insertion :", err.message);
    } else {
      console.log('Utilisateur ajouté avec l\'ID:', this.lastID);
    }
  });
};


// Fonction pour verifier si un utilisateur existe
export const checkCredentials = (email: string, password: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE email = ?`;
    interface UserRow {
      idNumber: string;
      firstName: string;
      lastName: string;
      nickName: string;
      email: string;
      password: string;
      address: string;
      telephone: string;
    }
//verification de l'email
    db.get(query, [email], async (err, row: UserRow | undefined) => {
      if (err){
        console.log('erreur lors de la verification des identifiants: ', err);
        return reject(err);
      }
      if (!row){
        console.log("email incorrect ou n'a pas ete trouve : \n", email);
        return resolve(null); //l'email n'as pas ete trouve
      }
//verifiaction du mot de passe
      const isPasswordValid = await bcrypt.compare(password, row.password);
      if (!isPasswordValid){
        console.log("mot de passe incorrect");
        return resolve(null) // mauvais mot de passe
      }
      //email et mot de passe correct
      console.log("utilisateur trouve :D \n ",row.firstName,"\n",row.email,"\n",row.password);
      // => on reconstruit l'objet User :D
      const user =  new User(row.idNumber,row.firstName,row.lastName,row.nickName,row.email,row.password,row.address,row.telephone);
      return resolve(user);
    });
  });
};


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

createTable();
