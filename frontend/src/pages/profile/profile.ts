import { getTranslation } from "../../i18n/i18n.js"; 
import { profileTranslations } from "../../translations/profile.js";
import { RedirectEvents } from "../../utils/redirectEvents.js";

export class ProfilePage implements Page {
    render() {
        const t = (key: keyof typeof profileTranslations) => getTranslation("profile", key);

        const savedUser = localStorage.getItem("transcendenceUser");
        let user;
        if(savedUser){
            user = JSON.parse(savedUser);
        }
        

        const winRate = ((user.wins / user.matches) * 100).toFixed(1);

        const statusBadge: { [key in "online" | "offline" | "in-game"]: string } = {
            online: `<span class="flex items-center gap-2 text-green-400 font-semibold"><span class="w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>${t('online')}</span>`,
            offline: `<span class="flex items-center gap-2 text-gray-400 font-semibold"><span class="w-3 h-3 rounded-full bg-gray-400"></span>${t('offline')}</span>`,
            "in-game": `<span class="flex items-center gap-2 text-yellow-300 font-semibold"><span class="w-3 h-3 rounded-full bg-yellow-300 animate-pulse"></span>${t('in-game')}</span>`,
        };

        const html = `
            <div class="max-w-5xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-xl">
            <div class="flex flex-col items-center mb-8 space-y-6">
            <p class="text-neon-orange text-3xl"> << ${t('welcome')} >> </p>
            </div>
                <!-- Header -->
                <div class="flex justify-between items-start mb-8">
                    <!-- Avatar + Info -->
                    <div class="flex items-center space-x-6">
                        <img src="${user.avatar}" alt="Avatar" class="w-32 h-32 rounded-full border-4 border-neon-green cursor-pointer hover:scale-105 transition" onclick="alert('Edit avatar')">
                        <div>
                            <h3 class="text-2xl text-neon-green font-bold">${user.username}</h3>
                            <p class="text-gray-300">${user.email}</p>
                            <p class="mt-2">${statusBadge[user.status as "online" | "offline" | "in-game"]}</p>
                        </div>
                    </div>
                    <button data-page="editProfile" class="redirect-btn bg-neon-green text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-opacity-80 transition">
                        ✏️ ${t('editProfile')}
                    </button>
                </div>

                <!-- Level -->
                <div class="mb-10">
                    <h4 class="text-neon-blue text-lg font-semibold mb-2">⭐ ${t('levelTitle')}</h4>
                    <p class="text-xl text-white font-bold">Lv. ${user.level}</p>
                </div>

                <!-- Stats -->
                <div class="mt-2">
                    <h4 class="text-neon-purple text-lg font-semibold mb-4">📊 ${t('statsTitle')}</h4>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div class="bg-gray-700 p-4 rounded-lg">
                            <p class="text-sm text-gray-300">${t('matches')}</p>
                            <p class="text-2xl text-white font-bold">${user.matches}</p>
                        </div>
                        <div class="bg-gray-700 p-4 rounded-lg">
                            <p class="text-sm text-gray-300">${t('wins')}</p>
                            <p class="text-2xl text-green-400 font-bold">${user.wins}</p>
                        </div>
                        <div class="bg-gray-700 p-4 rounded-lg">
                            <p class="text-sm text-gray-300">${t('losses')}</p>
                            <p class="text-2xl text-red-400 font-bold">${user.losses}</p>
                        </div>
                        <div class="bg-gray-700 p-4 rounded-lg">
                            <p class="text-sm text-gray-300">${t('winRate')}</p>
                            <p class="text-2xl text-yellow-300 font-bold">${winRate}%</p>
                        </div>
                    </div>
                </div>
        `;

        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = html;

            RedirectEvents.attachRedirectEvents();
        }
    }
}
