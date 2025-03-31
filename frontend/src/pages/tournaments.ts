import { getTranslation } from "../i18n/i18n.js";
import { tournamentsTranslations } from "../translations/tournaments.js";

export class TournamentsPage {
    render(): string {
        const t = (key: keyof typeof tournamentsTranslations) => getTranslation("tournaments", key);

        return `
            <div class="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 class="text-3xl font-gaming text-neon-blue mb-6 animate-glow">${t("title")}</h2>
                <div class="space-y-6">
                    <div class="bg-gray-900 p-6 rounded-lg border border-neon-purple flex items-center">
                        <img src="./public/images/local_tournament.jpg" class="w-32 h-32 object-cover rounded-lg mr-4">
                        <div>
                            <h3 class="text-xl text-neon-green mb-2">${t("localTitle")}</h3>
                            <p class="text-gray-400">${t("localDesc")}</p>
                            <p class="text-sm text-neon-blue mt-2">${t("startLocal")}</p>
                        </div>
                        <button class="bg-neon-purple text-white px-6 py-2 rounded-lg hover:bg-opacity-80 ml-auto">
                            ${t("join")}
                        </button>
                    </div>
                    <div class="bg-gray-900 p-6 rounded-lg border border-neon-purple flex items-center">
                        <img src="./public/images/online_tournament.jpg" class="w-32 h-32 object-cover rounded-lg mr-4">
                        <div>
                            <h3 class="text-xl text-neon-green mb-2">${t("onlineTitle")}</h3>
                            <p class="text-gray-400">${t("onlineDesc")}</p>
                            <p class="text-sm text-neon-blue mt-2">${t("startOnline")}</p>
                        </div>
                        <button class="bg-neon-purple text-white px-6 py-2 rounded-lg hover:bg-opacity-80 ml-auto">
                            ${t("join")}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}
