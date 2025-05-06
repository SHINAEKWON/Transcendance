import { env } from "../env/env";
import { User } from "../models/user";
import { authorizedFetch } from "../utils/authorizedFetch";


export async function getUsersList(){
    const res = await authorizedFetch(`${env.backUser}/users`);
    const result = await res.json() as User[];
    return result;
}

export async function getUsersFriendsStatus(){
    const savedUser = localStorage.getItem("transcendenceUser");
    if (savedUser) {
        const user = JSON.parse(savedUser);
        const res = await authorizedFetch(`${env.backUser}/users/${user.id}/usersFriendsStatus`);
        const result = await res.json() as User[];
        return result;
     }
    return null;
}

export async function getAllAcceptedFriends(){
    const savedUser = localStorage.getItem("transcendenceUser");
    if (savedUser) {
        const user = JSON.parse(savedUser);
        const res = await authorizedFetch(`${env.backUser}/users/${user.id}/friends`);
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
            const response = await authorizedFetch(`${env.backUser}/users/${userId}/stats`, {
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
    const res = await authorizedFetch(`${env.backUser}/users/${id}`);
    const result = await res.json() as User[];
    return result;
}


// ----------- HISTORY SERVICES -----------

export async function addHistory(name: string, type: string, isWinner: boolean) {
    const savedUser = localStorage.getItem("transcendenceUser");
    if (savedUser) {
        const user = JSON.parse(savedUser);
        const response = await authorizedFetch(`${env.backUser}/users/${user.id}/history`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, type, isWinner })
        });

        if (!response.ok) {
            console.error('Erreur lors de l\'ajout à l\'historique');
            return null;
        }

        const result = await response.json();
        return result;
    }
    return null;
}

export async function getLocalUserHistory() {
    const savedUser = localStorage.getItem("transcendenceUser");
    if (savedUser) {
        const user = JSON.parse(savedUser);
        const response = await authorizedFetch(`${env.backUser}/users/${user.id}/history`);
        if (!response.ok) {
            console.error('Erreur lors de la récupération de l\'historique');
            return [];
        }
        const result = await response.json();
        return result;
    }
    return [];
}

export async function getUserHistory(id: number) {
   
        const response = await authorizedFetch(`${env.backUser}/users/${id}/history`);
        if (!response.ok) {
            console.error('Erreur lors de la récupération de l\'historique');
            return [];
        }
        const result = await response.json();
        return result;
}
export async function deleteUserHistory() {
    const savedUser = localStorage.getItem("transcendenceUser");
    if (savedUser) {
        const user = JSON.parse(savedUser);
        const response = await authorizedFetch(`${env.backUser}/users/${user.id}/history`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            console.error('Erreur lors de la suppression de l\'historique');
            return null;
        }

        const result = await response.json();
        return result;
    }
    return null;
}
