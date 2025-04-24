import { User } from "../models/user";


export async function getUsersList(){
    const res = await fetch(`/user/users`);
    const result = await res.json() as User[];
    return result;
}