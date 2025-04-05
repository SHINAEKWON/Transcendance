import { Game } from "./Game";

export let game: Game | null = null;

export function renderGamePage(player1: string | null, player2: string | null)
{
    const app: HTMLElement | null = document.getElementById("app");
    
    if (app)
    {
        app.innerHTML = `

        `;
    
        if (player1 && player2)
        {
            if (!game)
            {
                game = new Game(player1, player2);
                game.loop();
            }
        }
    }
}