import { setLang, getLang } from '../i18n/language.js';
import { getTranslation } from '../i18n/i18n.js';
import { navbarTranslations } from '../translations/navbar.js';

export class Navbar implements Page{
    render() {
        const lang = getLang();
        const t = (key: keyof typeof navbarTranslations) => getTranslation("navbar", key);
        const html = `
            <div class="container mx-auto flex justify-between items-center">
                <a href="#" onclick="router.updatePage('welcome', true)" class="navbar-title text-3xl text-neon-blue animate-glow">
                    ${t("title")}
                </a>

                <div class="flex items-center space-x-4 relative">
                    
                    <select id="navbar-language" class="bg-gray-700 text-white text-sm rounded px-2 py-1">
                        <option value="en" ${lang === 'en' ? 'selected' : ''}>🇬🇧 English</option>
                        <option value="fr" ${lang === 'fr' ? 'selected' : ''}>🇫🇷 Français</option>
                        <option value="de" ${lang === 'de' ? 'selected' : ''}>🇩🇪 Deutsch</option>
                        <option value="ar" ${lang === 'ar' ? 'selected' : ''}>🇹🇳 العربية</option>
                        <option value="ko" ${lang === 'ko' ? 'selected' : ''}>🇰🇷 한국어</option>
                    </select>


                   
                </div>
            </div>
        `;
        const app = document.getElementById('navbar');
        if (app) {
            app.innerHTML = html;
            
                const langSelect = document.getElementById("navbar-language") as HTMLSelectElement;
                if (langSelect) {
                    langSelect.addEventListener("change", (e) => {
                        const value = (e.target as HTMLSelectElement).value;
                        setLang(value);
                        window.location.reload();
                    })
                }

        }
    }

}
