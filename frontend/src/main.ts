import { Router } from './router.js';
import { WelcomePage } from './pages/welcome.js';
import { ProfilePage } from './pages/profile.js';
import { ProfileGuestPage } from './pages/profileGuest.js';
import { GamePage } from './pages/game/game.js';
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
    gameboard: new GameBoard(), // à Ajouer 
    signup: new SignupPage(),
    signin: new SigninPage(),
    guest: new GuestPage(),
    profileGuest: new ProfileGuestPage(),

});

// ✅ Rendre `router` accessible dans `window` pour d'autres scripts
(window as any).router = router;

window.addEventListener('hashchange', () => {
    console.log("🔄 Détection d'un changement d'URL:", window.location.hash);
});

document.addEventListener('DOMContentLoaded', () => {

    const appElement: HTMLElement | null = document.getElementById('navbar');
    if(appElement){
        appElement.innerHTML = new Navbar().render();
    }
   

    

   
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
    // window.addEventListener('hashchange', updateSidebar);

    router.init(); // ✅ Initialiser `router`
    console.log("after router init")

    // ✅ Connexion automatique + WebSocket chat
    const savedUser = localStorage.getItem("transcendenceUser");
    if (savedUser) {
        console.log("savedUser ok")
        const user = JSON.parse(savedUser);

        const socket = io("http://localhost:4003", {
            auth: {
                userId: user.id
            }
        });

        socket.on("connect", () => {
            console.log("🔌 Connecté au chat-service socket.io avec ID :", socket.id);
        });

        socket.on("newMessage", (msg) => {
            console.log("💬 Nouveau message reçu :", msg);
            alert(msg.content);
        });

        (window as any).socket = socket;

        if (!window.location.hash || window.location.hash === "#welcome") {
            window.location.hash = "#profileGuest";
        }
    }
    // ✅ Gestion du chat dans la sidebar
    document.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;

        if (target.classList.contains("open-chat")) {
            const user = target.getAttribute("data-user");
            const chatWindow = document.getElementById("chat-window")!;
            const chatTitle = document.getElementById("chat-title")!;
            const chatMessages = document.getElementById("chat-messages")!;

            chatTitle.textContent = `💬 Chat with ${user}`;
            chatMessages.innerHTML = "";

            chatWindow.classList.remove("hidden");
        }

        if (target.id === "chat-close") {
            document.getElementById("chat-window")?.classList.add("hidden");
        }
    });

    const chatSendBtn = document.getElementById("chat-send-btn");
    chatSendBtn?.addEventListener("click", () => {
        const chatInput = document.getElementById("chat-input") as HTMLInputElement;
        const chatMessages = document.getElementById("chat-messages")!;
    
        const messageText = chatInput.value.trim();
        if (messageText !== "") {
            // 👤 Ton message (bleu)
            const userMessage = document.createElement("div");
            userMessage.className = "bg-blue-600 text-white px-4 py-2 rounded-lg self-end max-w-[75%] shadow-[0_0_10px_#3b82f6]";
            userMessage.textContent = messageText;
            chatMessages.appendChild(userMessage);
            chatMessages.scrollTo(0, chatMessages.scrollHeight);
            chatInput.value = "";
    
            // 💬 Simuler une réponse (violet neon)
            setTimeout(() => {
                const response = document.createElement("div");
                response.className = "bg-purple-600 text-white px-4 py-2 rounded-lg self-start max-w-[75%] shadow-[0_0_10px_#a855f7]";
                response.textContent = "Coucou 👋";
                chatMessages.appendChild(response);
                chatMessages.scrollTo(0, chatMessages.scrollHeight);
            }, 1000);
        }
    });
   
});
