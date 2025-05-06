declare const confetti: any;
import { getTranslation } from "../../i18n/i18n.js";
import { gameTranslations } from "../../translations/game.js";
import { GameBoardPage } from "../../game/GameBoard";
import { Player } from "../../game/Player";
import { addHistory, updateStats } from "../../services/userService.js";

export class DuelGameBoardPage implements Page {
  private duelData: any = null;
  private pageMode = '';
  private isReady = false;

  async render() {
    this.reset();

    const t = (key: keyof typeof gameTranslations) => getTranslation("game", key);

    const hash = window.location.hash;
    const urlParams = new URLSearchParams(hash.split('?')[1]);
    const duelEncoded = urlParams.get('duel');
    const duelId = urlParams.get('id');
    const modeParam = urlParams.get('mode');
    if (modeParam) {
      this.pageMode = modeParam;
    }

    if (duelEncoded) {
      this.duelData = JSON.parse(decodeURIComponent(duelEncoded));
    }

    const { player1, player2, mode } = this.duelData;

    const rulesHtml = `
    <div class="flex justify-center mt-4">
      <button id="showRulesBtn" class="text-xs px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-full text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue animate-pulse">
      📜 ${t("rulesButton")}
      </button>
    </div>

    <div id="rulesModal" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 hidden">
      <div class="bg-gray-800 text-white p-6 rounded-lg w-full max-w-md shadow-xl relative">
        <button id="closeRulesBtn" class="absolute top-2 right-2 text-gray-400 hover:text-white text-xl">&times;</button>
        <h3 class="text-2xl font-bold mb-4 text-center text-gradient">${t('rulesTitle')}</h3>
        <ul class="text-sm space-y-3 leading-relaxed">
          <li>🎯 <strong>${t('goalTitle')}</strong> ${t('goal')}</li>
          <li>🥇 ${t('match')}</li>
          <li>🔁 <strong>${t('serve')}</strong> ${t('serveRule')}</li>
          <li>💡 <strong>${t('indicator')}</strong> ${t('indicatorRule')}</li>
          <li>🕹 <strong>${t('turn')}</strong> ${t('turnRule')}</li>
          <li>🤖 <strong>${t('robotDuel')}</strong> ${t('robotDuelRule')}</li>
          <li>❌ <strong>${t('losePoint')}</strong> ${t('losePointRule')}</li>
        </ul>
      </div>
    </div>
    `;

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

        ${rulesHtml}
      </div>

      <div class="ml-15 mr-15 mt-0 justify-center relative">
        <div id="appGame" class="relative w-full h-180 rounded-lg border-white shadow-2xl overflow-visible">
        </div>
      </div>
    `;

    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = html;

      let socket: any = null;
      if (mode === "remote") {

        socket = getSocket();
        if (socket) {
          const savedUser = localStorage.getItem("transcendenceUser");
          if (savedUser) {
            const user = JSON.parse(savedUser);
            const remotePlayerId = user.id == player1.id ? player2.id : player1.id;
            console.log('send ready to ',remotePlayerId)
            socket.emit("ready", {
              to: "" + remotePlayerId,
              from: "" + user.id
            })

            socket.on("readyYes", (msg: any) => {
              console.log('receive ready yes', msg)
              this.isReady = true;
              this.maybeStartGame(player1, player2, mode, socket);
            });

            socket.on("ready", (msg: any) => {
              console.log('receive ready', msg)
              console.log('send receive readyYes', msg.from)
              socket.emit("readyYes", { to: "" + msg.from });
              this.isReady = true;
              this.maybeStartGame(player1, player2, mode, socket);
            });
          }

        } 
      }else {
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
          this.handleEndGame.bind(this)
        ).render();
      }

      document.getElementById('showRulesBtn')?.addEventListener('click', () => {
        document.getElementById('rulesModal')?.classList.remove('hidden');
      });

      document.getElementById('closeRulesBtn')?.addEventListener('click', () => {
        document.getElementById('rulesModal')?.classList.add('hidden');
      });
    }
  }
  private maybeStartGame(player1: any, player2: any, mode: any, socket: any) {
    if (this.isReady) {
      // commencer le jeu ici !
      console.log("🎮 Les deux joueurs sont prêts !");
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
        this.handleEndGame.bind(this)
      ).render();
    }
  }
  private handleEndGame(playerLeft: Player, playerRight: Player) {
    const t = (key: keyof typeof gameTranslations) => getTranslation("game", key);

    console.log("🏁 Duel terminé");

    const winner = playerLeft.getScore() > playerRight.getScore() ? playerLeft : playerRight;
    const looser = playerLeft.getScore() > playerRight.getScore() ? playerRight : playerLeft;
    updateStats(winner.getId(), true);
    updateStats(looser.getId(), false);
    const savedUser = localStorage.getItem("transcendenceUser");
    if (savedUser) {
        const user = JSON.parse(savedUser);
        if(user.id == winner.getId()){
          addHistory("duel : "+playerLeft.getName() +" vs "+playerRight.getName(), "duel", true);
        }else if(user.id == looser.getId()){
          addHistory("duel : "+playerLeft.getName() +" vs "+playerRight.getName(), "duel", false);
        }
    }
    const appGame = document.getElementById("appGame");
    if (appGame) {
      appGame.innerHTML = "";
      appGame.className = "flex flex-col items-center justify-center p-10 rounded-xl shadow-2xl";

      appGame.innerHTML = `
        <div class="flex flex-col items-center space-y-6 animate-bounce-in">
          <img src="${winner.getAvatar()}" class="w-40 h-40 rounded-full border-4 border-white shadow-lg animate-pulse" />
          <div class="text-3xl font-extrabold text-white animate-glow">🏆 ${winner.getName()} 🏆</div>
          <div class="text-lg text-white">${t("duelWinner")}</div>
          <div class="flex space-x-6 mt-6">
            <button id="rematchBtn" class="px-6 py-3 bg-neon-green text-black font-bold rounded-lg hover:bg-green-400 transition">
              🔥 ${t("rematch")}
            </button>
            <a href="#${this.pageMode}" class="px-6 py-3 bg-neon-purple text-white font-bold rounded-lg hover:bg-purple-400 transition">
              ⚔️ ${t("newDuel")}
            </a>
          </div>
        </div>
      `;

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(()=>{
        this.reset();
      }, 500);
      

      const rematchBtn = document.getElementById("rematchBtn");
      rematchBtn?.addEventListener("click", () => {
        window.location.reload();
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

  reset(){
    this.isReady = false;
    let socket = getSocket();
    if (socket) {
        socket.off("readyYes");
        socket.off("ready");
        socket.off("ballMove");
        socket.off("pressSpace");
        socket.off("paddleMove");
        socket.off("paddleRelativeMove");

    }
}
}


function getSocket(): any | undefined {
  return (window as any).socket;
}
