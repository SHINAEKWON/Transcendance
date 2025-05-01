import { GameBoardPage } from "../../game/GameBoard";
import { Player } from "../../game/Player";

export class DuelGameBoardPage implements Page {
  private duelData: any = null;

  async render() {
    const hash = window.location.hash;

    const urlParams = new URLSearchParams(hash.split('?')[1]);
    const duelEncoded = urlParams.get('duel');
    const duelId = urlParams.get('id');

    if (duelEncoded) {
      this.duelData = JSON.parse(decodeURIComponent(duelEncoded));
    }

    const { player1, player2, mode } = this.duelData; // mode = local ou remote

    const html = `
      <div class="max-w-5xl mx-auto mt-8 p-4 bg-gray-900 rounded-xl text-white">
        <h2 class="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue animate-pulse">
          ⚔️ ${player1.username} vs ${player2.username} ⚔️
        </h2>

        <div class="flex justify-center space-x-20 mb-10">
          ${this.renderPlayerBox(player1, true)}
          ${this.renderVersus()}
          ${this.renderPlayerBox(player2, false)}
        </div>


        
      </div>

      <div class="ml-15 mr-15 mt-0 justify-center relative">
          <div id="appGame" class="relative w-full h-160 rounded-lg border-white shadow-2xl overflow-visible">
          </div>
        </div>

    `;

    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = html;

      let socket = null;
      if (mode == "remote") {
        console.log("set socket ...")
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

    const appGame = document.getElementById("appGame");
    if (appGame) {
      // 1. Nettoyer complètement l'intérieur
      appGame.innerHTML = "";
      appGame.className = "flex flex-col items-center justify-center p-10 rounded-xl shadow-2xl";

      // 2. Afficher la carte du gagnant
      appGame.innerHTML = `
        <div class="flex flex-col items-center space-y-6 animate-bounce-in">
          <img src="${winner.getAvatar()}" class="w-40 h-40 rounded-full border-4 border-white shadow-lg animate-pulse" />
          <div class="text-3xl font-extrabold text-white animate-glow">🏆 ${winner.getName()} 🏆</div>
          <div class="text-lg text-white">Vainqueur du Duel !</div>
        </div>
      `;

      // 3. Explosion de confettis
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }



  renderPlayerBox(player: any, isLeft: boolean) {
    const borderColor = isLeft ? "border-yellow-400" : "border-blue-400";
    const textColor = isLeft ? "text-yellow-400" : "text-blue-400";

    return `
      <div class="flex flex-col items-center space-y-2">
        <img src="${player.avatar}" class="w-24 h-24 rounded-full border-4 ${borderColor}" />
        <span class="text-lg font-semibold ${textColor}">${player.username}</span>
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
