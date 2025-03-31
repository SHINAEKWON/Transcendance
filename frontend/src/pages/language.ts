import { getTranslation } from "../i18n/i18n.js";
import { languageTranslations } from "../translations/language.js";

export class LanguagePage {
    render(): string {
        const t = (key: keyof typeof languageTranslations) => getTranslation("language", key);

        return `
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
    }
}

