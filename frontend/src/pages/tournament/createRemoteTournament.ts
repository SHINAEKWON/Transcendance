import { getUsersList } from '../../services/userService.js';
import { getTranslation } from '../../i18n/i18n.js';
import { createTournamentTranslations } from '../../translations/tournaments.js';

export class CreateRemoteTournamentPage implements Page {
  private selectedPlayers: any[] = [];

  async render() {
    const currentUserString = localStorage.getItem("transcendenceUser");
    if (!currentUserString) {
      console.error("Utilisateur non connecté !");
      return;
    }
    const currentUser = JSON.parse(currentUserString);
    
    let users: any[] = [];
    try {
      users = await getUsersList();
    } catch (error) {
      console.error("Erreur récupération des utilisateurs :", error);
      users = [];
    }

    const t = (key: keyof typeof createTournamentTranslations) => getTranslation("createTournament", key);

    const html = `
      <div class="max-w-3xl mx-auto mt-12 p-5 bg-gray-900 rounded-xl text-white">
        <h2 class="text-3xl font-gaming text-neon-blue mb-6 animate-glow text-center">
           ${t("title")}
        </h2>

        <div class="mb-6">
          <input id="tournamentName" placeholder="${t("tournamentNamePlaceholder")}" class="w-full p-3 rounded bg-gray-800 border border-neon-purple text-white" />
        </div>

        <h3 class="text-neon-green mb-4 font-semibold">${t("addPlayers")}</h3>
        <div id="userList" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 pr-2 max-h-70 overflow-y-auto">
          ${users.length > 0 
            ? users.filter(u => u.id !== currentUser.id).map(user => `
              <div class="flex items-center bg-gray-800 p-4 rounded-lg justify-between">
                <div class="flex items-center space-x-4">
                  <img src="${user.avatar}" class="w-10 h-10 rounded-full border border-gray-500" />
                  <span class="text-white">${user.username}</span>
                </div>
                <button onclick="addToTournament(${user.id})" class="bg-neon-green text-gray-900 px-3 py-1 rounded font-bold">
                  ➕
                </button>
              </div>
            `).join('')
            : `<p class="text-center text-gray-400">${t("noUsersAvailable") || "No other players available."}</p>`
          }
        </div>

        <h3 class="text-neon-purple mb-4 font-semibold">${t("selectedPlayers")}</h3>
        <div id="selectedPlayers" class="space-y-4 mb-6 max-h-50 overflow-y-auto"></div>

        <div class="text-center">
          <button id="startTournament" class="bg-neon-orange px-6 py-3 rounded-lg font-bold animate-float">
            🚀 ${t("startTournament")}
          </button>
        </div>
        <div class="flex flex-col items-center  gap-4 mt-6">
            <a href="#customization" class="px-6 py-3 bg-neon-orange text-black rounded-lg font-bold text-lg hover:bg-orange-400 transition text-center">
            <span class="text-2xl">⚙️</span> ${t("customizeGame")}
                </a>
        </div>
      </div>
    `;

    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = html;
      this.selectedPlayers.push(currentUser); // Ajout automatique du joueur connecté
      this.renderSelectedPlayers(currentUser.id);
      this.setupEvents(users, currentUser.id);
    }
  }

  setupEvents(users: any[], currentUserId: number) {
    const t = (key: keyof typeof createTournamentTranslations) => getTranslation("createTournament", key);

    (window as any).addToTournament = (userId: number) => {
      const user = users.find(u => u.id === userId);
      if (user && !this.selectedPlayers.find(p => p.id === user.id)) {
        this.selectedPlayers.push(user);
        this.renderSelectedPlayers(currentUserId);
      }
    };

    const startBtn = document.getElementById('startTournament');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        const nameInput = document.getElementById('tournamentName') as HTMLInputElement;
        const name = nameInput.value.trim();

        if (!name) {
          alert(t("tournamentError"));
          return;
        }

        if (this.selectedPlayers.length !== 4) {
          alert(t("exactlyFourPlayersError") || "You must have exactly 4 players to start the tournament.");
          return;
        }

        const tournamentId = Date.now().toString();
        const tournamentData = {
          id: tournamentId,
          name,
          players: this.selectedPlayers,
          matches: [],
          mode: 'remote'
        };

        localStorage.setItem(`tournament_${tournamentId}`, JSON.stringify(tournamentData));
        window.location.href = `/#tournamentGameBoard?id=${tournamentId}`;
      });
    }
  }

  renderSelectedPlayers(currentUserId: number) {
    const container = document.getElementById('selectedPlayers');
    if (!container) return;

    container.innerHTML = this.selectedPlayers.map(player => `
      <div class="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
        <div class="flex items-center space-x-4">
          <img src="${player.avatar}" class="w-10 h-10 rounded-full border border-green-400" />
          <input value="${player.username}" class="bg-gray-700 p-2 rounded text-white w-full max-w-xs" readonly />
        </div>
        ${player.id !== currentUserId ? `
          <button onclick="removeFromTournament(${player.id})" class="bg-red-600 text-white px-3 py-1 rounded">
            ✖
          </button>` : ''
        }
      </div>
    `).join('');

    (window as any).removeFromTournament = (userId: number) => {
      this.selectedPlayers = this.selectedPlayers.filter(p => p.id !== userId);
      this.renderSelectedPlayers(currentUserId);
    };
  }
}
