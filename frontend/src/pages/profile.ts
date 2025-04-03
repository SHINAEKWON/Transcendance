import { getTranslation } from "../i18n/i18n.js"; 
import { profileTranslations } from "../translations/profile.js";

export class ProfilePage {
    render(): string {
        // Assurez-vous que la clé est valide pour "profile"
        const t = (key: keyof typeof profileTranslations) => getTranslation("profile", key);

        const user = {
            username: "AsmaPro",
            email: "asma@gaming.com",
            status: "in-game", // 'online', 'offline', 'in-game'
            avatar: "./public/images/profile.jpg",
            level: 12,
            matches: 128,
            wins: 72,
            losses: 56,
        };

        const winRate = ((user.wins / user.matches) * 100).toFixed(1);

        // Ajuster le type pour que TypeScript accepte ces valeurs comme chaîne valide
        const statusBadge: { [key in "online" | "offline" | "in-game"]: string } = {
            online: `<span class="flex items-center gap-2 text-green-400 font-semibold"><span class="w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>${t('online')}</span>`,
            offline: `<span class="flex items-center gap-2 text-gray-400 font-semibold"><span class="w-3 h-3 rounded-full bg-gray-400"></span>${t('offline')}</span>`,
            "in-game": `<span class="flex items-center gap-2 text-yellow-300 font-semibold"><span class="w-3 h-3 rounded-full bg-yellow-300 animate-pulse"></span>${t('in-game')}</span>`,
        };

        const friends = [
            { name: "PlayerOne", avatar: "./public/images/player1_avatar.png", status: "online" },
            { name: "PingQueen", avatar: "./public/images/player2_avatar.png", status: "in-game" },
            { name: "ShadowAce", avatar: "./public/images/avatar1.png", status: "offline" }
        ];

        const friendCards = friends.map(friend => `
            <div class="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                <div class="flex items-center space-x-4">
                    <img src="${friend.avatar}" class="w-12 h-12 rounded-full border-2 ${friend.status === 'online' ? 'border-green-400' : (friend.status === 'in-game' ? 'border-yellow-300' : 'border-gray-500')}">
                    <div>
                        <p class="text-white font-semibold">${friend.name}</p>
                        <p class="text-sm">${statusBadge[friend.status as "online" | "offline" | "in-game"]}</p>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button class="bg-neon-orange text-white px-3 py-1 rounded hover:bg-opacity-80 text-sm">${t('challenge')}</button>
                    <button class="bg-neon-purple text-white px-3 py-1 rounded hover:bg-opacity-80 text-sm">${t('invite')}</button>
                    <button class="bg-red-600 text-white px-3 py-1 rounded hover:bg-opacity-80 text-sm">${t('block')}</button>
                </div>
            </div>
        `).join("");

        return `
            <div class="max-w-5xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-xl">
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
                    <button class="bg-neon-green text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-opacity-80 transition" onclick="alert('Edit username')">
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

                <!-- Friends -->
                <div class="mt-10">
                    <h4 class="text-neon-green text-lg font-semibold mb-4">${t('friendsTitle')}</h4>
                    <div class="space-y-4">
                        ${friendCards}
                    </div>
                </div>
            </div>
        `;
    }
}
