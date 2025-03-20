import { Router } from './router.js';
import { WelcomePage } from './pages/welcome.js';
import { ProfilePage } from './pages/profile.js';
import { GamePage } from './pages/game.js';
import { TournamentsPage } from './pages/tournaments.js';
import { ChatPage } from './pages/chat.js';
import { LanguagePage } from './pages/language.js';
import { Sidebar } from './pages/sidebar.js';


document.addEventListener('DOMContentLoaded', () => {
    const router = new Router({
        welcome: new WelcomePage(),
        profile: new ProfilePage(),
        game: new GamePage(),
        tournaments: new TournamentsPage(),
        chat: new ChatPage(),
        language: new LanguagePage(),
    });

    function updateSidebar() {
        const appElement: HTMLElement | null = document.getElementById('sidebar');
        const currentPage = window.location.hash.slice(1) || 'welcome';

        if (appElement) {
            if (currentPage !== 'welcome') {
                appElement.innerHTML = new Sidebar().render();
                appElement.style.display = "block"; // Assurer l'affichage
            } else {
                appElement.innerHTML = "";
                appElement.style.display = "none"; // Cacher la sidebar
            }
        }
    }

    function updateBackgroundEffect() {
        const overlay = document.getElementById('background-overlay');
        const currentPage = window.location.hash.slice(1) || 'welcome';
    
        if (overlay) {
            if (currentPage === 'welcome') {
                overlay.classList.remove('fade-in');
                overlay.classList.add('fade-out'); // Disparaît en fondu
            } else {
                overlay.classList.remove('fade-out');
                overlay.classList.add('fade-in'); // Apparition fluide du sombre
            }
        }
    }
    
    // Appliquer l'effet au chargement et lors des changements de page
    updateBackgroundEffect();
    window.addEventListener('hashchange', updateBackgroundEffect);
    

    // Mettre à jour la sidebar au chargement
    updateSidebar();

    // Mettre à jour la sidebar à chaque changement de page
    window.addEventListener('hashchange', updateSidebar);

    router.init();
});
