
import { A_Page } from "./A_Page.js";
import { Game } from "./Game.js";
import { GameMode } from "./Paddle.js";
import { Player } from "./Player.js";

export class GameBoardPage extends A_Page implements Page {
    game: Game | null = null;

    constructor(
        private playerLeft: string,
        private playerRight: string,
        private avatarPlayerLeft: string,
        private avatarPlayerRight: string,
        private isIaPlayerLeft: boolean,
        private isIaPlayerRight: boolean,
        private mode: GameMode,
        private idPlayerLeft: number,
        private idPlayerRight: number,
        private socket: any,
        private endGameEvents: (playerLeft: Player,playerRight: Player) => void
        
        
    ) {
        super();
    }

    render() {
        this.clear();
        this.load_page();
    }

    load_page(): void {
        this.game = new Game(this.playerLeft, this.playerRight, this.isIaPlayerLeft, this.avatarPlayerLeft, this.isIaPlayerRight, this.avatarPlayerRight, this.socket, this.mode, this.idPlayerLeft, this.idPlayerRight, this.endGameEvents);
        this.game.loop();
    }

    leave(): string {
        this.game?.destroy();
        this.nullifyGame();
        return "";
    }

    private nullifyGame(): void {
        if (this.game != null)
            this.game = null;
    }
}

