import { getTranslation } from "../../i18n/i18n.js";
import { customizationTranslations } from "../../translations/customization.js";

export class CustomizationPage implements Page {
    render() {
        const t = (key: keyof typeof customizationTranslations) => getTranslation("customization", key);

        let html = `
            <div class="max-w-5xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 class="text-3xl font-gaming text-neon-blue mb-8 animate-glow text-center">${t("title")}</h2>
                
                <div class="flex justify-center gap-6 mb-8">
                    <button id="default-btn" class="px-4 py-2 bg-neon-green text-black rounded-lg font-bold">${t("defaultGame")}</button>
                    <button id="custom-btn" class="px-4 py-2 bg-neon-orange text-black rounded-lg font-bold">${t("customGame")}</button>
                </div>

                <div id="custom-options" class="hidden space-y-4">

                    ${this.selectOption("boardColor", t("boardColor"))}
                    ${this.selectOption("ballColor", t("ballColor"))}
                    ${this.selectOption("paddleColor", t("paddleColor"))}
                    ${this.rangeOption("ballSpeed", t("ballSpeed"), 1, 10)}
                    ${this.rangeOption("paddleSpeed", t("paddleSpeed"), 1, 10)}
                    ${this.rangeOption("ballSize", t("ballSize"), 5, 20)}
                    ${this.rangeOption("paddleSize", t("paddleSize"), 20, 100)}

                    <h3 class="text-2xl text-neon-purple mt-6">${t("themesTitle")}</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        ${this.themeCard("neon-night", t("theme1"))}
                        ${this.themeCard("cyber-grid", t("theme2"))}
                        ${this.themeCard("dark-future", t("theme3"))}
                    </div>
                </div>

                <div class="mt-10 text-center">
                    <button id="start-game" class="px-6 py-3 bg-neon-green text-black rounded-lg font-bold text-lg">${t("playBtn")}</button>
                    <div class="mt-4">
                        <a href="#ai-play" class="text-neon-blue underline">${t("backToAI")}</a>
                    </div>
                </div>
            </div>
        `;

        const app = document.getElementById("app");
        if (app) app.innerHTML = html;

        this.setupEvents();
    }

    selectOption(id: string, label: string) {
        return `
            <div>
                <label for="${id}" class="block mb-2 text-gray-300">${label}</label>
                <input type="color" id="${id}" class="w-full h-10 rounded">
            </div>
        `;
    }

    rangeOption(id: string, label: string, min: number, max: number) {
        return `
            <div>
                <label for="${id}" class="block mb-2 text-gray-300">${label}</label>
                <input type="range" id="${id}" min="${min}" max="${max}" class="w-full">
            </div>
        `;
    }

    themeCard(themeId: string, themeName: string) {
        return `
            <div class="theme-card bg-gray-900 p-4 rounded-lg shadow-md hover:ring-2 hover:ring-neon-purple cursor-pointer text-center" data-theme="${themeId}">
                <h4 class="text-lg text-neon-purple font-bold mb-2">${themeName}</h4>
                <p class="text-gray-400 text-sm">Cyberpunk style</p>
            </div>
        `;
    }

    setupEvents() {
        const defaultBtn = document.getElementById("default-btn");
        const customBtn = document.getElementById("custom-btn");
        const customOptions = document.getElementById("custom-options");

        defaultBtn?.addEventListener("click", () => {
            customOptions?.classList.add("hidden");
        });

        customBtn?.addEventListener("click", () => {
            customOptions?.classList.remove("hidden");
        });

        // Exemple : démarrer le jeu (à adapter avec tes params)
        document.getElementById("start-game")?.addEventListener("click", () => {
            console.log("Game started with chosen settings!");
            // Ici, tu peux lire les valeurs des inputs et lancer la partie
        });
    }
}
