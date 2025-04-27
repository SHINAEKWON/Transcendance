import { GameBoardPage } from "../../game/GameBoard";
import { Player } from "../../game/Player";

export class DuelGameBoardPage implements Page {
  private duelData: any = null;

  async render() {
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(hash.split('?')[1]);
    const duelId = urlParams.get('id');

    if (!duelId) {
      console.error("Pas d'ID de duel !");
      return;
    }

    const storedDuel = localStorage.getItem(`duel_${duelId}`);
    if (!storedDuel) {
      console.error("Duel introuvable !");
      return;
    }

    this.duelData = JSON.parse(storedDuel);
    const { player1, player2, mode } = this.duelData; // mode = local ou remote

    const html = `
      <div class="max-w-5xl mx-auto mt-8 p-4 bg-gray-900 rounded-xl text-white">
        <h2 class="text-2xl font-bold text-center mb-7 text-neon-purple animate-glow">
          ⚔️ ${player1.username} vs ${player2.username} ⚔️
        </h2>

        <div class="flex justify-center space-x-20 mb-10">
          ${this.renderPlayerBox(player1)}
          ${this.renderVersus()}
          ${this.renderPlayerBox(player2)}
        </div>

        
      </div>

      <div class="ml-15 mr-15 mt-0 justify-center relative">
          <div id="appGame" class="relative w-full h-160 rounded-lg border-white shadow-2xl overflow-visible">
          </div>
        </div>
        <div id="winnerAnnouncement" class="hidden flex flex-col items-center space-y-3 mt-8">
        <h3 class="text-2xl font-bold text-yellow-300 animate-glow">WINNER</h3>
        <div class="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
            <img id="winnerAvatar" src="" class="w-20 h-20 rounded-full border-2 border-white" />
        </div>
        <h3 id="winnerName" class="text-2xl font-bold text-yellow-300 animate-glow"></h3>
      </div>

      

    `;

    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = html;

      let socket = null;
      if (mode === "remote") {
        socket = getSocket();
      }

      new GameBoardPage(
        player1.username,
        player2.username,
        player1.avatar,
        player2.avatar,
        player1.isIa,
        player2.isIa,
        mode,
        player1.id,
        player2.id,
        socket,
        this.handleEndGame.bind(this) // on passe une fonction pour la fin
      ).render();

    }
  }

  private handleEndGame(playerLeft: Player, playerRight: Player) {
    console.log("🏁 Duel terminé");

    const winner = playerLeft.getScore() > playerRight.getScore() ? playerLeft : playerRight;

    // Cacher la table de jeu
    const appGame = document.getElementById("appGame");
    if (appGame) {
      appGame.classList.add("hidden");
    }

    // Afficher l'annonce du vainqueur
    const winnerAnnouncement = document.getElementById("winnerAnnouncement");
    const winnerName = document.getElementById("winnerName");
    const winnerAvatar = document.getElementById("winnerAvatar") as HTMLImageElement;

    if (winnerAnnouncement && winnerName && winnerAvatar) {
      winnerName.textContent = winner.getName();
      winnerAvatar.src = winner.getAvatar();
      winnerAnnouncement.classList.remove("hidden");
    }
  }


  renderPlayerBox(player: any) {
    return `
      <div class="flex flex-col items-center space-y-2">
        <img src="${player.avatar}" class="w-20 h-20 rounded-full border-4 border-gray-400" />
        <span class="text-white text-lg font-semibold">${player.username}</span>
      </div>
    `;
  }

  renderVersus() {
    return `
      <div class="flex items-center justify-center">
        <div class="text-4xl text-red-500">🆚</div>
      </div>
    `;
  }
}

function getSocket(): any | undefined {
  return (window as any).socket;
}
