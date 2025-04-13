import { A_Page } from "./A_Page.js";
import { Game } from "./Game.js";

export class PageGame extends A_Page
{
    game: Game | null = null;

    load(): void
    {
        this.clear();

        if (this.game == null)
        {
            this.game = new Game();
            this.game.loop();
        }
    }

    leave(): void
    {
        this.nullifyGame();
    }

    private nullifyGame(): void
    {
        if (this.game != null)
            this.game = null;
    }
}