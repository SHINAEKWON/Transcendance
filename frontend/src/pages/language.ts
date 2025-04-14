import { getTranslation } from "../i18n/i18n.js";
import { languageTranslations } from "../translations/language.js";
import { setLang, getLang } from '../i18n/language.js';

export class LanguagePage implements Page {
    render() {
        const t = (key: keyof typeof languageTranslations) => getTranslation("language", key);

        let html = `
            <div class="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 class="text-3xl font-gaming text-neon-blue mb-6 animate-glow">${t("settingsTitle")}</h2>
                <p class="text-lg text-neon-purple">${t("settingsDescription")}</p>
                <div class="mt-6">
                    <h4 class="text-neon-green mb-2">${t("chooseLabel")}</h4>
                    <select id="language-select" class="bg-gray-700 text-white p-2 rounded-sm">
                        <option value="en">🇬🇧 English</option>
                        <option value="fr">🇫🇷 Français</option>
                        <option value="de">🇩🇪 Deutsch</option>
                        <option value="ar">🇹🇳 العربية</option>
                        <option value="ko">🇰🇷 한국어</option>
                    </select>
                </div>
            </div>
        `;

        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = html;
        }
        setTimeout(() => {
            this.attachLangEvent();
        }, 10);
    }

    private attachLangEvent(): void {
        // ✅ Charger la langue déjà choisie et la mettre dans le <select>
        const lang = getLang();
        const select = document.getElementById("language-select") as HTMLSelectElement;
        if (select) {
            select.value = lang;
            // ✅ Lorsqu'on change la langue dans le sélecteur
            select.addEventListener("change", (e) => {
                const target = e.target as HTMLElement;
                if (target.id === "language-select") {
                    const value = (target as HTMLSelectElement).value;
                    setLang(value);
                    location.reload(); // Recharge pour appliquer la nouvelle langue
                }
            });
        }
    }

}



