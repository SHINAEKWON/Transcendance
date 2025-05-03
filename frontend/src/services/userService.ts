import { env } from "../env/env";
import { User } from "../models/user";


export async function getUsersList(){
    const res = await fetch(`${env.backUser}/users`);
    const result = await res.json() as User[];
    return result;
}

export async function getUsersFriendsStatus(){
    const savedUser = localStorage.getItem("transcendenceUser");
    if (savedUser) {
        const user = JSON.parse(savedUser);
        const res = await fetch(`${env.backUser}/users/${user.id}/usersFriendsStatus`);
        const result = await res.json() as User[];
        return result;
     }
    return null;
}



export async function getUserInfo(id: number){
    const res = await fetch(`${env.backUser}/users/${id}`);
    const result = await res.json() as User[];
    return result;
}