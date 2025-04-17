import { User } from "../models/user";


export async function getUsersList(){
    const res = await fetch(`http://localhost:5000/user/users`);
    const result = await res.json() as User[];
    return result;
}