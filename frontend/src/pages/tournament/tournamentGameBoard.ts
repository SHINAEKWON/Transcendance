import { GameBoardPage } from "../../game/GameBoard";
import { Player } from "../../game/Player";

export class TournamentGameBoardPage implements Page {
  private tournamentData: any = null;
  private winners: any[] = []; // stocke les vainqueurs
  private finalWinner: any = null; // stocke le grand gagnant

  constructor() {
    this.endGameEvents = this.endGameEvents.bind(this); // Important de binder le contexte
  }

  // les classes pour allumer et ettendre les box
  private highlightMatch(matchIndex: number) {
    const matchBox = document.getElementById(`match-${matchIndex}`);
    if (matchBox) {
      matchBox.classList.add('animate-glow');
      matchBox.classList.add('border-blue-400'); // ➔ Contour lumineux bleu
      matchBox.classList.remove('border-white/20'); // ➔ Enlève l'ancien contour gris
    }
  }

  private unhighlightMatch(matchIndex: number) {
    const matchBox = document.getElementById(`match-${matchIndex}`);
    if (matchBox) {
      matchBox.classList.remove('animate-glow');
      matchBox.classList.remove('border-blue-400');
      matchBox.classList.add('border-white/20'); // ➔ Remet le contour normal
    }
  }


  private currentMatchIndex = 0;

  private endGameEvents(playerLeft: Player, playerRight: Player) {
    console.log("Match terminé");

    const winner = playerLeft.getScore() > playerRight.getScore() ? playerLeft : playerRight;
    console.log(`Winner: ${winner.getName()}`);

    this.winners.push({
      id: winner.getId(),
      username: winner.getName(),
      avatar: winner.getAvatar()
    });

    // Éteindre l'ancien match
    this.unhighlightMatch(this.currentMatchIndex);


    // 🏆 Mise à jour immédiate dans l'arbre du tournoi
    const winnerBoxId = this.currentMatchIndex === 0 ? "winner1" : "winner2"; // winner1 pour premier match, winner2 pour deuxième
    const winnerBox = document.getElementById(winnerBoxId);

    if (winnerBox) {
      winnerBox.innerHTML = `
        <div class="flex flex-col items-center space-y-1">
          <img src="${winner.getAvatar()}" class="w-14 h-14 rounded-full border-2 border-yellow-400" />
          <span class="text-white text-sm font-semibold">${winner.getName()}</span>
        </div>
      `;
    }

    const appGame = document.getElementById('appGame');
    if (!appGame) return;

    this.currentMatchIndex++;

    if (this.currentMatchIndex === 1) {
      // Après premier match ➔ Lancer 2ème match (P3 vs P4)
      appGame.innerHTML = "";

      const [p1, p2, p3, p4] = this.tournamentData.players;
      let socket = null;
      if (this.tournamentData.mode === "remote") {
        socket = getSocket();
      }
      new GameBoardPage(
        p3.username,
        p4.username,
        p3.avatar,
        p4.avatar,
        false,
        false,
        this.tournamentData.mode,
        p3.id,
        p4.id,
        socket,
        this.endGameEvents
      ).render();
      // Allumer le nouveau match (match-1)
      this.highlightMatch(this.currentMatchIndex)


    } else if (this.currentMatchIndex === 2) {
      // Après 2ème match ➔ Lancer la finale entre les 2 winners
      appGame.innerHTML = "";

      const [winner1, winner2] = this.winners;
      let socket = null;
      if (this.tournamentData.mode === "remote") {
        socket = getSocket();
      }
      new GameBoardPage(
        winner1.username,
        winner2.username,
        winner1.avatar,
        winner2.avatar,
        false,
        false,
        this.tournamentData.mode,
        winner1.id,
        winner2.id,
        socket,
        this.finalMatchEndEvent.bind(this)
      ).render();
      // Allumer le nouveau match (match-1)
      this.highlightMatch(this.currentMatchIndex);
    }
  }



  private finalMatchEndEvent(playerLeft: Player, playerRight: Player) {
    console.log("Finale terminée");

    const winner = playerLeft.getScore() > playerRight.getScore() ? playerLeft : playerRight;
    console.log(`Grand gagnant: ${winner.getName()}`);

    this.finalWinner = {
      username: winner.getName(),
      avatar: winner.getAvatar()
    };

    const appGame = document.getElementById('appGame');
    if (appGame) {
      // 1. Nettoyer complètement l'intérieur et changer les styles
      appGame.innerHTML = "";
      appGame.className = "flex flex-col items-center justify-center p-10 rounded-xl shadow-2xl";

      // 2. Ajouter l'affichage du gagnant
      appGame.innerHTML = `
        <div class="flex flex-col items-center space-y-6 animate-bounce-in">
          <img src="${this.finalWinner.avatar}" class="w-32 h-32 rounded-full border-4 border-white shadow-lg animate-pulse" />
          <div class="text-3xl font-extrabold text-white animate-glow">🏆 ${this.finalWinner.username} 🏆</div>
          <div class="text-lg text-white">Champion du tournoi !</div>
          <div class="flex space-x-6 mt-6">
            <button id="rematchBtn" class="px-6 py-3 bg-neon-green text-black font-bold rounded-lg hover:bg-green-400 transition">
              🔥 Rematch
            </button>
            <button id="newTournamentBtn" class="px-6 py-3 bg-neon-purple text-white font-bold rounded-lg hover:bg-purple-400 transition">
              🏆 New Tournament
            </button>
          </div>
        </div>
      `;

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });


    }
  }



  async render() {
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(hash.split('?')[1]);
    const tournamentId = urlParams.get('id');

    if (!tournamentId) {
      console.error("Pas d'ID de tournoi !");
      return;
    }

    const storedTournament = localStorage.getItem(`tournament_${tournamentId}`);
    if (!storedTournament) {
      console.error("Tournoi introuvable !");
      return;
    }

    this.tournamentData = JSON.parse(storedTournament);
    const [p1, p2, p3, p4] = this.tournamentData.players;

    const html = `
      <div class="max-w-5xl mx-auto mt-10 p-4 bg-gray-900 rounded-xl text-white">
        <h2  class="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue animate-pulse">
          ⚔️ ${this.tournamentData.name} ⚔️
        </h2>

        <div class="flex flex-col items-center space-y-6 mb-5">
          <div class="flex justify-center space-x-15">
            <div id="match-0" class="flex items-center justify-around space-x-2 border border-white/20 p-4 rounded-lg shadow-md bg-gray-800/30 min-w-[360px] max-w-[370px]">
              ${this.renderPlayerBox(p1)}
              ${this.renderVersus()}
              ${this.renderPlayerBox(p2)}
            </div>

            <div id="match-1" class="flex items-center justify-around space-x-2 border border-white/20 p-4 rounded-lg shadow-md bg-gray-800/30 min-w-[360px] max-w-[370px]">
              ${this.renderPlayerBox(p3)}
              ${this.renderVersus()}
              ${this.renderPlayerBox(p4)}
            </div>
          </div>

          <!-- Ligne 2 : carte des vainqueurs -->
          <div class="flex justify-center">
            <div id="match-2"class="flex items-center justify-around space-x-2 border border-white/20 p-4 rounded-lg shadow-md bg-gray-800/30 min-w-[360px] max-w-[370px]">
              ${this.renderEmptyMatchBox("winner1")}
              ${this.renderVersus()}
              ${this.renderEmptyMatchBox("winner2")}
            </div>
          </div>


          

        
      </div>
      <div class="flex justify-center relative">
          <div id="appGame" style="height: 380px" class="relative w-200 rounded-lg border-white shadow-2xl overflow-visible">
          </div>
        </div>
    `;

    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = html;
      let socket = null;
      if (this.tournamentData.mode === "remote") {
        socket = getSocket();
      }
      new GameBoardPage(
        p1.username,
        p2.username,
        p1.avatar,
        p2.avatar,
        false,
        false,
        this.tournamentData.mode,
        p1.id,
        p2.id,
        socket,
        this.endGameEvents
      ).render();
      // Allumer le nouveau match (match-1)
      this.highlightMatch(this.currentMatchIndex)

    }
  }

  renderPlayerBox(player: any) {
    return `
      <div id="player-${player.id}" class="flex flex-col items-center space-y-1">
        <img src="${player.avatar}" class="w-14 h-14 rounded-full border-2 border-gray-400" />
        <span class="text-white text-sm font-semibold">${player.username}</span>
      </div>
    `;
  }

  renderEmptyMatchBox(id: string) {
    return `
      <div id="${id}" class="flex flex-col items-center space-y-1 text-center">
        <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-white text-base">❓</div>
        <div class="text-xs text-gray-400">${id}</div>
      </div>
    `;
  }


  renderEmptyWinnerBox() {
    return `
    
      <div class="flex flex-col items-center space-y-1 text-center">
        <div class="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xl shadow-md">🏅</div>
        <div class="text-xs text-gray-400 mt-1">Username</div>
        </div>
      `;
  }

  renderVersus() {
    return `
      <div class="flex items-center justify-center">
        <div class="text-2xl text-red-500 mx-2">🆚</div>
      </div>
    `;
  }
}

function getSocket(): any | undefined {
  return (window as any).socket;
}
