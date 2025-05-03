import { Router } from './router.js';
import { WelcomePage } from './pages/welcome.js';
import { ProfilePage } from './pages/profile/profile.js';
import { ProfileGuestPage } from './pages/profile/profileGuest.js';
import { TournamentsPage } from './pages/tournament/tournaments.js';
import { ChatPage } from './pages/chat.js';
import { LanguagePage } from './pages/language.js';
import { Sidebar } from './pages/sidebar.js';
import { SignupPage } from './pages/login/signup.js';
import { SigninPage } from './pages/login/signin.js';
import { GuestPage } from './pages/login/guest.js';
import { Navbar } from './pages/navbar.js';
import { EditProfilePage } from './pages/profile/editProfile.js';
import { io } from "socket.io-client";
import { env } from './env/env.js';
import { TournamentGameBoardPage } from './pages/tournament/tournamentGameBoard.js';
import { DuelPage } from './pages/gamePage/Duel.js';
import { LocalPlayPage } from './pages/gamePage/local-play.js';
import { AIPlayPage } from './pages/gamePage/ai-play.js';
import { OnlinePlayPage } from './pages/gamePage/online-play.js';
import { DuelGameBoardPage } from './pages/gamePage/duelGameBoard.js';
import { CreateLocalTournamentPage } from './pages/tournament/createLocalTournament.js';
import { CreateRemoteTournamentPage } from './pages/tournament/createRemoteTournament.js';

// ✅ Définir `router` en dehors pour qu'il soit globalement accessible
const router = new Router({
    welcome: new WelcomePage(),
    profile: new ProfilePage(),
    duel: new DuelPage(),
    tournaments: new TournamentsPage(),
    chat: new ChatPage(),
    language: new LanguagePage(),
    localPlay: new LocalPlayPage(),  // 🎮 Mode Local
    aiPlay: new AIPlayPage(),        // 🤖 Mode IA
    onlinePlay: new OnlinePlayPage(), // 🌐 Mode Online
    signup: new SignupPage(),
    signin: new SigninPage(),
    guest: new GuestPage(),
    profileGuest: new ProfileGuestPage(),
    createLocalTournament: new CreateLocalTournamentPage(),
    createRemoteTournament: new CreateRemoteTournamentPage(),
    tournamentGameBoard: new TournamentGameBoardPage(),
    editProfile: new EditProfilePage(),
    duelGameBoard: new DuelGameBoardPage()
});

// ✅ Rendre `router` accessible dans `window` pour d'autres scripts
(window as any).router = router;

window.addEventListener('hashchange', () => {
    console.log("🔄 Détection d'un changement d'URL:", window.location.hash);
});

document.addEventListener('DOMContentLoaded', () => {


    initSocket();
    const navbar = new Navbar();
    const appElement: HTMLElement | null = document.getElementById('navbar');
    if (appElement) {
        appElement.innerHTML = navbar.render();
        navbar.afterRender();
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

import { getUserInfo } from './services/userService.js'; // à adapter selon ton path

async function initSocket() {
  const savedUser = localStorage.getItem("transcendenceUser");

  if (!savedUser) return;

  try {
    const user = JSON.parse(savedUser);

    const found: any = await getUserInfo(user.id);

    if (!found || !found.id) {
      console.warn("🚫 Utilisateur introuvable en base. Réinitialisation du cache.");
      localStorage.removeItem("transcendenceUser");
      window.location.hash = "#welcome";
      return;
    }

    let socket: any = null;
    if (env.env == "docker") {
      socket = io({
        path: env.backChatSocketPath,
        transports: ["websocket"],
        auth: { userId: "" + user.id }
      });
    } else {
      socket = io(env.backChat, {
        path: env.backChatSocketPath,
        transports: ["websocket"],
        auth: { userId: "" + user.id }
      });
    }

    socket.on("removedUser", async (msg: any) => {
      let id = msg.id;
      new Sidebar().render();
     });

    socket.on("connect", () => {
      console.log("🔌 Connecté au chat-service socket.io avec ID :", socket.id);
    });

    socket.on("connect_error", (err: any) => {
      console.error("❌ Erreur de connexion socket :", err.message);
    });

    (window as any).socket = socket;

    if (!window.location.hash || window.location.hash === "#welcome") {
      window.location.hash = "#profileGuest";
    }

  } catch (err) {
    console.error("❌ Erreur lors de la vérification de l'utilisateur :", err);
    localStorage.removeItem("transcendenceUser");
    window.location.hash = "#welcome";
  }
}

