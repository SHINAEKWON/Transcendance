let playerLeft;
let playerRight;

function renderRevanchePage(player1, player2, won)
{
    const app = document.getElementById("app");
    
    let playerWon;
    if (won == "left")
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
                <button class="btnRevanche btnAgain" id="btnRevanche">Revanche</button>
                <button class="btnEnd btnAgain" id="btnEnd">Back to welcome</button>
            </div>
        </div>
    `;
    
    playerLeft = player1;
    playerRight = player2;
    
    const btnRevanche = document.getElementById("btnRevanche");
    btnRevanche.addEventListener("click", startRevanche);

    const btnEnd = document.getElementById("btnEnd");
    btnEnd.addEventListener("click", clickedEnd);
}

function startRevanche()
{
    navigateTo("game", true, playerLeft, playerRight);
}

function clickedEnd()
{
    navigateTo("welcome", true);
}