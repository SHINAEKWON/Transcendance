import { getTranslation } from "../../i18n/i18n.js";
import { tournamentsTranslations } from "../../translations/tournaments.js";
import { RedirectEvents } from "../../utils/redirectEvents.js";

export class TournamentsPage implements Page {
    render() {
        const t = (key: keyof typeof tournamentsTranslations) => getTranslation("tournaments", key);

        let html = `
            <div class="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 class="text-3xl font-gaming text-neon-blue mb-6 animate-glow">${t("title")}</h2>
                <div class="space-y-6">
                    <div class="bg-gray-900 p-8 rounded-lg hover:ring-2 hover:ring-orange-500 cursor-pointer flex items-center">
                        <img src="./public/images/local_tournament.png" class="w-50 h-50 object-cover rounded-lg mr-4">
                        <div>
                            <h3 class="text-xl text-neon-orange mb-2">${t("localTitle")}</h3>
                            <p class="text-gray-400">${t("localDesc")}</p>
                            <p class="text-sm text-neon-green mt-2">${t("startLocal")}</p>
                        </div>
                        <button data-page="createLocalTournament" class="redirect-btn bg-neon-orange text-white px-6 py-2 rounded-lg hover:bg-opacity-80 ml-auto">
                            ${t("join")}
                        </button>
                    </div>
                    <div class="bg-gray-900 p-8 rounded-lg hover:ring-2 hover:ring-neon-purple cursor-pointer flex items-center relative">
                        <img src="./public/images/online_tournament.png" class="w-50 h-50 object-cover rounded-lg mr-4">
                        <div>
                            <h3 class="text-xl text-neon-purple mb-2">${t("onlineTitle")}</h3>
                            <p class="text-gray-400">${t("onlineDesc")}</p>
                            <p class="text-sm text-neon-green mt-2">${t("startOnline")}</p>
                        </div>

                        <p class="text-ms text-black italic absolute bottom-4 right-3" 
                        style="text-shadow: 0 0 3px white, 0 0 5px white;">
                            ${t("comingSoon")}
                        </p>
                    </div>                

                </div>
                <div class="flex flex-col items-center  gap-4 mt-6">
                    <a href="#customization" class="px-6 py-3 bg-neon-orange text-black rounded-lg font-bold text-lg hover:bg-orange-400 transition text-center">
                    <span class="text-2xl">⚙️</span> ${t("customizeGame")}
                        </a>
                </div>
            </div>
        `;

        const app = document.getElementById('app');
        if(app){
            app.innerHTML = html;
        }
        RedirectEvents.attachRedirectEvents();
    }
}
