import { Router } from './router.js';
import { WelcomePage } from './pages/welcome.js';
import { ProfilePage } from './pages/profile/profile.js';
import { ProfileGuestPage } from './pages/profile/profileGuest.js';
import { GamePage } from './pages/game/GamePage.js';
import { TournamentsPage } from './pages/tournaments.js';
import { ChatPage } from './pages/chat.js';
import { LanguagePage } from './pages/language.js';
import { Sidebar } from './pages/sidebar.js';
import { LocalPlayPage } from './pages/game/local-play.js';
import { AIPlayPage } from './pages/game/ai-play.js';
import { OnlinePlayPage } from './pages/game/online-play.js';
import { GameBoard } from './pages/game/gameboard.js';
import { SignupPage } from './pages/login/signup.js';
import { SigninPage } from './pages/login/signin.js';
import { GuestPage } from './pages/login/guest.js';
import { Navbar } from './pages/navbar.js';
import { EditProfilePage } from './pages/profile/editProfile.js';
import { PageGame } from './pages/game/PageGame.js';
import { io } from "socket.io-client";

// ✅ Définir `router` en dehors pour qu'il soit globalement accessible
const router = new Router({
    welcome: new WelcomePage(),
    profile: new ProfilePage(),
    game: new GamePage(),
    tournaments: new TournamentsPage(),
    chat: new ChatPage(),
    language: new LanguagePage(),
    localPlay: new LocalPlayPage(),  // 🎮 Mode Local
    aiPlay: new AIPlayPage(),        // 🤖 Mode IA
    onlinePlay: new OnlinePlayPage(), // 🌐 Mode Online
    gameboard: new PageGame(), // à Ajouer 
    signup: new SignupPage(),
    signin: new SigninPage(),
    guest: new GuestPage(),
    profileGuest: new ProfileGuestPage(),
    editProfile: new EditProfilePage()

});

// ✅ Rendre `router` accessible dans `window` pour d'autres scripts
(window as any).router = router;

window.addEventListener('hashchange', () => {
    console.log("🔄 Détection d'un changement d'URL:", window.location.hash);
});

document.addEventListener('DOMContentLoaded', () => {


    initSocket();
    const appElement: HTMLElement | null = document.getElementById('navbar');
    if(appElement){
        appElement.innerHTML = new Navbar().render();
    }
   

    

   
    function updateSidebar() {
        const appElement: HTMLElement | null = document.getElementById('sidebar');
        const currentPage = window.location.hash.slice(1) || 'welcome';

        if (appElement) {
            if (currentPage !== 'welcome') {
                new Sidebar().render();
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
    // window.addEventListener('hashchange', updateSidebar);

    router.init(); // ✅ Initialiser `router`
    console.log("after router init")

    
    
});

function initSocket(){
    // ✅ Connexion automatique + WebSocket chat
    const savedUser = localStorage.getItem("transcendenceUser");
    if (savedUser) {
        console.log("savedUser ok")
        const user = JSON.parse(savedUser);

        const socket = io({
            path: "/socket.io",
            transports: ["websocket"],
            auth: { userId: "" + user.id }
          });          

        socket.on("connect", () => {
            console.log("🔌 Connecté au chat-service socket.io avec ID :", socket.id);
        });

        socket.on("connect_error", (err : any) => {
            console.error("❌ Erreur de connexion socket :", err.message);
          });
          

        

        (window as any).socket = socket;

        if (!window.location.hash || window.location.hash === "#welcome") {
            window.location.hash = "#profileGuest";
        }
    }
}
