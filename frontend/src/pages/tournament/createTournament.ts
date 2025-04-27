import { getUsersList } from '../../services/userService.js';
import { getTranslation } from '../../i18n/i18n.js';
import { createTournamentTranslations } from '../../translations/tournaments.js';


export class CreateTournamentPage implements Page {
  private selectedPlayers: any[] = [];
  private mode!: string;

  async render() {
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(hash.split('?')[1]);
    const mode = urlParams.get('mode');
    console.log(`mode = ${mode}`);
    const users = await getUsersList();
    const t = (key: keyof typeof createTournamentTranslations) => getTranslation("createTournament", key);

    const html = `
      <div class="max-w-3xl mx-auto mt-12 p-5 bg-gray-900 rounded-xl text-white">
        <h2 class="text-neon-blue text-3xl font-extrabold mb-10 text-center animate-pulse">
           ${t("title")}
        </h2>

        <div class="mb-6">
          <input id="tournamentName" placeholder="${t("tournamentNamePlaceholder")}" class="w-full p-3 rounded bg-gray-800 border border-neon-purple text-white" />
        </div>

        <h3 class="text-neon-green mb-4 font-semibold">${t("addPlayers")}</h3>
        <div id="userList" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 pr-2 max-h-70 overflow-y-auto">
          ${users.map(user => `
            <div class="flex items-center bg-gray-800 p-4 rounded-lg justify-between">
              <div class="flex items-center space-x-4">
                <img src="${user.avatar}" class="w-10 h-10 rounded-full border border-gray-500" />
                <span class="text-white">${user.username}</span>
              </div>
              <button onclick="addToTournament(${user.id})" class="bg-neon-green text-gray-900 px-3 py-1 rounded font-bold">
                ➕
              </button>
            </div>
          `).join('')}
        </div>

        <h3 class="text-neon-purple mb-4 font-semibold">${t("selectedPlayers")}</h3>
        <div id="selectedPlayers" class="space-y-4 mb-6 max-h-50 overflow-y-auto"></div>

        <div class="text-center">
          <button id="startTournament" class="bg-neon-orange px-6 py-3 rounded-lg font-bold animate-float">
            🚀 ${t("startTournament")}
          </button>
        </div>
      </div>
    `;

    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = html;
      this.setupEvents(users);
    }
  }

  setupEvents(users: any[]) {
    const t = (key: keyof typeof createTournamentTranslations) => getTranslation("createTournament", key);
  
    (window as any).addToTournament = (userId: number) => {
      const user = users.find(u => u.id === userId);
      if (user && !this.selectedPlayers.find(p => p.id === user.id)) {
        this.selectedPlayers.push(user);
        this.renderSelectedPlayers();
      }
    };
  
    const startBtn = document.getElementById('startTournament');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        const name = (document.getElementById('tournamentName') as HTMLInputElement).value;
        if (!name || this.selectedPlayers.length < 2) {
          alert(t("tournamentError"));
          return;
        }
  
        // 1. Générer un ID unique pour le tournoi
        const tournamentId = Date.now().toString(); // simple id unique basé sur le temps
  
        // 2. Créer l'objet tournoi
        const tournamentData = {
          id: tournamentId,
          name,
          players: this.selectedPlayers,
          matches: [], // tu peux initialiser les matchs vides pour l'instant
          mode: this.mode
        };
  
        // 3. Stocker dans le localStorage
        localStorage.setItem(`tournament_${tournamentId}`, JSON.stringify(tournamentData));
  
        // 4. Rediriger vers la page du tournoi
        window.location.href = `/#tournamentGameBoard?id=${tournamentId}`;
      });
    }
  }
  

  renderSelectedPlayers() {
    const container = document.getElementById('selectedPlayers');
    if (!container) return;
    container.innerHTML = this.selectedPlayers.map(player => `
      <div class="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
        <div class="flex items-center space-x-4">
          <img src="${player.avatar}" class="w-10 h-10 rounded-full border border-green-400" />
          <input value="${player.username}" class="bg-gray-700 p-2 rounded text-white w-full max-w-xs" />
        </div>
        <button onclick="removeFromTournament(${player.id})" class="bg-red-600 text-white px-3 py-1 rounded">
          ✖
        </button>
      </div>
    `).join('');

    (window as any).removeFromTournament = (userId: number) => {
      this.selectedPlayers = this.selectedPlayers.filter(p => p.id !== userId);
      this.renderSelectedPlayers();
    };
  }
}
