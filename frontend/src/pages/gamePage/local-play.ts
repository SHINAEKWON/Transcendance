import { getTranslation } from "../../i18n/i18n.js";
import { localPlayTranslations } from "../../translations/game.js";
import { RedirectEvents } from "../../utils/redirectEvents.js";

export class LocalPlayPage implements Page {
  private selectedPlayers: any[] = [];
  private avatars = [
    { src: "./public/images/avatar3.png", label: "Phantom", borderColor: "#00f3ff", textColor: "#00f3ff" },
    { src: "./public/images/cyber_profile.png", label: "Agent", borderColor: "#FF6700", textColor: "#FF6700" },
    { src: "./public/images/avatar1.png", label: "Pixie", borderColor: "#ff00ff", textColor: "#ff00ff" },
    { src: "./public/images/avatar4.jpg", label: "Rebel", borderColor: "#39ff14", textColor: "#39ff14" },
  ];

  async render() {
    const currentUserString = localStorage.getItem("transcendenceUser");
    if (!currentUserString) {
      console.error("Utilisateur non connecté !");
      return;
    }
    const connectedUser = JSON.parse(currentUserString);
    const t = (key: keyof typeof localPlayTranslations) => getTranslation("localPlay", key);

    this.selectedPlayers = [
      { id: connectedUser.id, username: connectedUser.username, avatar: connectedUser.avatar, isConnected: true },
      { id: Date.now() + 1, username: "", avatar: "" },
    ];

    const html = `
    <div class="max-w-6xl mx-auto bg-gray-800 p-10 rounded-2xl shadow-xl">
      <div class="mb-10 text-center">
        <h2 class="text-4xl font-bold text-neon-green">${t("titleLocalPlay") || "Local Play"}</h2>
      </div>

      <div class="grid grid-cols-2 gap-10 mb-10">
        <!-- Joueur Connecté -->
        <div class="bg-gray-700 rounded-2xl p-6 flex flex-col items-center shadow-lg">
          <div class="text-[#f1c40f] text-xl font-bold animate-bounce mb-4"> 🟨 ${t("readyChampion") || "Ready to Rule?"}</div>
            <div class="text-center bg-gray-600 text-white p-3 mt-3 rounded-lg animate-pulse flex items-center gap-2 mb-4">
              ${t("guestConnectedInfo") || "Yellow player connected... Guest, get ready to see stars?! ✨✨"}
            </div>

          <img id="playerAvatar_0" src="${this.selectedPlayers[0].avatar}" 
            class="w-32 h-32 rounded-full border-4 border-[#f1c40f] hover:scale-105 transition object-cover" />

          <input 
            id="playerName_0" 
            type="text" 
            value="${this.selectedPlayers[0].username}" 
            readonly
            class="w-full text-center bg-[#f1c40f] text-black p-3 mt-6 rounded-lg opacity-70 cursor-not-allowed"
          />
        </div>

        <!-- Joueur Invité -->
        <div class="bg-gray-700 rounded-2xl p-6 flex flex-col items-center shadow-lg">
          <div class="text-[#3498db] text-xl font-bold animate-bounce mb-4">🟦 ${t("chooseYourHero") || "Choose Your Hero!"}</div>

          <!-- Choix d'Avatars en haut -->
          <div class="flex flex-wrap justify-center gap-3 mb-6">
            ${this.avatars.map(avatar => `
              <img src="${avatar.src}" 
                data-src="${avatar.src}" 
                class="w-25 h-25 rounded-full border-2 cursor-pointer hover:scale-110 transition object-cover"
                style="border-color: ${avatar.borderColor}"
              />
            `).join("")}
          </div>

          <img id="playerAvatar_1" src="./public/images/empty_avatar.png" 
            class="w-32 h-32 rounded-full border-4 border-[#3498db] hover:scale-105 transition object-cover bg-gray-600" />

          <input 
            id="playerName_1" 
            type="text" 
            placeholder="${t("playerNamePlaceholder") || "Player 2 Name"}" 
            class="w-full text-center bg-[#3498db] text-black p-3 mt-6 rounded-lg focus:outline-none focus:ring-2 focus:bg-gray-600 focus:ring-[#3498db]"
          />
        </div>
      </div>

      <div class="text-center">
        <button id="startPlay" class="bg-neon-orange text-black px-10 py-5 rounded-lg font-bold text-xl hover:scale-105 transition animate-float">
          🚀 ${t("startPlay") || "Start Playing"}
        </button>
      </div>
    </div>
    `;

    const app = document.getElementById("app");
    if (app) {
      app.innerHTML = html;
      this.setupEvents(connectedUser);
      RedirectEvents.attachRedirectEvents();
    }
  }

  setupEvents(currentUser: any) {
    const t = (key: keyof typeof localPlayTranslations) => getTranslation("localPlay", key);

    const startBtn = document.getElementById("startPlay");
    if (startBtn) {
      startBtn.addEventListener("click", () => {
        const input = document.getElementById(`playerName_1`) as HTMLInputElement;
        this.selectedPlayers[1].username = input.value.trim();

        if (!this.selectedPlayers[1].username || !this.selectedPlayers[1].avatar) {
          alert(t("playersMissingError") || "Please fill in both player names and select an avatar.");
          return;
        }

        const duelId = Date.now().toString();

        const duelData = {
          player1: {
            id: currentUser.id,
            username: currentUser.username,
            avatar: currentUser.avatar,
            isIa: false
          },
          player2: this.selectedPlayers[1],
          mode: "local"
        };

        const params = new URLSearchParams();
        params.set('id', duelId);
        params.set('duel', encodeURIComponent(JSON.stringify(duelData)));
        window.location.href = `/#duelGameBoard?${params.toString()}`;
      });
    }

    // Choix d'avatar pour joueur invité
    const avatarImgs = document.querySelectorAll('img[data-src]');
    avatarImgs.forEach(img => {
      img.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLImageElement;
        const src = target.getAttribute('data-src') || "";

        // Mise à jour visuelle
        const player2Img = document.getElementById('playerAvatar_1') as HTMLImageElement;
        if (player2Img) {
          player2Img.src = src;
        }

        // Sauvegarde
        this.selectedPlayers[1].avatar = src;
      });
    });
  }
}
