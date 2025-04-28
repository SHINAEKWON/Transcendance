
import { getTranslation } from "../../i18n/i18n.js";
import { createLocalTournamentTranslations } from "../../translations/tournaments.js";
import { RedirectEvents } from "../../utils/redirectEvents.js";

export class CreateLocalTournamentPage implements Page {
  private selectedPlayers: any[] = [];
  private avatars = [
    { src: "./public/images/profile.jpg", label: "default", borderColor: "#39ff14", textColor: "#39ff14" },
    { src: "./public/images/avatar3.png", label: "Phantom", borderColor: "#00f3ff", textColor: "#00f3ff" },
    { src: "./public/images/avatar2.png", label: "Chrome", borderColor: "#FF6700", textColor: "#FF6700" },
    { src: "./public/images/profile_robo.jpg", label: "Shadow", borderColor: "#00f3ff", textColor: "#00f3ff" },
  ];

  async render() {
    const currentUserString = localStorage.getItem("transcendenceUser");
    if (!currentUserString) {
      console.error("Utilisateur non connecté !");
      return;
    }
    const connectedUser = JSON.parse(currentUserString);
    const t = (key: keyof typeof createLocalTournamentTranslations) => getTranslation("createLocalTournament", key);

    // Premier joueur = connecté
    this.selectedPlayers = [
      { id: connectedUser.id, username: connectedUser.username, avatar: connectedUser.avatar, isConnected: true },
      { id: Date.now() + 1, username: "", avatar: this.avatars[1].src },
      { id: Date.now() + 2, username: "", avatar: this.avatars[2].src },
      { id: Date.now() + 3, username: "", avatar: this.avatars[3].src },
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
    <div class="max-w-4xl mx-auto bg-gray-800 p-10 rounded-2xl shadow-xl">
      <div class="mb-10 text-center">
        <h2 class="text-3xl font-bold text-neon-green">${t("titleLocal")}</h2>
      </div>

      <div class="mb-8">
        <input id="tournamentName" placeholder="${t("tournamentNamePlaceholder")}" class="w-full bg-gray-700 text-white p-4 rounded-lg border border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-green" />
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        ${playerCards}
      </div>

      <div class="text-center">
        <button id="startTournament" class="bg-neon-orange text-black px-8 py-4 rounded-lg font-bold hover:scale-105 transition animate-float">
          🚀 ${t("startTournament")}
        </button>
      </div>
    </div>
    `;

    const app = document.getElementById("app");
    if (app) {
      app.innerHTML = html;
      this.setupEvents();
      RedirectEvents.attachRedirectEvents();
    }
  }

  setupEvents() {
    const t = (key: keyof typeof createLocalTournamentTranslations) => getTranslation("createLocalTournament", key);

    const startBtn = document.getElementById("startTournament");
    if (startBtn) {
      startBtn.addEventListener("click", () => {
        const name = (document.getElementById("tournamentName") as HTMLInputElement).value.trim();
        if (!name) {
          alert(t("tournamentError"));
          return;
        }

        // Mettre à jour les pseudos
        for (let i = 1; i < this.selectedPlayers.length; i++) {
          const input = document.getElementById(`playerName_${i}`) as HTMLInputElement;
          this.selectedPlayers[i].username = input.value.trim();
        }

        // Vérification
        const filledPlayers = this.selectedPlayers.filter(p => p.username.length > 0);
        if (filledPlayers.length < 4) {
          alert(t("playersMissingError"));
          return;
        }

        const tournamentId = Date.now().toString();
        const tournamentData = {
          id: tournamentId,
          name,
          players: filledPlayers,
          matches: [],
          mode: "local"
        };

        localStorage.setItem(`tournament_${tournamentId}`, JSON.stringify(tournamentData));
        window.location.href = `/#tournamentGameBoard?id=${tournamentId}`;
      });
    }
  }
}
