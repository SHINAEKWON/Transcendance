/*
TODO:
*/
let playerLeft;
let playerRight;

function renderRevanchePage(player1, player2, won)
{
    const app = document.getElementById("app");
    
    let playerWon;
    if (won == 1)
    {
        playerWon = player1;
    }
    else
    {
        playerWon = player2;
    }
    
    app.innerHTML = `
        <div id="containerPlayAgain" class="containerPlayAgain hidden">
            <h1 class="inputAgainHeading">${playerWon} wins! Do you want to play again?</h1>
            <div id="againButtons" class="againButtons">
                <button class="btnRevanche" id="btnRevanche">Revanche</button>
                <button class="btnNewgame" id="btnNewgame">New Game</button>
                <button class="btnEnd" id="btnEnd">End</button>
            </div>
        </div>
    `;
    
    playerLeft = player1;
    playerRight = player2;
    
    const btnRevanche = document.getElementById("btnRevanche");
    btnRevanche.addEventListener("click", startRevanche);
}

function startRevanche()
{
    navigateTo("game", { player1: playerLeft, player2: playerRight });
}
