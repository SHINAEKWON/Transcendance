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

export async function getAllAcceptedFriends(){
    const savedUser = localStorage.getItem("transcendenceUser");
    if (savedUser) {
        const user = JSON.parse(savedUser);
        const res = await fetch(`${env.backUser}/users/${user.id}/friends`);
        const result = await res.json() as User[];
        return result;
     }
    return [];
}

export async function updateStats(userId: number, didWin: boolean) {
    const savedUser = localStorage.getItem("transcendenceUser");
    if (savedUser) {
        const user = JSON.parse(savedUser);
        if(user.id == userId){
            const response = await fetch(`${env.backUser}/users/${userId}/stats`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ didWin })
                 });
        
            if (!response.ok) {
                console.error('Erreur lors de la mise à jour des stats');
                return;
            }
        
            const result = await response.json();
            console.log('Stats mises à jour :', result);
        
            // Optionnel : mettre à jour le localStorage
            const savedUser = localStorage.getItem("transcendenceUser");
            if (savedUser) {
                const user = JSON.parse(savedUser);
                user.matches = result.result.matches;
                user.wins = result.result.wins;
                user.losses = result.result.losses;
                localStorage.setItem("transcendenceUser", JSON.stringify(user));
            }
            
        }
    }
       
}



export async function getUserInfo(id: number){
    const res = await fetch(`${env.backUser}/users/${id}`);
    const result = await res.json() as User[];
    return result;
}