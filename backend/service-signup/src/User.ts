import sqlite3 from 'sqlite3';
import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';
import validator from 'validator';


export class User
{
    private nickname: string;
    private password: string;
    private email: string;

    constructor(nickname: string, password: string, email: string)
    {            
        if (this.isPasswordValid(password) == false || this.isEmailValid(email) == false || this.isNicknameValid(nickname) == false)
        {
            alert("Invalid user input");
            throw new Error("Invalid user input");
        }

        this.nickname = nickname;
        this.password = password;
        this.email = email;
        this.encryptPassword();
    }

    async encryptPassword()
    {
        await bcrypt.hash(this.password, 10);
    }

    // Getters 
    getNickname(): string
    {
        return this.nickname;
    }
      
    getPassword(): string
    {
        return this.password;
    }
    
    getEmail(): string
    {
        return this.email;
    }

    isPasswordValid(password: string): boolean
    {
        const length: boolean = password.length >= 12 && password.length <= 30;
        const regex: boolean = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W])(?!.*(.)\1\1).*$/.test(password);
        return length && regex;
    };
      
    isEmailValid(email: string): boolean
    {
        return validator.isEmail(email);
    };
      
    isNicknameValid(nickname: string): boolean
    {
        const length: boolean = nickname.length >= 2 && nickname.length <= 20;
        const regex: boolean = /^[A-Za-z0-9_.-]+$/.test(nickname);
        return length && regex;
    };

    static addUserToDB(user: User): void
    {
        const nickname: string = user.getNickname();
        const password: string = user.getPassword(); 
        const email: string = user.getEmail(); 
        
        const insertQuery: string = `
        INSERT INTO users (nickname, password, email)
        VALUES (?, ?, ?)
        `;
        
        const db: sqlite3.Database = new sqlite3.Database('./data/user_db.sqlite', (err: Error | null) => {
            if (err) {
                console.error("Error opening user database:", err.message);
            } else {
                console.log("Opened user database");
            }
        });
    
        db.run(insertQuery, [nickname, password, email], function (err: Error)
        {
            if (err) {
                console.error("Error adding user to database:", err.message);
            } else {
                console.log('User added, nickname: ', nickname);
            }
        });
    };

    // aysnc:
    // Wraps a function's return value in a Promise:
    //   An async function always returns a Promise. If you return a value directly 
    //   from an async function, it automatically wraps it in a resolved Promise.
    // Allows the use of await inside the function:
    //   Inside an async function, you can use the await keyword to wait for other 
    //   asynchronous operations (like database calls or HTTP requests) to complete 
    //   before continuing execution.
    // Handles errors with try...catch:
    //   You can use try...catch in async functions to handle errors just like in 
    //   synchronous code, but it works with Promises.
    static async registerNewUser(request: FastifyRequest, reply: FastifyReply)
    {
        const {nickname, password, email }: { nickname: string, password: string, email: string } 
        = request.body as 
        {
            nickname: string,
            password: string,
            email: string,
        };

        if (!password || !nickname || !email) {
            alert("all fields required");
            throw new Error("All fields are required!" );
        }

        // await userRegisterInfoCheck(request, reply);

        try {
            // The cost factor (in this case, 10) is a value that determines how 
            // computationally expensive the hashing process will be.
            // The higher the cost factor, the more time it will take to hash the 
            // password and check hashes during authentication. This makes it more 
            // resistant to brute-force attacks, but at the cost of more CPU usage.        
            const newUser: User = new User( nickname, password, email);
            User.addUserToDB(newUser);

        } catch (error: unknown) {
            if (error instanceof Error) {
                alert("error when registering");
                throw new Error(`Error when registering user: ${error.message}`);
            } else {
                alert("unknown error when registering");
                throw new Error("Unknown error when registering user" );
            }
        }
    }
}