import { getTranslation } from "../../i18n/i18n.js";
import { localPlayTranslations } from "../../translations/game.js";
import { RedirectEvents } from "../../utils/redirectEvents.js";

export class LocalPlayPage implements Page {
  private selectedPlayers: any[] = [];
  private avatars = [
    { src: "./public/images/profile.jpg", label: "default", borderColor: "#39ff14", textColor: "#39ff14" },
    { src: "./public/images/avatar3.png", label: "Phantom", borderColor: "#00f3ff", textColor: "#00f3ff" },
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
      { id: Date.now() + 1, username: "", avatar: this.avatars[1].src },
    ];

    const playerCards = this.selectedPlayers.map((player, index) => `
      <div class="flex flex-col items-center space-y-4">
        <img src="${player.avatar}" style="border-color: ${this.avatars[index]?.borderColor || "#39ff14"}" 
          class="w-28 h-28 rounded-full border-4 hover:scale-105 transition" />

        <input 
          id="playerName_${index}" 
          type="text" 
          value="${player.username}" 
          placeholder="${player.isConnected ? t("connectedPlayer") : t("playerNamePlaceholder")}" 
          ${player.isConnected ? "readonly" : ""}
          class="w-full text-center bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green ${player.isConnected ? 'opacity-70 cursor-not-allowed' : ''}"
        />
      </div>
    `).join("");

    const html = `
    <div class="max-w-2xl mx-auto bg-gray-800 p-10 rounded-2xl shadow-xl">
      <div class="mb-10 text-center">
        <h2 class="text-3xl font-bold text-neon-green">${t("titleLocalPlay") || "Local Play"}</h2>
      </div>

      <div class="grid grid-cols-2 gap-8 mb-10">
        ${playerCards}
      </div>

      <div class="text-center">
        <button id="startPlay" class="bg-neon-orange text-black px-8 py-4 rounded-lg font-bold hover:scale-105 transition animate-float">
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
    const t = (key: keyof typeof localPlayTranslations) => getTranslation("createLocalTournament", key);

    const startBtn = document.getElementById("startPlay");
    if (startBtn) {
      startBtn.addEventListener("click", () => {
        // Update pseudo du 2ème joueur
        const input = document.getElementById(`playerName_1`) as HTMLInputElement;
        this.selectedPlayers[1].username = input.value.trim();

        if (!this.selectedPlayers[1].username) {
          alert(t("playersMissingError") || "Please fill in both player names.");
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
  }
}
