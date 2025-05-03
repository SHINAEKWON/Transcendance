import { setLang, getLang } from '../i18n/language.js';
import { getTranslation } from '../i18n/i18n.js';
import { navbarTranslations } from '../translations/navbar.js';
import { env } from '../env/env.js';
import { getUsersFriendsStatus } from '../services/userService.js';

export class Navbar {
    render() {
        const lang = getLang();
        const t = (key: keyof typeof navbarTranslations) => getTranslation("navbar", key);
        let isGuest = false;
        const userLs = localStorage.getItem("transcendenceUser");
        if (userLs) {
            const user = JSON.parse(userLs);
            console.log(`user : `, user);
            console.log(`user type: `, user['type']);
            if(user && user['type'] == 'guest'){
                isGuest = true;
            }
        }

 
 

        return `
            <div class="container mx-auto flex justify-between items-center">
                <a href="#" onclick="router.updatePage('welcome', true)" class="navbar-title text-3xl text-neon-blue animate-glow">
                    ${t("title")}
                </a>

                <div class="flex items-center space-x-4 relative">
                    <a href="#${isGuest ? "profileGuest" : "profile"}" data-page="${isGuest ? "profileGuest" : "profile"}" class="nav-link hover:text-neon-green transition">${t("profile")}</a>
                    <a href="#duel" data-page="duel" class="nav-link hover:text-neon-orange transition">${t("duel")}</a>
                    <a href="#tournaments" data-page="tournaments" class="nav-link hover:text-neon-purple transition">${t("tournaments")}</a>

                    <select id="navbar-language" class="bg-gray-700 text-white text-sm rounded px-2 py-1">
                        <option value="en" ${lang === 'en' ? 'selected' : ''}>🇬🇧 English</option>
                        <option value="fr" ${lang === 'fr' ? 'selected' : ''}>🇫🇷 Français</option>
                        <option value="de" ${lang === 'de' ? 'selected' : ''}>🇩🇪 Deutsch</option>
                        <option value="ar" ${lang === 'ar' ? 'selected' : ''}>🇹🇳 العربية</option>
                        <option value="ko" ${lang === 'ko' ? 'selected' : ''}>🇰🇷 한국어</option>
                    </select>

                    <!-- 🔥 Bouton pour ouvrir le menu -->
                    <div class="relative" style="display: contents;  width: 150px;">
                        <button id="menu-btn" class="w-10 h-10 flex items-center justify-center font-gaming text-neon-blue animate-glow transition">
                            ⏻
                        </button>

                        <!-- 🔥 Menu caché -->
                        <div id="menu-dropdown" style="margin-left: 5px; width: 140px" class="hidden w-30 bg-gray-700 rounded-md shadow-lg z-[9999]">
                        <button id="logout-btn" class="w-full text-center px-4 py-2 text-white hover:bg-red-600" style="font-size: 12px">
                            Log out  
                            </button>
                    </div>

                    </div>
                </div>
            </div>
        `;
    }

    afterRender() {
        const langSelect = document.getElementById("navbar-language") as HTMLSelectElement;
        if (langSelect) {
            langSelect.addEventListener("change", (e) => {
                const value = (e.target as HTMLSelectElement).value;
                setLang(value);

                const navbar = new Navbar();
                const navbarElement = document.getElementById('navbar');
                if (navbarElement) {
                    navbarElement.innerHTML = navbar.render();
                    navbar.afterRender();
                }

                if ((window as any).router && (window as any).router.updatePage) {
                    const currentPage = (window as any).router.getCurrentPage();
                    (window as any).router.updatePage(currentPage, true);
                }
            });
        }

        const menuBtn = document.getElementById("menu-btn");
        const menuDropdown = document.getElementById("menu-dropdown");
        if (menuBtn && menuDropdown) {
            menuBtn.addEventListener("click", () => {
                menuDropdown.classList.toggle("hidden");
            });
        }

        const logoutBtn = document.getElementById("logout-btn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", async () => {
                
                const userStr = localStorage.getItem("transcendenceUser");
                let user: any;
                if (userStr) {
                     user = JSON.parse(userStr);
                     let ids: any[] = [];
                    const users = await getUsersFriendsStatus();
                    if(users){
                        users.forEach(e => {
                            if(e.id != user.id){
                                ids.push(e.id); 
                            }
                        })
                    }
                    
                    // Vérifier si c'est un guest
                    if (user && user['type'] === "guest") {
                        try {
                            await fetch(`${env.backUser}/users/${user.id}`, {
                                method: 'DELETE'
                            });
                            console.log('Guest supprimé côté serveur.');
                        } catch (error) {
                            console.error('Erreur lors de la suppression du guest :', error);
                        }


                        const socket = getSocket()!;
                        console.log(`users `,users);
                         if(ids && socket){
                             console.log(`users and socket ok`);
            
                             ids.forEach((u: any) => {
                            console.log(`send to `,u);
                             socket.emit("removedUser", {
                                 to: ""+u
                             })
                         });
                         }
                    }
                }
               
                // Nettoyage du localStorage et redirection
                localStorage.removeItem("transcendenceUser");
                window.location.href = "#";
                window.location.reload();
            });
        }
        
    }
}
function getSocket(): any | undefined {
    return (window as any).socket;
  }