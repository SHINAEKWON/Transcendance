import { getTranslation } from "../i18n/i18n.js";
import { welcomeTranslations } from "../translations/welcome.js";
import { RedirectEvents } from "../utils/redirectEvents.js";

export class WelcomePage implements Page{
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

                    <div class="flex justify-center gap-6 pt-6 flex-wrap">
                        <!-- Sign Up -->
                        <div class="redirect-btn w-24 h-24 rounded-full bg-gradient-to-br from-purple-800 via-pink-400 to-yellow-400 
                            shadow-lg hover:scale-110 hover:ring-4 hover:ring-neon-purple transition cursor-pointer 
                            flex items-center justify-center text-center font-bold text-white text-sm leading-tight" 
                            data-page="signup">
                            ${t("signup").replace(" ", "<br>")}
                        </div>

                        <!-- Sign In -->
                        <div class="redirect-btn w-24 h-24 rounded-full bg-gradient-to-br from-blue-800 via-blue-400 to-yellow-400 
                            shadow-lg hover:scale-110 hover:ring-4 hover:ring-neon-blue transition cursor-pointer 
                            flex items-center justify-center text-center font-bold text-white text-sm leading-tight" 
                            data-page="signin">
                            ${t("signin").replace(" ", "<br>")}
                        </div>

                        <!-- Play as Guest -->
                        <div class="redirect-btn w-24 h-24 rounded-full bg-gradient-to-br from-green-500 via-green-300 to-yellow-400
                            shadow-lg hover:scale-110 hover:ring-4 hover:ring-neon-green transition cursor-pointer 
                            flex items-center justify-center text-center font-bold text-white text-sm leading-tight" 
                            data-page="guest">
                            ${t("guest").replace(" ", "<br>")}
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
