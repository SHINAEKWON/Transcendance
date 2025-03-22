function renderRevanchePage(player1: string | null, player2: string | null, won: string | null)
{
    const app: HTMLElement | null = document.getElementById("app");
    
    let playerWon;
    if (won == "left")
    {
        playerWon = player1;
    }
    else
    {
        playerWon = player2;
    }

    if (app)
    {
        app.innerHTML = `
            <div id="containerPlayAgain" class="containerPlayAgain">
                <h1 class="inputAgainHeading">${playerWon} wins! Do you want to play again?</h1>
                <div id="againButtons" class="againButtons">
                    <button class="btnRevanche btnAgain" id="btnRevanche">Revanche</button>
                    <button class="btnEnd btnAgain" id="btnEnd">Back to welcome</button>
                </div>
            </div>
        `;
    
        const btnRevanche: HTMLButtonElement | null = document.getElementById("btnRevanche") as HTMLButtonElement;
        btnRevanche?.addEventListener("click", () => {
            startRevanche(player1, player2);
        });

        const btnEnd: HTMLButtonElement | null = document.getElementById("btnEnd") as HTMLButtonElement;
        btnEnd?.addEventListener("click", clickedEnd);
    }
}

function startRevanche(playerLeft: string | null, playerRight: string | null): void
{
    navigateTo("game", true, playerLeft, playerRight);
}

function clickedEnd(event: Event): void
{
    navigateTo("welcome", true);
}
