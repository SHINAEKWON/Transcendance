import { getTranslation } from "../../i18n/i18n.js";
import { gameTranslations } from "../../translations/game.js";

export class GamePage {
    render(): string {
        const t = (key: keyof typeof gameTranslations) => getTranslation("game", key);

        return `
            <div class="max-w-5xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 class="text-3xl font-gaming text-neon-blue mb-6 animate-glow text-center">${t("title")}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    <!-- Jouer contre une IA -->
                    <div class="game-mode-btn bg-gray-900 p-6 rounded-lg hover:ring-2 hover:ring-neon-green cursor-pointer flex flex-col items-center" data-page="aiPlay">
                        <img src="/public/images/p_Robo.png" class="w-full h-70 object-cover rounded-sm mb-4">
                        <h3 class="text-xl text-neon-green mb-2 text-center">${t("aiTitle")}</h3>
                        <p class="text-gray-400 text-sm text-center">${t("aiDesc")}</p>
                    </div>

                    <!-- Jouer en local -->
                    <div class="game-mode-btn bg-gray-900 p-6 rounded-lg hover:ring-2 hover:ring-orange-500 cursor-pointer flex flex-col items-center" data-page="localPlay">
                        <img src="/public/images/p_Locally.png" class="w-full h-70 object-cover rounded-sm mb-4">
                        <h3 class="text-xl text-neon-orange mb-2 text-center">${t("localTitle")}</h3>
                        <p class="text-gray-400 text-sm text-center">${t("localDesc")}</p>
                    </div>

                    <!-- Jouer en ligne -->
                    <div class="game-mode-btn bg-gray-900 p-6 rounded-lg hover:ring-2 hover:ring-neon-purple cursor-pointer flex flex-col items-center" data-page="onlinePlay">
                        <img src="/public/images/p_Online.png" class="w-full h-70 object-cover rounded-sm mb-4">
                        <h3 class="text-xl text-neon-purple mb-2 text-center">${t("onlineTitle")}</h3>
                        <p class="text-gray-400 text-sm text-center">${t("onlineDesc")}</p>
                    </div>

                </div>
            </div>
        `;
    }
}
