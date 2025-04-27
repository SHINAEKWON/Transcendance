import { setLang, getLang } from '../i18n/language.js'; 
import { getTranslation } from '../i18n/i18n.js';
import { navbarTranslations } from '../translations/navbar.js';

export class Navbar {
    render() {
        const lang = getLang();
        const t = (key: keyof typeof navbarTranslations) => getTranslation("navbar", key);

        let textLang = "🇬🇧 English";
        if (lang === 'fr') {
            textLang = "🇫🇷 Français";
        } else if (lang === 'de') {
            textLang = "🇩🇪 Deutsch";
        } else if (lang === 'ar') {
            textLang = "🇹🇳 العربية";
        } else if (lang === 'ko') {
            textLang = "🇰🇷 한국어";
        }

        return `
            <div class="container mx-auto flex justify-between items-center">
                <a href="#" onclick="router.updatePage('welcome', true)" class="navbar-title text-2xl text-neon-blue animate-glow">${t("title")}</a>
                <div class="flex space-x-4">
                    <a href="#profile" data-page="profile" class="nav-link">${t("profile")}</a>
                    <a href="#duel" data-page="duel" class="nav-link">${t("duel")}</a>
                    <a href="#tournaments" data-page="tournaments" class="nav-link">${t("tournaments")}</a>
                    <a href="#chat" data-page="chat" class="nav-link">${t("chat")}</a>
                    <a href="#language" data-page="language" class="nav-link flex items-center space-x-2">
                        <span>${textLang}</span>
                    </a>
                </div>
            </div>
        `;
    }
}
