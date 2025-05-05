import { getTranslation } from "../i18n/i18n.js";
import { welcomeTranslations } from "../translations/welcome.js";
import { RedirectEvents } from "../utils/redirectEvents.js";

export class WelcomeConnectedPage implements Page{
    render() {
        const t = (key: keyof typeof welcomeTranslations) => getTranslation("welcome", key);

        let html = `
            <div class="flex items-center justify-center min-h-screen bg-dark-blue">
                <div class="bg-gray-800 bg-opacity-90 p-10 rounded-2xl shadow-lg text-center w-[90%] max-w-xl space-y-6 custom-position">
                    <h2 class="text-4xl font-gaming text-neon-blue glitch-text">${t("welcome")}</h2>
                    <p class="text-xl text-neon-orange font-semibold">${t("enjoy")}</p>

                    <div>
                        <h4 class="text-neon-green text-lg font-bold mb-2">${t("start")}</h4>
                        <p class="text-gray-300 text-sm">${t("pitch")}</p>
                    </div>

                    
                    </div>
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
