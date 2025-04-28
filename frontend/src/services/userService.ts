import { env } from "../env/env";
import { User } from "../models/user";


export async function getUsersList(){
    const res = await fetch(`${env.backUser}/users`);
    const result = await res.json() as User[];
    return result;
}