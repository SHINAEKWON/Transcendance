import { env } from "../../env/env.js";
import { getTranslation } from "../../i18n/i18n.js";
import { getUserHistory } from "../../services/userService.js";
import { profileTranslations } from "../../translations/profile.js";
import { authorizedFetch } from "../../utils/authorizedFetch.js";
import { decodeId } from "../../utils/decoder.js";
import { RedirectEvents } from "../../utils/redirectEvents.js";

export class ProfilePage implements Page {
    async render() {
        const t = (key: keyof typeof profileTranslations) => getTranslation("profile", key);

        const savedUser = localStorage.getItem("transcendenceUser");
        let currentUser;
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
        }

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


        const userHistory = await getUserHistory(userToDisplay.id);
        // Calcul des stats à partir de l'historique
        let matches = 0;
        let tournaments = 0;
        let wins = 0;
        let losses = 0;

        for (const entry of userHistory) {
            if (entry.type === "duel") matches++;
            else if (entry.type === "tournament") tournaments++;

            if (entry.isWinner) wins++;
            else losses++;
        }

        // Win rate
        const totalGames = matches + tournaments;
        const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : "0";

        // Level
        const levelPoints = matches * 1 + tournaments * 3;
        const level = Math.floor(levelPoints / 7);


        const statusBadge: { [key in "online" | "offline" | "in-game"]: string } = {
            online: `<span class="flex items-center gap-2 text-green-400 font-semibold"><span class="w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>${t('online')}</span>`,
            offline: `<span class="flex items-center gap-2 text-gray-400 font-semibold"><span class="w-3 h-3 rounded-full bg-gray-400"></span>${t('offline')}</span>`,
            "in-game": `<span class="flex items-center gap-2 text-yellow-300 font-semibold"><span class="w-3 h-3 rounded-full bg-yellow-300 animate-pulse"></span>${t('in-game')}</span>`,
        };

        const historyTable = `
<div class="mt-10">
    <h4 class="text-neon-orange text-lg font-semibold mb-4">🕒 ${t('historyTitle') || "Match / Tournament History"}</h4>
    ${userHistory.length === 0 ?
                `<p class="text-gray-400">${t('noHistory') || "No history available."}</p>` :
                `
        <div class="overflow-x-auto overflow-y-auto h-40 rounded-lg border border-gray-600">

            <table class="min-w-full bg-gray-700 rounded-lg shadow-md">
                <thead>
                    <tr>
                    <th class="py-2 px-4 text-left text-neon-green">${t('name')}</th>
                    <th class="py-2 px-4 text-left text-neon-green">${t('type')}</th>
                    <th class="py-2 px-4 text-left text-neon-green">${t('date')}</th>
                    <th class="py-2 px-4 text-left text-neon-green">${t('result')}</th>
                    
                    </tr>
                </thead>
                <tbody>
                    ${userHistory.map((entry: any) => `
                        <tr class="border-t border-gray-600">
                            <td class="py-2 px-4">${entry.name}</td>
                            <td class="py-2 px-4">${entry.type}</td>
                            <td class="py-2 px-4">${new Date(entry.finished_at).toLocaleString()}</td>
                            <td class="py-2 px-4 font-bold ${entry.isWinner ? 'text-green-400' : 'text-red-400'}">
                            ${entry.isWinner ? t('victory') : t('defeat')}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        `
            }
</div>
`;

        const html = ` 
        <div class="max-w-5xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-xl">
        ${(!viewedUserId || viewedUserId === currentUser.id.toString())
                ? ` <div class="flex flex-col items-center mb-8 space-y-6">
                <p class="text-neon-orange text-3xl"> << ${t('welcome')} >> </p>
            </div>`
                : ""
            }
                <!-- Header -->
                <div class="flex justify-between items-start mb-8">
                    <!-- Avatar + Info -->
                    <div class="flex items-center space-x-6">
                        <img src="${userToDisplay.avatar}" alt="Avatar" class="w-65 h-65 rounded-full border-4 border-neon-green cursor-pointer hover:scale-105 transition" onclick="alert('Edit avatar')">
                        <div>
                            <h3 class="text-2xl text-neon-green font-bold">${userToDisplay.username}</h3>
                            <p class="text-gray-300">${userToDisplay.email}</p>
                            <p class="mt-2">${statusBadge[userToDisplay.status as "online" | "offline" | "in-game"]}</p>

                            <!-- Infos additionnelles -->
                            <div class="mt-4 space-y-1 text-gray-300">
                                <p><span class="font-semibold text-neon-green">${t('firstname') || "First Name"}:</span> ${userToDisplay.firstname || "-"}</p>
                                <p><span class="font-semibold text-neon-green">${t('lastname') || "Last Name"}:</span> ${userToDisplay.lastname || "-"}</p>
                                <p><span class="font-semibold text-neon-green">${t('telephone') || "Telephone"}:</span> ${userToDisplay.telephone || "-"}</p>
                                <p><span class="font-semibold text-neon-green">${t('address') || "Address"}:</span> ${userToDisplay.address || "-"}</p>
                            </div>
                        </div>
                    </div>
                    ${(!viewedUserId || viewedUserId === currentUser.id.toString())
                ? `<button data-page="editProfile" class="redirect-btn bg-neon-green text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-opacity-80 transition">
                            ✏️ ${t('editProfile')}
                          </button>`
                : ""
            }
                    
                </div>

                <!-- Level -->
                <div class="mb-10">
                    <h4 class="text-neon-blue text-lg font-semibold mb-2">⭐ ${t('levelTitle')}</h4>
                    <p class="text-xl text-white font-bold">Lv. ${level}</p>
                </div>

                <!-- Stats -->
                <div class="mt-2">
                    <h4 class="text-neon-purple text-lg font-semibold mb-4">📊 ${t('statsTitle')}</h4>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div class="bg-gray-700 p-4 rounded-lg">
                            <p class="text-sm text-gray-300">${t('matches')}</p>
                            <p class="text-2xl text-white font-bold">${totalGames}</p>
                        </div>
                        <div class="bg-gray-700 p-4 rounded-lg">
                            <p class="text-sm text-gray-300">${t('wins')}</p>
                            <p class="text-2xl text-green-400 font-bold">${wins}</p>
                        </div>
                        <div class="bg-gray-700 p-4 rounded-lg">
                            <p class="text-sm text-gray-300">${t('losses')}</p>
                            <p class="text-2xl text-red-400 font-bold">${losses}</p>
                        </div>
                        <div class="bg-gray-700 p-4 rounded-lg">
                            <p class="text-sm text-gray-300">${t('winRate')}</p>
                            <p class="text-2xl text-yellow-300 font-bold">${winRate}%</p>
                        </div>
                    </div>
                </div>
                ${historyTable}
            </div>
            
        `





        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = html;

            RedirectEvents.attachRedirectEvents();
        }
    }
}
