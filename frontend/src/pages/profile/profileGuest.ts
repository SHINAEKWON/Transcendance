

import { env } from "../../env/env.js";
import { getTranslation } from "../../i18n/i18n.js";
import { profileTranslations } from "../../translations/profile.js";
import { authorizedFetch } from "../../utils/authorizedFetch.js";
import { decodeId } from "../../utils/decoder.js";

export class ProfileGuestPage implements Page {
    async render() {
        const guestLs = localStorage.getItem("transcendenceUser");
        if (!guestLs) {
            window.location.hash = "#welcome";
            return;
        }

        const currentUser = JSON.parse(guestLs);


        const hash = window.location.hash;
        const urlParams = new URLSearchParams(hash.split('?')[1]);
        const encodedId = urlParams.get('id');
        const viewedUserId = encodedId ? decodeId(encodedId) : null;


        let userToDisplay;
        if (viewedUserId && viewedUserId !== currentUser.id.toString()) {
            const res = await authorizedFetch(`${env.backUser}/users/${viewedUserId}`);
            if (!res || !res.ok) {
                alert("Impossible de charger le profil de cet utilisateur.");
                return;
            }
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                userToDisplay = await res.json();
            } else {
                console.error("La réponse n'est pas du JSON");
                window.location.hash = "#";
                return;
            }
        } else {
            // Soit pas d'id, soit c'est toi-même
            userToDisplay = currentUser;
        }

        // Fonction pour récupérer les traductions
        const t = (key: keyof typeof profileTranslations) => getTranslation("profile", key);


        const html = `
            <div class="max-w-xl mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 rounded-2xl shadow-2xl mt-10 border border-blue-500 animate-fade-in">
                <div class="flex flex-col items-center space-y-6">
                ${(!viewedUserId || viewedUserId === currentUser.id.toString())
                    ? `  <p class="text-neon-orange text-3xl"> << ${t('welcome')} >> </p>`
                    : ""
                }
              
                <img src="${userToDisplay.avatar}" alt="Guest Avatar" class="w-35 h-35 rounded-full border-4 border-blue-400 shadow-[0_0_15px_#3b82f6] hover:scale-105 transition-transform duration-300">
                <h3 class="text-2xl text-neon-green font-bold font-gaming tracking-wide drop-shadow">${userToDisplay.username}</h3>
                <p class="text-neon-purple italic text-sm">${t('guestPlayer')}</p>
                
                <div class="text-4xl text-white animate-bounce">👻</div>
                    
                </div>
            </div>
        `;

        const app = document.getElementById('app');
        if(app){
            app.innerHTML = html;
        }

        
    }

     

}
