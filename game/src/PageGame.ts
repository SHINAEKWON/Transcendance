import { A_Page } from "./A_Page.js";
import { Game } from "./Game.js";

export class PageGame extends A_Page
{
    game: Game | null = null;

    load_page(params: URLSearchParams): void
    {
        if (this.game == null)
        {
            const playerLeft: string | null = params.get("playerLeft");
            const playerTop: string | null = params.get("playerTop");
            const playerRight: string | null = params.get("playerRight");
            const playerBottom: string | null = params.get("playerBottom");

            const cntBalls: string | null = params.get("cntBalls");

            this.game = new Game(playerLeft, playerTop, playerRight, playerBottom, cntBalls);
            this.game.loop();
        }
    }

    leave(): string
    {
        this.game?.destroy();
        this.nullifyGame();
        return "";
    }

    private nullifyGame(): void
    {
        if (this.game != null)
            this.game = null;
    }
}