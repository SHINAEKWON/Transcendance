import { Game } from "./Game.js";

export let game: Game | null = null;

export function nullifyGame(): void
{
    game = null;
}

export function renderGamePage()
{
    const app: HTMLElement | null = document.getElementById("app");
    
    if (app)
    {
        app.innerHTML = `

        `;
        if (!game)
        {
            game = new Game();
            game.loop();
        }
    }
}
